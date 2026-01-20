"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

const sanitizeNumeric = (val: any) => {
    if (val === "" || val === null || val === undefined) return null;
    const num = parseFloat(val);
    return isNaN(num) ? 0 : num;
}

export async function getShippingZones() {
    const supabase = await createClient()

    const { data: zones, error } = await supabase
        .from('shipping_zones')
        .select(`
            *,
            rates:shipping_rates(*)
        `)
        .order('created_at', { ascending: false })

    if (error) {
        console.error("Error fetching shipping zones:", error)
        return []
    }

    return zones || []
}

export async function createShippingZone(data: { name: string, countries: string[], zip_codes?: string }) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('shipping_zones')
        .insert({
            name: data.name,
            countries: data.countries,
            zip_codes: data.zip_codes,
            is_active: true
        })

    if (error) {
        console.error("Error creating shipping zone:", error)
        return { error: error.message }
    }

    revalidatePath('/admin/shipping')
    return { success: true }
}

export async function updateShippingZone(id: string, data: { name: string, countries: string[], zip_codes?: string, is_active: boolean }) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('shipping_zones')
        .update({
            name: data.name,
            countries: data.countries,
            zip_codes: data.zip_codes,
            is_active: data.is_active,
            updated_at: new Date().toISOString()
        })
        .eq('id', id)

    if (error) {
        console.error("Error updating shipping zone:", error)
        return { error: error.message }
    }

    revalidatePath('/admin/shipping')
    return { success: true }
}

export async function deleteShippingZone(id: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('shipping_zones')
        .delete()
        .eq('id', id)

    if (error) {
        console.error("Error deleting shipping zone:", error)
        return { error: error.message }
    }

    revalidatePath('/admin/shipping')
    return { success: true }
}

export async function createShippingRate(data: any) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('shipping_rates')
        .insert({
            zone_id: data.zone_id,
            name: data.name,
            type: data.type,
            base_cost: sanitizeNumeric(data.base_cost),
            min_weight: sanitizeNumeric(data.min_weight),
            max_weight: sanitizeNumeric(data.max_weight),
            price_per_kg: sanitizeNumeric(data.price_per_kg),
            min_order_subtotal: sanitizeNumeric(data.min_order_subtotal),
            estimated_delivery: data.estimated_delivery
        })

    if (error) {
        console.error("Error creating shipping rate:", error)
        return { error: error.message }
    }

    revalidatePath('/admin/shipping')
    return { success: true }
}

export async function updateShippingRate(id: string, data: any) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('shipping_rates')
        .update({
            name: data.name,
            type: data.type,
            base_cost: sanitizeNumeric(data.base_cost),
            min_weight: sanitizeNumeric(data.min_weight),
            max_weight: sanitizeNumeric(data.max_weight),
            price_per_kg: sanitizeNumeric(data.price_per_kg),
            min_order_subtotal: sanitizeNumeric(data.min_order_subtotal),
            estimated_delivery: data.estimated_delivery,
            updated_at: new Date().toISOString()
        })
        .eq('id', id)

    if (error) {
        console.error("Error updating shipping rate:", error)
        return { error: error.message }
    }

    revalidatePath('/admin/shipping')
    return { success: true }
}

export async function deleteShippingRate(id: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('shipping_rates')
        .delete()
        .eq('id', id)

    if (error) {
        console.error("Error deleting shipping rate:", error)
        return { error: error.message }
    }

    revalidatePath('/admin/shipping')
    return { success: true }
}
