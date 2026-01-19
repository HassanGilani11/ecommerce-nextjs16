"use client"

import { useActionState, useEffect } from "react"
import { toast } from "sonner"
import {
    Save,
    Settings2,
    Globe,
    Layout,
    Mail,
    Clock,
    Calendar,
    ImagePlus,
    Zap,
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
    Share2,
    Eye,
    Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { updateSettings } from "./actions"

const initialState: { error?: string; success?: string } = {}

export default function SettingsForm({ settings }: { settings: any }) {
    const [state, action, isPending] = useActionState(updateSettings, initialState)

    useEffect(() => {
        if (state?.error) {
            toast.error(state.error)
        }
        if (state?.success) {
            toast.success(state.success)
        }
    }, [state])

    return (
        <form action={action} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tighter">Site Settings</h1>
                    <p className="text-zinc-500 text-sm font-medium">Configure your store's global parameters and identity.</p>
                </div>
                <Button
                    disabled={isPending}
                    type="submit"
                    className="rounded-2xl h-11 px-8 font-bold uppercase tracking-widest text-[11px] gap-2 shadow-lg shadow-black/5 hover:scale-[1.02] active:scale-95 transition-all"
                >
                    {isPending ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="h-4 w-4" />
                            Save All Changes
                        </>
                    )}
                </Button>
            </div>

            <Tabs defaultValue="general" className="space-y-8">
                <TabsList className="bg-white border border-zinc-100 p-1.5 rounded-2xl h-auto flex flex-wrap gap-1 shadow-sm w-fit">
                    <TabsTrigger value="general" className="rounded-xl px-6 py-2.5 text-xs font-bold uppercase tracking-widest data-[state=active]:bg-zinc-900 data-[state=active]:text-white transition-all">
                        General
                    </TabsTrigger>
                    <TabsTrigger value="seo" className="rounded-xl px-6 py-2.5 text-xs font-bold uppercase tracking-widest data-[state=active]:bg-zinc-900 data-[state=active]:text-white transition-all">
                        SEO & Meta
                    </TabsTrigger>
                    <TabsTrigger value="social" className="rounded-xl px-6 py-2.5 text-xs font-bold uppercase tracking-widest data-[state=active]:bg-zinc-900 data-[state=active]:text-white transition-all">
                        Social Links
                    </TabsTrigger>
                    <TabsTrigger value="advanced" className="rounded-xl px-6 py-2.5 text-xs font-bold uppercase tracking-widest data-[state=active]:bg-zinc-900 data-[state=active]:text-white transition-all">
                        Advanced
                    </TabsTrigger>
                </TabsList>

                {/* General Settings */}
                <TabsContent value="general" className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-8">
                            <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] rounded-[2.5rem] bg-white overflow-hidden">
                                <CardHeader className="border-b border-zinc-50 px-10 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-9 w-9 rounded-2xl bg-zinc-900 flex items-center justify-center">
                                            <Layout className="h-4.5 w-4.5 text-white" />
                                        </div>
                                        <CardTitle className="text-xl font-black tracking-tight">Site Identity</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="px-10 pb-10 pt-4 space-y-6">
                                    <div className="space-y-2 pt-2">
                                        <Label htmlFor="site_title" className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">Site Title</Label>
                                        <Input
                                            id="site_title"
                                            name="site_title"
                                            defaultValue={settings?.site_title}
                                            className="h-12 rounded-2xl border-zinc-100 bg-zinc-50/50 focus-visible:ring-1 focus-visible:ring-zinc-200 font-bold"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="site_tagline" className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">Tagline</Label>
                                        <Input
                                            id="site_tagline"
                                            name="site_tagline"
                                            defaultValue={settings?.site_tagline}
                                            className="h-12 rounded-2xl border-zinc-100 bg-zinc-50/50 focus-visible:ring-1 focus-visible:ring-zinc-200 font-medium"
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="admin_email" className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">Administration Email</Label>
                                            <div className="relative">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                                                <Input
                                                    id="admin_email"
                                                    name="admin_email"
                                                    defaultValue={settings?.admin_email}
                                                    className="h-12 pl-11 rounded-2xl border-zinc-100 bg-zinc-50/50 focus-visible:ring-1 focus-visible:ring-zinc-200 font-medium"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="default_role" className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">Default User Role</Label>
                                            <Select name="default_role" defaultValue={settings?.default_role || "customer"}>
                                                <SelectTrigger className="h-12 rounded-2xl border-zinc-100 bg-zinc-50/50 font-medium">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-2xl border-zinc-100 shadow-2xl">
                                                    <SelectItem value="customer" className="rounded-xl">Customer</SelectItem>
                                                    <SelectItem value="subscriber" className="rounded-xl">Subscriber</SelectItem>
                                                    <SelectItem value="contributor" className="rounded-xl">Contributor</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] rounded-[2.5rem] bg-white overflow-hidden">
                                <CardHeader className="border-b border-zinc-50 px-10 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-9 w-9 rounded-2xl bg-zinc-900 flex items-center justify-center">
                                            <Clock className="h-4.5 w-4.5 text-white" />
                                        </div>
                                        <CardTitle className="text-xl font-black tracking-tight">Localization</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="px-10 pb-10 pt-4 space-y-6">
                                    <div className="space-y-4 pt-2">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="timezone" className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">Timezone</Label>
                                                <Select name="timezone" defaultValue={settings?.timezone || "utc-0"}>
                                                    <SelectTrigger className="h-12 rounded-2xl border-zinc-100 bg-zinc-50/50 font-medium">
                                                        <Globe className="h-4 w-4 mr-2 text-zinc-400" />
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent className="rounded-2xl border-zinc-100 shadow-2xl">
                                                        <SelectItem value="utc-0" className="rounded-xl">UTC+0 (London)</SelectItem>
                                                        <SelectItem value="utc-5" className="rounded-xl">UTC-5 (New York)</SelectItem>
                                                        <SelectItem value="utc+8" className="rounded-xl">UTC+8 (Singapore)</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2 md:col-span-1">
                                                <Label htmlFor="date_format" className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">Date Format</Label>
                                                <Select name="date_format" defaultValue={settings?.date_format || "f1"}>
                                                    <SelectTrigger className="h-12 rounded-2xl border-zinc-100 bg-zinc-50/50 font-medium">
                                                        <Calendar className="h-4 w-4 mr-2 text-zinc-400" />
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent className="rounded-2xl border-zinc-100 shadow-2xl">
                                                        <SelectItem value="f1" className="rounded-xl">January 13, 2026</SelectItem>
                                                        <SelectItem value="f2" className="rounded-xl">2026-01-13</SelectItem>
                                                        <SelectItem value="f3" className="rounded-xl">13/01/2026</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="time_format" className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">Time Format</Label>
                                                <Select name="time_format" defaultValue={settings?.time_format || "t1"}>
                                                    <SelectTrigger className="h-12 rounded-2xl border-zinc-100 bg-zinc-50/50 font-medium">
                                                        <Clock className="h-4 w-4 mr-2 text-zinc-400" />
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent className="rounded-2xl border-zinc-100 shadow-2xl">
                                                        <SelectItem value="t1" className="rounded-xl">5:40 PM</SelectItem>
                                                        <SelectItem value="t2" className="rounded-xl">17:40</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="space-y-8">
                            <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] rounded-[2.5rem] bg-white overflow-hidden">
                                <CardHeader className="border-b border-zinc-50 px-8 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-9 w-9 rounded-2xl bg-zinc-900 flex items-center justify-center">
                                            <ImagePlus className="h-4.5 w-4.5 text-white" />
                                        </div>
                                        <CardTitle className="text-xl font-black tracking-tight">Site Assets</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="px-8 pb-8 pt-4 space-y-6">
                                    <div className="space-y-2 pt-2">
                                        <Label className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">Site Icon (Favicon)</Label>
                                        <div className="border-2 border-dashed border-zinc-100 rounded-[2rem] p-8 text-center hover:bg-zinc-50/50 transition-colors cursor-pointer group flex flex-col items-center justify-center aspect-square">
                                            <div className="h-12 w-12 bg-zinc-50 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-sm">
                                                <ImagePlus className="h-5 w-5 text-zinc-300" />
                                            </div>
                                            <p className="text-[10px] font-black text-zinc-900 uppercase tracking-widest">Favicon</p>
                                            <p className="text-[9px] text-zinc-400 mt-1 uppercase tracking-tighter">Recommended: 512x512px</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>

                {/* SEO Settings */}
                <TabsContent value="seo" className="animate-in fade-in zoom-in-95 duration-500">
                    <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] rounded-[2.5rem] bg-white overflow-hidden">
                        <CardHeader className="border-b border-zinc-50 px-10 py-4">
                            <div className="flex items-center gap-3">
                                <div className="h-9 w-9 rounded-2xl bg-zinc-900 flex items-center justify-center">
                                    <Settings2 className="h-4.5 w-4.5 text-white" />
                                </div>
                                <CardTitle className="text-xl font-black tracking-tight">Global Meta Data</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="px-10 pb-10 pt-4 space-y-8">
                            <div className="space-y-2">
                                <Label htmlFor="meta_title" className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">Default Meta Title</Label>
                                <div className="relative">
                                    <Eye className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                                    <Input
                                        id="meta_title"
                                        name="meta_title"
                                        defaultValue={settings?.meta_title}
                                        placeholder="Site Title - Premium High-End Fashion"
                                        className="h-12 pl-11 rounded-2xl border-zinc-100 bg-zinc-50/50 focus-visible:ring-1 focus-visible:ring-zinc-200 font-medium"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="meta_description" className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">Meta Description</Label>
                                <Textarea
                                    id="meta_description"
                                    name="meta_description"
                                    defaultValue={settings?.meta_description}
                                    placeholder="Enter a default description for search engines..."
                                    className="min-h-[120px] rounded-[1.5rem] border-zinc-100 bg-zinc-50/50 focus-visible:ring-1 focus-visible:ring-zinc-200 resize-none p-5 font-medium"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="meta_keywords" className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">Meta Keywords</Label>
                                <Input
                                    id="meta_keywords"
                                    name="meta_keywords"
                                    defaultValue={settings?.meta_keywords}
                                    placeholder="fashion, ecommerce, luxury, apparel"
                                    className="h-12 rounded-2xl border-zinc-100 bg-zinc-50/50 focus-visible:ring-1 focus-visible:ring-zinc-200 font-medium"
                                />
                                <p className="text-[10px] text-zinc-400 font-medium px-2 italic pt-1">Separate keywords with commas.</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Social Settings */}
                <TabsContent value="social" className="animate-in fade-in zoom-in-95 duration-500">
                    <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] rounded-[2.5rem] bg-white overflow-hidden">
                        <CardHeader className="border-b border-zinc-50 px-10 py-4">
                            <div className="flex items-center gap-3">
                                <div className="h-9 w-9 rounded-2xl bg-zinc-900 flex items-center justify-center">
                                    <Share2 className="h-4.5 w-4.5 text-white" />
                                </div>
                                <CardTitle className="text-xl font-black tracking-tight">Social Networks</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="px-10 pb-10 pt-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="facebook_url" className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">Facebook URL</Label>
                                        <div className="relative">
                                            <Facebook className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                                            <Input name="facebook_url" defaultValue={settings?.facebook_url} placeholder="https://facebook.com/your-store" className="h-12 pl-11 rounded-2xl border-zinc-100 bg-zinc-50/50" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="twitter_url" className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">Twitter URL</Label>
                                        <div className="relative">
                                            <Twitter className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                                            <Input name="twitter_url" defaultValue={settings?.twitter_url} placeholder="https://twitter.com/your-store" className="h-12 pl-11 rounded-2xl border-zinc-100 bg-zinc-50/50" />
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="instagram_url" className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">Instagram URL</Label>
                                        <div className="relative">
                                            <Instagram className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                                            <Input name="instagram_url" defaultValue={settings?.instagram_url} placeholder="https://instagram.com/your-store" className="h-12 pl-11 rounded-2xl border-zinc-100 bg-zinc-50/50" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="linkedin_url" className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">LinkedIn URL</Label>
                                        <div className="relative">
                                            <Linkedin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                                            <Input name="linkedin_url" defaultValue={settings?.linkedin_url} placeholder="https://linkedin.com/company/your-store" className="h-12 pl-11 rounded-2xl border-zinc-100 bg-zinc-50/50" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Advanced Settings */}
                <TabsContent value="advanced" className="animate-in fade-in zoom-in-95 duration-500">
                    <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] rounded-[2.5rem] bg-white overflow-hidden">
                        <CardHeader className="border-b border-zinc-50 px-10 py-4">
                            <div className="flex items-center gap-3">
                                <div className="h-9 w-9 rounded-2xl bg-zinc-900 flex items-center justify-center">
                                    <Zap className="h-4.5 w-4.5 text-white" />
                                </div>
                                <CardTitle className="text-xl font-black tracking-tight">System Controls</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="px-10 pb-10 pt-4 divide-y divide-zinc-50">
                            <div className="flex items-center justify-between py-6">
                                <div className="space-y-1">
                                    <p className="text-sm font-black text-zinc-900 uppercase tracking-tight">Maintenance Mode</p>
                                    <p className="text-[11px] text-zinc-500 font-medium">Temporarily disable the store front for customers.</p>
                                </div>
                                <Switch name="maintenance_mode" defaultChecked={settings?.maintenance_mode} className="data-[state=checked]:bg-zinc-900" />
                            </div>
                            <div className="flex items-center justify-between py-6">
                                <div className="space-y-1">
                                    <p className="text-sm font-black text-zinc-900 uppercase tracking-tight">Enable Registration</p>
                                    <p className="text-[11px] text-zinc-500 font-medium">Allow new customers to create accounts.</p>
                                </div>
                                <Switch name="enable_registration" defaultChecked={settings?.enable_registration} className="data-[state=checked]:bg-zinc-900" />
                            </div>
                            <div className="flex items-center justify-between py-6">
                                <div className="space-y-1">
                                    <p className="text-sm font-black text-zinc-900 uppercase tracking-tight">Store Notifications</p>
                                    <p className="text-[11px] text-zinc-500 font-medium">Send automated emails for orders and account alerts.</p>
                                </div>
                                <Switch name="store_notifications" defaultChecked={settings?.store_notifications} className="data-[state=checked]:bg-zinc-900" />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </form>
    )
}
