"use client"

import { useState } from "react"
import { updatePaymentSettings } from "@/app/actions/payment-settings"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { Loader2, Save, Terminal, ShieldCheck, CreditCard, Banknote, Building2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function PaymentSettingsForm({ settings }: { settings: any }) {
    const [isLoading, setIsLoading] = useState(false)
    const [stripeTestMode, setStripeTestMode] = useState(settings?.stripe_test_mode ?? true)
    const [enableStripe, setEnableStripe] = useState(settings?.enable_stripe ?? true)
    const [enableCod, setEnableCod] = useState(settings?.enable_cod ?? true)
    const [enableBank, setEnableBank] = useState(settings?.enable_bank_transfer ?? false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)

        const formData = new FormData(e.currentTarget)
        formData.set("stripe_test_mode", stripeTestMode ? "on" : "off")
        formData.set("enable_stripe", enableStripe ? "on" : "off")
        formData.set("enable_cod", enableCod ? "on" : "off")
        formData.set("enable_bank_transfer", enableBank ? "on" : "off")

        const result = await updatePaymentSettings(formData)
        setIsLoading(false)

        if (result.success) {
            toast.success("Payment settings updated successfully")
        } else {
            toast.error(result.error || "Failed to update settings")
        }
    }

    return (
        <form onSubmit={handleSubmit} className="grid lg:grid-cols-12 gap-8 pb-20">
            <div className="lg:col-span-8 space-y-8">
                {/* Method Toggles */}
                <Card className="border-none shadow-xl shadow-zinc-200/50 rounded-3xl overflow-hidden">
                    <CardHeader className="bg-zinc-50/50 px-8 py-6">
                        <CardTitle className="text-xl font-black tracking-tight flex items-center gap-2">
                            <CreditCard className="h-5 w-5 text-zinc-400" />
                            Active Payment Methods
                        </CardTitle>
                        <CardDescription className="font-medium">Enable or disable methods shown to customers at checkout</CardDescription>
                    </CardHeader>
                    <CardContent className="px-8 py-8 space-y-6">
                        <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-2xl border border-zinc-100 transition-all hover:shadow-md hover:bg-white">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                                    <Building2 className="h-5 w-5 text-zinc-900" />
                                </div>
                                <div className="space-y-0.5">
                                    <Label className="text-base font-bold">Stripe Checkout</Label>
                                    <p className="text-xs text-muted-foreground font-medium">Accept Credit/Debit cards securely via Stripe</p>
                                </div>
                            </div>
                            <Switch checked={enableStripe} onCheckedChange={setEnableStripe} />
                        </div>

                        <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-2xl border border-zinc-100 transition-all hover:shadow-md hover:bg-white">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                                    <Banknote className="h-5 w-5 text-zinc-900" />
                                </div>
                                <div className="space-y-0.5">
                                    <Label className="text-base font-bold">Cash on Delivery (COD)</Label>
                                    <p className="text-xs text-muted-foreground font-medium">Customers pay upon physical delivery</p>
                                </div>
                            </div>
                            <Switch checked={enableCod} onCheckedChange={setEnableCod} />
                        </div>

                        <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-2xl border border-zinc-100 transition-all hover:shadow-md hover:bg-white">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                                    <Terminal className="h-5 w-5 text-zinc-900" />
                                </div>
                                <div className="space-y-0.5">
                                    <Label className="text-base font-bold">Direct Bank Transfer</Label>
                                    <p className="text-xs text-muted-foreground font-medium">Customers receive bank details to pay manually</p>
                                </div>
                            </div>
                            <Switch checked={enableBank} onCheckedChange={setEnableBank} />
                        </div>
                    </CardContent>
                </Card>

                {/* Stripe Configuration */}
                {enableStripe && (
                    <Card className="border-none shadow-xl shadow-zinc-200/50 rounded-3xl overflow-hidden animate-in fade-in duration-500">
                        <CardHeader className="bg-zinc-50/50 px-8 py-6 flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-xl font-black tracking-tight flex items-center gap-2">
                                    <ShieldCheck className="h-5 w-5 text-emerald-500" />
                                    Stripe Configuration
                                </CardTitle>
                                <CardDescription className="font-medium">Enter your Stripe dashboard API keys</CardDescription>
                            </div>
                            <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-zinc-100 shadow-sm">
                                <Label className="text-[10px] font-black uppercase tracking-widest">Test Mode</Label>
                                <Switch checked={stripeTestMode} onCheckedChange={setStripeTestMode} />
                            </div>
                        </CardHeader>
                        <CardContent className="px-8 py-8 space-y-8">
                            <Alert className="bg-amber-50 border-amber-200 rounded-2xl">
                                <Terminal className="h-4 w-4 text-amber-600" />
                                <AlertTitle className="text-amber-900 font-bold">Developer Notice</AlertTitle>
                                <AlertDescription className="text-amber-800 font-medium">
                                    Make sure to toggle Test Mode off when you are ready to accept real payments with Live Keys.
                                </AlertDescription>
                            </Alert>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <Label className="text-xs font-black uppercase tracking-widest text-zinc-500">Test Secret Key</Label>
                                    <Input
                                        name="stripe_test_secret_key"
                                        defaultValue={settings?.stripe_test_secret_key}
                                        placeholder="sk_test_..."
                                        type="password"
                                        className="rounded-xl h-12 bg-zinc-50/50"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-xs font-black uppercase tracking-widest text-zinc-500">Test Publishable Key</Label>
                                    <Input
                                        name="stripe_test_publishable_key"
                                        defaultValue={settings?.stripe_test_publishable_key}
                                        placeholder="pk_test_..."
                                        className="rounded-xl h-12 bg-zinc-50/50"
                                    />
                                </div>
                            </div>

                            <Separator className="bg-zinc-100" />

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <Label className="text-xs font-black uppercase tracking-widest text-zinc-500">Live Secret Key</Label>
                                    <Input
                                        name="stripe_live_secret_key"
                                        defaultValue={settings?.stripe_live_secret_key}
                                        placeholder="sk_live_..."
                                        type="password"
                                        className="rounded-xl h-12 bg-zinc-50/50"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-xs font-black uppercase tracking-widest text-zinc-500">Live Publishable Key</Label>
                                    <Input
                                        name="stripe_live_publishable_key"
                                        defaultValue={settings?.stripe_live_publishable_key}
                                        placeholder="pk_live_..."
                                        className="rounded-xl h-12 bg-zinc-50/50"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Bank Transfer Details */}
                {enableBank && (
                    <Card className="border-none shadow-xl shadow-zinc-200/50 rounded-3xl overflow-hidden animate-in fade-in duration-500">
                        <CardHeader className="bg-zinc-50/50 px-8 py-6">
                            <CardTitle className="text-xl font-black tracking-tight flex items-center gap-2">
                                <Terminal className="h-5 w-5 text-blue-500" />
                                Bank Transfer Instructions
                            </CardTitle>
                            <CardDescription className="font-medium">Details shown to customers for manual payment</CardDescription>
                        </CardHeader>
                        <CardContent className="px-8 py-8">
                            <div className="space-y-3">
                                <Label className="text-xs font-black uppercase tracking-widest text-zinc-500">Payment Instructions</Label>
                                <Textarea
                                    name="bank_transfer_details"
                                    defaultValue={settings?.bank_transfer_details}
                                    placeholder="Account Name: ...\nAccount Number: ...\nBank: ..."
                                    className="rounded-2xl min-h-[150px] bg-zinc-50/50 border-zinc-100"
                                />
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            <div className="lg:col-span-4">
                <div className="sticky top-24 space-y-6">
                    <Card className="border-none shadow-2xl shadow-zinc-900/10 rounded-3xl bg-zinc-900 text-white overflow-hidden">
                        <CardHeader className="p-8">
                            <CardTitle className="text-2xl font-black tracking-tighter">Save Changes</CardTitle>
                            <CardDescription className="text-zinc-400 font-medium">Your changes will be immediately reflected across the entire store.</CardDescription>
                        </CardHeader>
                        <CardContent className="px-8 pb-8 pt-0">
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-14 bg-white text-black hover:bg-zinc-200 rounded-2xl font-black uppercase tracking-widest transition-all shadow-lg active:scale-95"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Updating...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-5 w-5" />
                                        Update Settings
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>

                    <div className="bg-zinc-50 rounded-3xl p-6 border border-zinc-100 flex items-start gap-4">
                        <div className="h-10 w-10 rounded-2xl bg-white flex items-center justify-center shadow-sm shrink-0">
                            <ShieldCheck className="h-5 w-5 text-emerald-500" />
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-sm font-black tracking-tight uppercase">Security Sync</h4>
                            <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                                Keys are stored securely in Supabase with RLS policies ensuring only administrators can access or modify them.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    )
}
