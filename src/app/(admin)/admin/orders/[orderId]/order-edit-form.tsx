"use client"

import * as React from "react"
import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { updateOrderDetails } from "@/app/actions/admin-orders"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { toast } from "sonner"
import {
    Loader2,
    Save,
    Trash2,
    Minus,
    Plus,
    Package,
    Mail,
    Phone,
    Truck,
    CreditCard,
    Clock
} from "lucide-react"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"

export function OrderEditForm({ order }: { order: any }) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [status, setStatus] = useState(order.status)
    const [items, setItems] = useState<any[]>(order.order_items || [])

    // Sync state when order prop changes (after router.refresh)
    React.useEffect(() => {
        console.log("OrderEditForm - Syncing with new order data")
        setStatus(order.status)
        setItems(order.order_items || [])
    }, [order])

    // Recalculate totals based on items
    const { subtotal, total } = useMemo(() => {
        const sub = items.reduce((acc, item) => acc + (item.price * item.quantity), 0)
        const discountValue = Number(order.discount) || 0
        const shippingValue = 10.00 // Fixed shipping for now
        return {
            subtotal: sub,
            total: sub - discountValue + shippingValue
        }
    }, [items, order.discount])

    const updateQuantity = (itemId: string, delta: number) => {
        setItems(prev => prev.map(item => {
            if (item.id === itemId) {
                const newQty = Math.max(1, item.quantity + delta)
                return { ...item, quantity: newQty }
            }
            return item
        }))
    }

    const removeItem = (itemId: string) => {
        if (items.length <= 1) {
            toast.error("An order must have at least one item")
            return
        }
        setItems(prev => prev.filter(item => item.id !== itemId))
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        console.log("OrderEditForm - Submitting...")
        setIsLoading(true)

        const formData = new FormData(e.currentTarget)
        const data = {
            status,
            email: formData.get("email"),
            shipping_address: formData.get("shipping_address"),
            billing_address: formData.get("billing_address"),
            subtotal,
            discount: Number(order.discount) || 0,
            total,
            items: items.map(item => ({
                product_id: item.product_id,
                quantity: item.quantity,
                price: item.price
            }))
        }

        console.log("OrderEditForm - Prepared Data:", data)
        const result = await updateOrderDetails(order.id, data)
        setIsLoading(false)

        if (result.success) {
            console.log("OrderEditForm - Success, redirecting...")
            toast.success("Order updated successfully")
            router.push('/admin/orders')
        } else {
            console.error("OrderEditForm - Error:", result.error)
            toast.error(result.error || "Failed to update order")
        }
    }

    return (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
            {/* Left Column - Main Details */}
            <div className="lg:col-span-2 space-y-8">
                {/* Status Card */}
                <Card className="rounded-[2.5rem] border-zinc-100 shadow-xl shadow-zinc-200/50 overflow-hidden">
                    <CardHeader className="bg-zinc-50/50 border-b border-zinc-100 px-8 py-6">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-zinc-900 border border-zinc-100">
                                <Package className="h-5 w-5" />
                            </div>
                            <div>
                                <CardTitle className="text-xl font-bold tracking-tight">Status & Settings</CardTitle>
                                <p className="text-xs text-zinc-400 font-medium">Control the workflow of this order</p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 pl-1">Order Status</Label>
                                <Select value={status} onValueChange={setStatus}>
                                    <SelectTrigger className="rounded-2xl h-14 border-zinc-200 focus:ring-zinc-900 bg-zinc-50/30">
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl border-zinc-100 shadow-2xl p-2">
                                        <SelectItem value="pending" className="rounded-xl py-3 font-medium">Pending</SelectItem>
                                        <SelectItem value="paid" className="rounded-xl py-3 font-medium text-emerald-600">Paid</SelectItem>
                                        <SelectItem value="processing" className="rounded-xl py-3 font-medium">Processing</SelectItem>
                                        <SelectItem value="shipped" className="rounded-xl py-3 font-medium">Shipped</SelectItem>
                                        <SelectItem value="delivered" className="rounded-xl py-3 font-medium">Delivered</SelectItem>
                                        <SelectItem value="completed" className="rounded-xl py-3 font-medium">Completed</SelectItem>
                                        <SelectItem value="cancelled" className="rounded-xl py-3 font-medium text-rose-600">Cancelled</SelectItem>
                                        <SelectItem value="refunded" className="rounded-xl py-3 font-medium text-zinc-600">Refunded</SelectItem>
                                        <SelectItem value="on-hold" className="rounded-xl py-3 font-medium text-orange-600">On Hold</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-3">
                                <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-zinc-400 pl-1">Customer Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                                    <Input
                                        id="email"
                                        name="email"
                                        defaultValue={order.email}
                                        className="rounded-2xl h-14 pl-12 border-zinc-200 focus:ring-zinc-900 bg-zinc-50/30"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Items Card */}
                <Card className="rounded-[2.5rem] border-zinc-100 shadow-xl shadow-zinc-200/50 overflow-hidden">
                    <CardHeader className="bg-zinc-50/50 border-b border-zinc-100 px-8 py-6">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-zinc-900 border border-zinc-100">
                                <Package className="h-5 w-5" />
                            </div>
                            <div>
                                <CardTitle className="text-xl font-bold tracking-tight">Order Items</CardTitle>
                                <p className="text-xs text-zinc-400 font-medium">Products purchased in this order</p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-zinc-50">
                            {items.map((item: any) => (
                                <div key={item.id} className="p-6 flex items-center justify-between group hover:bg-zinc-50/50 transition-colors">
                                    <div className="flex items-center gap-6">
                                        <div className="relative h-20 w-20 rounded-2xl overflow-hidden bg-zinc-100 border border-zinc-100 shadow-inner group-hover:scale-105 transition-transform">
                                            <Image
                                                src={item.products?.featured_image || "/placeholder-product.png"}
                                                alt={item.products?.title || "Product"}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <h4 className="font-bold text-zinc-900 tracking-tight">{item.products?.title}</h4>
                                            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                                                Price: <span className="text-zinc-600 font-black">${Number(item.price).toFixed(2)}</span>
                                            </p>
                                            <div className="flex items-center gap-3 pt-2">
                                                <div className="flex items-center border border-zinc-200 rounded-xl bg-white overflow-hidden">
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 rounded-none hover:bg-zinc-50"
                                                        onClick={() => updateQuantity(item.id, -1)}
                                                    >
                                                        <Minus className="h-3 w-3" />
                                                    </Button>
                                                    <span className="w-10 text-center font-bold text-xs">{item.quantity}</span>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 rounded-none hover:bg-zinc-50"
                                                        onClick={() => updateQuantity(item.id, 1)}
                                                    >
                                                        <Plus className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-zinc-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                                                    onClick={() => removeItem(item.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-black tracking-tight text-zinc-900">
                                            ${(item.quantity * item.price).toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Shipping & Billing Card */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Card className="rounded-[2.5rem] border-zinc-100 shadow-xl shadow-zinc-200/50 overflow-hidden">
                        <CardHeader className="bg-zinc-50/50 border-b border-zinc-100 px-8 py-6">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-zinc-900 border border-zinc-100">
                                    <Truck className="h-5 w-5" />
                                </div>
                                <CardTitle className="text-lg font-bold tracking-tight">Shipping Address</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            <Textarea
                                name="shipping_address"
                                defaultValue={order.shipping_address}
                                className="min-h-[160px] rounded-2xl border-zinc-200 focus:ring-zinc-900 p-4 font-medium text-sm leading-relaxed"
                            />
                        </CardContent>
                    </Card>

                    <Card className="rounded-[2.5rem] border-zinc-100 shadow-xl shadow-zinc-200/50 overflow-hidden">
                        <CardHeader className="bg-zinc-50/50 border-b border-zinc-100 px-8 py-6">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-zinc-900 border border-zinc-100">
                                    <CreditCard className="h-5 w-5" />
                                </div>
                                <CardTitle className="text-lg font-bold tracking-tight">Billing Address</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            <Textarea
                                name="billing_address"
                                defaultValue={order.billing_address}
                                className="min-h-[160px] rounded-2xl border-zinc-200 focus:ring-zinc-900 p-4 font-medium text-sm leading-relaxed"
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Right Column - Summary & Action */}
            <div className="space-y-8">
                <Card className="rounded-[2.5rem] border-zinc-100 shadow-2xl shadow-zinc-900/10 bg-zinc-900 text-white overflow-hidden sticky top-8">
                    <CardHeader className="border-b border-white/10 px-8 py-8">
                        <CardTitle className="text-2xl font-black tracking-tighter">Order Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-zinc-400 font-bold uppercase tracking-widest text-[10px]">Subtotal</span>
                                <span className="font-bold tracking-tight text-white">${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center text-rose-400">
                                <span className="font-bold uppercase tracking-widest text-[10px]">Discount</span>
                                <span className="font-bold tracking-tight">-${(Number(order.discount) || 0).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center text-emerald-400">
                                <span className="font-bold uppercase tracking-widest text-[10px]">Shipping</span>
                                <span className="font-bold tracking-tight">${(Number(order.shipping_cost) || 10).toFixed(2)}</span>
                            </div>

                            <Separator className="bg-white/10" />

                            <div className="flex justify-between items-center pt-2">
                                <div className="space-y-1">
                                    <span className="font-black uppercase tracking-widest text-[11px] text-zinc-400">Grand Total</span>
                                    <p className="text-4xl font-black tracking-tighter text-white">${total.toFixed(2)}</p>
                                </div>
                            </div>
                        </div>

                        {/* Payment Details (Enhanced) */}
                        {order.status === 'paid' && (
                            <>
                                <Separator className="bg-white/10" />
                                <div className="space-y-4 pt-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-zinc-400 font-bold uppercase tracking-widest text-[10px]">Paid Amount</span>
                                        <span className="font-bold text-white">${total.toFixed(2)}</span>
                                    </div>
                                    <div className="text-[10px] font-medium text-zinc-500 flex items-center gap-2">
                                        <Clock className="h-3 w-3" />
                                        {new Date(order.paid_at).toLocaleString()} via {order.payment_method}
                                    </div>

                                    {order.payment_method === 'STRIPE' && order.stripe_fee > 0 && (
                                        <div className="bg-white/5 rounded-2xl p-4 space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-zinc-500 font-bold uppercase tracking-widest text-[9px]">Stripe Fee</span>
                                                <span className="font-bold text-rose-400 text-xs">-${Number(order.stripe_fee).toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-zinc-400 font-bold uppercase tracking-widest text-[9px]">Net Payout</span>
                                                <span className="font-bold text-emerald-400 text-sm">${Number(order.stripe_payout).toFixed(2)}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full rounded-[1.25rem] h-16 bg-white text-zinc-900 hover:bg-zinc-100 transition-all font-black uppercase tracking-[0.15em] text-xs shadow-xl shadow-white/5 active:scale-[0.98]"
                        >
                            {isLoading ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <span className="flex items-center gap-2">
                                    <Save className="h-4 w-4" />
                                    Save Changes
                                </span>
                            )}
                        </Button>
                        <p className="text-center text-[10px] text-zinc-500 font-medium uppercase tracking-widest">
                            Updates are synced with Supabase
                        </p>
                    </CardContent>
                </Card>
            </div>
        </form>
    )
}
