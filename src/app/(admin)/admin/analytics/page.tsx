import { getAnalyticsData } from "@/app/actions/admin-analytics"
import AnalyticsClient from "./analytics-client"

export const dynamic = "force-dynamic"

export default async function AnalyticsPage({
    searchParams
}: {
    searchParams: Promise<{ days?: string }>
}) {
    const { days: daysParam } = await searchParams
    const days = daysParam ? parseInt(daysParam) : 7
    const data = await getAnalyticsData(days)

    return <AnalyticsClient data={data} />
}
