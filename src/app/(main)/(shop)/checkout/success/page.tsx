"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react"
import { verifyStripeSession } from "@/app/actions/stripe"
import { useCart } from "@/context/cart-context"

function SuccessContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { clearCart } = useCart()
    const sessionId = searchParams.get("session_id")

    const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
    const [errorMessage, setErrorMessage] = useState("")

    useEffect(() => {
        if (!sessionId) {
            setStatus("error")
            setErrorMessage("No session ID found.")
            return
        }

        async function verify() {
            const result = await verifyStripeSession(sessionId!)
            if (result.success) {
                setStatus("success")
                clearCart() // Clear local cart state
            } else {
                setStatus("error")
                setErrorMessage(result.error || "Failed to verify payment.")
            }
        }

        verify()
    }, [sessionId, clearCart])

    if (status === "loading") {
        return (
            <div className="container mx-auto py-20 px-4 flex flex-col items-center justify-center text-center">
                <Loader2 className="h-10 w-10 animate-spin text-zinc-400 mb-6" />
                <h1 className="text-2xl font-bold tracking-tighter mb-2 uppercase tracking-widest">Verifying Payment</h1>
                <p className="text-muted-foreground">Please wait while we confirm your transaction...</p>
            </div>
        )
    }

    if (status === "error") {
        return (
            <div className="container mx-auto py-20 px-4 flex flex-col items-center justify-center text-center">
                <div className="h-20 w-20 bg-destructive/5 rounded-full flex items-center justify-center mb-6">
                    <AlertCircle className="h-10 w-10 text-destructive" />
                </div>
                <h1 className="text-4xl font-bold tracking-tighter mb-4 text-destructive">Verification Failed</h1>
                <p className="text-muted-foreground text-lg max-w-md mb-8">
                    {errorMessage}
                </p>
                <Button onClick={() => router.push('/checkout')} className="rounded-full px-8 h-12 font-bold uppercase tracking-widest text-[10px]">
                    Back to Checkout
                </Button>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-20 px-4 flex flex-col items-center justify-center text-center">
            <div className="h-20 w-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold tracking-tighter mb-4">Payment Successful!</h1>
            <p className="text-muted-foreground text-lg max-w-md mb-8">
                Thank you for your purchase. Your order has been received and is being processed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={() => router.push('/')} className="rounded-full px-8 h-12 font-bold uppercase tracking-widest text-[10px]">
                    Back to Home
                </Button>
                <Button variant="outline" onClick={() => router.push('/shop')} className="rounded-full px-8 h-12 font-bold uppercase tracking-widest text-[10px]">
                    Continue Shopping
                </Button>
            </div>
        </div>
    )
}

export default function CheckoutSuccessPage() {
    return (
        <Suspense fallback={
            <div className="container mx-auto py-20 text-center">
                <p className="text-zinc-400 font-bold uppercase tracking-widest text-xs">Verifying Payment...</p>
            </div>
        }>
            <SuccessContent />
        </Suspense>
    )
}
