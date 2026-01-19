import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { ShopContent } from "../../shop/shop-content"
import { getCategories } from "@/actions/get-categories"
import { getBrands } from "@/actions/get-brands"
import { getTags } from "@/actions/get-tags"

export const dynamic = "force-dynamic"

interface CategoryPageProps {
    params: Promise<{
        categoryName: string
    }>
    searchParams?: Promise<{
        sort?: string
        minPrice?: string
        maxPrice?: string
        brand?: string
        tag?: string
    }>
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
    const { categoryName } = await params
    const sParams = (await searchParams) || {}
    const supabase = await createClient()

    const currentSort = sParams.sort || "newest"
    const minPrice = sParams.minPrice ? parseFloat(sParams.minPrice) : null
    const maxPrice = sParams.maxPrice ? parseFloat(sParams.maxPrice) : null
    const currentBrand = sParams.brand || "All"
    const currentTag = sParams.tag || "All"

    // 1. Fetch filters in parallel
    const [categories, brands, tags] = await Promise.all([
        getCategories(),
        getBrands(),
        getTags()
    ])

    const categoryNames = ["All", ...categories.map(c => c.name)]
    const brandNames = brands.map(b => b.name)
    const tagNames = tags.map(t => t.name)

    // 2. Fetch current category details
    const { data: categoryData } = await supabase
        .from('categories')
        .select('name, id')
        .eq('slug', categoryName)
        .single()

    if (!categoryData) {
        notFound()
    }

    let selectString = `*`
    const isBrandFilter = currentBrand !== "All"
    const isTagFilter = currentTag !== "All"

    // Construct the select string with required !inner joins for filtering
    const categoryJoin = `category:categories!inner(name, slug)` // Always inner here as we are on category page
    const brandJoin = isBrandFilter ? `brand:brands!inner(name)` : `brand:brands(name)`
    const tagJoin = isTagFilter
        ? `product_tags!inner(tags!inner(name))`
        : `product_tags!left(tags!inner(name))`

    selectString = `*, ${categoryJoin}, ${brandJoin}, ${tagJoin}`

    // 3. Fetch products with full filtering
    let query = supabase
        .from('products')
        .select(selectString)
        .eq('category.slug', categoryName)
        .eq('status', 'active')

    // Apply filters
    if (currentBrand !== "All") {
        query = query.eq('brand.name', currentBrand)
    }
    if (currentTag !== "All") {
        query = query.eq('product_tags.tags.name', currentTag)
    }
    if (minPrice !== null) {
        query = query.gte('price', minPrice)
    }
    if (maxPrice !== null) {
        query = query.lte('price', maxPrice)
    }

    // Sorting
    if (currentSort === "price-asc") {
        query = query.order('price', { ascending: true })
    } else if (currentSort === "price-desc") {
        query = query.order('price', { ascending: false })
    } else {
        query = query.order('created_at', { ascending: false })
    }

    const { data: products } = await query

    const transformedProducts = (products as any[] || [])?.map(p => ({
        ...p,
        name: p.title,
        image: p.featured_image || "/placeholder.jpg",
        category: p.category?.name || "Uncategorized",
        slug: p.slug
    }))

    return (
        <ShopContent
            products={transformedProducts as any}
            currentCategory={categoryData.name}
            categories={categoryNames}
            brands={brandNames}
            tags={tagNames}
        />
    )
}
