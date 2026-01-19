import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"
import { CategoriesTable } from "./categories-table"

export const dynamic = "force-dynamic"

export default async function CategoryManagementPage() {
    const supabase = await createClient()

    const { data: categories, error } = await supabase
        .from('categories')
        .select(`
            id,
            name,
            slug,
            description,
            image_url,
            products(count)
        `)
        .order('created_at', { ascending: false })

    if (error) {
        console.error("Error fetching categories:", error)
    }

    // Transform count data
    const formattedCategories = categories?.map(cat => ({
        ...cat,
        _count: {
            // @ts-ignore - Supabase types counting relation specifically
            products: cat.products?.[0]?.count || 0
        }
    })) || []

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-bold tracking-tighter">Categories</h1>
                    <p className="text-zinc-500 text-sm">Manage product categories and organization.</p>
                </div>
                <Link href="/admin/categories/new">
                    <Button className="rounded-2xl h-11 px-6 font-bold uppercase tracking-widest text-[11px] gap-2 shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95">
                        <Plus className="h-4 w-4" />
                        Add Category
                    </Button>
                </Link>
            </div>

            <CategoriesTable categories={formattedCategories as any} />
        </div>
    )
}
