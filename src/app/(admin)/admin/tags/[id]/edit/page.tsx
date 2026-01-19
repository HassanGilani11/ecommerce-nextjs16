import { createClient } from "@/lib/supabase/server"
import { notFound, redirect } from "next/navigation"
import EditTagForm from "./edit-tag-form"

interface EditTagPageProps {
    params: {
        id: string
    }
}

export default async function EditTagPage({ params }: EditTagPageProps) {
    const { id } = await params
    const supabase = await createClient()

    // Auth Check
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        redirect("/login")
    }

    // Fetch Tag
    const { data: tag, error } = await supabase
        .from('tags')
        .select('*')
        .eq('id', id)
        .single()

    if (error || !tag) {
        notFound()
    }

    return (
        <EditTagForm tag={tag} />
    )
}
