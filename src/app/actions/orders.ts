"use server"

import { createClient } from "@/lib/supabase/server"
import { z } from "zod"
import { incrementCouponUsage } from "./coupons"

const checkoutSchema = z.object({
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Phone number is required"),
    address: z.string().min(5, "Address is required"),
    city: z.string().min(2, "City is required"),
    state: z.string().min(2, "State/Region is required"),
    zipCode: z.string().min(2, "Zip code is required"),
    country: z.string().min(2, "Country is required"),
    paymentMethod: z.enum(["COD", "STRIPE", "BANK"]),
})

export async function placeOrder(formData: FormData) {
    const supabase = await createClient()

    // 1. Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
        return { error: "You must be logged in to place an order." }
    }

    // 2. Validate form data
    const rawData = {
        firstName: formData.get("firstName"),
        lastName: formData.get("lastName"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        address: formData.get("address"),
        city: formData.get("city"),
        state: formData.get("state"),
        zipCode: formData.get("zipCode"),
        country: formData.get("country"),
        paymentMethod: formData.get("paymentMethod") || "COD",
    }

    const validatedFields = checkoutSchema.safeParse(rawData)

    if (!validatedFields.success) {
        return {
            error: "Validation failed.",
            details: validatedFields.error.flatten().fieldErrors
        }
    }

    const data = validatedFields.data

    // 3. Fetch real cart items from the user's profile
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('cart')
        .eq('id', user.id)
        .single()

    if (profileError || !profile || !profile.cart || !Array.isArray(profile.cart) || profile.cart.length === 0) {
        return { error: "Your cart is empty or could not be retrieved." }
    }

    const cartItems = profile.cart as any[]
    const discount = Number(formData.get("discount")) || 0
    const couponCode = formData.get("couponCode") as string
    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0)
    const shipping = 10
    const total = subtotal + shipping - discount

    const fullAddress = `${data.firstName} ${data.lastName}\n${data.address}\n${data.city}, ${data.state} ${data.zipCode}\n${data.country}\nPhone: ${data.phone}`

    // 4. Insert into orders table
    const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
            user_id: user.id,
            email: data.email,
            status: 'pending',
            subtotal: subtotal,
            discount: discount,
            shipping_cost: shipping,
            total: total,
            payment_method: data.paymentMethod,
            shipping_address: fullAddress,
            billing_address: fullAddress, // For now, same as shipping
        })
        .select()
        .single()

    if (orderError) {
        console.error("Order creation error:", orderError)
        return { error: "Failed to create order." }
    }

    // 5. Insert into order_items table
    const orderItems = cartItems.map(item => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        price: item.price
    }))

    const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

    if (itemsError) {
        console.error("Order items creation error:", itemsError)
        return { error: "Failed to create order items." }
    }

    // 6. Increment coupon usage if applied
    if (couponCode && discount > 0) {
        await incrementCouponUsage(couponCode)
    }

    // 7. Clear the cart in Supabase (Only for COD. Stripe clears on success)
    if (data.paymentMethod === "COD" || data.paymentMethod === "BANK") {
        await supabase
            .from('profiles')
            .update({ cart: [] })
            .eq('id', user.id)
    }

    return { success: true, orderId: order.id }
}
