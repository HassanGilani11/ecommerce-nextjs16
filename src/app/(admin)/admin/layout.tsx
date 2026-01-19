import { getSettings } from "@/actions/get-settings"
import { getCurrentProfile } from "@/app/actions/admin-users"
import AdminShell from "./admin-shell"

export const dynamic = "force-dynamic"

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const settings = await getSettings()
    const user = await getCurrentProfile()

    return (
        <AdminShell settings={settings} user={user}>
            {children}
        </AdminShell>
    )
}
