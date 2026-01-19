import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Star, Truck, ShieldCheck } from "lucide-react"
import { ProductGallery } from "@/components/shop/product-gallery"
import { ProductInteraction } from "@/components/shop/product-interaction"

interface ProductPageProps {
    params: Promise<{
        slug: string
    }>
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { slug } = await params
    const supabase = await createClient()

    const { data: product } = await supabase
        .from('products')
        .select(`
            *,
            category:categories(name),
            brand:brands(name)
        `)
        .eq('slug', slug)
        .single()

    if (!product) {
        notFound()
    }

    // Map database fields to UI expectations
    const productName = product.title
    const productCategory = product.category?.name || "Uncategorized"
    const productPrice = product.price
    const productDescription = product.description || "No description available."

    // Combine featured image and gallery
    const featuredImage = product.featured_image || "/placeholder.jpg"
    const gallery = Array.isArray(product.gallery) ? product.gallery : []
    // Ensure unique images and featured image is first
    const productImages = Array.from(new Set([featuredImage, ...gallery])).filter(Boolean)

    return (
        <div className="container mx-auto py-6 sm:py-8 md:py-16 px-4">
            <Link
                href="/shop"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6 sm:mb-8"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to Shop
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20">
                {/* Product Images */}
                <ProductGallery
                    images={productImages}
                    title={productName}
                />

                {/* Product Info */}
                <div className="flex flex-col gap-6 sm:gap-8">
                    <div className="space-y-3 sm:space-y-4">
                        <Badge variant="outline" className="rounded-full px-4 text-[10px] sm:text-xs">{productCategory}</Badge>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tighter">{productName}</h1>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                            <span className="text-2xl sm:text-3xl font-bold text-primary">${Number(productPrice).toFixed(2)}</span>
                            <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <Star key={i} className="h-3 w-3 sm:h-4 sm:w-4 fill-primary text-primary" />
                                ))}
                                <span className="text-xs sm:text-sm text-muted-foreground ml-1 sm:ml-2">(48 Reviews)</span>
                            </div>
                        </div>
                    </div>

                    <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                        {productDescription}
                    </p>

                    {/* Product Interaction (Quantity + Buttons) */}
                    <ProductInteraction
                        product={{
                            id: product.id,
                            name: productName,
                            price: Number(productPrice),
                            image: featuredImage,
                            slug: slug,
                            category: productCategory
                        }}
                    />

                    <Separator />

                    <div className="grid gap-4">
                        <div className="flex items-start gap-4">
                            <Truck className="h-5 w-5 mt-1 text-muted-foreground" />
                            <div>
                                <p className="font-semibold text-xs sm:text-sm">Free Express Shipping</p>
                                <p className="text-[10px] sm:text-xs text-muted-foreground">On all orders over $100. Delivered in 2-3 business days.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <ShieldCheck className="h-5 w-5 mt-1 text-muted-foreground" />
                            <div>
                                <p className="font-semibold text-xs sm:text-sm">2-Year Warranty</p>
                                <p className="text-[10px] sm:text-xs text-muted-foreground">Certified quality and authenticity guaranteed.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
