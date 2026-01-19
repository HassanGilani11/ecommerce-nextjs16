"use client"

import * as React from "react"
import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    ShoppingBag,
    Package,
    ArrowUpRight,
    Calendar,
    CreditCard,
    Layers,
    Award
} from "lucide-react"
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    AreaChart,
    Area
} from 'recharts'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

import { useRouter, useSearchParams } from "next/navigation"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface AnalyticsClientProps {
    data: any
}

export default function AnalyticsClient({ data }: AnalyticsClientProps) {
    const router = useRouter()
    const searchParams = useSearchParams()

    if (!data || data.error) {
        return <div className="p-8 text-center text-zinc-500">Error loading analytics: {data?.error || "Unknown error"}</div>
    }

    const { summary, trend, topCategories, topProducts, days } = data

    const handleDaysChange = (value: string) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set('days', value)
        router.push(`/admin/analytics?${params.toString()}`)
    }

    const downloadReport = () => {
        const csvRows = []

        // Header
        csvRows.push(['Metric', 'Value'])
        csvRows.push(['Total Sales', summary.totalSales])
        csvRows.push(['Net Sales', summary.netSales])
        csvRows.push(['Total Orders', summary.totalOrders])
        csvRows.push(['Products Sold', summary.productsSold])
        csvRows.push([]) // empty row

        // Trend
        csvRows.push(['Date', 'Sales', 'Orders'])
        trend.forEach((d: any) => csvRows.push([d.fullDate, d.sales, d.orders]))
        csvRows.push([]) // empty row

        // Top Categories
        csvRows.push(['Category', 'Items Sold', 'Revenue'])
        topCategories.forEach((c: any) => csvRows.push([c.name, c.sold, c.revenue]))
        csvRows.push([]) // empty row

        // Top Products
        csvRows.push(['Product', 'Sales', 'Revenue'])
        topProducts.forEach((p: any) => csvRows.push([p.name, p.sold, p.revenue]))

        const csvContent = csvRows.map(e => e.join(",")).join("\n")
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement("a")
        const url = URL.createObjectURL(blob)
        link.setAttribute("href", url)
        link.setAttribute("download", `store_analytics_${days}_days.csv`)
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const stats = [
        { label: "Total Sales", value: `$${summary.totalSales.toLocaleString()}`, trend: "+12.5%", icon: DollarSign },
        { label: "Net Sales", value: `$${summary.netSales.toLocaleString()}`, trend: "+8.2%", icon: CreditCard },
        { label: "Total Orders", value: summary.totalOrders.toLocaleString(), trend: "+5.1%", icon: ShoppingBag },
        { label: "Product Sold", value: summary.productsSold.toLocaleString(), trend: "-2.4%", icon: Package, negative: true },
    ]

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tighter">Performance Analytics</h1>
                    <p className="text-zinc-500 text-sm font-medium">Detailed insights into your store's sales and activity.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Select value={days.toString()} onValueChange={handleDaysChange}>
                        <SelectTrigger className="rounded-2xl h-11 w-[180px] px-4 gap-2 border-zinc-100 bg-white text-zinc-600 font-bold uppercase tracking-widest text-[10px]">
                            <Calendar className="h-3.5 w-3.5 mr-2" />
                            <SelectValue placeholder="Select Range" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-zinc-100">
                            <SelectItem value="7" className="text-xs font-bold uppercase tracking-widest py-3">Last 7 Days</SelectItem>
                            <SelectItem value="30" className="text-xs font-bold uppercase tracking-widest py-3">Last 30 Days</SelectItem>
                            <SelectItem value="90" className="text-xs font-bold uppercase tracking-widest py-3">Last 90 Days</SelectItem>
                        </SelectContent>
                    </Select>

                    <Button
                        onClick={downloadReport}
                        className="rounded-2xl h-11 px-6 font-bold uppercase tracking-widest text-[11px] gap-2 shadow-lg shadow-black/5 hover:scale-[1.02] active:scale-95 transition-all"
                    >
                        Download Report
                    </Button>
                </div>
            </div>

            {/* Summary Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <Card key={i} className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] rounded-[2rem] bg-white overflow-hidden group hover:shadow-xl transition-all duration-500">
                        <CardContent className="p-8">
                            <div className="flex items-center justify-between mb-4">
                                <div className="h-12 w-12 rounded-2xl bg-zinc-950 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <stat.icon className="h-5 w-5 text-white" />
                                </div>
                                <Badge variant="outline" className={`rounded-lg border px-2 py-0.5 gap-1 font-bold text-[10px] uppercase tracking-wider ${stat.negative ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                                    {stat.negative ? <TrendingDown className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
                                    {stat.trend}
                                </Badge>
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-1">{stat.label}</p>
                            <h3 className="text-2xl font-black tracking-tighter text-zinc-900">{stat.value}</h3>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Net Sales Chart */}
                <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] rounded-[2.5rem] bg-white overflow-hidden">
                    <CardHeader className="border-b border-zinc-50 px-10 py-5">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-9 w-9 rounded-2xl bg-zinc-900 flex items-center justify-center">
                                    <TrendingUp className="h-4.5 w-4.5 text-white" />
                                </div>
                                <CardTitle className="text-xl font-black tracking-tight">Net Sales Trend</CardTitle>
                            </div>
                            <Button variant="ghost" size="icon" className="rounded-xl h-8 w-8">
                                <ArrowUpRight className="h-4 w-4 text-zinc-400" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="px-10 pb-10 pt-8">
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={trend}>
                                    <defs>
                                        <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#18181b" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#18181b" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 10, fontWeight: 700, fill: '#a1a1aa' }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 10, fontWeight: 700, fill: '#a1a1aa' }}
                                    />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                                        cursor={{ stroke: '#18181b', strokeWidth: 1 }}
                                    />
                                    <Area type="monotone" dataKey="sales" stroke="#18181b" strokeWidth={2} fillOpacity={1} fill="url(#colorSales)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Orders Chart */}
                <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] rounded-[2.5rem] bg-white overflow-hidden">
                    <CardHeader className="border-b border-zinc-50 px-10 py-5">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-9 w-9 rounded-2xl bg-zinc-900 flex items-center justify-center">
                                    <ShoppingBag className="h-4.5 w-4.5 text-white" />
                                </div>
                                <CardTitle className="text-xl font-black tracking-tight">Order Volume</CardTitle>
                            </div>
                            <Button variant="ghost" size="icon" className="rounded-xl h-8 w-8">
                                <ArrowUpRight className="h-4 w-4 text-zinc-400" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="px-10 pb-10 pt-8">
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={trend}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f4f4f5" />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 10, fontWeight: 700, fill: '#a1a1aa' }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 10, fontWeight: 700, fill: '#a1a1aa' }}
                                    />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                                        cursor={{ fill: '#f4f4f5' }}
                                    />
                                    <Bar dataKey="orders" fill="#18181b" radius={[6, 6, 0, 0]} barSize={32} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Leaderboards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Top Categories */}
                <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] rounded-[2.5rem] bg-white overflow-hidden">
                    <CardHeader className="border-b border-zinc-50 px-10 py-5">
                        <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-2xl bg-zinc-900 flex items-center justify-center">
                                <Layers className="h-4.5 w-4.5 text-white" />
                            </div>
                            <CardTitle className="text-xl font-black tracking-tight">Top Categories</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="px-10 pb-8 pt-4">
                        <div className="space-y-6 pt-4">
                            {topCategories.length > 0 ? topCategories.map((cat: any, i: number) => (
                                <div key={i} className="flex items-center justify-between group">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-xl bg-zinc-50 flex items-center justify-center text-xs font-black text-zinc-400 group-hover:bg-zinc-950 group-hover:text-white transition-colors">
                                            0{i + 1}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-zinc-900">{cat.name}</p>
                                            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">{cat.sold} items sold</p>
                                        </div>
                                    </div>
                                    <Badge className={`rounded-lg border px-2 py-0.5 font-black text-[10px] ${cat.growth >= 0 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                                        {cat.growth > 0 ? '+' : ''}{cat.growth}%
                                    </Badge>
                                </div>
                            )) : (
                                <p className="text-center text-zinc-400 text-xs py-8">No data available</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Top Products */}
                <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] rounded-[2.5rem] bg-white overflow-hidden">
                    <CardHeader className="border-b border-zinc-50 px-10 py-5">
                        <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-2xl bg-zinc-900 flex items-center justify-center">
                                <Award className="h-4.5 w-4.5 text-white" />
                            </div>
                            <CardTitle className="text-xl font-black tracking-tight">Best Sellers</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="px-10 pb-8 pt-4">
                        <div className="space-y-6 pt-4">
                            {topProducts.length > 0 ? topProducts.map((product: any, i: number) => (
                                <div key={i} className="flex items-center justify-between group">
                                    <div className="flex items-center gap-4 font-mono">
                                        <div className="h-10 w-10 rounded-xl bg-zinc-50 flex items-center justify-center text-xs font-black text-zinc-400 group-hover:bg-zinc-950 group-hover:text-white transition-colors">
                                            #{i + 1}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-zinc-900 line-clamp-1">{product.name}</p>
                                            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">{product.sold} sales</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-black text-zinc-900">${product.revenue.toLocaleString()}</p>
                                        <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-tighter">Revenue</p>
                                    </div>
                                </div>
                            )) : (
                                <p className="text-center text-zinc-400 text-xs py-8">No data available</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
