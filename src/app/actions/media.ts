"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function uploadMedia(formData: FormData) {
    const supabase = await createClient()
    const file = formData.get('file') as File
    const bucket = formData.get('bucket') as string || 'products'

    if (!file) return { error: "No file provided" }

    try {
        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
        const filePath = `${fileName}`

        const { error: uploadError } = await supabase.storage
            .from(bucket)
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false
            })

        if (uploadError) {
            console.error("Storage upload error:", uploadError)
            return { error: uploadError.message }
        }

        const { data: { publicUrl } } = supabase.storage
            .from(bucket)
            .getPublicUrl(filePath)

        return { url: publicUrl }
    } catch (err: any) {
        console.error("Upload media exception:", err)
        return { error: err.message || "An unexpected error occurred during upload" }
    }
}
