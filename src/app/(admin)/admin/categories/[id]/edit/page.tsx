import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import EditCategoryForm from "./edit-category-form"

interface PageProps {
    params: Promise<{ id: string }>
}

export default async function EditCategoryPage({ params }: PageProps) {
    const { id } = await params
    const supabase = await createClient()

    const { data: category, error } = await supabase
        .from('categories')
        .select('*')
        .eq('id', id)
        .single()

    if (error || !category) {
        console.error("Error fetching category:", error)
        notFound()
    }

    return <EditCategoryForm category={category} />
}
