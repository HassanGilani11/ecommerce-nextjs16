"use server";

import { createClient } from "@/lib/supabase/server";

export async function forgotPassword(prevState: any, formData: FormData) {
    const supabase = await createClient();
    const email = formData.get("email") as string;

    if (!email) {
        return { error: "Email is required" };
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return { error: "Invalid email address" };
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback?next=/update-password`,
    });

    if (error) {
        return { error: error.message };
    }

    return { success: "If an account exists, a password reset link has been sent." };
}
