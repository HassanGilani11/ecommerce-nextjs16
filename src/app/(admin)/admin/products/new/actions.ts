"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"

const productSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    slug: z.string().min(3, "Slug must be at least 3 characters").optional(),
    description: z.string().optional(),
    price: z.coerce.number().min(0, "Price must be positive"),
    stock: z.coerce.number().int().min(0, "Stock must be non-negative"),
    status: z.enum(["draft", "active", "archived"]),
    category: z.string().min(1, "Category is required"),
    brand: z.string().optional(),
    tags: z.array(z.string()).optional(),
    featured_image: z.string().optional(),
    gallery: z.array(z.string()).optional()
})

export async function createProduct(prevState: any, formData: FormData) {
    const supabase = await createClient()

    // Debug Authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        return { error: "You must be logged in to create a product." }
    }

    // 1. Parse and validate data
    const rawData = {
        title: formData.get("title"),
        slug: formData.get("slug"),
        description: formData.get("description"),
        price: formData.get("price"),
        stock: formData.get("stock"),
        status: formData.get("status"),
        category: formData.get("category"), // This is the slug 
        brand: formData.get("brand"), // This is the slug
        tags: JSON.parse(formData.get("tags") as string || "[]"),
        featured_image: formData.get("featured_image"),
        gallery: JSON.parse(formData.get("gallery") as string || "[]")
    }

    console.log("Create Product Raw Data:", rawData)

    const validatedFields = productSchema.safeParse(rawData)

    if (!validatedFields.success) {
        console.error("Validation Errors:", validatedFields.error.flatten().fieldErrors)
        return {
            error: validatedFields.error.flatten().fieldErrors,
            message: "Validation failed"
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { tags, category: categorySlug, brand: brandSlug, slug: providedSlug, ...productData } = validatedFields.data

    try {
        // 2. Resolve IDs (Category & Brand)
        const { data: categoryData, error: catError } = await supabase
            .from('categories')
            .select('id')
            .eq('slug', categorySlug)
            .single()

        if (catError || !categoryData) {
            return { error: "Invalid category selected." }
        }

        let brandId = null
        if (brandSlug && brandSlug !== 'none') {
            const { data: brandData, error: brandError } = await supabase
                .from('brands')
                .select('id')
                .eq('slug', brandSlug)
                .single()

            if (brandData) brandId = brandData.id
        }

        // 3. Generate Slug (if not provided)
        const finalSlug = providedSlug || productData.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '') +
            '-' + Math.random().toString(36).substring(7)

        // 4. Insert Product
        const { data: product, error: insertError } = await supabase
            .from('products')
            .insert({
                ...productData,
                slug: finalSlug,
                category_id: categoryData.id,
                brand_id: brandId,
                gallery: productData.gallery || []
            })
            .select()
            .single()

        if (insertError) {
            console.error("Insert Product SQL Error:", insertError)
            return { error: "Database error: " + insertError.message }
        }

        // 5. Link Tags
        if (tags && tags.length > 0) {
            // Find existing tags
            const { data: existingTags } = await supabase
                .from('tags')
                .select('id, name')
                .in('name', tags)

            const existingTagNames = existingTags?.map(t => t.name) || []
            const newTagNames = tags.filter(t => !existingTagNames.includes(t))

            // Create new tags (UI restricts, but safe backend fallback)
            let newTags: { id: string, name: string }[] = []
            if (newTagNames.length > 0) {
                const { data: createdTags } = await supabase
                    .from('tags')
                    .insert(newTagNames.map(name => ({
                        name,
                        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
                    })))
                    .select('id, name')

                if (createdTags) newTags = createdTags
            }

            const allTags = [...(existingTags || []), ...newTags]

            // Create product_tags links
            if (allTags.length > 0) {
                const tagLinks = allTags.map(tag => ({
                    product_id: product.id,
                    tag_id: tag.id
                }))

                const { error: linkError } = await supabase
                    .from('product_tags')
                    .insert(tagLinks)

                if (linkError) {
                    console.error("Error linking tags:", linkError)
                }
            }
        }

        revalidatePath('/admin/products')

    } catch (e: any) {
        return { error: "Server error: " + e.message }
    }

    return { success: true }
}
