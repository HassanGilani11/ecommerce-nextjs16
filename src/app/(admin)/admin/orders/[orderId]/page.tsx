import { createClient } from "@/lib/supabase/server"
import { notFound, redirect } from "next/navigation"
import { OrderEditForm } from "./order-edit-form"
import {
    Clock,
    Truck,
    CheckCircle2,
    XCircle,
    RotateCcw,
    AlertCircle,
    ChevronLeft
} from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

const STATUS_CONFIG: Record<string, any> = {
    pending: { label: "Pending", icon: Clock, class: "bg-amber-50 text-amber-600 border-amber-100" },
    processing: { label: "Processing", icon: Clock, class: "bg-amber-50 text-amber-600 border-amber-100" },
    shipped: { label: "Shipped", icon: Truck, class: "bg-blue-50 text-blue-600 border-blue-100" },
    paid: { label: "Paid", icon: CheckCircle2, class: "bg-emerald-50 text-emerald-600 border-emerald-100" },
    delivered: { label: "Delivered", icon: CheckCircle2, class: "bg-emerald-50 text-emerald-600 border-emerald-100" },
    completed: { label: "Completed", icon: CheckCircle2, class: "bg-emerald-50 text-emerald-600 border-emerald-100" },
    cancelled: { label: "Cancelled", icon: XCircle, class: "bg-rose-50 text-rose-600 border-rose-100" },
    refunded: { label: "Refunded", icon: RotateCcw, class: "bg-zinc-50 text-zinc-600 border-zinc-100" },
    "on-hold": { label: "On Hold", icon: AlertCircle, class: "bg-orange-50 text-orange-600 border-orange-100" }
}

export default async function OrderPage({ params }: { params: Promise<{ orderId: string }> }) {
    const { orderId } = await params
    const supabase = await createClient()

    // 1. Admin check
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect("/login")

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'admin') redirect("/")

    // 2. Fetch order with items
    const { data: order, error } = await supabase
        .from('orders')
        .select(`
            *,
            order_items (
                *,
                products (
                    title,
                    price,
                    featured_image
                )
            )
        `)
        .eq('id', orderId)
        .single()

    if (error || !order) {
        console.error("OrderPage Error:", error)
        notFound()
    }

    const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending
    const StatusIcon = status.icon

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-100 pb-8">
                <div className="space-y-4">
                    <Link
                        href="/admin/orders"
                        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-900 transition-colors"
                    >
                        <ChevronLeft className="h-3 w-3" />
                        Back to Orders
                    </Link>
                    <div className="space-y-1">
                        <h1 className="text-4xl font-black tracking-tighter text-zinc-900">
                            Edit Order <span className="text-zinc-400">#{order.id.slice(0, 8).toUpperCase()}</span>
                        </h1>
                        <p className="text-zinc-500 font-medium font-mono text-xs">Placed on {new Date(order.created_at).toLocaleString()}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Badge variant="outline" className={`rounded-xl border-2 px-4 py-1 gap-2 font-bold text-xs uppercase tracking-widest shadow-sm ${status.class}`}>
                        <StatusIcon className="h-4 w-4" />
                        {status.label}
                    </Badge>
                </div>
            </div>

            {/* Form Component */}
            <OrderEditForm order={order} />
        </div>
    )
}
