"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function updateSettings(prevState: any, formData: FormData) {
    const supabase = await createClient()

    const rawData = {
        site_title: formData.get("site_title") as string,
        site_tagline: formData.get("site_tagline") as string,
        admin_email: formData.get("admin_email") as string,
        default_role: formData.get("default_role") as string,
        timezone: formData.get("timezone") as string,
        date_format: formData.get("date_format") as string,
        time_format: formData.get("time_format") as string,
        meta_title: formData.get("meta_title") as string,
        meta_description: formData.get("meta_description") as string,
        meta_keywords: formData.get("meta_keywords") as string,
        facebook_url: formData.get("facebook_url") as string,
        twitter_url: formData.get("twitter_url") as string,
        instagram_url: formData.get("instagram_url") as string,
        linkedin_url: formData.get("linkedin_url") as string,
        maintenance_mode: formData.get("maintenance_mode") === "on",
        enable_registration: formData.get("enable_registration") === "on",
        store_notifications: formData.get("store_notifications") === "on",
        updated_at: new Date().toISOString(),
    }

    console.log("Updating settings with:", rawData)

    const { error } = await supabase
        .from("settings")
        .update(rawData)
        .eq("id", 1)

    if (error) {
        console.error("Settings update error:", error)
        return { error: error.message }
    }
    console.log("Settings update success")

    revalidatePath("/", "layout")
    revalidatePath("/admin", "layout")
    return { success: "Settings updated successfully" }
}
