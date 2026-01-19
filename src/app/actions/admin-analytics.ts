"use server"

import { createClient } from "@/lib/supabase/server"
import { startOfDay, endOfDay, subDays, format } from "date-fns"

export async function getAnalyticsData(days: number = 7) {
    const supabase = await createClient()

    // ... existing auth check ...
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return { error: "Unauthorized" }

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'admin') return { error: "Unauthorized" }

    try {
        // 2. Summary Stats (Total Sales, Net Sales, Orders, Products Sold)
        // We filter summary stats by the selected days to keep them synced
        const startDate = startOfDay(subDays(new Date(), days - 1)).toISOString()

        const { data: ordersData } = await supabase
            .from('orders')
            .select('total, subtotal, discount, status, created_at')
            .not('status', 'in', '("cancelled", "refunded", "archived")')
            .gte('created_at', startDate)

        const { data: itemsData } = await supabase
            .from('order_items')
            .select('quantity, price, product_id, created_at, products(title, categories(name))')
            .gte('created_at', startDate)

        const totalSales = ordersData?.reduce((acc, o) => acc + Number(o.total), 0) || 0
        const totalSubtotal = ordersData?.reduce((acc, o) => acc + Number(o.subtotal), 0) || 0
        const totalDiscount = ordersData?.reduce((acc, o) => acc + Number(o.discount), 0) || 0

        const netSales = totalSubtotal - totalDiscount
        const totalOrders = ordersData?.length || 0
        const productsSold = itemsData?.reduce((acc, i) => acc + i.quantity, 0) || 0

        // 3. Date Range Trend
        const trendData = Array.from({ length: days }, (_, i) => {
            const date = subDays(new Date(), i)
            return {
                name: format(date, days > 7 ? 'MMM dd' : 'EEE'),
                fullDate: format(date, 'yyyy-MM-dd'),
                sales: 0,
                orders: 0
            }
        }).reverse()

        ordersData?.forEach(order => {
            const orderDate = format(new Date(order.created_at), 'yyyy-MM-dd')
            const dayMatch = trendData.find(d => d.fullDate === orderDate)
            if (dayMatch) {
                dayMatch.sales += Number(order.total)
                dayMatch.orders += 1
            }
        })

        // 4. Top Categories
        const categoryMap: Record<string, { sold: number; revenue: number }> = {}
        itemsData?.forEach(item => {
            const catName = (item.products as any)?.categories?.name || "Uncategorized"
            if (!categoryMap[catName]) {
                categoryMap[catName] = { sold: 0, revenue: 0 }
            }
            categoryMap[catName].sold += item.quantity
            categoryMap[catName].revenue += (item.quantity * Number(item.price))
        })

        const topCategories = Object.entries(categoryMap)
            .map(([name, data]) => ({
                name,
                sold: data.sold,
                revenue: data.revenue,
                growth: 5.0
            }))
            .sort((a, b) => b.sold - a.sold)
            .slice(0, 4)

        // 5. Best Sellers (Products)
        const productMap: Record<string, { sold: number; revenue: number; name: string }> = {}
        itemsData?.forEach(item => {
            const pName = (item.products as any)?.title || "Unknown Product"
            const pid = item.product_id
            if (!productMap[pid]) {
                productMap[pid] = { sold: 0, revenue: 0, name: pName }
            }
            productMap[pid].sold += item.quantity
            productMap[pid].revenue += (item.quantity * Number(item.price))
        })

        const topProducts = Object.values(productMap)
            .map(p => ({
                name: p.name,
                sold: p.sold,
                revenue: p.revenue
            }))
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 4)

        return {
            summary: {
                totalSales,
                netSales,
                totalOrders,
                productsSold
            },
            trend: trendData,
            topCategories,
            topProducts,
            days
        }

    } catch (error: any) {
        console.error("Analytics fetch error:", error)
        return { error: "Failed to load analytics" }
    }
}
