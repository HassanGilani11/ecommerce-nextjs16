"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function updatePassword(prevState: any, formData: FormData) {
    const supabase = await createClient()
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirmPassword") as string

    if (!password || !confirmPassword) {
        return { error: "Both password fields are required" }
    }

    if (password !== confirmPassword) {
        return { error: "Passwords do not match" }
    }

    if (password.length < 6) {
        return { error: "Password must be at least 6 characters" }
    }

    const { error } = await supabase.auth.updateUser({
        password: password
    })

    if (error) {
        return { error: error.message }
    }

    const { data: { user } } = await supabase.auth.getUser()

    let role = "customer"
    if (user) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()

        if (profile) {
            role = profile.role
        }
    }

    return {
        success: "Password updated successfully. Redirecting...",
        role: role
    }
}
