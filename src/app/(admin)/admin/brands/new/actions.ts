"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const brandSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    slug: z.string().min(2, "Slug must be at least 2 characters"),
    description: z.string().optional(),
    logo_url: z.string().optional()
})

export async function createBrand(prevState: any, formData: FormData) {
    const supabase = await createClient()

    const rawData = {
        name: formData.get("name"),
        slug: formData.get("slug"),
        description: formData.get("description"),
        logo_url: formData.get("logo_url")
    }

    const validatedFields = brandSchema.safeParse(rawData)

    if (!validatedFields.success) {
        return {
            error: validatedFields.error.flatten().fieldErrors,
            message: "Validation failed"
        }
    }

    try {
        const { error } = await supabase
            .from('brands')
            .insert({
                ...validatedFields.data,
                created_at: new Date().toISOString()
            })

        if (error) {
            console.error("Create Brand Error:", error)
            return { error: "Failed to create brand. Slug might be taken." }
        }

        revalidatePath('/admin/brands')
    } catch (e: any) {
        return { error: "Server error: " + e.message }
    }

    return { success: true }
}
