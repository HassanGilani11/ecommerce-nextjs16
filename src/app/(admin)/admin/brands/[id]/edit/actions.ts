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

export async function updateBrand(id: string, prevState: any, formData: FormData) {
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
            .update({
                ...validatedFields.data
            })
            .eq('id', id)

        if (error) {
            console.error("Update Brand Error:", error)
            return { error: "Failed to update brand." }
        }

        revalidatePath('/admin/brands')
        revalidatePath(`/admin/brands/${id}/edit`)
    } catch (e: any) {
        return { error: "Server error: " + e.message }
    }

    return { success: true }
}
