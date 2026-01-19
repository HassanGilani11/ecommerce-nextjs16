import * as React from "react"
import Link from "next/link"
import {
    Plus,
    Search,
    Filter,
    ArrowUpDown,
    Download
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { OrdersTable } from "./orders-table"
import { SearchOrders } from "./search-orders"
import { ExportOrdersButton } from "./export-button"
import { OrderTabs } from "./order-tabs"

import { OrdersTableContainer } from "./orders-container"

export default async function OrdersManagementPage({
    searchParams
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    // ... metadata and fetch logic remains ...
    const params = await searchParams
    const query = params.q as string
    const statusFilter = params.status as string || "all"
    const supabase = await createClient()

    // 1. Admin-only access check
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        redirect('/login')
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'admin') {
        redirect('/')
    }

    // 2. Fetch counts for each status
    const { data: countsData } = await supabase
        .from('orders')
        .select('status')

    const counts: Record<string, number> = {
        all: 0,
        pending: 0,
        processing: 0,
        shipped: 0,
        delivered: 0,
        "on-hold": 0,
        completed: 0,
        cancelled: 0,
        refunded: 0,
        archived: 0
    }

    countsData?.forEach(order => {
        if (order.status !== 'archived') counts.all++
        if (counts[order.status] !== undefined) {
            counts[order.status]++
        }
    })

    // 3. Fetch orders with filtering
    let supabaseQuery = supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })

    // Extended Status filtering
    if (statusFilter === "all" || !statusFilter) {
        supabaseQuery = supabaseQuery.neq('status', 'archived')
    } else {
        supabaseQuery = supabaseQuery.eq('status', statusFilter)
    }

    // Search filtering
    if (query) {
        supabaseQuery = supabaseQuery.or(`email.ilike.%${query}%,id.string.ilike.%${query}%`)
    }

    const { data: orders, error: ordersError } = await supabaseQuery

    if (ordersError) {
        console.error("Error fetching orders:", ordersError)
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-bold tracking-tighter text-zinc-900">Orders</h1>
                    <p className="text-zinc-500 text-sm font-medium">Manage and track customer purchases across your store.</p>
                </div>
                <div className="flex items-center gap-3">
                    <ExportOrdersButton orders={orders || []} />
                    <Link href="/admin/orders/new">
                        <Button className="rounded-2xl h-11 px-6 font-bold uppercase tracking-widest text-[11px] gap-2 shadow-lg shadow-black/5 transition-all hover:scale-[1.02] active:scale-95">
                            <Plus className="h-4 w-4" />
                            Add Order
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Table Area managed by Client Container for Performance */}
            <OrdersTableContainer
                initialOrders={orders || []}
                initialCounts={counts}
            />
        </div>
    )
}
