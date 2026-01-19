"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, User, Mail, Globe, Shield, Info, UserCheck, Loader2, MessageSquare, Upload, X, ImagePlus, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getCurrentProfile, updateUser, uploadAvatar } from "@/app/actions/admin-users"
import { toast } from "sonner"
import { MediaGalleryModal } from "@/components/admin/media-gallery-modal"

export default function ProfilePage() {
    const router = useRouter()
    const [loading, setLoading] = React.useState(true)
    const [saving, setSaving] = React.useState(false)
    const [uploading, setUploading] = React.useState(false)
    const [isGalleryOpen, setIsGalleryOpen] = React.useState(false)
    const [formData, setFormData] = React.useState<any>({
        id: "",
        full_name: "",
        username: "",
        email: "",
        password: "",
        role: "",
        status: "",
        website: "",
        first_name: "",
        last_name: "",
        avatar_url: "",
        post_count: 0,
        created_at: new Date().toISOString()
    })

    React.useEffect(() => {
        const fetchProfile = async () => {
            const data = await getCurrentProfile()
            if (data) {
                setFormData({
                    ...data,
                    full_name: data.full_name || "",
                    username: data.username || "",
                    email: data.email || "",
                    password: "",
                    role: data.role || "",
                    status: data.status || "",
                    website: data.website || "",
                    first_name: data.first_name || "",
                    last_name: data.last_name || "",
                    avatar_url: data.avatar_url || "",
                    post_count: data.post_count || 0,
                    created_at: data.created_at || new Date().toISOString()
                })
            } else {
                toast.error("Profile not found")
                router.push("/admin")
            }
            setLoading(false)
        }
        fetchProfile()
    }, [router])

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.username) {
            toast.error("Username is mandatory")
            return
        }
        if (!formData.email) {
            toast.error("Email Address is mandatory")
            return
        }

        setSaving(true)

        const result = await updateUser(formData.id, formData)

        if (result.success) {
            toast.success("Profile updated successfully")
            // Refresh to update header etc.
            window.location.reload()
        } else {
            toast.error(result.error || "Failed to update profile")
        }
        setSaving(false)
    }

    const getRoleLabel = (role: string) => {
        const roles: Record<string, string> = {
            admin: "System Administrator",
            shop_manager: "Shop Manager",
            editor: "Content Editor",
            moderator: "Moderator",
            author: "Author",
            customer: "Customer"
        }
        return roles[role] || role
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
            </div>
        )
    }

    return (
        <form onSubmit={handleSave} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin">
                        <Button type="button" variant="ghost" size="icon" className="rounded-2xl hover:bg-white shadow-sm border border-transparent hover:border-zinc-100 transition-all">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-4xl font-black tracking-tight text-zinc-900">My Profile</h1>
                        <p className="text-zinc-500 text-sm font-medium">Manage your personal account settings and identity.</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Link href="/admin">
                        <Button type="button" variant="ghost" className="rounded-2xl h-11 px-6 font-bold uppercase tracking-widest text-[11px] hover:bg-white text-zinc-500 hover:text-zinc-900">
                            Back
                        </Button>
                    </Link>
                    <Button
                        type="submit"
                        disabled={saving || uploading}
                        className="rounded-2xl h-11 px-8 bg-zinc-900 text-white font-bold uppercase tracking-widest text-[11px] gap-2 shadow-xl shadow-zinc-900/10 hover:scale-[1.02] active:scale-95 transition-all"
                    >
                        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        Update Profile
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-10">
                    {/* Account Details */}
                    <Card className="border-none shadow-[0_8px_40px_rgb(0,0,0,0.03)] rounded-[2.5rem] bg-white overflow-hidden">
                        <CardHeader className="border-b border-zinc-50 px-10 py-6">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-2xl bg-zinc-900 flex items-center justify-center">
                                    <User className="h-5 w-5 text-white" />
                                </div>
                                <CardTitle className="text-2xl font-black tracking-tight">Account Identity</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="px-10 pb-12 pt-6 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <Label htmlFor="username" className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">
                                        Username <span className="text-rose-500">*</span>
                                    </Label>
                                    <div className="relative group">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 font-bold text-sm">@</span>
                                        <Input
                                            id="username"
                                            value={formData.username || ""}
                                            readOnly
                                            className="h-14 pl-10 rounded-2xl border-zinc-100 bg-zinc-50/50 focus-visible:ring-0 font-bold text-zinc-500 cursor-not-allowed transition-all"
                                        />
                                        <Lock className="absolute right-5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-300" />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">
                                        Email Address <span className="text-rose-500">*</span>
                                    </Label>
                                    <div className="relative group">
                                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-zinc-400" />
                                        <Input
                                            id="email"
                                            type="email"
                                            value={formData.email || ""}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="h-14 pl-14 rounded-2xl border-zinc-100 bg-zinc-50/50 focus-visible:ring-zinc-200 font-bold text-zinc-900 transition-all group-hover:bg-zinc-50"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">
                                        Set New Password
                                    </Label>
                                    <div className="relative group">
                                        <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-zinc-400" />
                                        <Input
                                            id="password"
                                            type="password"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            placeholder="••••••••"
                                            className="h-14 pl-14 rounded-2xl border-zinc-100 bg-zinc-50/50 focus-visible:ring-zinc-200 font-bold text-zinc-900 transition-all group-hover:bg-zinc-50"
                                        />
                                    </div>
                                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest ml-1">Leave blank to keep current password</p>
                                </div>
                                <div className="space-y-3">
                                    <Label htmlFor="website" className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">Website</Label>
                                    <div className="relative group">
                                        <Globe className="absolute left-5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-zinc-400" />
                                        <Input
                                            id="website"
                                            value={formData.website || ""}
                                            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                            placeholder="https://yourportfolio.com"
                                            className="h-14 pl-14 rounded-2xl border-zinc-100 bg-zinc-50/50 focus-visible:ring-zinc-200 font-bold text-zinc-900 transition-all group-hover:bg-zinc-50"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <Label htmlFor="firstName" className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">First Name</Label>
                                    <Input
                                        id="firstName"
                                        value={formData.first_name || ""}
                                        onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                                        className="h-14 rounded-2xl border-zinc-100 bg-zinc-50/50 focus-visible:ring-zinc-200 font-bold text-zinc-900 transition-all"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <Label htmlFor="lastName" className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">Last Name</Label>
                                    <Input
                                        id="lastName"
                                        value={formData.last_name || ""}
                                        onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                                        className="h-14 rounded-2xl border-zinc-100 bg-zinc-50/50 focus-visible:ring-zinc-200 font-bold text-zinc-900 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">Profile Avatar</Label>
                                <div className="flex flex-col sm:flex-row gap-8 items-start sm:items-center">
                                    {formData.avatar_url ? (
                                        <div className="group relative rounded-[2.5rem] overflow-hidden aspect-square w-32 border-4 border-white shadow-xl bg-zinc-50 flex-shrink-0">
                                            <img src={formData.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-2">
                                                <Button type="button" size="sm" variant="secondary" onClick={() => setIsGalleryOpen(true)} className="rounded-full font-black text-[9px] uppercase tracking-[0.2em] h-7">
                                                    Change
                                                </Button>
                                                <Button type="button" size="sm" variant="destructive" onClick={() => setFormData({ ...formData, avatar_url: "" })} className="rounded-full h-7 w-7 p-0">
                                                    <X className="h-3.5 w-3.5" />
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div
                                            onClick={() => setIsGalleryOpen(true)}
                                            className="border-2 border-dashed border-zinc-200 rounded-[2.5rem] w-32 aspect-square flex flex-col items-center justify-center p-4 text-center hover:bg-zinc-50 hover:border-zinc-300 transition-all cursor-pointer group flex-shrink-0"
                                        >
                                            <div className="h-10 w-10 bg-zinc-50 rounded-2xl flex items-center justify-center mb-2 transition-transform group-hover:scale-110">
                                                <ImagePlus className="h-5 w-5 text-zinc-400" />
                                            </div>
                                            <p className="text-[8px] font-black text-zinc-900 uppercase tracking-widest leading-tight">Upload</p>
                                        </div>
                                    )}
                                    <div className="flex-1 w-full space-y-4">
                                        <p className="text-xs text-zinc-500 font-medium leading-relaxed">
                                            Update your circular avatar here. You can pick an image from your e-commerce media gallery or upload a new one directly.
                                        </p>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="h-11 px-6 rounded-2xl border-zinc-100 text-[10px] font-black uppercase tracking-widest hover:bg-white shadow-sm flex items-center gap-2"
                                            onClick={() => setIsGalleryOpen(true)}
                                        >
                                            <Upload className="h-4 w-4 mr-1" />
                                            Open Media Gallery
                                        </Button>
                                    </div>
                                </div>
                                <MediaGalleryModal
                                    open={isGalleryOpen}
                                    onOpenChange={setIsGalleryOpen}
                                    onSelect={(url) => setFormData({ ...formData, avatar_url: url })}
                                    bucket="profile"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-10">
                    {/* Role & Status (READ ONLY for self) */}
                    <Card className="border-none shadow-[0_8px_40px_rgb(0,0,0,0.03)] rounded-[2.5rem] bg-white overflow-hidden">
                        <CardHeader className="border-b border-zinc-50 px-8 py-6">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-2xl bg-zinc-900 flex items-center justify-center">
                                    <Shield className="h-5 w-5 text-white" />
                                </div>
                                <CardTitle className="text-xl font-black tracking-tight">Access Level</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="px-8 pb-10 pt-6 space-y-6">
                            <div className="space-y-4">
                                <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-100">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-2">Assigned Role</p>
                                    <Badge className="bg-zinc-900 hover:bg-zinc-900 text-white font-black uppercase tracking-widest text-[10px] py-1.5 px-3 rounded-lg shadow-sm">
                                        {getRoleLabel(formData.role)}
                                    </Badge>
                                </div>
                                <div className="p-5 rounded-2xl bg-emerald-50/40 border border-emerald-100/40">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600/60 mb-2">Account Status</p>
                                    <Badge className="bg-emerald-500 hover:bg-emerald-500 text-white font-black uppercase tracking-widest text-[10px] py-1.5 px-3 rounded-lg shadow-sm">
                                        {formData.status}
                                    </Badge>
                                </div>
                            </div>

                            <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100 flex gap-4">
                                <Info className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-amber-700">Self-Management</p>
                                    <p className="text-[11px] text-amber-600/80 font-medium leading-relaxed italic">
                                        You cannot change your own role or status for security reasons. Please contact another administrator for access changes.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Stats Card */}
                    <Card className="border-none shadow-[0_20px_50px_rgb(24,24,27,0.1)] rounded-[2.5rem] bg-zinc-900 text-white overflow-hidden p-10 relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl" />
                        <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center mb-8 relative">
                            <UserCheck className="h-7 w-7 text-white" />
                        </div>
                        <h3 className="text-2xl font-black tracking-tight mb-3 relative text-white">Profile Summary</h3>
                        <div className="space-y-4 pt-4 relative">
                            <div className="flex justify-between items-center text-[10px] text-zinc-400 font-black uppercase tracking-[0.2em] pb-3 border-b border-white/10">
                                <span>Platform Posts</span>
                                <span className="text-white text-lg">{formData.post_count || 0}</span>
                            </div>
                            <div className="flex flex-col gap-1 pt-2">
                                <span className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em]">Member Since</span>
                                <span className="text-sm font-bold text-white tracking-tight">{new Date(formData.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </form>
    )
}
