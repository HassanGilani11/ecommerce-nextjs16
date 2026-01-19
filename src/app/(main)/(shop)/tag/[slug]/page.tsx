import Link from "next/link"
import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface TagPageProps {
    params: {
        slug: string
    }
}

export default async function TagPage({ params }: TagPageProps) {
    const { slug } = await params
    const supabase = await createClient()

    // Fetch tag and its products
    const { data: tag, error } = await supabase
        .from('tags')
        .select(`
            *,
            product_tags (
                product: products (
                     id,
                     title,
                     slug,
                     price,
                     featured_image
                )
            )
        `)
        .eq('slug', slug)
        .single()

    if (error || !tag) {
        notFound()
    }

    const products = tag.product_tags.map((pt: any) => pt.product).filter(Boolean)

    return (
        <div className="container py-12 space-y-12">
            <div className="flex flex-col items-center text-center space-y-4 max-w-2xl mx-auto">
                <Badge variant="secondary" className="px-4 py-1 text-sm bg-zinc-100 text-zinc-600 mb-2">
                    Tag Collection
                </Badge>
                <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase">
                    {tag.name}
                </h1>
                {tag.description && (
                    <p className="text-zinc-500 text-lg leading-relaxed">
                        {tag.description}
                    </p>
                )}
            </div>

            {products.length === 0 ? (
                <div className="text-center py-24 bg-zinc-50 rounded-[3rem]">
                    <h3 className="text-xl font-bold text-zinc-900 mb-2">No products found</h3>
                    <p className="text-zinc-500">This tag has not been applied to any products yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {products.map((product: any) => (
                        <Link key={product.id} href={`/product/${product.slug}`} className="group block">
                            <Card className="border-none shadow-none bg-transparent space-y-4">
                                <div className="aspect-[3/4] rounded-[2rem] overflow-hidden bg-zinc-100 relative">
                                    {product.featured_image ? (
                                        <img
                                            src={product.featured_image}
                                            alt={product.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-zinc-300">
                                            No Image
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-base font-bold text-zinc-900 group-hover:text-primary transition-colors">
                                        {product.title}
                                    </h3>
                                    <p className="text-sm font-medium text-zinc-500">
                                        ${product.price}
                                    </p>
                                </div>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}
