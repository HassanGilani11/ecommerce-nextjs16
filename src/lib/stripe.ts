import Stripe from "stripe"

export const getStripeInstance = (customSecretKey?: string) => {
    const key = customSecretKey || process.env.STRIPE_SECRET_KEY
    if (!key) {
        throw new Error("STRIPE_SECRET_KEY is missing")
    }
    return new Stripe(key, {
        apiVersion: "2025-12-15.clover",
        typescript: true,
    })
}

// Fallback singleton for backward compatibility or default use
export const stripe = getStripeInstance()
