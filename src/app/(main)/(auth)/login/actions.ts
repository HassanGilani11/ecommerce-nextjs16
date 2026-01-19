"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function login(prevState: any, formData: FormData) {
    const supabase = await createClient()

    const email = formData.get("email") as string
    const password = formData.get("password") as string

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        return { error: error.message }
    }

    const { data: { user } } = await supabase.auth.getUser()

    // Check if user has admin role in metadata (which we sync to profiles)
    // Or fetch from profiles table for source of truth
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user?.id)
        .single()

    if (profile?.role === 'admin') {
        redirect("/admin")
    }

    redirect("/")
}
