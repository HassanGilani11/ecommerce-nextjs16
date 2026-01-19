import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import EditProductForm from "./edit-product-form"

interface PageProps {
    params: Promise<{ id: string }>
}

export default async function EditProductPage({ params }: PageProps) {
    const { id } = await params
    const supabase = await createClient()

    const { data: product, error } = await supabase
        .from('products')
        .select(`
            id,
            title,
            description,
            price,
            stock,
            status,
            featured_image,
            gallery,
            slug,
            category:categories(name, slug),
            brand:brands(name, slug),
            tags:product_tags(tag:tags(name))
        `)
        .eq('id', id)
        .single()

    if (error || !product) {
        console.error("Error fetching product:", error)
        notFound()
    }

    // Transform data to match client component props
    const formattedProduct = {
        ...product,
        category: Array.isArray(product.category) ? product.category[0] : product.category,
        brand: Array.isArray(product.brand) ? product.brand[0] : product.brand,
        tags: Array.isArray(product.tags) ? product.tags : []
    }

    return <EditProductForm product={formattedProduct as any} />
}
