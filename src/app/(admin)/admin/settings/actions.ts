"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function updateSettings(prevState: any, formData: FormData) {
    const supabase = await createClient()

    // 1. Fetch current settings to prevent wiping fields NOT in the current form submission
    const { data: currentSettings } = await supabase
        .from("settings")
        .select("*")
        .single()

    const patchData: any = {}

    // 2. Extract fields from formData
    const textFields = [
        "site_title", "site_tagline", "admin_email", "default_role",
        "timezone", "date_format", "time_format", "favicon_url", "logo_url",
        "meta_title", "meta_description", "meta_keywords",
        "facebook_url", "twitter_url", "instagram_url", "linkedin_url"
    ]

    textFields.forEach(field => {
        const value = formData.get(field)
        // ONLY merge if the value is a string and NOT empty
        // This prevents an empty input in an inactive tab from wiping the DB
        if (typeof value === 'string' && value.trim() !== '') {
            patchData[field] = value
        }
    })

    // 3. Handle switches (checkboxes)
    // ONLY update if they are actually in the form data (checked)
    // To support "turning off", we check for existence if they are in the current 'TabsContent' scope
    // But since tabs are all in one form, we should be careful.
    // Given the user issue, we'll only update them if they are explicitly present.
    if (formData.has("maintenance_mode")) patchData.maintenance_mode = formData.get("maintenance_mode") === "on"
    if (formData.has("enable_registration")) patchData.enable_registration = formData.get("enable_registration") === "on"
    if (formData.has("store_notifications")) patchData.store_notifications = formData.get("store_notifications") === "on"

    // 4. Merge with current settings
    // This ensures that if we are on Tab A, data from Tab B (not in form) is preserved
    const finalData = {
        ...(currentSettings || {}),
        ...patchData,
        id: 1, // Ensure we always target row 1
        updated_at: new Date().toISOString(),
    }

    // 5. Update the database
    const { error } = await supabase
        .from("settings")
        .upsert(finalData)

    if (error) {
        console.error("Settings update error:", error)
        return { error: error.message }
    }

    console.log("Settings merged and updated successfully")

    // 6. Force immediate revalidation
    revalidatePath("/", "layout")
    revalidatePath("/admin", "layout")
    revalidatePath("/admin/settings", "page")

    return { success: "Settings updated successfully" }
}
