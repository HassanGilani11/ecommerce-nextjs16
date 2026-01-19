"use server"

import { createClient } from "@/lib/supabase/server"

export async function getDashboardData() {
    const supabase = await createClient()

    // 1. Check if user is admin
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return { error: "Unauthorized" }

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'admin') return { error: "Unauthorized" }

    try {
        // 2. Fetch summary data in parallel
        const results = await Promise.all([
            // Total Revenue
            supabase
                .from('orders')
                .select('total')
                .not('status', 'in', '("cancelled", "refunded", "archived")'),
            // Total Orders Count
            supabase
                .from('orders')
                .select('*', { count: 'exact', head: true }),
            // Active Users Count
            supabase
                .from('profiles')
                .select('*', { count: 'exact', head: true })
                .eq('status', 'active'),
            // Total Products Count
            supabase
                .from('products')
                .select('*', { count: 'exact', head: true }),
        ])

        const revenueData = results[0].data
        const totalOrders = results[1].count
        const activeUsers = results[2].count
        const totalProducts = results[3].count
        const totalRevenue = revenueData?.reduce((acc, curr) => acc + Number(curr.total), 0) || 0

        // 3. Fetch Recent Orders (Fetch without join first to avoid SQL errors if relationship is missing)
        const { data: recentOrdersRaw, error: ordersError } = await supabase
            .from('orders')
            .select('id, total, status, created_at, email, user_id')
            .order('created_at', { ascending: false })
            .limit(5)

        if (ordersError) {
            console.error("Dashboard Recent Orders Fetch Error:", ordersError)
        }

        // Resolve names from profiles separately for robustness
        const userIds = recentOrdersRaw?.map(o => o.user_id).filter(Boolean) as string[] || []
        let profilesMap: Record<string, string> = {}

        if (userIds.length > 0) {
            const { data: profilesData } = await supabase
                .from('profiles')
                .select('id, full_name')
                .in('id', userIds)

            profilesData?.forEach(p => {
                profilesMap[p.id] = p.full_name || ""
            })
        }

        const recentOrders = recentOrdersRaw?.map(o => ({
            ...o,
            customer_name: (o.user_id && profilesMap[o.user_id]) ? profilesMap[o.user_id] : o.email.split('@')[0]
        })) || []

        // 4. Top Products (Sales volume from order_items)
        const { data: salesItems } = await supabase
            .from('order_items')
            .select(`
                quantity,
                product_id,
                products (
                    title,
                    featured_image,
                    categories (name)
                )
            `)

        // Aggregate sales in JS
        const productSales: Record<string, any> = {}
        salesItems?.forEach(item => {
            if (!item.product_id || !item.products) return
            const pid = item.product_id
            if (!productSales[pid]) {
                const p = item.products as any
                productSales[pid] = {
                    id: pid,
                    name: p.title,
                    category: p.categories?.name || "Uncategorized",
                    img: p.featured_image,
                    sales: 0
                }
            }
            productSales[pid].sales += item.quantity
        })

        const topProducts = Object.values(productSales)
            .sort((a, b) => b.sales - a.sales)
            .slice(0, 3)

        return {
            stats: {
                totalRevenue,
                totalOrders: totalOrders || 0,
                activeUsers: activeUsers || 0,
                totalProducts: totalProducts || 0
            },
            recentOrders,
            topProducts
        }

    } catch (error: any) {
        console.error("Dashboard data fetch error:", error)
        return { error: "Failed to load dashboard data" }
    }
}
