import { getSettings } from "@/actions/get-settings"
import SettingsForm from "./settings-form"

export const dynamic = "force-dynamic"

export default async function SettingsPage() {
    const settings = await getSettings()

    return <SettingsForm settings={settings} key={settings?.updated_at} />
}
