"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useTransition } from "react"
import { cn } from "@/lib/utils"

const STATUSES = [
    { label: "All", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "Processing", value: "processing" },
    { label: "Shipped", value: "shipped" },
    { label: "Delivered", value: "delivered" },
    { label: "On hold", value: "on-hold" },
    { label: "Completed", value: "completed" },
    { label: "Cancelled", value: "cancelled" },
    { label: "Refunded", value: "refunded" },
    { label: "Archived", value: "archived" },
]

interface OrderTabsProps {
    counts: Record<string, number>
    isTransitioning?: boolean
    onStatusChange?: (value: string) => void
}

export function OrderTabs({ counts, isTransitioning, onStatusChange }: OrderTabsProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [localIsPending, startLocalTransition] = useTransition()
    const urlStatus = searchParams.get("status") || "all"

    // Optimistic state to ensure highlight moves INSTANTLY
    const [optimisticStatus, setOptimisticStatus] = React.useState(urlStatus)

    // Sync optimistic state if searchParams change (e.g. back/forward button)
    React.useEffect(() => {
        setOptimisticStatus(urlStatus)
    }, [urlStatus])

    const handleStatusChange = (value: string) => {
        // Update highlight instantly
        setOptimisticStatus(value)

        if (onStatusChange) {
            onStatusChange(value)
            return
        }

        const params = new URLSearchParams(searchParams.toString())
        if (value === "all") {
            params.delete("status")
        } else {
            params.set("status", value)
        }

        startLocalTransition(() => {
            router.push(`/admin/orders?${params.toString()}`)
        })
    }

    const pending = isTransitioning || localIsPending

    return (
        <div className={cn(
            "flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-bold transition-opacity duration-300",
            pending ? "opacity-60" : "opacity-100"
        )}>
            {STATUSES.map((status, index) => (
                <div key={status.value} className="flex items-center">
                    <button
                        onClick={() => handleStatusChange(status.value)}
                        className={cn(
                            "hover:text-zinc-900 transition-all py-1 px-2 rounded-md active:scale-95",
                            optimisticStatus === status.value
                                ? "text-zinc-900 bg-zinc-100 shadow-sm"
                                : "text-zinc-400"
                        )}
                    >
                        {status.label} <span className="opacity-50 font-medium ml-0.5">({counts[status.value] || 0})</span>
                    </button>
                    {index < STATUSES.length - 1 && (
                        <span className="text-zinc-200 ml-2">|</span>
                    )}
                </div>
            ))}
        </div>
    )
}
