"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Minus, Plus, Trash2, ArrowRight, Loader2, ShoppingBag } from "lucide-react"
import { placeOrder } from "@/app/actions/orders"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/context/cart-context"

export default function CartPage() {
    const router = useRouter()
    const { cart, removeFromCart, updateQuantity, clearCart, subtotal } = useCart()
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    const shipping = cart.length > 0 ? 10 : 0
    const total = subtotal + shipping

    const handleCheckout = () => {
        router.push('/checkout')
    }

    return (
        <div className="container mx-auto py-8 sm:py-12 lg:py-20 px-4">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tighter mb-8 sm:mb-10">Shopping Cart</h1>

            <div className="grid lg:grid-cols-3 gap-10 lg:gap-16">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-6 sm:space-y-8">
                    {message && (
                        <div className={`p-4 rounded-xl text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-destructive/10 text-destructive border border-destructive/20'}`}>
                            {message.text}
                        </div>
                    )}

                    {cart.map((item) => (
                        <div key={item.id} className="flex gap-4 sm:gap-6 pb-6 sm:pb-8 border-b last:border-0 last:pb-0">
                            <div className="h-28 w-20 sm:h-40 sm:w-32 relative rounded-lg sm:rounded-xl overflow-hidden bg-muted flex-shrink-0">
                                <Image
                                    src={item.image}
                                    alt={item.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="flex flex-col justify-between flex-1 py-1">
                                <div className="flex flex-col sm:flex-row sm:justify-between items-start gap-1 sm:gap-4">
                                    <div>
                                        <Link href={`/products/${item.slug}`} className="font-semibold text-base sm:text-lg hover:underline decoration-2">
                                            {item.name}
                                        </Link>
                                        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">{item.category}</p>
                                    </div>
                                    <p className="font-bold text-base sm:text-lg">${(item.price * item.quantity).toFixed(2)}</p>
                                </div>

                                <div className="flex items-center justify-between mt-3 sm:mt-4">
                                    <div className="flex items-center border rounded-full overflow-hidden h-8 sm:h-9">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-full w-8 sm:w-9 rounded-none hover:bg-muted"
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            disabled={item.quantity <= 1}
                                        >
                                            <Minus className="h-3 w-3" />
                                        </Button>
                                        <span className="w-8 sm:w-10 text-center text-xs sm:text-sm font-medium">{item.quantity}</span>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-full w-8 sm:w-9 rounded-none hover:bg-muted"
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        >
                                            <Plus className="h-3 w-3" />
                                        </Button>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-muted-foreground hover:text-destructive transition-colors h-8 w-8 sm:h-9 sm:w-9"
                                        onClick={() => removeFromCart(item.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {cart.length === 0 && (
                        <div className="py-20 text-center border rounded-[2rem] border-dashed bg-muted/20">
                            <div className="flex flex-col items-center gap-4">
                                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                                    <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                                </div>
                                <div>
                                    <p className="text-xl font-bold">Your cart is empty</p>
                                    <p className="text-muted-foreground text-sm mt-1">Looks like you haven't added anything to your cart yet.</p>
                                </div>
                                <Link href="/shop" className="mt-2">
                                    <Button className="rounded-full px-8 h-12 font-bold uppercase tracking-widest text-[10px]">Return to Shop</Button>
                                </Link>
                            </div>
                        </div>
                    )}
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-muted/30 rounded-[2rem] p-8 sticky top-24 border border-muted">
                        <h3 className="text-xl font-bold mb-6">Order Summary</h3>
                        <div className="space-y-4 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground font-medium">Subtotal</span>
                                <span className="font-bold">${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground font-medium">Shipping</span>
                                <span className="font-bold">${shipping.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground font-medium">Est. Taxes</span>
                                <span className="font-bold">$0.00</span>
                            </div>
                            <Separator className="bg-muted-foreground/10" />
                            <div className="flex justify-between text-lg font-bold">
                                <span>Total</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                        </div>
                        <Button
                            size="lg"
                            className="w-full mt-8 rounded-full h-14 group font-bold uppercase tracking-widest text-[11px]"
                            onClick={handleCheckout}
                            disabled={isLoading || cart.length === 0}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-3 h-4 w-4 animate-spin" />
                                    Processing Order...
                                </>
                            ) : (
                                <>
                                    Complete Purchase
                                    <ArrowRight className="h-4 w-4 ml-3 transition-transform group-hover:translate-x-1" />
                                </>
                            )}
                        </Button>
                        <p className="text-center text-[9px] text-muted-foreground mt-6 uppercase tracking-[0.2em] font-black">
                            Secure Checkout Guaranteed
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
