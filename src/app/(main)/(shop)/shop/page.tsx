import { Suspense } from "react"
import { createClient } from "@/lib/supabase/server"
import { ShopContent } from "./shop-content"
import { getCategories } from "@/actions/get-categories"
import { getBrands } from "@/actions/get-brands"
import { getTags } from "@/actions/get-tags"

export const dynamic = "force-dynamic"

interface SearchParams {
    category?: string
    sort?: string
    minPrice?: string
    maxPrice?: string
    brand?: string
    tag?: string
    page?: string
}

export default async function ShopPage({
    searchParams,
}: {
    searchParams?: Promise<SearchParams>
}) {
    const supabase = await createClient()
    const params = (await searchParams) || {}

    const currentCategory = params.category || "All"
    const currentSort = params.sort || "newest"
    const minPrice = params.minPrice ? parseFloat(params.minPrice) : null
    const maxPrice = params.maxPrice ? parseFloat(params.maxPrice) : null
    const currentBrand = params.brand || "All"
    const currentTag = params.tag || "All"
    const currentPage = parseInt(params.page || "1")
    const pageSize = 12
    const from = (currentPage - 1) * pageSize
    const to = from + pageSize - 1

    // Fetch filters in parallel
    const [categories, brands, tags] = await Promise.all([
        getCategories(),
        getBrands(),
        getTags()
    ])

    const categoryNames = ["All", ...categories.map(c => c.name)]
    const brandNames = brands.map(b => b.name)
    const tagNames = tags.map(t => t.name)

    let selectString = `*`
    const isCategoryFilter = currentCategory !== "All"
    const isBrandFilter = currentBrand !== "All"
    const isTagFilter = currentTag !== "All"

    // Construct the select string with required !inner joins for filtering
    const categoryJoin = isCategoryFilter ? `category:categories!inner(name)` : `category:categories(name)`
    const brandJoin = isBrandFilter ? `brand:brands!inner(name)` : `brand:brands(name)`
    const tagJoin = isTagFilter
        ? `product_tags!inner(tags!inner(name))`
        : `product_tags!left(tags!inner(name))`

    selectString = `*, ${categoryJoin}, ${brandJoin}, ${tagJoin}`

    let query = supabase
        .from('products')
        .select(selectString, { count: 'exact' })
        .eq('status', 'active')

    // 1. Category Filter
    if (currentCategory !== "All") {
        query = query.eq('category.name', currentCategory)
    }

    // 2. Brand Filter
    if (currentBrand !== "All") {
        query = query.eq('brand.name', currentBrand)
    }

    // 3. Tag Filter
    if (currentTag !== "All") {
        query = query.eq('product_tags.tags.name', currentTag)
    }

    // 4. Price Filter
    if (minPrice !== null) {
        query = query.gte('price', minPrice)
    }
    if (maxPrice !== null) {
        query = query.lte('price', maxPrice)
    }

    // 5. Sorting
    if (currentSort === "price-asc") {
        query = query.order('price', { ascending: true })
    } else if (currentSort === "price-desc") {
        query = query.order('price', { ascending: false })
    } else {
        query = query.order('created_at', { ascending: false })
    }

    const { data: products, error, count } = await query
        .range(from, to)

    if (error) {
        console.error("Error fetching products:", error)
    }

    // Transform data to match UI expectations
    const transformedProducts = (products as any[] || [])?.map(p => ({
        ...p,
        name: p.title,
        image: p.featured_image || "/placeholder.jpg",
        category: p.category?.name || "Uncategorized"
    }))

    return (
        <Suspense fallback={<div className="container py-20 text-center">Loading products...</div>}>
            <ShopContent
                products={transformedProducts as any}
                currentCategory={currentCategory}
                categories={categoryNames}
                brands={brandNames}
                tags={tagNames}
                totalCount={count || 0}
                currentPage={currentPage}
                pageSize={pageSize}
            />
        </Suspense>
    )
}
