"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function updatePaymentSettings(formData: FormData) {
    const supabase = await createClient()

    // Admin Auth Check
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) return { error: "Not authenticated" }

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'admin') return { error: "Unauthorized" }

    const rawData = {
        stripe_test_mode: formData.get("stripe_test_mode") === "on",
        stripe_test_secret_key: formData.get("stripe_test_secret_key") as string,
        stripe_test_publishable_key: formData.get("stripe_test_publishable_key") as string,
        stripe_live_secret_key: formData.get("stripe_live_secret_key") as string,
        stripe_live_publishable_key: formData.get("stripe_live_publishable_key") as string,
        enable_cod: formData.get("enable_cod") === "on",
        enable_stripe: formData.get("enable_stripe") === "on",
        enable_bank_transfer: formData.get("enable_bank_transfer") === "on",
        bank_transfer_details: formData.get("bank_transfer_details") as string,
        updated_at: new Date().toISOString()
    }

    const { error } = await supabase
        .from("settings")
        .update(rawData)
        .eq("id", 1)

    if (error) {
        console.error("Error updating payment settings:", error)
        return { error: "Failed to update settings" }
    }

    revalidatePath("/admin/payments")
    revalidatePath("/") // For checkout dynamic rendering
    return { success: true }
}
