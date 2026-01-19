"use client"

import { useActionState, useEffect, useState } from "react"
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
    Loader2,
    X,
    Upload
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
import { MediaGalleryModal } from "@/components/admin/media-gallery-modal"

const initialState: { error?: string; success?: string } = {}

export default function SettingsForm({ settings }: { settings: any }) {
    const [state, action, isPending] = useActionState(updateSettings, initialState)
    const [isGalleryOpen, setIsGalleryOpen] = useState(false)

    // Controlled form state
    const [formData, setFormData] = useState({
        site_title: settings?.site_title || "",
        site_tagline: settings?.site_tagline || "",
        admin_email: settings?.admin_email || "",
        default_role: settings?.default_role || "customer",
        timezone: settings?.timezone || "utc-0",
        date_format: settings?.date_format || "f1",
        time_format: settings?.time_format || "t1",
        favicon_url: settings?.favicon_url || "",
        meta_title: settings?.meta_title || "",
        meta_description: settings?.meta_description || "",
        meta_keywords: settings?.meta_keywords || "",
        facebook_url: settings?.facebook_url || "",
        twitter_url: settings?.twitter_url || "",
        instagram_url: settings?.instagram_url || "",
        linkedin_url: settings?.linkedin_url || "",
        maintenance_mode: settings?.maintenance_mode || false,
        enable_registration: settings?.enable_registration || false,
        store_notifications: settings?.store_notifications || false,
    })

    useEffect(() => {
        if (state?.error) {
            toast.error(state.error)
        }
        if (state?.success) {
            toast.success(state.success)
        }
    }, [state])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSwitchChange = (name: string, checked: boolean) => {
        setFormData(prev => ({ ...prev, [name]: checked }))
    }

    return (
        <form key={settings?.id + settings?.updated_at} action={action} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Hidden Input for Favicon */}
            <input type="hidden" name="favicon_url" value={formData.favicon_url} />

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
                <TabsContent value="general" forceMount className="space-y-8 animate-in fade-in zoom-in-95 duration-500 data-[state=inactive]:hidden">
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
                                            value={formData.site_title}
                                            onChange={handleChange}
                                            className="h-12 rounded-2xl border-zinc-100 bg-zinc-50/50 focus-visible:ring-1 focus-visible:ring-zinc-200 font-bold"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="site_tagline" className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">Tagline</Label>
                                        <Input
                                            id="site_tagline"
                                            name="site_tagline"
                                            value={formData.site_tagline}
                                            onChange={handleChange}
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
                                                    value={formData.admin_email}
                                                    onChange={handleChange}
                                                    className="h-12 pl-11 rounded-2xl border-zinc-100 bg-zinc-50/50 focus-visible:ring-1 focus-visible:ring-zinc-200 font-medium"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="default_role" className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">Default User Role</Label>
                                            <Select name="default_role" value={formData.default_role} onValueChange={(val) => handleSelectChange("default_role", val)}>
                                                <SelectTrigger className="h-12 rounded-2xl border-zinc-100 bg-zinc-50/50 font-medium">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-2xl border-zinc-100 shadow-2xl">
                                                    <SelectItem value="customer" className="rounded-xl">Customer</SelectItem>
                                                    <SelectItem value="subscriber" className="rounded-xl">Subscriber</SelectItem>
                                                    <SelectItem value="contributor" className="rounded-xl">Contributor</SelectItem>
                                                    <SelectItem value="editor" className="rounded-xl">Editor</SelectItem>
                                                    <SelectItem value="admin" className="rounded-xl">Admin</SelectItem>
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
                                                <Select name="timezone" value={formData.timezone} onValueChange={(val) => handleSelectChange("timezone", val)}>
                                                    <SelectTrigger className="h-12 rounded-2xl border-zinc-100 bg-zinc-50/50 font-medium">
                                                        <Globe className="h-4 w-4 mr-2 text-zinc-400" />
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent className="rounded-2xl border-zinc-100 shadow-2xl">
                                                        <SelectItem value="utc-0" className="rounded-xl">UTC+0 (London)</SelectItem>
                                                        <SelectItem value="utc-5" className="rounded-xl">UTC-5 (New York)</SelectItem>
                                                        <SelectItem value="utc+8" className="rounded-xl">UTC+8 (Singapore)</SelectItem>
                                                        <SelectItem value="utc+5" className="rounded-xl">UTC+5 (Islamabad)</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2 md:col-span-1">
                                                <Label htmlFor="date_format" className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">Date Format</Label>
                                                <Select name="date_format" value={formData.date_format} onValueChange={(val) => handleSelectChange("date_format", val)}>
                                                    <SelectTrigger className="h-12 rounded-2xl border-zinc-100 bg-zinc-50/50 font-medium">
                                                        <Calendar className="h-4 w-4 mr-2 text-zinc-400" />
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent className="rounded-2xl border-zinc-100 shadow-2xl">
                                                        <SelectItem value="f1" className="rounded-xl">January 13, 2026</SelectItem>
                                                        <SelectItem value="f2" className="rounded-xl">2026-01-13</SelectItem>
                                                        <SelectItem value="f3" className="rounded-xl">13/01/2026</SelectItem>
                                                        <SelectItem value="f4" className="rounded-xl">DD-MM-YYYY</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="time_format" className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">Time Format</Label>
                                                <Select name="time_format" value={formData.time_format} onValueChange={(val) => handleSelectChange("time_format", val)}>
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
                                        <div
                                            onClick={() => setIsGalleryOpen(true)}
                                            className="border-2 border-dashed border-zinc-100 rounded-[2rem] p-8 text-center hover:bg-zinc-50/50 transition-colors cursor-pointer group flex flex-col items-center justify-center aspect-square relative overflow-hidden"
                                        >
                                            {formData.favicon_url ? (
                                                <>
                                                    <img src={formData.favicon_url} alt="Favicon" className="w-full h-full object-contain p-4" />
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                        <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center">
                                                            <Upload className="h-5 w-5 text-zinc-900" />
                                                        </div>
                                                        <Button
                                                            type="button"
                                                            size="icon"
                                                            variant="destructive"
                                                            className="h-10 w-10 rounded-full"
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                setFormData(prev => ({ ...prev, favicon_url: "" }))
                                                            }}
                                                        >
                                                            <X className="h-5 w-5" />
                                                        </Button>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="h-12 w-12 bg-zinc-50 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-sm">
                                                        <ImagePlus className="h-5 w-5 text-zinc-300" />
                                                    </div>
                                                    <p className="text-[10px] font-black text-zinc-900 uppercase tracking-widest">Favicon</p>
                                                    <p className="text-[9px] text-zinc-400 mt-1 uppercase tracking-tighter">Recommended: 512x512px</p>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>

                {/* SEO Settings */}
                <TabsContent value="seo" forceMount className="animate-in fade-in zoom-in-95 duration-500 data-[state=inactive]:hidden">
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
                                        value={formData.meta_title}
                                        onChange={handleChange}
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
                                    value={formData.meta_description}
                                    onChange={handleChange}
                                    placeholder="Enter a default description for search engines..."
                                    className="min-h-[120px] rounded-[1.5rem] border-zinc-100 bg-zinc-50/50 focus-visible:ring-1 focus-visible:ring-zinc-200 resize-none p-5 font-medium"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="meta_keywords" className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">Meta Keywords</Label>
                                <Input
                                    id="meta_keywords"
                                    name="meta_keywords"
                                    value={formData.meta_keywords}
                                    onChange={handleChange}
                                    placeholder="fashion, ecommerce, luxury, apparel"
                                    className="h-12 rounded-2xl border-zinc-100 bg-zinc-50/50 focus-visible:ring-1 focus-visible:ring-zinc-200 font-medium"
                                />
                                <p className="text-[10px] text-zinc-400 font-medium px-2 italic pt-1">Separate keywords with commas.</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Social Settings */}
                <TabsContent value="social" forceMount className="animate-in fade-in zoom-in-95 duration-500 data-[state=inactive]:hidden">
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
                                            <Input name="facebook_url" value={formData.facebook_url} onChange={handleChange} placeholder="https://facebook.com/your-store" className="h-12 pl-11 rounded-2xl border-zinc-100 bg-zinc-50/50" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="twitter_url" className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">Twitter URL</Label>
                                        <div className="relative">
                                            <Twitter className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                                            <Input name="twitter_url" value={formData.twitter_url} onChange={handleChange} placeholder="https://twitter.com/your-store" className="h-12 pl-11 rounded-2xl border-zinc-100 bg-zinc-50/50" />
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="instagram_url" className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">Instagram URL</Label>
                                        <div className="relative">
                                            <Instagram className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                                            <Input name="instagram_url" value={formData.instagram_url} onChange={handleChange} placeholder="https://instagram.com/your-store" className="h-12 pl-11 rounded-2xl border-zinc-100 bg-zinc-50/50" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="linkedin_url" className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">LinkedIn URL</Label>
                                        <div className="relative">
                                            <Linkedin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                                            <Input name="linkedin_url" value={formData.linkedin_url} onChange={handleChange} placeholder="https://linkedin.com/company/your-store" className="h-12 pl-11 rounded-2xl border-zinc-100 bg-zinc-50/50" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Advanced Settings */}
                <TabsContent value="advanced" forceMount className="animate-in fade-in zoom-in-95 duration-500 data-[state=inactive]:hidden">
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
                                <input type="hidden" name="maintenance_mode" value={formData.maintenance_mode ? "on" : "off"} />
                                <Switch checked={formData.maintenance_mode} onCheckedChange={(val) => handleSwitchChange("maintenance_mode", val)} className="data-[state=checked]:bg-zinc-900" />
                            </div>
                            <div className="flex items-center justify-between py-6">
                                <div className="space-y-1">
                                    <p className="text-sm font-black text-zinc-900 uppercase tracking-tight">Enable Registration</p>
                                    <p className="text-[11px] text-zinc-500 font-medium">Allow new customers to create accounts.</p>
                                </div>
                                <input type="hidden" name="enable_registration" value={formData.enable_registration ? "on" : "off"} />
                                <Switch checked={formData.enable_registration} onCheckedChange={(val) => handleSwitchChange("enable_registration", val)} className="data-[state=checked]:bg-zinc-900" />
                            </div>
                            <div className="flex items-center justify-between py-6">
                                <div className="space-y-1">
                                    <p className="text-sm font-black text-zinc-900 uppercase tracking-tight">Store Notifications</p>
                                    <p className="text-[11px] text-zinc-500 font-medium">Send automated emails for orders and account alerts.</p>
                                </div>
                                <input type="hidden" name="store_notifications" value={formData.store_notifications ? "on" : "off"} />
                                <Switch checked={formData.store_notifications} onCheckedChange={(val) => handleSwitchChange("store_notifications", val)} className="data-[state=checked]:bg-zinc-900" />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <MediaGalleryModal
                open={isGalleryOpen}
                onOpenChange={setIsGalleryOpen}
                onSelect={(url) => setFormData(prev => ({ ...prev, favicon_url: url }))}
                bucket="assets"
            />
        </form>
    )
}
