"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
    MoreHorizontal,
    Eye,
    CheckCircle2,
    Clock,
    Truck,
    XCircle,
    RotateCcw,
    AlertCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { archiveOrder, restoreOrder } from "@/app/actions/admin-orders"
import { toast } from "sonner"

const STATUS_CONFIG: Record<string, any> = {
    pending: {
        label: "Pending",
        icon: Clock,
        class: "bg-amber-50 text-amber-600 border-amber-100"
    },
    processing: {
        label: "Processing",
        icon: Clock,
        class: "bg-amber-50 text-amber-600 border-amber-100"
    },
    shipped: {
        label: "Shipped",
        icon: Truck,
        class: "bg-blue-50 text-blue-600 border-blue-100"
    },
    delivered: {
        label: "Delivered",
        icon: CheckCircle2,
        class: "bg-emerald-50 text-emerald-600 border-emerald-100"
    },
    completed: {
        label: "Completed",
        icon: CheckCircle2,
        class: "bg-emerald-50 text-emerald-600 border-emerald-100"
    },
    cancelled: {
        label: "Cancelled",
        icon: XCircle,
        class: "bg-rose-50 text-rose-600 border-rose-100"
    },
    refunded: {
        label: "Refunded",
        icon: RotateCcw,
        class: "bg-zinc-50 text-zinc-600 border-zinc-100"
    },
    "on-hold": {
        label: "On Hold",
        icon: AlertCircle,
        class: "bg-orange-50 text-orange-600 border-orange-100"
    },
    archived: {
        label: "Archived",
        icon: XCircle,
        class: "bg-zinc-100 text-zinc-500 border-zinc-200"
    }
}

interface Order {
    id: string
    email: string
    total: number
    status: string
    created_at: string
}

interface OrdersTableProps {
    orders: Order[]
    onActionStart?: () => void
}

export function OrdersTable({ orders, onActionStart }: OrdersTableProps) {
    const router = useRouter()
    const [isProcessingAction, setIsProcessingAction] = React.useState<string | null>(null)
    const [isPending, startTransition] = React.useTransition()

    const handleArchive = async (orderId: string) => {
        if (!confirm("Are you sure you want to archive this order?")) return

        setIsProcessingAction(orderId)
        if (onActionStart) onActionStart()

        const result = await archiveOrder(orderId)

        startTransition(() => {
            if (result.success) {
                toast.success("Order archived successfully")
                router.refresh()
            } else {
                toast.error(result.error || "Failed to archive order")
            }
            setIsProcessingAction(null)
        })
    }

    const handleRestore = async (orderId: string) => {
        setIsProcessingAction(orderId)
        if (onActionStart) onActionStart()

        const result = await restoreOrder(orderId)

        startTransition(() => {
            if (result.success) {
                toast.success("Order restored to active list")
                router.refresh()
            } else {
                toast.error(result.error || "Failed to restore order")
            }
            setIsProcessingAction(null)
        })
    }

    const handlePrint = (orderId: string) => {
        window.open(`/admin/orders/${orderId}/print`, '_blank')
    }

    return (
        <Table>
            <TableHeader>
                <TableRow className="hover:bg-transparent border-zinc-50 text-zinc-400">
                    <TableHead className="px-8 text-[10px] font-black uppercase tracking-widest h-14">Order ID</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest h-14">Customer</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest hidden md:table-cell h-14">Date</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest h-14">Total Amount</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest h-14">Status</TableHead>
                    <TableHead className="text-right pr-8 text-[10px] font-black uppercase tracking-widest h-14">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {orders.map((order) => {
                    const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending
                    const StatusIcon = status.icon

                    return (
                        <TableRow key={order.id} className="group border-zinc-50 hover:bg-zinc-50/50 transition-colors">
                            <TableCell className="px-8 py-5">
                                <span className="font-bold text-zinc-900 font-mono text-[10px]">{order.id.slice(0, 8).toUpperCase()}</span>
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-zinc-600 text-[11px] font-bold tracking-tight">{order.email.split('@')[0]}</span>
                                    <span className="text-zinc-400 text-[9px] font-medium uppercase tracking-tighter">{order.email}</span>
                                </div>
                            </TableCell>
                            <TableCell className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest hidden md:table-cell">
                                {new Date(order.created_at).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                                <span className="font-black text-zinc-900 tracking-tight text-sm">
                                    ${Number(order.total).toFixed(2)}
                                </span>
                            </TableCell>
                            <TableCell>
                                <Badge variant="outline" className={`rounded-xl border px-3 py-1 gap-1.5 font-bold text-[10px] uppercase tracking-wider shadow-sm transition-transform active:scale-95 ${status.class}`}>
                                    <StatusIcon className="h-3 w-3" />
                                    {status.label}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right pr-8">
                                <div className="flex items-center justify-end gap-1">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-9 w-9 rounded-xl text-zinc-400 hover:text-zinc-900 hover:bg-white border border-transparent hover:border-zinc-100 shadow-none transition-all"
                                        onClick={() => router.push(`/admin/orders/${order.id}`)}
                                    >
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-zinc-400 hover:text-zinc-900 hover:bg-white border border-transparent hover:border-zinc-100 shadow-none transition-all">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-52 rounded-2xl border-zinc-100 shadow-xl p-2 animate-in fade-in zoom-in-95 duration-200">
                                            <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 px-3 py-2 mb-1">Order Actions</DropdownMenuLabel>
                                            <DropdownMenuItem
                                                onClick={() => router.push(`/admin/orders/${order.id}`)}
                                                className="rounded-xl gap-2 text-[11px] font-bold uppercase tracking-wider px-3 py-3 cursor-pointer focus:bg-zinc-50 transition-colors"
                                            >
                                                Edit Order
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => handlePrint(order.id)}
                                                className="rounded-xl gap-2 text-[11px] font-bold uppercase tracking-wider px-3 py-3 cursor-pointer focus:bg-zinc-50 transition-colors"
                                            >
                                                Print Invoice
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator className="bg-zinc-50 my-1" />
                                            {order.status === 'archived' ? (
                                                <DropdownMenuItem
                                                    disabled={isProcessingAction === order.id}
                                                    onClick={() => handleRestore(order.id)}
                                                    className="rounded-xl gap-2 text-[11px] font-bold uppercase tracking-wider px-3 py-3 cursor-pointer text-emerald-600 focus:text-emerald-700 focus:bg-emerald-50 transition-colors"
                                                >
                                                    {isProcessingAction === order.id ? "Restoring..." : "Restore Order"}
                                                </DropdownMenuItem>
                                            ) : (
                                                <DropdownMenuItem
                                                    disabled={isProcessingAction === order.id}
                                                    onClick={() => handleArchive(order.id)}
                                                    className="rounded-xl gap-2 text-[11px] font-bold uppercase tracking-wider px-3 py-3 cursor-pointer text-rose-600 focus:text-rose-700 focus:bg-rose-50 transition-colors"
                                                >
                                                    {isProcessingAction === order.id ? "Archiving..." : "Archive Order"}
                                                </DropdownMenuItem>
                                            )}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </TableCell>
                        </TableRow>
                    )
                })}
                {orders.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={6} className="text-center py-10 text-muted-foreground text-sm">
                            No orders found.
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    )
}
