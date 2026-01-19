"use client"

import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DashboardReportProps {
    stats: {
        totalRevenue: number
        totalOrders: number
        activeUsers: number
        totalProducts: number
    }
    recentOrders: any[]
}

export function DashboardReportButton({ stats, recentOrders }: DashboardReportProps) {
    const handleDownload = () => {
        // 1. Dashboard Summary Section
        let csvContent = "AVANT-GARDE STORE REPORT\n"
        csvContent += `Generated at: ${new Date().toLocaleString()}\n\n`

        csvContent += "DASHBOARD SUMMARY\n"
        csvContent += "Metric,Value\n"
        csvContent += `Total Revenue,$${stats.totalRevenue.toFixed(2)}\n`
        csvContent += `Total Orders,${stats.totalOrders}\n`
        csvContent += `Active Users,${stats.activeUsers}\n`
        csvContent += `Total Products,${stats.totalProducts}\n\n`

        // 2. Recent Orders Section
        if (recentOrders && recentOrders.length > 0) {
            csvContent += "RECENT ORDERS\n"
            csvContent += "Order ID,Customer Email,Status,Total,Date\n"

            recentOrders.forEach(order => {
                csvContent += `${order.id.slice(0, 8).toUpperCase()},${order.email},${order.status.toUpperCase()},${order.total},${new Date(order.created_at).toLocaleDateString()}\n`
            })
        }

        // 3. Create download link
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.setAttribute("href", url)
        link.setAttribute("download", `avant_garde_report_${new Date().toISOString().split('T')[0]}.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    return (
        <Button
            onClick={handleDownload}
            variant="outline"
            className="rounded-2xl h-11 px-5 font-bold uppercase tracking-widest text-[10px] border-zinc-100 hover:bg-zinc-50 transition-all flex gap-2"
        >
            <Download className="h-3.5 w-3.5" />
            Download Report
        </Button>
    )
}
