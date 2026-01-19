import { createClient } from "@/lib/supabase/server"

export async function getBrands() {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('brands')
        .select('*')
        .order('name', { ascending: true })

    if (error) {
        console.error("Error fetching brands:", error)
        return []
    }

    return data || []
}
