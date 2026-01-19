"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { sendOrderStatusEmail } from "@/lib/notifications"

export async function updateOrderStatus(orderId: string, status: string) {
    const supabase = await createClient()

    // 1. Check if user is admin
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return { error: "Unauthorized" }

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'admin') return { error: "Unauthorized" }

    // 2. Fetch order to get customer email
    const { data: order, error: orderFetchError } = await supabase
        .from('orders')
        .select('email, id')
        .eq('id', orderId)
        .single()

    if (orderFetchError || !order) return { error: "Order not found" }

    // 3. Update status
    const { error: updateError } = await supabase
        .from('orders')
        .update({ status: status })
        .eq('id', orderId)

    if (updateError) {
        console.error("Error updating order status:", updateError)
        return { error: "Failed to update status" }
    }

    // 4. Trigger email notification
    await sendOrderStatusEmail(order.email, order.id, status)

    revalidatePath('/admin/orders')
    revalidatePath(`/admin/orders/${orderId}`)
    return { success: true }
}

export async function updateOrderDetails(orderId: string, data: any) {
    console.log("updateOrderDetails - ID:", orderId)
    console.log("updateOrderDetails - Data:", data)

    const supabase = await createClient()

    // 1. Check if user is admin
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        console.error("updateOrderDetails - Auth Error:", authError)
        return { error: "Unauthorized" }
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'admin') {
        console.error("updateOrderDetails - Not an admin:", profile?.role)
        return { error: "Unauthorized" }
    }

    // 2. Update order primary details and totals
    const { error: updateError } = await supabase
        .from('orders')
        .update({
            status: data.status,
            email: data.email,
            shipping_address: data.shipping_address,
            billing_address: data.billing_address,
            subtotal: Number(data.subtotal),
            discount: Number(data.discount),
            total: Number(data.total),
            updated_at: new Date().toISOString()
        })
        .eq('id', orderId)

    if (updateError) {
        console.error("Error updating order master:", updateError)
        return { error: "Failed to update order details: " + updateError.message }
    }

    // 3. Update order items
    if (data.items && Array.isArray(data.items)) {
        console.log("updateOrderDetails - Syncing items:", data.items.length)

        // Step 3a: Delete existing items
        const { error: deleteError } = await supabase
            .from('order_items')
            .delete()
            .eq('order_id', orderId)

        if (deleteError) {
            console.error("Error deleting old order items:", deleteError)
            return { error: "Failed to sync order items" }
        }

        // Step 3b: Insert new items
        const itemsToInsert = data.items.map((item: any) => ({
            order_id: orderId,
            product_id: item.product_id,
            quantity: item.quantity,
            price: item.price
        }))

        const { error: insertError } = await supabase
            .from('order_items')
            .insert(itemsToInsert)

        if (insertError) {
            console.error("Error inserting new order items:", insertError)
            return { error: "Failed to update item details" }
        }
    }

    console.log("updateOrderDetails - Success")
    revalidatePath('/admin')
    revalidatePath('/admin')
    revalidatePath('/admin/orders')
    revalidatePath(`/admin/orders/${orderId}`)
    return { success: true }
}

export async function archiveOrder(orderId: string) {
    const supabase = await createClient()

    // 1. Check if user is admin
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return { error: "Unauthorized" }

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'admin') return { error: "Unauthorized" }

    // 2. Update status to archived
    const { error: updateError } = await supabase
        .from('orders')
        .update({ status: 'archived' })
        .eq('id', orderId)

    if (updateError) {
        console.error("Error archiving order:", updateError)
        return { error: "Failed to archive order: " + updateError.message }
    }

    revalidatePath('/admin')
    revalidatePath('/admin/orders')
    revalidatePath(`/admin/orders/${orderId}`)
    return { success: true }
}

export async function restoreOrder(orderId: string) {
    const supabase = await createClient()

    // 1. Check if user is admin
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return { error: "Unauthorized" }

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'admin') return { error: "Unauthorized" }

    // 2. Update status to pending
    const { error: updateError } = await supabase
        .from('orders')
        .update({ status: 'pending' })
        .eq('id', orderId)

    if (updateError) {
        console.error("Error restoring order:", updateError)
        return { error: "Failed to restore order: " + updateError.message }
    }

    revalidatePath('/admin')
    revalidatePath('/admin/orders')
    revalidatePath(`/admin/orders/${orderId}`)
    return { success: true }
}
