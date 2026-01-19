"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, User, Mail, Globe, Shield, Info, UserCheck, Loader2, MessageSquare, Upload, X, ImagePlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createUser, uploadAvatar } from "@/app/actions/admin-users"
import { toast } from "sonner"
import { MediaGalleryModal } from "@/components/admin/media-gallery-modal"

export default function AddUserPage() {
    const router = useRouter()
    const [saving, setSaving] = React.useState(false)
    const [uploading, setUploading] = React.useState(false)
    const fileInputRef = React.useRef<HTMLInputElement>(null)
    const [isGalleryOpen, setIsGalleryOpen] = React.useState(false)
    const [formData, setFormData] = React.useState({
        username: "",
        email: "",
        first_name: "",
        last_name: "",
        full_name: "",
        website: "",
        avatar_url: "",
        post_count: 0,
        role: "customer",
        status: "active"
    })

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setUploading(true)
        const fd = new FormData()
        fd.append('file', file)

        const result = await uploadAvatar(fd)
        if (result.url) {
            setFormData({ ...formData, avatar_url: result.url })
            toast.success("Avatar uploaded successfully")
        } else {
            toast.error(result.error || "Upload failed")
        }
        setUploading(false)
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.email) {
            toast.error("Email is required")
            return
        }

        setSaving(true)
        const result = await createUser(formData)

        if (result.success) {
            toast.success("User profile created successfully")
            router.push("/admin/users")
        } else {
            toast.error(result.error || "Failed to create user")
        }
        setSaving(false)
    }

    return (
        <form onSubmit={handleSave} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/users">
                        <Button type="button" variant="ghost" size="icon" className="rounded-2xl hover:bg-white shadow-sm border border-transparent hover:border-zinc-100 transition-all">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tighter">Add User</h1>
                        <p className="text-zinc-500 text-sm font-medium">Create a new account profile with specific roles.</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Link href="/admin/users">
                        <Button type="button" variant="ghost" className="rounded-2xl h-11 px-6 font-bold uppercase tracking-widest text-[11px] hover:bg-white text-zinc-500 hover:text-zinc-900">
                            Discard
                        </Button>
                    </Link>
                    <Button
                        type="submit"
                        disabled={saving || uploading}
                        className="rounded-2xl h-11 px-6 font-bold uppercase tracking-widest text-[11px] gap-2 shadow-lg shadow-black/5 hover:scale-[1.02] active:scale-95 transition-all"
                    >
                        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        Save User
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Account Details */}
                    <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] rounded-[2.5rem] bg-white overflow-hidden">
                        <CardHeader className="border-b border-zinc-50 px-10 py-5">
                            <div className="flex items-center gap-3">
                                <div className="h-9 w-9 rounded-2xl bg-zinc-900 flex items-center justify-center">
                                    <User className="h-4.5 w-4.5 text-white" />
                                </div>
                                <CardTitle className="text-xl font-black tracking-tight">Account Identity</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="px-10 pb-10 pt-4 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                                <div className="space-y-2">
                                    <Label htmlFor="username" className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">Username</Label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 font-bold text-xs">@</span>
                                        <Input
                                            id="username"
                                            value={formData.username}
                                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                            placeholder="johndoe"
                                            className="h-12 pl-8 rounded-2xl border-zinc-100 bg-zinc-50/50 focus-visible:ring-1 focus-visible:ring-zinc-200 font-medium"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">Email Address</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                                        <Input
                                            id="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            placeholder="john@example.com"
                                            required
                                            className="h-12 pl-11 rounded-2xl border-zinc-100 bg-zinc-50/50 focus-visible:ring-1 focus-visible:ring-zinc-200 font-medium"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <Label className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">Profile Avatar</Label>
                                    <div className="flex flex-col gap-4">
                                        {formData.avatar_url ? (
                                            <div className="group relative rounded-[2rem] overflow-hidden aspect-square max-w-[200px] border-2 border-zinc-100 bg-zinc-50">
                                                <img src={formData.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                    <Button type="button" size="sm" variant="secondary" onClick={() => setIsGalleryOpen(true)} className="rounded-full font-bold text-[10px] uppercase tracking-widest">
                                                        Change
                                                    </Button>
                                                    <Button type="button" size="sm" variant="destructive" onClick={() => setFormData({ ...formData, avatar_url: "" })} className="rounded-full">
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div
                                                onClick={() => setIsGalleryOpen(true)}
                                                className="border-2 border-dashed border-zinc-100 rounded-[2rem] aspect-square max-w-[200px] flex flex-col items-center justify-center p-6 text-center hover:bg-zinc-50/50 transition-colors cursor-pointer group"
                                            >
                                                <div className="h-14 w-14 bg-zinc-50 rounded-[1.25rem] flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                                                    <ImagePlus className="h-7 w-7 text-zinc-300" />
                                                </div>
                                                <p className="text-xs font-bold text-zinc-900 uppercase tracking-widest">Upload Avatar</p>
                                                <p className="text-[10px] text-zinc-400 mt-1 uppercase tracking-tighter">JPG, PNG, WEBP</p>
                                            </div>
                                        )}
                                        <div className="flex-1 space-y-2">
                                            <div className="flex gap-2">
                                                <Input
                                                    id="avatar_url"
                                                    value={formData.avatar_url || ""}
                                                    onFocus={() => setIsGalleryOpen(true)}
                                                    readOnly
                                                    placeholder="Select from Media Gallery..."
                                                    className="h-11 rounded-2xl border-zinc-100 bg-zinc-50/50 text-xs font-medium cursor-pointer"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    className="h-11 px-4 rounded-2xl border-zinc-100 text-zinc-600 hover:bg-white shadow-sm"
                                                    onClick={() => setIsGalleryOpen(true)}
                                                >
                                                    <Upload className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            <p className="text-[10px] text-zinc-400 font-medium ml-1">Click to open media gallery or upload new images.</p>
                                        </div>
                                    </div>
                                    <MediaGalleryModal
                                        open={isGalleryOpen}
                                        onOpenChange={setIsGalleryOpen}
                                        onSelect={(url) => setFormData({ ...formData, avatar_url: url })}
                                        bucket="profile"
                                    />
                                </div>
                                <div className="space-y-4">
                                    <Label htmlFor="postCount" className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">Initial Post Count</Label>
                                    <div className="relative">
                                        <MessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                                        <Input
                                            id="postCount"
                                            type="number"
                                            value={formData.post_count}
                                            onChange={(e) => setFormData({ ...formData, post_count: parseInt(e.target.value) })}
                                            className="h-12 pl-11 rounded-2xl border-zinc-100 bg-zinc-50/50 focus-visible:ring-1 focus-visible:ring-zinc-200 font-medium"
                                        />
                                    </div>
                                    <p className="text-[10px] text-zinc-400 font-medium ml-1">Set the starting post count for this user.</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName" className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">First Name</Label>
                                    <Input
                                        id="firstName"
                                        value={formData.first_name}
                                        onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                                        placeholder="John"
                                        className="h-12 rounded-2xl border-zinc-100 bg-zinc-50/50 focus-visible:ring-1 focus-visible:ring-zinc-200 font-medium"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName" className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">Last Name</Label>
                                    <Input
                                        id="lastName"
                                        value={formData.last_name}
                                        onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                                        placeholder="Doe"
                                        className="h-12 rounded-2xl border-zinc-100 bg-zinc-50/50 focus-visible:ring-1 focus-visible:ring-zinc-200 font-medium"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="fullName" className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">Full Display Name</Label>
                                <Input
                                    id="fullName"
                                    value={formData.full_name}
                                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                    placeholder="John Doe"
                                    className="h-12 rounded-2xl border-zinc-100 bg-zinc-50/50 focus-visible:ring-1 focus-visible:ring-zinc-200 font-medium"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="website" className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">Website (Optional)</Label>
                                <div className="relative">
                                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                                    <Input
                                        id="website"
                                        value={formData.website}
                                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                        placeholder="https://example.com"
                                        className="h-12 pl-11 rounded-2xl border-zinc-100 bg-zinc-50/50 focus-visible:ring-1 focus-visible:ring-zinc-200 font-medium"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 flex gap-4">
                        <Info className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-bold text-amber-900">Important Note</p>
                            <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                                Creating a user profile here does not automatically create a login account.
                                The user must still register or be invited via Supabase Auth with this email address to access the account.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                    {/* Role Assignment */}
                    <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] rounded-[2.5rem] bg-white overflow-hidden">
                        <CardHeader className="border-b border-zinc-50 px-8 py-5">
                            <div className="flex items-center gap-3">
                                <div className="h-9 w-9 rounded-2xl bg-zinc-900 flex items-center justify-center">
                                    <Shield className="h-4.5 w-4.5 text-white" />
                                </div>
                                <CardTitle className="text-xl font-black tracking-tight">Access Control</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="px-8 pb-10 pt-4 space-y-6">
                            <div className="space-y-4 pt-2">
                                <Label className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">Primary Role</Label>
                                <Select
                                    value={formData.role}
                                    onValueChange={(val) => setFormData({ ...formData, role: val })}
                                >
                                    <SelectTrigger className="h-12 rounded-2xl border-zinc-100 bg-zinc-50/50 focus:ring-1 focus:ring-zinc-200 font-medium">
                                        <SelectValue placeholder="Select a role" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl border-zinc-100 shadow-2xl">
                                        <SelectItem value="admin" className="rounded-xl">Administrator</SelectItem>
                                        <SelectItem value="moderator" className="rounded-xl">Moderator</SelectItem>
                                        <SelectItem value="customer" className="rounded-xl">Customer</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="bg-zinc-50/50 rounded-2xl p-5 border border-zinc-100 space-y-3">
                                <div className="flex items-center gap-2">
                                    <Info className="h-3.5 w-3.5 text-zinc-400" />
                                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Permission Note</p>
                                </div>
                                <p className="text-[11px] text-zinc-500 font-medium leading-relaxed italic">
                                    "Administrator role grants full access to all store settings and financial data. Use with caution."
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Stats Placeholder */}
                    <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] rounded-[2.5rem] bg-zinc-900 text-white overflow-hidden p-8">
                        <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center mb-6">
                            <UserCheck className="h-6 w-6 text-zinc-400" />
                        </div>
                        <h3 className="text-xl font-bold tracking-tight mb-2">Account Ready?</h3>
                        <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                            Double check all details before saving. New users will receive a welcome email to verify their account.
                        </p>
                        <Badge variant="outline" className="rounded-lg border-white/10 bg-white/5 text-white py-1 px-3 text-[10px] font-bold uppercase tracking-widest">
                            New Account Profile
                        </Badge>
                    </Card>
                </div>
            </div>
        </form>
    )
}
