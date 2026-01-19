"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

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

    // Destructure to ensure we only update allowed fields and exclude 'id'
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
        console.error("Error updating user:", error)
        return { error: error.message }
    }

    revalidatePath('/admin/users')
    return { success: true }
}

export async function deleteUser(id: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id)

    if (error) {
        console.error("Error deleting user:", error)
        return { error: error.message }
    }

    revalidatePath('/admin/users')
    return { success: true }
}

import { createAdminClient } from "@/lib/supabase/admin"

export async function createUser(data: any) {
    const supabase = await createClient()
    const adminClient = createAdminClient()

    // 1. Clean data to ensure no unwanted fields are inserted
    const {
        username,
        email,
        password, // Optional: if provided in form, otherwise Supabase generates one
        first_name,
        last_name,
        full_name,
        website,
        avatar_url,
        post_count,
        role,
        status
    } = data

    // 2. Create the Auth User using Service Role (Admin Client)
    // This allows us to create users without them having to sign up themselves
    const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
        email: email,
        password: password || Math.random().toString(36).slice(-12), // Generate temp password if not provided
        email_confirm: true,
        user_metadata: { full_name: full_name || `${first_name} ${last_name}`.trim() }
    })

    if (authError) {
        console.error("Error creating auth user:", authError)
        return { error: authError.message }
    }

    const userId = authData.user.id

    // 3. Create the profile record linked to the new Auth User ID
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
        .insert([cleanData])

    if (profileError) {
        console.error("Error creating user profile:", profileError)
        // Cleanup: try to delete the auth user if profile creation fails? 
        // For now, just report error.
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
