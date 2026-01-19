import { getSettings } from "@/actions/get-settings"
import AdminShell from "./admin-shell"

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const settings = await getSettings()

    return (
        <AdminShell settings={settings}>
            {children}
        </AdminShell>
    )
}
