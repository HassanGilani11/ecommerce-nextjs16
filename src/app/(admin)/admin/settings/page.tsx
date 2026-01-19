import { createClient } from "@/lib/supabase/server"
import SettingsForm from "./settings-form"

export const dynamic = "force-dynamic"

export default async function SettingsPage() {
    const supabase = await createClient()
    const { data: settings } = await supabase
        .from('settings')
        .select('*')
        .single() // Should return the single row with id=1

    return <SettingsForm settings={settings} key={settings?.updated_at} />
}
