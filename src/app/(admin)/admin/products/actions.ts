"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function deleteProduct(id: string) {
    const supabase = await createClient()

    // Debug Authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        return { error: "You must be logged in to delete a product." }
    }

    try {
        // 1. Delete Product (Cascading deletes should handle related tables if configured, 
        // otherwise we might need to manually delete tags/order_items - assuming cascade is ON or handled)
        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id)

        if (error) {
            console.error("Delete Product Error:", error)
            return { error: "Database error: " + error.message }
        }

        revalidatePath('/admin/products')
        return { success: true }

    } catch (e: any) {
        return { error: "Server error: " + e.message }
    }
}
