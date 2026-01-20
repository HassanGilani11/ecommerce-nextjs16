import { getSettings } from "@/actions/get-settings"
import { PaymentSettingsForm } from "./payment-settings-form"
import { CreditCard } from "lucide-react"

export default async function PaymentSettingsPage() {
    const settings = await getSettings()

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-2xl bg-zinc-900 flex items-center justify-center text-white shadow-lg shadow-black/20">
                        <CreditCard className="h-5 w-5" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tighter text-zinc-900">Payment Settings</h1>
                        <p className="text-sm font-medium text-zinc-500">Enable methods and configure your Stripe checkout gateway</p>
                    </div>
                </div>
            </div>

            <PaymentSettingsForm settings={settings} />
        </div>
    )
}
