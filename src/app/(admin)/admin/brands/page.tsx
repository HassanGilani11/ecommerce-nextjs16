import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"
import { BrandsTable } from "./brands-table"

export const dynamic = "force-dynamic"

export default async function BrandsManagementPage() {
    const supabase = await createClient()

    const { data: brands, error } = await supabase
        .from('brands')
        .select(`
            id,
            name,
            slug,
            description,
            logo_url,
            products(count)
        `)
        .order('name')

    if (error) {
        console.error("Error fetching brands:", error)
    }

    const formattedBrands = brands?.map(brand => ({
        ...brand,
        product_count: brand.products?.[0]?.count || 0
    })) || []

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-bold tracking-tighter">Brands</h1>
                    <p className="text-zinc-500 text-sm">Manage your store's brand partners and manufacturers.</p>
                </div>
                <Link href="/admin/brands/new">
                    <Button className="rounded-2xl h-11 px-6 font-bold uppercase tracking-widest text-[11px] gap-2 shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95">
                        <Plus className="h-4 w-4" />
                        Add Brand
                    </Button>
                </Link>
            </div>

            <BrandsTable brands={formattedBrands as any} />
        </div>
    )
}
