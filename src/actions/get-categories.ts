"use server"

import { createClient } from "@/lib/supabase/server"

export async function getCategories() {
    const supabase = await createClient()

    const { data: categories, error } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true })

    if (error) {
        console.error("Error fetching categories:", error)
        return []
    }

    return categories || []
}
