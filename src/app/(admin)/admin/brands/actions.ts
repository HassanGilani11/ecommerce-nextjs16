"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function deleteBrand(id: string) {
    const supabase = await createClient()

    try {
        const { error } = await supabase.from('brands').delete().eq('id', id)

        if (error) {
            console.error("Delete Brand Error:", error)
            return { error: "Failed to delete brand" }
        }

        revalidatePath('/admin/brands')
        return { success: true }
    } catch (e) {
        return { error: "Server error" }
    }
}
