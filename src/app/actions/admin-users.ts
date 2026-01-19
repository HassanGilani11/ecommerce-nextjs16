"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { createAdminClient } from "@/lib/supabase/admin"

export async function getUsers() {
    const supabase = await createClient()

    const { data: users, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error("Error fetching users:", error)
        return []
    }

    return users || []
}

export async function getUserById(id: string) {
    const supabase = await createClient()

    const { data: user, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single()

    if (error) {
        console.error("Error fetching user:", error)
        return null
    }

    return user
}

export async function updateUser(id: string, updates: any) {
    const supabase = await createClient()
    const adminClient = createAdminClient()

    // 1. Fetch current user to check for email change
    const { data: currentUser, error: fetchError } = await supabase
        .from('profiles')
        .select('email')
        .eq('id', id)
        .single()

    if (fetchError) {
        console.error("Error fetching current user for sync:", fetchError)
    }

    // 2. Sync email with Supabase Auth if it has changed
    if (updates.email && updates.email !== currentUser?.email) {
        const { error: authUpdateError } = await adminClient.auth.admin.updateUserById(id, {
            email: updates.email,
            email_confirm: false // This will trigger a confirmation email to the new address
        })

        if (authUpdateError) {
            console.error("Error syncing email to Auth:", authUpdateError)
            return { error: `Failed to update login email: ${authUpdateError.message}` }
        }
    }

    // 3. Update password if provided
    if (updates.password) {
        const { error: passwordError } = await adminClient.auth.admin.updateUserById(id, {
            password: updates.password
        })
        if (passwordError) {
            console.error("Error updating password in Auth:", passwordError)
            return { error: `Failed to update password: ${passwordError.message}` }
        }
    }

    // 3. Update profile record
    const {
        full_name,
        username,
        email,
        role,
        status,
        website,
        first_name,
        last_name,
        avatar_url,
        post_count
    } = updates

    const cleanUpdates = {
        full_name,
        username,
        email,
        role,
        status,
        website,
        first_name,
        last_name,
        avatar_url,
        post_count
    }

    const { error } = await supabase
        .from('profiles')
        .update(cleanUpdates)
        .eq('id', id)

    if (error) {
        console.error("Error updating user profile:", error)
        return { error: error.message }
    }

    revalidatePath('/admin/users')
    return { success: true }
}

export async function deleteUser(id: string) {
    const supabase = await createClient()
    const adminClient = createAdminClient()

    // 1. Delete the user from Supabase Auth (Service Role required)
    const { error: authError } = await adminClient.auth.admin.deleteUser(id)
    if (authError) {
        console.error("Error deleting auth user:", authError)
        // If user doesn't exist in Auth, we might still want to delete the profile
        if (authError.status !== 404) {
            return { error: `Failed to delete login account: ${authError.message}` }
        }
    }

    // 2. Delete the profile record
    const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id)

    if (profileError) {
        console.error("Error deleting user profile:", profileError)
        return { error: profileError.message }
    }

    revalidatePath('/admin/users')
    return { success: true }
}

export async function createUser(data: any) {
    const supabase = await createClient()
    const adminClient = createAdminClient()

    // 1. Clean data to ensure no unwanted fields are inserted
    const {
        username,
        email,
        password, // Optional
        first_name,
        last_name,
        full_name,
        website,
        avatar_url,
        post_count,
        role,
        status
    } = data

    let userId: string
    let isNewUser = false

    // 2. Check if user already exists in Auth (Orphaned account handling)
    const { data: { users }, error: listError } = await adminClient.auth.admin.listUsers()
    const existingUser = users?.find(u => u.email?.toLowerCase() === email.toLowerCase())

    if (existingUser) {
        userId = existingUser.id
        console.log(`Found existing Auth user ${userId} for email ${email}. Linking to new profile.`)

        // If password provided, update it
        if (password) {
            await adminClient.auth.admin.updateUserById(userId, { password })
        }

        // Trigger a password reset email so they get the link to secure/set their password
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback?next=/update-password`
        })

        if (resetError) {
            console.warn("Could not send recovery email to existing user:", resetError)
        }
    } else {
        isNewUser = true
        // 3. Create or Invite the user via Supabase Auth
        // If password is provided, use createUser to set it immediately and avoid invitation token issues
        if (password) {
            const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
                email,
                password,
                email_confirm: true, // Mark as confirmed so we can immediately send a recovery link
                user_metadata: {
                    full_name: full_name || `${first_name} ${last_name}`.trim(),
                    username: username,
                    role: role
                }
            })

            if (authError) {
                console.error("Error creating user:", authError)
                return { error: authError.message }
            }
            userId = authData.user.id

            // Now explicitly send a recovery email so they get the link in their inbox
            const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback?next=/update-password`
            })

            if (resetError) {
                console.warn("Could not send recovery email after creation:", resetError)
            }
        } else {
            // Fallback to invitation if no password (though password is now mandatory in UI)
            const { data: authData, error: authError } = await adminClient.auth.admin.inviteUserByEmail(email, {
                data: { full_name: full_name || `${first_name} ${last_name}`.trim() },
                redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback?next=/update-password`
            })

            if (authError) {
                console.error("Error inviting user:", authError)
                return { error: authError.message }
            }
            userId = authData.user.id
        }
    }

    // 4. Create the profile record linked to the Auth User ID
    const cleanData = {
        id: userId,
        username,
        email,
        first_name,
        last_name,
        full_name,
        website,
        avatar_url,
        post_count: post_count || 0,
        role: role || 'customer',
        status: status || 'active'
    }

    const { error: profileError } = await supabase
        .from('profiles')
        .upsert(cleanData, { onConflict: 'id' })

    if (profileError) {
        console.error("Error creating/updating user profile:", profileError)
        return { error: profileError.message }
    }

    revalidatePath('/admin/users')
    return { success: true }
}

export async function uploadAvatar(formData: FormData) {
    const supabase = await createClient()
    const file = formData.get('file') as File
    const userId = formData.get('userId') as string || 'anonymous'

    if (!file) return { error: "No file provided" }

    try {
        const fileExt = file.name.split('.').pop()
        const fileName = `${userId}-${Date.now()}.${fileExt}`
        const filePath = `${fileName}`

        const { error: uploadError } = await supabase.storage
            .from('profile')
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false
            })

        if (uploadError) {
            console.error("Storage upload error:", uploadError)
            return { error: uploadError.message }
        }

        const { data: { publicUrl } } = supabase.storage
            .from('profile')
            .getPublicUrl(filePath)

        return { url: publicUrl }
    } catch (err: any) {
        console.error("Upload avatar exception:", err)
        return { error: err.message || "An unexpected error occurred during upload" }
    }
}

export async function getCurrentProfile() {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
        console.error("Auth error in getCurrentProfile:", authError)
        return null
    }

    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    if (profileError) {
        console.error("Profile fetch error in getCurrentProfile:", profileError)
        return null
    }

    return profile
}
