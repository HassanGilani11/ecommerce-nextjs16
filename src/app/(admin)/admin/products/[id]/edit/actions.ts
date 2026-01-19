"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"

const productSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    slug: z.string().min(3, "Slug must be at least 3 characters").optional(),
    description: z.string().optional(),
    price: z.number().min(0, "Price must be positive"),
    stock: z.number().int().min(0, "Stock must be non-negative"),
    status: z.enum(["draft", "active", "archived"]),
    category: z.string().min(1, "Category is required"),
    brand: z.string().optional(),
    tags: z.array(z.string()).optional(),
    featured_image: z.string().optional(),
    gallery: z.array(z.string()).optional()
})

export async function updateProduct(id: string, prevState: any, formData: FormData) {
    const supabase = await createClient()

    // Debug Authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        return { error: "You must be logged in to update a product." }
    }

    // 1. Parse and validate data
    const rawData = {
        title: formData.get("title"),
        slug: formData.get("slug"),
        description: formData.get("description"),
        price: Number(formData.get("price")),
        stock: Number(formData.get("stock")),
        status: formData.get("status"),
        category: formData.get("category"),
        brand: formData.get("brand"),
        tags: JSON.parse(formData.get("tags") as string || "[]"),
        featured_image: formData.get("featured_image"),
        gallery: JSON.parse(formData.get("gallery") as string || "[]")
    }

    console.log("Update Product Raw Data:", rawData)

    const validatedFields = productSchema.safeParse(rawData)

    if (!validatedFields.success) {
        console.error("Validation Errors:", validatedFields.error.flatten().fieldErrors)
        return {
            error: validatedFields.error.flatten().fieldErrors,
            message: "Validation failed"
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { tags, category, brand, slug: providedSlug, ...productData } = validatedFields.data

    try {
        // 2. Resolve IDs (Category & Brand)
        // The form sends slugs as the value
        const { data: categoryData, error: catError } = await supabase
            .from('categories')
            .select('id')
            .eq('slug', category)
            .single()

        const categoryId = categoryData?.id

        let brandId = null
        if (brand && brand !== 'none') {
            const { data: brandData } = await supabase
                .from('brands')
                .select('id')
                .eq('slug', brand)
                .single()

            if (brandData) brandId = brandData.id
        }

        // 3. Update Product
        const { error: updateError } = await supabase
            .from('products')
            .update({
                ...productData,
                slug: providedSlug,
                category_id: categoryId,
                brand_id: brandId,
                featured_image: rawData.featured_image || null,
                gallery: productData.gallery || [],
                updated_at: new Date().toISOString()
            })
            .eq('id', id)

        if (updateError) {
            console.error("Update Product SQL Error:", updateError)
            return { error: "Database error: " + updateError.message }
        }

        // 4. Handle Tags (Delete existing, Insert new)
        if (tags) {
            // Delete old tags mapping
            await supabase.from('product_tags').delete().eq('product_id', id)

            // Resolve Tags (by name)
            const tagIds = []

            // Optimization: Fetch all tags at once
            const { data: existingTags } = await supabase
                .from('tags')
                .select('id, name')
                .in('name', tags)

            const existingTagMap = new Map(existingTags?.map(t => [t.name, t.id]))

            for (const tagName of tags) {
                if (existingTagMap.has(tagName)) {
                    tagIds.push(existingTagMap.get(tagName))
                } else {
                    // Create new tag if doesn't exist
                    const { data: newTag } = await supabase
                        .from('tags')
                        .insert({ name: tagName, slug: tagName.toLowerCase().replace(/[^a-z0-9]+/g, '-') })
                        .select('id')
                        .single()

                    if (newTag) tagIds.push(newTag.id)
                }
            }

            // Insert new mappings
            if (tagIds.length > 0) {
                const tagLinks = tagIds.map(tagId => ({
                    product_id: id,
                    tag_id: tagId
                }))
                await supabase.from('product_tags').insert(tagLinks)
            }
        }

        revalidatePath('/admin/products')
        revalidatePath(`/admin/products/${id}/edit`)

    } catch (e: any) {
        return { error: "Server error: " + e.message }
    }

    return { success: true }
}
