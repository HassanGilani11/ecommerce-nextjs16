"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
    ArrowLeft,
    Save,
    Ticket,
    Info,
    Calendar,
    Tag,
    Percent,
    DollarSign,
    Truck,
    TrendingUp,
    TrendingDown,
    Zap,
    ShoppingBag,
    Layers,
    Award
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { createOrUpdateCoupon } from "@/app/actions/coupons"

export function CouponForm({ initialData }: { initialData?: any }) {
    const router = useRouter()
    const [isPending, startTransition] = React.useTransition()
    const isEditing = !!initialData?.id

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const data = Object.fromEntries(formData.entries())

        // Add id if editing
        if (isEditing) {
            (data as any).id = initialData.id
        }

        startTransition(async () => {
            const result = await createOrUpdateCoupon(data)
            if (result.success) {
                toast.success(isEditing ? "Coupon updated successfully" : "Coupon created successfully")
                router.push("/admin/coupons")
            } else {
                toast.error(result.error || "Failed to save coupon")
            }
        })
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/coupons">
                        <Button type="button" variant="ghost" size="icon" className="rounded-2xl hover:bg-white shadow-sm border border-transparent hover:border-zinc-100 transition-all">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tighter">{isEditing ? "Edit Coupon" : "Create Coupon"}</h1>
                        <p className="text-zinc-500 text-sm font-medium">
                            {isEditing ? "Update existing promotional reward details." : "Define a new promotional code with specific rewards and rules."}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Link href="/admin/coupons">
                        <Button type="button" variant="ghost" className="rounded-2xl h-11 px-6 font-bold uppercase tracking-widest text-[11px] hover:bg-white text-zinc-500 hover:text-zinc-900">
                            Discard
                        </Button>
                    </Link>
                    <Button
                        disabled={isPending}
                        className="rounded-2xl h-11 px-6 font-bold uppercase tracking-widest text-[11px] gap-2 shadow-lg shadow-black/5 hover:scale-[1.02] active:scale-95 transition-all"
                    >
                        {isPending ? (
                            <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                        ) : (
                            <Save className="h-4 w-4" />
                        )}
                        {isEditing ? "Update Coupon" : "Save Coupon"}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Basic Configuration */}
                    <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] rounded-[2.5rem] bg-white overflow-hidden">
                        <CardHeader className="border-b border-zinc-50 px-10 py-4">
                            <div className="flex items-center gap-3">
                                <div className="h-9 w-9 rounded-2xl bg-zinc-900 flex items-center justify-center">
                                    <Ticket className="h-4.5 w-4.5 text-white" />
                                </div>
                                <CardTitle className="text-xl font-black tracking-tight">Coupon Identification</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="px-10 pb-10 pt-4 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                                <div className="space-y-2">
                                    <Label htmlFor="code" className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">Coupon Code</Label>
                                    <div className="relative">
                                        <Tag className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
                                        <Input
                                            id="code"
                                            name="code"
                                            required
                                            defaultValue={initialData?.code}
                                            placeholder="e.g. SUMMER50"
                                            className="h-12 pl-11 rounded-2xl border-zinc-100 bg-zinc-50/50 focus-visible:ring-1 focus-visible:ring-zinc-200 font-black tracking-tight uppercase"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="type" className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">Discount Type</Label>
                                    <Select name="type" defaultValue={initialData?.type || "percentage"}>
                                        <SelectTrigger className="h-12 rounded-2xl border-zinc-100 bg-zinc-50/50 font-medium">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-2xl border-zinc-100 shadow-2xl">
                                            <SelectItem value="percentage" className="rounded-xl">Percentage Discount</SelectItem>
                                            <SelectItem value="fixed_amount" className="rounded-xl">Fixed Amount Discount</SelectItem>
                                            <SelectItem value="free_shipping" className="rounded-xl">Free Shipping</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="amount" className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">Coupon Amount</Label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400">
                                            <Percent className="h-4 w-4" />
                                        </div>
                                        <Input
                                            id="amount"
                                            name="amount"
                                            type="number"
                                            step="0.01"
                                            required
                                            defaultValue={initialData?.amount}
                                            placeholder="20"
                                            className="h-12 pl-11 rounded-2xl border-zinc-100 bg-zinc-50/50 focus-visible:ring-1 focus-visible:ring-zinc-200 font-black"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="expiry_date" className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">Coupon Expiry Date</Label>
                                    <div className="relative">
                                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                                        <Input
                                            id="expiry_date"
                                            name="expiry_date"
                                            type="date"
                                            defaultValue={initialData?.expiry_date ? new Date(initialData.expiry_date).toISOString().split('T')[0] : ""}
                                            className="h-12 pl-11 rounded-2xl border-zinc-100 bg-zinc-50/50 focus-visible:ring-1 focus-visible:ring-zinc-200 font-medium"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description" className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">Description</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    defaultValue={initialData?.description}
                                    placeholder="Briefly describe what this coupon provides..."
                                    className="min-h-[100px] rounded-[1.5rem] border-zinc-100 bg-zinc-50/50 focus-visible:ring-1 focus-visible:ring-zinc-200 resize-none p-5 text-sm font-medium leading-relaxed"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Spend Restrictions */}
                    <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] rounded-[2.5rem] bg-white overflow-hidden">
                        <CardHeader className="border-b border-zinc-50 px-10 py-4">
                            <div className="flex items-center gap-3">
                                <div className="h-9 w-9 rounded-2xl bg-zinc-900 flex items-center justify-center">
                                    <DollarSign className="h-4.5 w-4.5 text-white" />
                                </div>
                                <CardTitle className="text-xl font-black tracking-tight">Spend Constraints</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="px-10 pb-10 pt-4 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                                <div className="space-y-2">
                                    <Label htmlFor="min_spend" className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">Minimum Spend</Label>
                                    <div className="relative">
                                        <TrendingUp className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
                                        <Input
                                            id="min_spend"
                                            name="min_spend"
                                            type="number"
                                            step="0.01"
                                            defaultValue={initialData?.min_spend || 0}
                                            placeholder="0.00"
                                            className="h-12 pl-11 rounded-2xl border-zinc-100 bg-zinc-50/50 focus-visible:ring-1 focus-visible:ring-zinc-200 font-medium"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="max_spend" className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">Maximum Spend</Label>
                                    <div className="relative">
                                        <TrendingDown className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
                                        <Input
                                            id="max_spend"
                                            name="max_spend"
                                            type="number"
                                            step="0.01"
                                            defaultValue={initialData?.max_spend || ""}
                                            placeholder="No Limit"
                                            className="h-12 pl-11 rounded-2xl border-zinc-100 bg-zinc-50/50 focus-visible:ring-1 focus-visible:ring-zinc-200 font-medium"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="usage_limit" className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">Total Usage Limit</Label>
                                    <div className="relative">
                                        <Ticket className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
                                        <Input
                                            id="usage_limit"
                                            name="usage_limit"
                                            type="number"
                                            defaultValue={initialData?.usage_limit || ""}
                                            placeholder="Unlimited"
                                            className="h-12 pl-11 rounded-2xl border-zinc-100 bg-zinc-50/50 focus-visible:ring-1 focus-visible:ring-zinc-200 font-medium"
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                    {/* Campaign Context */}
                    <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] rounded-[2.5rem] bg-zinc-900 text-white overflow-hidden p-8">
                        <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center mb-6">
                            <Ticket className="h-6 w-6 text-zinc-400" />
                        </div>
                        <h3 className="text-xl font-bold tracking-tight mb-2">Campaign Rules</h3>
                        <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                            Define spending limits and target specific products to ensure your marketing budget is utilized effectively.
                        </p>
                        <div className="h-px bg-white/10 w-full mb-6" />
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-300">Minimum Spend Enforcement</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="h-2 w-2 rounded-full bg-blue-500" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-300">Targeted Discounts</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="h-2 w-2 rounded-full bg-accent" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-300">Usage Limit Control</span>
                            </div>
                        </div>
                    </Card>

                    {/* Quick Config Tips */}
                    <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-zinc-100">
                        <div className="flex items-center gap-2 mb-4">
                            <Info className="h-3.5 w-3.5 text-zinc-400" />
                            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Marketing Insight</p>
                        </div>
                        <p className="text-xs text-zinc-600 font-medium leading-relaxed italic">
                            "Limiting coupons to specific categories rather than individual products often yields higher cart totals."
                        </p>
                    </div>
                </div>
            </div>
        </form>
    )
}
