"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
    Search,
    MoreHorizontal,
    Edit2,
    Trash2,
    Filter,
    ArrowUpDown,
    Ticket,
    Plus,
    Calendar,
    Tag,
    Clock,
    Percent,
    DollarSign,
    Truck,
    BarChart3,
    Copy,
    Power,
    PowerOff
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
import { toast } from "sonner"
import { deleteCoupon, toggleCouponStatus, duplicateCoupon } from "@/app/actions/coupons"
import { format } from "date-fns"

import { cn } from "@/lib/utils"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

const TYPE_CONFIG = {
    fixed_amount: {
        label: "Fixed $",
        icon: DollarSign,
        class: "bg-blue-50 text-blue-600 border-blue-100"
    },
    percentage: {
        label: "Percentage %",
        icon: Percent,
        class: "bg-purple-50 text-purple-600 border-purple-100"
    },
    free_shipping: {
        label: "Free Shipping",
        icon: Truck,
        class: "bg-emerald-50 text-emerald-600 border-emerald-100"
    }
}

export function CouponsTable({ coupons }: { coupons: any[] }) {
    const router = useRouter()
    const [isPending, startTransition] = React.useTransition()
    const [searchQuery, setSearchQuery] = React.useState("")
    const [analyticsCoupon, setAnalyticsCoupon] = React.useState<any>(null)

    const filteredCoupons = coupons.filter(c =>
        c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this coupon?")) return

        startTransition(async () => {
            const result = await deleteCoupon(id)
            if (result.success) {
                toast.success("Coupon deleted successfully")
            } else {
                toast.error(result.error || "Failed to delete coupon")
            }
        })
    }

    const handleToggleStatus = async (id: string, currentStatus: string) => {
        startTransition(async () => {
            const result = await toggleCouponStatus(id, currentStatus)
            if (result.success) {
                toast.success(`Coupon ${currentStatus === 'active' ? 'deactivated' : 'activated'} successfully`)
            } else {
                toast.error(result.error || "Failed to update status")
            }
        })
    }

    const handleDuplicate = async (id: string) => {
        startTransition(async () => {
            const result = await duplicateCoupon(id)
            if (result.success) {
                toast.success("Coupon duplicated successfully")
            } else {
                toast.error(result.error || "Failed to duplicate coupon")
            }
        })
    }

    return (
        <div className="bg-white rounded-[2rem] shadow-sm border border-zinc-100 overflow-hidden">
            <div className="flex flex-col sm:flex-row items-center gap-4 p-6 border-b border-zinc-50">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                    <input
                        placeholder="Search by coupon code or description..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-11 h-11 rounded-xl border border-zinc-100 bg-zinc-50/50 focus:outline-none focus:ring-1 focus:ring-zinc-200 text-sm transition-all"
                    />
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Button variant="outline" className="flex-1 sm:flex-none rounded-xl h-11 px-4 gap-2 border-zinc-100 text-zinc-600 font-bold uppercase tracking-widest text-[10px]">
                        <Filter className="h-3.5 w-3.5" />
                        Filter
                    </Button>
                    <Button variant="outline" className="flex-1 sm:flex-none rounded-xl h-11 px-4 gap-2 border-zinc-100 text-zinc-600 font-bold uppercase tracking-widest text-[10px]">
                        <ArrowUpDown className="h-3.5 w-3.5" />
                        Sort
                    </Button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent border-zinc-50">
                            <TableHead className="px-8 text-[10px] font-bold uppercase tracking-widest">Coupon Code</TableHead>
                            <TableHead className="text-[10px] font-bold uppercase tracking-widest">Type & Amount</TableHead>
                            <TableHead className="text-[10px] font-bold uppercase tracking-widest hidden lg:table-cell">Usage</TableHead>
                            <TableHead className="text-[10px] font-bold uppercase tracking-widest">Expiry Date</TableHead>
                            <TableHead className="text-[10px] font-bold uppercase tracking-widest">Status</TableHead>
                            <TableHead className="text-right pr-8 text-[10px] font-bold uppercase tracking-widest">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredCoupons.map((coupon) => {
                            const type = TYPE_CONFIG[coupon.type as keyof typeof TYPE_CONFIG]
                            const TypeIcon = type.icon
                            const isInactive = coupon.status === 'inactive'

                            return (
                                <TableRow key={coupon.id} className={cn(
                                    "group border-zinc-50 hover:bg-zinc-50/50 transition-colors",
                                    isInactive && "opacity-60"
                                )}>
                                    <TableCell className="px-8 py-5">
                                        <div className="flex flex-col">
                                            <span className="font-black text-zinc-900 font-mono text-sm tracking-tighter">{coupon.code}</span>
                                            <span className="text-[10px] text-zinc-400 font-medium truncate max-w-[150px]">{coupon.description}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className={`rounded-lg border px-2 py-0.5 gap-1.5 font-bold text-[10px] uppercase tracking-wider ${type.class}`}>
                                                <TypeIcon className="h-3 w-3" />
                                                {type.label}
                                            </Badge>
                                            <span className="font-black text-zinc-900 text-sm">
                                                {coupon.type === 'fixed_amount' ? `$${coupon.amount}` : `${coupon.amount}%`}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="hidden lg:table-cell">
                                        <div className="flex items-center gap-2 text-zinc-600 text-[11px] font-bold">
                                            <Clock className="h-3.5 w-3.5 text-zinc-300" />
                                            {coupon.usage_count} / {coupon.usage_limit || '∞'}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2 text-zinc-500 text-xs font-medium">
                                            <Calendar className="h-3.5 w-3.5 text-zinc-300" />
                                            {coupon.expiry_date ? format(new Date(coupon.expiry_date), 'MMM d, yyyy') : 'No Expiry'}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={cn(
                                            "rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-widest",
                                            isInactive ? "bg-zinc-100 text-zinc-400" : "bg-emerald-100 text-emerald-600"
                                        )}>
                                            {coupon.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right pr-8">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-zinc-400 hover:text-zinc-900 hover:bg-white shadow-none transition-all">
                                                    <MoreHorizontal className="h-3.5 w-3.5" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="rounded-xl border-zinc-100 shadow-xl w-48">
                                                <DropdownMenuLabel className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 px-2 py-1.5">Coupon Operations</DropdownMenuLabel>
                                                <Link href={`/admin/coupons/new?id=${coupon.id}`}>
                                                    <DropdownMenuItem className="rounded-lg gap-2 text-xs font-medium cursor-pointer">
                                                        <Edit2 className="h-3.5 w-3.5 text-zinc-400" /> Edit Coupon Details
                                                    </DropdownMenuItem>
                                                </Link>
                                                <DropdownMenuItem
                                                    onClick={() => handleDuplicate(coupon.id)}
                                                    className="rounded-lg gap-2 text-xs font-medium cursor-pointer"
                                                >
                                                    <Copy className="h-3.5 w-3.5 text-zinc-400" /> Duplicate Code
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => setAnalyticsCoupon(coupon)}
                                                    className="rounded-lg gap-2 text-xs font-medium cursor-pointer"
                                                >
                                                    <BarChart3 className="h-3.5 w-3.5 text-zinc-400" /> View Analytics
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    onClick={() => handleToggleStatus(coupon.id, coupon.status)}
                                                    className={cn(
                                                        "rounded-lg gap-2 text-xs font-medium cursor-pointer",
                                                        isInactive ? "text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50" : "text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                                                    )}
                                                >
                                                    {isInactive ? <Power className="h-3.5 w-3.5" /> : <PowerOff className="h-3.5 w-3.5" />}
                                                    {isInactive ? "Activate" : "Deactivate"}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => handleDelete(coupon.id)}
                                                    className="rounded-lg gap-2 text-xs font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 cursor-pointer"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" /> Delete Coupon
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                        {filteredCoupons.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="h-40 text-center text-zinc-500 font-medium">
                                    No coupons found matching your search.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="p-6 border-t border-zinc-50 bg-zinc-50/30">
                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-[0.2em] text-center">
                    Overseeing {coupons.length} active global promotions
                </p>
            </div>

            {/* Analytics Dialog */}
            <Dialog open={!!analyticsCoupon} onOpenChange={() => setAnalyticsCoupon(null)}>
                <DialogContent className="rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden max-w-md">
                    <div className="bg-zinc-900 p-8 text-white">
                        <DialogHeader>
                            <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center mb-4">
                                <BarChart3 className="h-6 w-6 text-zinc-400" />
                            </div>
                            <DialogTitle className="text-2xl font-black tracking-tight">{analyticsCoupon?.code} Analytics</DialogTitle>
                            <DialogDescription className="text-zinc-400 font-medium">
                                Usage performance and performance metrics.
                            </DialogDescription>
                        </DialogHeader>
                    </div>
                    <div className="p-8 space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-zinc-50 rounded-2xl p-4 border border-zinc-100">
                                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">Total Uses</p>
                                <p className="text-2xl font-black text-zinc-900">{analyticsCoupon?.usage_count || 0}</p>
                            </div>
                            <div className="bg-zinc-50 rounded-2xl p-4 border border-zinc-100">
                                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">Usage Limit</p>
                                <p className="text-2xl font-black text-zinc-900">{analyticsCoupon?.usage_limit || '∞'}</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-end">
                                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Capacity</p>
                                <p className="text-[10px] font-black text-zinc-900">{analyticsCoupon?.usage_limit ? Math.round((analyticsCoupon.usage_count / analyticsCoupon.usage_limit) * 100) : 0}%</p>
                            </div>
                            <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-zinc-900 transition-all duration-1000"
                                    style={{ width: `${analyticsCoupon?.usage_limit ? Math.min(100, (analyticsCoupon.usage_count / analyticsCoupon.usage_limit) * 100) : 0}%` }}
                                />
                            </div>
                        </div>

                        <div className="pt-4 border-t border-zinc-100">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-zinc-500 font-medium">Status</span>
                                <Badge className={cn(
                                    "rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-widest",
                                    analyticsCoupon?.status === 'inactive' ? "bg-zinc-100 text-zinc-400" : "bg-emerald-100 text-emerald-600"
                                )}>
                                    {analyticsCoupon?.status}
                                </Badge>
                            </div>
                            <div className="flex items-center justify-between text-sm mt-3">
                                <span className="text-zinc-500 font-medium">Expiry</span>
                                <span className="text-zinc-900 font-bold">{analyticsCoupon?.expiry_date ? format(new Date(analyticsCoupon.expiry_date), 'MMM d, yyyy') : 'No Expiry'}</span>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
