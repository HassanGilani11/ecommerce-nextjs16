"use client"

import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ExportOrdersButton({ orders }: { orders: any[] }) {
    const handleExport = () => {
        if (!orders || orders.length === 0) return

        // Define CSV headers
        const headers = ["Order ID", "Customer Email", "Date", "Total Amount", "Status", "Shipping Address", "Billing Address"]

        // Map data to CSV rows
        const rows = orders.map(order => [
            order.id.slice(0, 8).toUpperCase(),
            order.email,
            new Date(order.created_at).toLocaleDateString(),
            order.total,
            order.status.toUpperCase(),
            `"${order.shipping_address?.replace(/"/g, '""')}"`,
            `"${order.billing_address?.replace(/"/g, '""')}"`
        ])

        // Combine into CSV string
        const csvContent = [
            headers.join(","),
            ...rows.map(row => row.join(","))
        ].join("\n")

        // Create download link
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.setAttribute("href", url)
        link.setAttribute("download", `orders_export_${new Date().toISOString().split('T')[0]}.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    return (
        <Button
            onClick={handleExport}
            variant="outline"
            className="rounded-2xl h-11 px-6 font-bold uppercase tracking-widest text-[11px] gap-2 border-zinc-200 hover:bg-white shadow-sm transition-all hover:scale-[1.02] active:scale-95"
        >
            <Download className="h-4 w-4" />
            Export Orders
        </Button>
    )
}
