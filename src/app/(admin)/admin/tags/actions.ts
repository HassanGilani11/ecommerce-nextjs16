'use server'

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"

const tagSchema = z.object({
    name: z.string().min(1, "Name is required"),
    slug: z.string().min(1, "Slug is required"),
    description: z.string().optional(),
})

export async function createTag(prevState: any, formData: FormData) {
    const supabase = await createClient()

    // Auth check
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: "You must be logged in to create a tag." }
    }

    const rawData = {
        name: formData.get("name"),
        slug: formData.get("slug"),
        description: formData.get("description"),
    }

    const validatedFields = tagSchema.safeParse(rawData)

    if (!validatedFields.success) {
        return {
            error: "Validation failed",
            fieldErrors: validatedFields.error.flatten().fieldErrors,
        }
    }

    const { error } = await supabase
        .from('tags')
        .insert(validatedFields.data)

    if (error) {
        console.error("Create Tag Error:", error)
        return { error: error.message }
    }

    revalidatePath('/admin/tags')
    redirect('/admin/tags')
}

export async function updateTag(id: string, prevState: any, formData: FormData) {
    const supabase = await createClient()

    // Auth check
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: "You must be logged in to update a tag." }
    }

    const rawData = {
        name: formData.get("name"),
        slug: formData.get("slug"),
        description: formData.get("description"),
    }

    const validatedFields = tagSchema.safeParse(rawData)

    if (!validatedFields.success) {
        return {
            error: "Validation failed",
            fieldErrors: validatedFields.error.flatten().fieldErrors,
        }
    }

    const { error } = await supabase
        .from('tags')
        .update(validatedFields.data)
        .eq('id', id)

    if (error) {
        console.error("Update Tag Error:", error)
        return { error: error.message }
    }

    revalidatePath('/admin/tags')
    redirect('/admin/tags')
}

export async function deleteTag(id: string) {
    const supabase = await createClient()

    // Auth check
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: "Unauthorized" }
    }

    const { error } = await supabase
        .from('tags')
        .delete()
        .eq('id', id)

    if (error) {
        console.error("Delete Tag Error:", error)
        return { error: error.message }
    }

    revalidatePath('/admin/tags')
    return { success: true }
}
