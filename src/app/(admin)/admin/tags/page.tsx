import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"
import { TagsTable } from "./tags-table"

export const dynamic = "force-dynamic"

export default async function TagManagementPage() {
    const supabase = await createClient()

    const { data: tags } = await supabase
        .from('tags')
        .select(`
            id,
            name,
            slug,
            description,
            created_at,
            _count:product_tags(count)
        `)
        .order('created_at', { ascending: false })

    // Transform data to match interface if needed (Supabase returns count as array of objects usually, but here using count direct via alias if supported or need transform)
    // Actually Supabase JS .select(..., { count: 'exact' }) or inner join count is tricky.
    // The easiest way for count in joined table: .select('*, products:product_tags(count)')
    // But let's check what I wrote: _count:product_tags(count) is a Prisma-like syntax, Supabase uses select('*, product_tags(count)')

    // Correct query for Supabase:
    const { data: tagsData } = await supabase
        .from('tags')
        .select(`
            *,
            products:product_tags(count)
        `)
        .order('created_at', { ascending: false })

    // Transform to flatten count
    const formattedTags = tagsData?.map(tag => ({
        ...tag,
        _count: {
            products: tag.products?.[0]?.count || 0
        }
    })) || []

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-bold tracking-tighter">Tags</h1>
                    <p className="text-zinc-500 text-sm">Organize and label your products with custom tags.</p>
                </div>
                <Link href="/admin/tags/new">
                    <Button className="rounded-2xl h-11 px-6 font-bold uppercase tracking-widest text-[11px] gap-2 shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95">
                        <Plus className="h-4 w-4" />
                        Add Tag
                    </Button>
                </Link>
            </div>

            {/* Table Area */}
            <TagsTable initialTags={formattedTags} />
        </div>
    )
}
