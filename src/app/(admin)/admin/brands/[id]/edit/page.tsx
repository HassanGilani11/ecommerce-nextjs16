import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import EditBrandForm from "./edit-brand-form"

interface PageProps {
    params: Promise<{ id: string }>
}

export default async function EditBrandPage({ params }: PageProps) {
    const { id } = await params
    const supabase = await createClient()

    const { data: brand, error } = await supabase
        .from('brands')
        .select('*')
        .eq('id', id)
        .single()

    if (error || !brand) {
        console.error("Error fetching brand:", error)
        notFound()
    }

    return <EditBrandForm brand={brand} />
}
