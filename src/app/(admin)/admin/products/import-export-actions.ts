"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

/**
 * EXPORT PRODUCTS TO CSV
 */
export async function exportProductsToCSV() {
    const supabase = await createClient()

    // Fetch all products with their relations
    const { data: products, error } = await supabase
        .from('products')
        .select(`
            *,
            category:categories(name, slug),
            brand:brands(name, slug),
            tags:product_tags(tag:tags(name))
        `)
        .order('created_at', { ascending: false })

    if (error) {
        console.error("Export Error:", error)
        return { error: "Failed to fetch products for export." }
    }

    if (!products || products.length === 0) {
        return { error: "No products found to export." }
    }

    // CSV Header
    const headers = [
        "title", "slug", "description", "price", "stock",
        "category", "brand", "status", "featured_image",
        "gallery", "tags"
    ]

    // Map products to CSV rows
    const rows = products.map(p => {
        const gallery = Array.isArray(p.gallery) ? p.gallery.join('|') : ""
        const tags = p.tags?.map((t: any) => t.tag?.name).filter(Boolean).join(',') || ""

        const data = [
            p.title,
            p.slug,
            p.description || "",
            p.price,
            p.stock,
            p.category?.slug || p.category?.name || "",
            p.brand?.slug || p.brand?.name || "",
            p.status,
            p.featured_image || "",
            gallery,
            tags
        ]

        // Escape quotes and wrap in quotes
        return data.map(val => {
            const str = String(val).replace(/"/g, '""')
            return `"${str}"`
        }).join(",")
    })

    const csvContent = [headers.join(","), ...rows].join("\n")
    return { success: true, csv: csvContent }
}

/**
 * IMPORT PRODUCTS FROM CSV
 */
export async function importProductsFromCSV(csvText: string) {
    const supabase = await createClient()

    // Auth Check
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return { error: "Unauthorized" }

    // Parse CSV (Simple line-based parser with quote handling)
    const lines = csvText.split(/\r?\n/).filter(line => line.trim())
    if (lines.length < 2) return { error: "CSV file is empty or missing data." }

    const headers = lines[0].split(",").map(h => h.trim().replace(/"/g, ''))
    const dataLines = lines.slice(1)

    // Helper to extract values handles escaped commas in quotes
    const getValues = (line: string) => {
        const result = []
        let current = ""
        let inQuotes = false
        for (let i = 0; i < line.length; i++) {
            const char = line[i]
            if (char === '"') {
                if (inQuotes && line[i + 1] === '"') { // Escaped quote
                    current += '"'
                    i++
                } else {
                    inQuotes = !inQuotes
                }
            } else if (char === ',' && !inQuotes) {
                result.push(current)
                current = ""
            } else {
                current += char
            }
        }
        result.push(current)
        return result
    }

    let successCount = 0
    let errorCount = 0
    const errors: string[] = []

    // Cache categories, brands, and tags for lookup
    const { data: allCategories } = await supabase.from('categories').select('id, name, slug')
    const { data: allBrands } = await supabase.from('brands').select('id, name, slug')
    const { data: allTags } = await supabase.from('tags').select('id, name')

    for (const line of dataLines) {
        try {
            const values = getValues(line)
            const row: any = {}
            headers.forEach((h, i) => { row[h] = values[i] })

            // 1. Resolve Category ID
            let categoryId = null
            if (row.category) {
                let cat = allCategories?.find(c => c.slug === row.category || c.name === row.category)
                if (!cat) {
                    // Create new category
                    const slug = row.category.toLowerCase().replace(/[^a-z0-9]+/g, '-')
                    const { data: newCat, error: catError } = await supabase
                        .from('categories')
                        .insert({ name: row.category, slug })
                        .select()
                        .single()

                    if (!catError && newCat) {
                        cat = newCat
                        allCategories?.push(newCat) // Update cache
                    }
                }
                categoryId = cat?.id || null
            }

            // 2. Resolve Brand ID
            let brandId = null
            if (row.brand) {
                let b = allBrands?.find(br => br.slug === row.brand || br.name === row.brand)
                if (!b) {
                    // Create new brand
                    const slug = row.brand.toLowerCase().replace(/[^a-z0-9]+/g, '-')
                    const { data: newBrand, error: brandError } = await supabase
                        .from('brands')
                        .insert({ name: row.brand, slug })
                        .select()
                        .single()

                    if (!brandError && newBrand) {
                        b = newBrand
                        allBrands?.push(newBrand) // Update cache
                    }
                }
                brandId = b?.id || null
            }

            // 3. Process Gallery
            const gallery = row.gallery ? row.gallery.split('|').filter(Boolean) : []

            // 4. Upsert Product
            const productData = {
                title: row.title,
                slug: row.slug || row.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                description: row.description,
                price: parseFloat(row.price) || 0,
                stock: parseInt(row.stock) || 0,
                category_id: categoryId,
                brand_id: brandId,
                status: row.status || 'draft',
                featured_image: row.featured_image,
                gallery: gallery,
            }

            const { data: product, error: upsertError } = await supabase
                .from('products')
                .upsert(productData, { onConflict: 'slug' })
                .select()
                .single()

            if (upsertError) throw upsertError

            // 5. Handle Tags
            if (row.tags && product) {
                const tagNames = row.tags.split(',').map((t: string) => t.trim()).filter(Boolean)

                // Clear existing tags for this product (optional, but safer for "sync")
                await supabase.from('product_tags').delete().eq('product_id', product.id)

                for (const tagName of tagNames) {
                    let tag = allTags?.find(t => t.name.toLowerCase() === tagName.toLowerCase())

                    if (!tag) {
                        // Create new tag if doesn't exist
                        const { data: newTag } = await supabase
                            .from('tags')
                            .insert({ name: tagName, slug: tagName.toLowerCase().replace(/[^a-z0-9]+/g, '-') })
                            .select()
                            .single()
                        tag = newTag
                    }

                    if (tag) {
                        await supabase.from('product_tags').insert({
                            product_id: product.id,
                            tag_id: tag.id
                        })
                    }
                }
            }

            successCount++
        } catch (err: any) {
            console.error("Import Row Error:", err)
            errorCount++
            errors.push(err.message || "Unknown error")
        }
    }

    revalidatePath('/admin/products')
    return {
        success: true,
        message: `Successfully imported ${successCount} products. ${errorCount > 0 ? `${errorCount} failed.` : ''}`,
        errors: errors.length > 0 ? errors.slice(0, 5) : []
    }
}
