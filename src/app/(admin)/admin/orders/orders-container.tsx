"use client"

import * as React from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { OrderTabs } from "./order-tabs"
import { OrdersTable } from "./orders-table"
import { OrdersSkeleton } from "./orders-skeleton"
import { SearchOrders } from "./search-orders"
import { Filter, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Order {
    id: string
    email: string
    total: number
    status: string
    created_at: string
}

interface OrdersTableContainerProps {
    initialOrders: Order[]
    initialCounts: Record<string, number>
}

export function OrdersTableContainer({ initialOrders, initialCounts }: OrdersTableContainerProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const [isPending, startTransition] = React.useTransition()

    // We use the initial orders from server, but the transition will handle the "refresh"
    // Next.js App Router keeps the client component state across RSC navigations
    // as long as the component is in the tree.

    return (
        <div className="bg-white rounded-[2rem] shadow-sm border border-zinc-100 overflow-hidden">
            <div className="flex flex-col lg:flex-row items-center gap-6 p-6 border-b border-zinc-50 bg-zinc-50/10">
                <OrderTabs
                    counts={initialCounts}
                    isTransitioning={isPending}
                    onStatusChange={(value) => {
                        const params = new URLSearchParams(searchParams.toString())
                        if (value === "all") {
                            params.delete("status")
                        } else {
                            params.set("status", value)
                        }

                        startTransition(() => {
                            router.push(`${pathname}?${params.toString()}`)
                        })
                    }}
                />
                <div className="flex-1 w-full flex flex-col sm:flex-row items-center gap-4">
                    <SearchOrders />
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Button variant="outline" className="flex-1 sm:flex-none rounded-xl h-11 px-4 gap-2 border-zinc-100 text-zinc-600 font-bold uppercase tracking-widest text-[10px] hover:bg-white transition-all">
                            <Filter className="h-3.5 w-3.5" />
                            Filter
                        </Button>
                        <Button variant="outline" className="flex-1 sm:flex-none rounded-xl h-11 px-4 gap-2 border-zinc-100 text-zinc-600 font-bold uppercase tracking-widest text-[10px] hover:bg-white transition-all">
                            <ArrowUpDown className="h-3.5 w-3.5" />
                            Sort
                        </Button>
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto relative min-h-[400px]">
                {/* 
                    When isPending is true, the RSC is re-rendering in the background.
                    We show the skeleton to give instant feedback.
                */}
                {isPending ? (
                    <div className="animate-in fade-in duration-300">
                        <OrdersSkeleton />
                    </div>
                ) : (
                    <div className="animate-in fade-in duration-300">
                        <OrdersTable orders={initialOrders} onActionStart={() => {
                            // We can also trigger transitions for actions if needed
                        }} />
                    </div>
                )}
            </div>

            <div className="p-6 border-t border-zinc-50 bg-zinc-50/30">
                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-[0.2em] text-center">
                    Securely processing orders via Stripe
                </p>
            </div>
        </div>
    )
}
