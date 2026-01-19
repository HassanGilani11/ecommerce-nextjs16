"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/context/cart-context"
import { placeOrder } from "@/app/actions/orders"
import { validateCoupon } from "@/app/actions/coupons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, ArrowRight, CheckCircle2, CreditCard, Truck, Tag } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"

export default function CheckoutPage() {
    const router = useRouter()
    const { cart, subtotal, clearCart } = useCart()
    const [isLoading, setIsLoading] = useState(false)
    const [isCouponLoading, setIsCouponLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})
    const [isSuccess, setIsSuccess] = useState(false)
    const [orderId, setOrderId] = useState<string | null>(null)
    const [couponCode, setCouponCode] = useState("")
    const [discount, setDiscount] = useState(0)

    const shipping = 10
    const total = subtotal + shipping - discount

    const handleApplyCoupon = async () => {
        if (!couponCode) return
        setIsCouponLoading(true)
        const result = await validateCoupon(couponCode)
        setIsCouponLoading(false)

        if (result.success) {
            let discountAmount = 0
            if (result.discount_type === 'percentage') {
                discountAmount = (subtotal * (result.discount_value || 0)) / 100
            } else {
                discountAmount = result.discount_value || 0
            }
            setDiscount(discountAmount)
            toast.success(result.message)
        } else {
            setDiscount(0)
            toast.error(result.error)
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)
        setFieldErrors({})

        const formData = new FormData(e.currentTarget)

        try {
            const result = await placeOrder(formData)

            if (result.error) {
                setError(result.error)
                if (result.details) {
                    setFieldErrors(result.details as Record<string, string[]>)
                }
            } else if (result.success) {
                setIsSuccess(true)
                setOrderId(result.orderId!)
                clearCart()
            }
        } catch (err) {
            setError("An unexpected error occurred. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    if (isSuccess) {
        return (
            <div className="container mx-auto py-20 px-4 flex flex-col items-center justify-center text-center">
                <div className="h-20 w-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="h-10 w-10 text-green-600" />
                </div>
                <h1 className="text-4xl font-bold tracking-tighter mb-4">Order Placed Successfully!</h1>
                <p className="text-muted-foreground text-lg max-w-md mb-8">
                    Your order <span className="font-bold text-foreground">#{orderId?.slice(0, 8)}</span> has been received and is being processed.
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

    if (cart.length === 0 && !isSuccess) {
        return (
            <div className="container mx-auto py-20 px-4 text-center">
                <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
                <p className="text-muted-foreground mb-8">Add some items to your cart before checking out.</p>
                <Button onClick={() => router.push('/shop')} className="rounded-full px-8 h-12 font-bold uppercase tracking-widest text-[10px]">
                    Go to Shop
                </Button>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-8 lg:py-16 px-4">
            <h1 className="text-3xl lg:text-4xl font-bold tracking-tighter mb-10">Checkout</h1>

            <form onSubmit={handleSubmit} className="grid lg:grid-cols-12 gap-12">
                {/* Left Column: Form Details */}
                <div className="lg:col-span-7 space-y-10">
                    <section className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-zinc-900 text-white flex items-center justify-center text-xs font-bold">1</div>
                            <h2 className="text-xl font-bold">Billing & Shipping</h2>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="firstName" className="text-xs uppercase font-black tracking-widest text-muted-foreground">First Name</Label>
                                <Input id="firstName" name="firstName" placeholder="John" className="rounded-xl h-12" required />
                                {fieldErrors.firstName && <p className="text-xs text-destructive">{fieldErrors.firstName[0]}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName" className="text-xs uppercase font-black tracking-widest text-muted-foreground">Last Name</Label>
                                <Input id="lastName" name="lastName" placeholder="Doe" className="rounded-xl h-12" required />
                                {fieldErrors.lastName && <p className="text-xs text-destructive">{fieldErrors.lastName[0]}</p>}
                            </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-xs uppercase font-black tracking-widest text-muted-foreground">Email</Label>
                                <Input id="email" name="email" type="email" placeholder="john@example.com" className="rounded-xl h-12" required />
                                {fieldErrors.email && <p className="text-xs text-destructive">{fieldErrors.email[0]}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone" className="text-xs uppercase font-black tracking-widest text-muted-foreground">Phone</Label>
                                <Input id="phone" name="phone" type="tel" placeholder="+1 (555) 000-0000" className="rounded-xl h-12" required />
                                {fieldErrors.phone && <p className="text-xs text-destructive">{fieldErrors.phone[0]}</p>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="address" className="text-xs uppercase font-black tracking-widest text-muted-foreground">Street Address</Label>
                            <Input id="address" name="address" placeholder="123 Minimalist St." className="rounded-xl h-12" required />
                            {fieldErrors.address && <p className="text-xs text-destructive">{fieldErrors.address[0]}</p>}
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="city" className="text-xs uppercase font-black tracking-widest text-muted-foreground">City</Label>
                                <Input id="city" name="city" placeholder="Brisbane City" className="rounded-xl h-12" required />
                                {fieldErrors.city && <p className="text-xs text-destructive">{fieldErrors.city[0]}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="state" className="text-xs uppercase font-black tracking-widest text-muted-foreground">State / Region</Label>
                                <Input id="state" name="state" placeholder="Queensland" className="rounded-xl h-12" required />
                                {fieldErrors.state && <p className="text-xs text-destructive">{fieldErrors.state[0]}</p>}
                            </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="zipCode" className="text-xs uppercase font-black tracking-widest text-muted-foreground">Zip / Postcode</Label>
                                <Input id="zipCode" name="zipCode" placeholder="4122" className="rounded-xl h-12" required />
                                {fieldErrors.zipCode && <p className="text-xs text-destructive">{fieldErrors.zipCode[0]}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="country" className="text-xs uppercase font-black tracking-widest text-muted-foreground">Country</Label>
                                <Input id="country" name="country" placeholder="Australia" className="rounded-xl h-12" required />
                                {fieldErrors.country && <p className="text-xs text-destructive">{fieldErrors.country[0]}</p>}
                            </div>
                        </div>
                    </section>

                    <section className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-zinc-900 text-white flex items-center justify-center text-xs font-bold">2</div>
                            <h2 className="text-xl font-bold">Payment Method</h2>
                        </div>

                        <div className="grid gap-4">
                            <Label
                                htmlFor="payment-cod"
                                className="flex items-center justify-between p-4 border-2 rounded-2xl cursor-pointer hover:bg-zinc-50 transition-colors border-zinc-900 bg-zinc-50/50"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-full bg-zinc-100 flex items-center justify-center">
                                        <CreditCard className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="font-bold">Cash on Delivery (COD)</p>
                                        <p className="text-xs text-muted-foreground">Pay when your order arrives.</p>
                                    </div>
                                </div>
                                <input type="radio" id="payment-cod" name="paymentMethod" value="COD" defaultChecked className="h-4 w-4 accent-zinc-900" />
                            </Label>
                        </div>
                    </section>
                </div>

                {/* Right Column: Order Summary */}
                <div className="lg:col-span-5">
                    <div className="bg-zinc-50 rounded-[2.5rem] p-8 border sticky top-24">
                        <h3 className="text-xl font-bold mb-8">Your Order</h3>

                        <div className="space-y-4 mb-8">
                            {cart.map((item) => (
                                <div key={item.id} className="flex gap-4 items-center">
                                    <div className="h-16 w-12 relative rounded-lg overflow-hidden bg-muted flex-shrink-0">
                                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-sm truncate">{item.name}</p>
                                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                                    </div>
                                    <p className="font-bold text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                            ))}
                        </div>

                        <Separator className="bg-zinc-200 mb-8" />

                        {/* Coupon Section */}
                        <div className="space-y-3 mb-8">
                            <Label htmlFor="coupon" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Promo Code</Label>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="coupon"
                                        placeholder="Enter code"
                                        className="pl-10 rounded-xl h-11 border-zinc-200"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value)}
                                    />
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="rounded-xl h-11 px-6 font-bold text-xs uppercase tracking-widest"
                                    onClick={handleApplyCoupon}
                                    disabled={isCouponLoading || !couponCode}
                                >
                                    {isCouponLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Apply"}
                                </Button>
                            </div>
                            {discount > 0 && <p className="text-[10px] text-green-600 font-bold uppercase tracking-widest">Coupon applied savings: -${discount.toFixed(2)}</p>}
                        </div>

                        <div className="space-y-4 text-sm mb-8">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground font-medium">Subtotal</span>
                                <span className="font-bold">${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground font-medium flex items-center gap-1.5">
                                    <Truck className="h-3.5 w-3.5" />
                                    Shipping
                                </span>
                                <span className="font-bold">${shipping.toFixed(2)}</span>
                            </div>
                            {discount > 0 && (
                                <div className="flex justify-between text-green-600 font-bold">
                                    <span>Discount</span>
                                    <span>-${discount.toFixed(2)}</span>
                                </div>
                            )}
                            <Separator className="bg-zinc-200" />
                            <div className="flex justify-between text-lg font-bold">
                                <span>Total</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                        </div>

                        <input type="hidden" name="discount" value={discount} />
                        <input type="hidden" name="couponCode" value={couponCode} />

                        {error && (
                            <div className="p-4 rounded-xl bg-destructive/5 text-destructive border border-destructive/10 text-xs font-bold mb-6">
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            size="lg"
                            className="w-full rounded-2xl h-14 font-black uppercase tracking-[.15em] text-[10px] shadow-xl shadow-zinc-200"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-3 h-4 w-4 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    Complete Order
                                    <ArrowRight className="ml-3 h-4 w-4" />
                                </>
                            )}
                        </Button>

                        <p className="text-center text-[9px] text-zinc-400 mt-6 uppercase tracking-[0.2em] font-black">
                            Encrypted & Secure Payment
                        </p>
                    </div>
                </div>
            </form>
        </div>
    )
}
