import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getCoupons } from "@/app/actions/coupons"
import { CouponsTable } from "./coupons-table"

export const dynamic = "force-dynamic"

export default async function CouponsPage() {
    const { data: coupons = [] } = await getCoupons()

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-bold tracking-tighter">Coupon Management</h1>
                    <p className="text-zinc-500 text-sm font-medium">Create and oversee promotional discounts and rewards.</p>
                </div>
                <Link href="/admin/coupons/new">
                    <Button className="rounded-2xl h-11 px-6 font-bold uppercase tracking-widest text-[11px] gap-2 shadow-lg shadow-black/5 transition-all hover:scale-[1.02] active:scale-95">
                        <Plus className="h-4 w-4" />
                        Create Coupon
                    </Button>
                </Link>
            </div>

            {/* Table Area */}
            <CouponsTable coupons={coupons} />
        </div>
    )
}
