import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"
import { ProductsTable } from "./products-table"

export const dynamic = "force-dynamic"

export default async function AdminProductsPage() {
    const supabase = await createClient()

    const { data: products } = await supabase
        .from('products')
        .select(`
            id,
            title,
            price,
            stock,
            status,
            featured_image,
            slug,
            category:categories(name, slug),
            brand:brands(name, slug),
            tags:product_tags(tag:tags(name))
        `)
        .order('created_at', { ascending: false })

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tighter">Products</h1>
                    <p className="text-zinc-500 text-sm">Manage your inventory and product listings.</p>
                </div>
                <Link href="/admin/products/new">
                    <Button className="rounded-2xl h-11 px-6 font-bold uppercase tracking-widest text-[11px] gap-2 shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95">
                        <Plus className="h-4 w-4" />
                        Add Product
                    </Button>
                </Link>
            </div>

            <ProductsTable products={products as any || []} />
        </div>
    )
}
