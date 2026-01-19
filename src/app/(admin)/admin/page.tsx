import * as React from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Users,
    ShoppingBag,
    Package,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    MoreHorizontal,
    DollarSign,
    ExternalLink,
    ChevronRight,
    Clock,
    CheckCircle2,
    Truck,
    XCircle,
    RotateCcw,
    AlertCircle
} from "lucide-react"
import { getDashboardData } from "@/app/actions/admin-dashboard"
import Link from "next/link"
import { redirect } from "next/navigation"
import { DashboardReportButton } from "./dashboard-report"
import { RecentOrdersCard } from "./dashboard-components"

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

export default async function AdminDashboard() {
    const data = await getDashboardData()

    if ('error' in data) {
        if (data.error === "Unauthorized") redirect('/login')
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <p className="text-rose-500 font-bold">{data.error}</p>
            </div>
        )
    }

    const { stats, recentOrders, topProducts } = data

    const dashboardStats = [
        {
            name: "Total Revenue",
            value: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(stats.totalRevenue),
            change: "+12.5%",
            trend: "up",
            icon: DollarSign,
            color: "bg-emerald-50 text-emerald-600"
        },
        {
            name: "Total Orders",
            value: stats.totalOrders.toString(),
            change: "+5.2%",
            trend: "up",
            icon: ShoppingBag,
            color: "bg-blue-50 text-blue-600"
        },
        {
            name: "Active Users",
            value: stats.activeUsers.toString(),
            change: "-0.5%",
            trend: "down",
            icon: Users,
            color: "bg-violet-50 text-violet-600"
        },
        {
            name: "Total Products",
            value: stats.totalProducts.toString(),
            change: "Live",
            trend: "neutral",
            icon: Package,
            color: "bg-orange-50 text-orange-600"
        },
    ]

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-4xl font-black tracking-tight text-zinc-900">Dashboard</h1>
                    <p className="text-zinc-500 text-sm font-medium">An overview of your store's performance and recent activity.</p>
                </div>
                <div className="flex items-center gap-2">
                    <DashboardReportButton stats={stats} recentOrders={recentOrders} />
                    <Link href="/admin/products">
                        <Button className="rounded-2xl bg-zinc-900 text-white h-11 px-6 font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-zinc-200 transition-all hover:scale-105 active:scale-95">
                            Manage Store
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {dashboardStats.map((stat) => {
                    const Icon = stat.icon
                    return (
                        <Card key={stat.name} className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] rounded-[2.5rem] overflow-hidden bg-white hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-500 group">
                            <CardContent className="p-8">
                                <div className="flex items-start justify-between">
                                    <div className={cn("h-12 w-12 rounded-[1.25rem] flex items-center justify-center transition-all duration-500 group-hover:scale-110", stat.color)}>
                                        <Icon className="h-6 w-6" />
                                    </div>
                                    <div className={cn(
                                        "flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
                                        stat.trend === "up" ? "bg-emerald-50 text-emerald-600" :
                                            stat.trend === "down" ? "bg-rose-50 text-rose-600" : "bg-zinc-50 text-zinc-400"
                                    )}>
                                        {stat.trend === "up" && <ArrowUpRight className="h-3 w-3" />}
                                        {stat.trend === "down" && <ArrowDownRight className="h-3 w-3" />}
                                        {stat.change}
                                    </div>
                                </div>
                                <div className="mt-8">
                                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-zinc-400">{stat.name}</p>
                                    <p className="text-3xl font-black tracking-tighter text-zinc-900 mt-1">{stat.value}</p>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-8 pb-10">
                <RecentOrdersCard orders={recentOrders} />

                {/* Top Performance / System */}
                <div className="space-y-8">
                    <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] rounded-[2.5rem] bg-white overflow-hidden">
                        <CardHeader className="border-b border-zinc-50/50 px-8 py-6">
                            <CardTitle className="text-lg font-black tracking-tight">Top Products</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            {topProducts.map((item, i) => (
                                <Link key={i} href={`/admin/products/${item.id}/edit`}>
                                    <div className="flex items-center justify-between group cursor-pointer hover:bg-zinc-50/50 p-2 rounded-2xl transition-all">
                                        <div className="flex items-center gap-3">
                                            <div className="h-12 w-12 rounded-[1rem] overflow-hidden bg-zinc-100 border border-zinc-100 flex-shrink-0">
                                                {item.img ? (
                                                    <img src={item.img} alt={item.name} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                ) : (
                                                    <div className="h-full w-full flex items-center justify-center text-zinc-400"><Package className="h-4 w-4" /></div>
                                                )}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[11px] font-bold text-zinc-900 line-clamp-1">{item.name}</span>
                                                <span className="text-[10px] font-medium text-zinc-400">{item.category}</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-black text-zinc-900">{item.sales}</p>
                                            <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-tighter">Sales</p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                            {topProducts.length === 0 && (
                                <p className="text-center text-zinc-400 text-xs py-4 italic">No products yet.</p>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-[0_8px_30px_rgb(15,15,15,0.02)] rounded-[2.5rem] bg-zinc-900 text-white overflow-hidden p-8">
                        <div className="h-10 w-10 rounded-2xl bg-white/10 flex items-center justify-center mb-6">
                            <TrendingUp className="h-5 w-5 text-zinc-400" />
                        </div>
                        <h3 className="text-xl font-black tracking-tight mb-2">Growth Target</h3>
                        <p className="text-zinc-400 text-sm font-medium mb-8">You're currently 82% of the way to your monthly revenue goal.</p>
                        <div className="space-y-2">
                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-white rounded-full w-[82%]" />
                            </div>
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-zinc-500">
                                <span>$20.2k</span>
                                <span className="text-white">$24.5k</span>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}
