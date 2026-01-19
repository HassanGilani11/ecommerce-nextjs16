import { getCouponById } from "@/app/actions/coupons"
import { CouponForm } from "../coupon-form"

interface PageProps {
    searchParams: Promise<{ id?: string }>
}

export default async function AddCouponPage({ searchParams }: PageProps) {
    const { id } = await searchParams

    let initialData = null
    if (id) {
        const { data } = await getCouponById(id)
        initialData = data
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <CouponForm initialData={initialData} />
        </div>
    )
}
