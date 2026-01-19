"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
    Clock,
    Truck,
    CheckCircle2,
    XCircle,
    RotateCcw,
    AlertCircle,
    ExternalLink,
    ChevronRight,
    MoreHorizontal
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const STATUS_CONFIG: Record<string, any> = {
    pending: { label: "Pending", icon: Clock, class: "bg-amber-50 text-amber-600 border-amber-100" },
    processing: { label: "Processing", icon: Clock, class: "bg-amber-50 text-amber-600 border-amber-100" },
    shipped: { label: "Shipped", icon: Truck, class: "bg-blue-50 text-blue-600 border-blue-100" },
    delivered: { label: "Delivered", icon: CheckCircle2, class: "bg-emerald-50 text-emerald-600 border-emerald-100" },
    completed: { label: "Completed", icon: CheckCircle2, class: "bg-emerald-50 text-emerald-600 border-emerald-100" },
    cancelled: { label: "Cancelled", icon: XCircle, class: "bg-rose-50 text-rose-600 border-rose-100" },
    refunded: { label: "Refunded", icon: RotateCcw, class: "bg-zinc-50 text-zinc-600 border-zinc-100" },
    "on-hold": { label: "On Hold", icon: AlertCircle, class: "bg-orange-50 text-orange-600 border-orange-100" },
    archived: { label: "Archived", icon: XCircle, class: "bg-zinc-100 text-zinc-500 border-zinc-200" }
}

export function RecentOrdersCard({ orders }: { orders: any[] }) {
    return (
        <Card className="lg:col-span-2 border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] rounded-[2.5rem] bg-white overflow-hidden">
            <CardHeader className="border-b border-zinc-50/50 px-10 py-8 flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="text-xl font-black tracking-tight">Recent Orders</CardTitle>
                    <CardDescription className="text-xs font-medium text-zinc-400 mt-1">You have {orders.length} recent orders.</CardDescription>
                </div>
                <Link href="/admin/orders">
                    <Button variant="ghost" size="icon" className="rounded-2xl hover:bg-zinc-50">
                        <MoreHorizontal className="h-5 w-5 text-zinc-400" />
                    </Button>
                </Link>
            </CardHeader>
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-zinc-50/30">
                            <tr>
                                <th className="px-10 py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Order ID</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Customer</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Status</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Total</th>
                                <th className="px-10 py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-400 text-right">Time</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-50/50">
                            {orders.map((order) => {
                                const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending
                                return (
                                    <tr key={order.id} className="hover:bg-zinc-50/30 transition-colors group cursor-pointer">
                                        <td className="px-10 py-5">
                                            <Link href={`/admin/orders/${order.id}`}>
                                                <span className="text-[10px] font-bold font-mono text-zinc-900 flex items-center gap-2">
                                                    {order.id.slice(0, 8).toUpperCase()}
                                                    <ExternalLink className="h-3 w-3 text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </span>
                                            </Link>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-zinc-800">{order.customer_name}</span>
                                                <span className="text-[10px] font-medium text-zinc-400 lowercase">{order.email}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <Badge className={cn(
                                                "rounded-lg text-[9px] font-black uppercase tracking-wider border-none px-2",
                                                status.class
                                            )}>
                                                {status.label}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-5 text-sm font-black text-zinc-900">
                                            {Number(order.total).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                                        </td>
                                        <td className="px-10 py-5 text-[10px] font-extrabold uppercase tracking-widest text-zinc-400 text-right">
                                            {new Date(order.created_at).toLocaleDateString()}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
                <div className="p-6 text-center border-t border-zinc-50/50">
                    <Link href="/admin/orders">
                        <Button variant="ghost" className="text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-900 gap-2 hover:bg-transparent">
                            View All Transactions
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </CardContent>
        </Card>
    )
}

export function DashboardSkeleton() {
    return (
        <div className="space-y-10 animate-pulse">
            <div className="flex justify-between h-12 bg-zinc-100 rounded-2xl w-1/3" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-32 bg-zinc-100 rounded-[2.5rem]" />
                ))}
            </div>
            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 h-96 bg-zinc-100 rounded-[2.5rem]" />
                <div className="h-96 bg-zinc-100 rounded-[2.5rem]" />
            </div>
        </div>
    )
}
