"use client"

import { Search } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useTransition, useEffect, useState } from "react"

export function SearchOrders() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [isPending, startTransition] = useTransition()
    const [query, setQuery] = useState(searchParams.get("q") || "")

    useEffect(() => {
        const timeout = setTimeout(() => {
            const params = new URLSearchParams(searchParams.toString())
            if (query) {
                params.set("q", query)
            } else {
                params.delete("q")
            }

            startTransition(() => {
                router.push(`/admin/orders?${params.toString()}`)
            })
        }, 300)

        return () => clearTimeout(timeout)
    }, [query, router, searchParams])

    return (
        <div className="relative flex-1 w-full">
            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors ${isPending ? 'text-zinc-900 animate-pulse' : 'text-zinc-400'}`} />
            <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by order ID or customer..."
                className="w-full pl-11 h-11 rounded-xl border border-zinc-100 bg-zinc-50/50 focus:outline-none focus:ring-1 focus:ring-zinc-200 text-sm transition-all"
            />
        </div>
    )
}
