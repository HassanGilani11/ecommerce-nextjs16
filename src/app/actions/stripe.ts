"use server"

import { stripe } from "@/lib/stripe"
import { createClient } from "@/lib/supabase/server"
import { headers } from "next/headers"

export async function createCheckoutSession(data: {
    items: any[],
    shippingCost: number,
    discount: number,
    orderId: string,
    couponCode?: string,
    customerDetails: {
        email: string,
        firstName: string,
        lastName: string,
        address: string,
        city: string,
        state: string,
        zipCode: string,
        country: string,
        phone: string
    }
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: "User not authenticated" }
    }

    const host = (await headers()).get("host")
    const protocol = host?.includes("localhost") ? "http" : "https"
    const baseUrl = `${protocol}://${host}`

    try {
        const lineItems = data.items.map(item => ({
            price_data: {
                currency: "aud", // Default to AUD for this project
                product_data: {
                    name: item.name,
                    images: item.image ? [item.image] : [],
                },
                unit_amount: Math.round(item.price * 100),
            },
            quantity: item.quantity,
        }))

        // Add shipping as a line item if it's > 0
        if (data.shippingCost > 0) {
            lineItems.push({
                price_data: {
                    currency: "aud",
                    product_data: {
                        name: "Shipping",
                    },
                    unit_amount: Math.round(data.shippingCost * 100),
                },
                quantity: 1,
            } as any)
        }

        // Handle discount without pre-syncing coupons: Add as a negative line item
        const finalLineItems = [...lineItems]
        if (data.discount > 0) {
            finalLineItems.push({
                price_data: {
                    currency: "aud",
                    product_data: {
                        name: "Discount",
                    },
                    unit_amount: -Math.round(data.discount * 100),
                },
                quantity: 1,
            } as any)
        }

        const finalSession = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: finalLineItems,
            mode: "payment",
            success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${baseUrl}/checkout/cancel`,
            customer_email: data.customerDetails.email,
            metadata: {
                userId: user.id,
                orderId: data.orderId,
                firstName: data.customerDetails.firstName,
                lastName: data.customerDetails.lastName,
                address: data.customerDetails.address,
                city: data.customerDetails.city,
                state: data.customerDetails.state,
                zipCode: data.customerDetails.zipCode,
                country: data.customerDetails.country,
                phone: data.customerDetails.phone,
                couponCode: data.couponCode || "",
                discount: data.discount.toString(),
                shippingCost: data.shippingCost.toString(),
            },
        })

        return { url: finalSession.url }
    } catch (error: any) {
        console.error("Stripe Session Error:", error)
        return { error: error.message }
    }
}

export async function verifyStripeSession(sessionId: string) {
    const supabase = await createClient()

    try {
        // Retrieve session with expanded charge and balance transaction to get fees
        const session = await stripe.checkout.sessions.retrieve(sessionId, {
            expand: ["payment_intent.latest_charge.balance_transaction"],
        })

        const orderId = session.metadata?.orderId
        const userId = session.metadata?.userId

        if (session.payment_status === "paid" && orderId && userId) {
            // Extract fee details
            const paymentIntent = session.payment_intent as any
            const charge = paymentIntent?.latest_charge as any
            const balanceTransaction = charge?.balance_transaction as any

            const fee = balanceTransaction?.fee ? balanceTransaction.fee / 100 : 0
            const net = balanceTransaction?.net ? balanceTransaction.net / 100 : 0

            // 1. Update order status and financials in Supabase
            const { error: orderError } = await supabase
                .from("orders")
                .update({
                    status: "paid",
                    payment_method: "STRIPE",
                    stripe_session_id: sessionId,
                    stripe_fee: fee,
                    stripe_payout: net,
                    paid_at: new Date().toISOString()
                })
                .eq("id", orderId)

            if (orderError) throw orderError

            // 2. Clear user's cart in Supabase
            const { error: cartError } = await supabase
                .from("profiles")
                .update({ cart: [] })
                .eq("id", userId)

            if (cartError) throw cartError

            return { success: true }
        }

        return { success: false, error: "Payment not verified or session incomplete." }
    } catch (error: any) {
        console.error("Verification Error:", error)
        return { success: false, error: error.message }
    }
}
