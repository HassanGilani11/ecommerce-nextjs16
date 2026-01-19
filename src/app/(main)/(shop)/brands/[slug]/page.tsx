import Link from "next/link"
import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

interface BrandPageProps {
    params: Promise<{
        slug: string
    }>
}

export default async function BrandPage({ params }: BrandPageProps) {
    const { slug } = await params
    const supabase = await createClient()

    // Fetch brand and its products
    const { data: brand, error } = await supabase
        .from('brands')
        .select(`
            *,
            products (
                 id,
                 title,
                 slug,
                 price,
                 featured_image
            )
        `)
        .eq('slug', slug)
        .single()

    if (error || !brand) {
        notFound()
    }

    const products = brand.products || []

    return (
        <div className="container py-12 space-y-12">
            <div className="flex flex-col items-center text-center space-y-6 max-w-2xl mx-auto">
                {brand.logo_url && (
                    <div className="h-24 w-24 relative rounded-2xl overflow-hidden border border-zinc-100 p-2 bg-white shadow-sm">
                        <Image
                            src={brand.logo_url}
                            alt={brand.name}
                            fill
                            className="object-contain p-2"
                        />
                    </div>
                )}

                <div className="space-y-4">
                    <Badge variant="secondary" className="px-4 py-1 text-sm bg-zinc-100 text-zinc-600 mb-2">
                        Official Brand Partner
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase">
                        {brand.name}
                    </h1>
                    {brand.description && (
                        <p className="text-zinc-500 text-lg leading-relaxed">
                            {brand.description}
                        </p>
                    )}
                </div>
            </div>

            {products.length === 0 ? (
                <div className="text-center py-24 bg-zinc-50 rounded-[3rem]">
                    <h3 className="text-xl font-bold text-zinc-900 mb-2">No products found</h3>
                    <p className="text-zinc-500">This brand has no products listed yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {products.map((product: any) => (
                        <Link key={product.id} href={`/products/${product.slug}`} className="group block">
                            <Card className="border-none shadow-none bg-transparent space-y-4">
                                <div className="aspect-[3/4] rounded-[2rem] overflow-hidden bg-zinc-100 relative">
                                    {product.featured_image ? (
                                        <Image
                                            src={product.featured_image}
                                            alt={product.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
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
