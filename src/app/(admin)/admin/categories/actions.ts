"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { redirect } from "next/navigation"

const categorySchema = z.object({
    name: z.string().min(1, "Name is required"),
    slug: z.string().min(1, "Slug is required"),
    description: z.string().optional(),
    image_url: z.string().optional(),
    parent_id: z.string().optional().nullable()
})

export async function createCategory(prevState: any, formData: FormData) {
    const supabase = await createClient()

    const rawData = {
        name: formData.get("name"),
        slug: formData.get("slug"),
        description: formData.get("description"),
        image_url: formData.get("image"), // Form sends "image", we map to image_url
        parent_id: formData.get("parent_id") || null
    }

    const validatedFields = categorySchema.safeParse(rawData)

    if (!validatedFields.success) {
        return {
            error: validatedFields.error.flatten().fieldErrors,
            message: "Validation failed"
        }
    }

    try {
        const { error } = await supabase
            .from('categories')
            .insert(validatedFields.data)

        if (error) {
            console.error("Create Category Error:", error)
            return { error: "Database error: " + error.message }
        }

        revalidatePath('/admin/categories')

    } catch (e: any) {
        return { error: "Server error: " + e.message }
    }

    redirect('/admin/categories')
}

export async function updateCategory(id: string, prevState: any, formData: FormData) {
    const supabase = await createClient()

    const rawData = {
        name: formData.get("name"),
        slug: formData.get("slug"),
        description: formData.get("description"),
        image_url: formData.get("image"), // Form sends "image", we map to image_url
        parent_id: formData.get("parent_id") || null
    }

    const validatedFields = categorySchema.safeParse(rawData)

    if (!validatedFields.success) {
        return {
            error: validatedFields.error.flatten().fieldErrors,
            message: "Validation failed"
        }
    }

    try {
        const { error } = await supabase
            .from('categories')
            .update(validatedFields.data)
            .eq('id', id)

        if (error) {
            console.error("Update Category Error:", error)
            return { error: "Database error: " + error.message }
        }

        revalidatePath('/admin/categories')

    } catch (e: any) {
        return { error: "Server error: " + e.message }
    }

    redirect('/admin/categories')
}

export async function deleteCategory(id: string) {
    const supabase = await createClient()

    try {
        const { error } = await supabase
            .from('categories')
            .delete()
            .eq('id', id)

        if (error) {
            return { error: "Database error: " + error.message }
        }

        revalidatePath('/admin/categories')
        return { success: true }

    } catch (e: any) {
        return { error: "Server error: " + e.message }
    }
}
