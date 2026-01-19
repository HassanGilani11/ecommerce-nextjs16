"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function getCoupons() {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error("Error fetching coupons:", error)
        return { error: error.message }
    }

    return { data }
}

export async function getCouponById(id: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('id', id)
        .single()

    if (error) {
        console.error("Error fetching coupon:", error)
        return { error: error.message }
    }

    return { data }
}

export async function createOrUpdateCoupon(data: any) {
    const supabase = await createClient()

    // Normalize data
    const couponData = {
        code: data.code.toUpperCase(),
        description: data.description,
        type: data.type,
        amount: parseFloat(data.amount),
        min_spend: parseFloat(data.min_spend || 0),
        max_spend: data.max_spend ? parseFloat(data.max_spend) : null,
        expiry_date: data.expiry_date || null,
        usage_limit: data.usage_limit ? parseInt(data.usage_limit) : null,
        status: data.status || 'active'
    }

    let result
    if (data.id) {
        // Update
        result = await supabase
            .from('coupons')
            .update(couponData)
            .eq('id', data.id)
    } else {
        // Create
        result = await supabase
            .from('coupons')
            .insert([couponData])
    }

    if (result.error) {
        console.error("Error saving coupon:", result.error)
        return { error: result.error.message }
    }

    revalidatePath('/admin/coupons')
    return { success: true }
}

export async function deleteCoupon(id: string) {
    const supabase = await createClient()
    const { error } = await supabase
        .from('coupons')
        .delete()
        .eq('id', id)

    if (error) {
        console.error("Error deleting coupon:", error)
        return { error: error.message }
    }

    revalidatePath('/admin/coupons')
    return { success: true }
}

export async function toggleCouponStatus(id: string, currentStatus: string) {
    const supabase = await createClient()
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active'

    const { error } = await supabase
        .from('coupons')
        .update({ status: newStatus })
        .eq('id', id)

    if (error) {
        console.error("Error toggling coupon status:", error)
        return { error: error.message }
    }

    revalidatePath('/admin/coupons')
    return { success: true }
}

export async function duplicateCoupon(id: string) {
    const supabase = await createClient()

    // 1. Fetch original
    const { data: original, error: fetchError } = await supabase
        .from('coupons')
        .select('*')
        .eq('id', id)
        .single()

    if (fetchError) return { error: fetchError.message }

    // 2. Prepare duplicate (exclude id and created_at so DB generates new ones)
    const { id: _, created_at: __, ...couponData } = original

    const newCoupon = {
        ...couponData,
        code: `${original.code}-COPY-${Math.floor(Math.random() * 1000)}`,
        usage_count: 0
    }

    // 3. Insert
    const { error: insertError } = await supabase
        .from('coupons')
        .insert([newCoupon])

    if (insertError) {
        console.error("Error duplicating coupon:", insertError)
        return { error: insertError.message }
    }

    revalidatePath('/admin/coupons')
    return { success: true }
}

export async function validateCoupon(code: string) {
    const supabase = await createClient()

    const { data: coupon, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', code.toUpperCase())
        .eq('status', 'active')
        .single()

    if (error || !coupon) {
        return { error: "Invalid or expired coupon code." }
    }

    const now = new Date()
    if (coupon.expiry_date && new Date(coupon.expiry_date) < now) {
        return { error: "This coupon has expired." }
    }

    if (coupon.usage_limit && coupon.usage_count >= coupon.usage_limit) {
        return { error: "This coupon has reached its usage limit." }
    }

    return {
        success: true,
        discount_type: coupon.type,
        discount_value: coupon.amount,
        message: "Coupon applied successfully!"
    }
}

export async function incrementCouponUsage(code: string) {
    const supabase = await createClient()

    // 1. Get current count
    const { data: coupon, error: fetchError } = await supabase
        .from('coupons')
        .select('id, usage_count')
        .eq('code', code.toUpperCase())
        .single()

    if (fetchError || !coupon) {
        console.error("Error fetching coupon for increment:", fetchError)
        return { error: "Coupon not found" }
    }

    // 2. Increment carefully
    const { error: updateError } = await supabase
        .from('coupons')
        .update({ usage_count: (coupon.usage_count || 0) + 1 })
        .eq('id', coupon.id)

    if (updateError) {
        console.error("Error incrementing coupon usage:", updateError)
        return { error: updateError.message }
    }

    revalidatePath('/admin/coupons')
    return { success: true }
}
