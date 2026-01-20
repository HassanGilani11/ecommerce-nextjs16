"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { XCircle, ArrowLeft } from "lucide-react"

export default function CheckoutCancelPage() {
    const router = useRouter()

    return (
        <div className="container mx-auto py-20 px-4 flex flex-col items-center justify-center text-center">
            <div className="h-20 w-20 bg-destructive/5 rounded-full flex items-center justify-center mb-6">
                <XCircle className="h-10 w-10 text-destructive" />
            </div>
            <h1 className="text-4xl font-bold tracking-tighter mb-4">Order Canceled</h1>
            <p className="text-muted-foreground text-lg max-w-md mb-8">
                Your payment session was canceled. No charges were made.
                You can return to the checkout to try again or choose a different payment method.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={() => router.push('/checkout')} className="rounded-full px-8 h-12 font-bold uppercase tracking-widest text-[10px] gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Checkout
                </Button>
                <Button variant="outline" onClick={() => router.push('/cart')} className="rounded-full px-8 h-12 font-bold uppercase tracking-widest text-[10px]">
                    View Cart
                </Button>
            </div>
        </div>
    )
}
