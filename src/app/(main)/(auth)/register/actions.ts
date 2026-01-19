"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function register(prevState: any, formData: FormData) {
    const supabase = await createClient()

    // Check if registration is enabled
    const { data: settings } = await supabase
        .from('settings')
        .select('enable_registration')
        .eq('id', 1)
        .single()

    if (!settings?.enable_registration) {
        return { error: "Registration is currently disabled." }
    }

    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirm-password") as string

    if (password !== confirmPassword) {
        return { error: "Passwords do not match" }
    }

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                role: "user",
            },
        },
    })

    if (error) {
        return { error: error.message }
    }

    redirect("/")
}
