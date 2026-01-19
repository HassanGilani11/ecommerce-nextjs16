"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Info, Link as LinkIcon, ImagePlus, Award, Loader2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { updateBrand } from "./actions"
import { MediaGalleryModal } from "@/components/admin/media-gallery-modal"

interface EditBrandFormProps {
    brand: {
        id: string
        name: string
        slug: string
        description: string | null
        logo_url: string | null
    }
}

export default function EditBrandForm({ brand }: EditBrandFormProps) {
    const router = useRouter()
    const [isPending, startTransition] = React.useTransition()
    const [name, setName] = React.useState(brand.name)
    const [slug, setSlug] = React.useState(brand.slug)
    const [description, setDescription] = React.useState(brand.description || "")
    const [logoUrl, setLogoUrl] = React.useState(brand.logo_url || "")
    const [isGalleryOpen, setIsGalleryOpen] = React.useState(false)

    // Auto-generate slug from name if user hasn't manually edited slug (simplified: always update if slug matches generated format? No, just let user edit)
    // For edit mode, usually we don't auto-update slug unless explicitly requested, or we can just let user edit.
    // I will trigger slug update if name changes AND previously slug was also just the name-ified version? 
    // To keep it simple and safe for existing URLs, I won't auto-update slug on name change in Edit mode, unless user clears it.

    const handleSave = () => {
        const formData = new FormData()
        formData.append("name", name)
        formData.append("slug", slug)
        formData.append("description", description)
        formData.append("logo_url", logoUrl)

        startTransition(async () => {
            const result = await updateBrand(brand.id, null, formData)
            if (result?.error) {
                toast.error(typeof result.error === 'string' ? result.error : "Validation failed")
            } else {
                toast.success("Brand updated successfully!")
                router.refresh()
                setTimeout(() => {
                    router.push('/admin/brands')
                }, 1000)
            }
        })
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/brands">
                        <Button variant="ghost" size="icon" className="rounded-2xl hover:bg-white shadow-sm border border-transparent hover:border-zinc-100 transition-all">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tighter">Edit Brand</h1>
                        <p className="text-zinc-500 text-sm font-medium">Update brand details and assets.</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Link href="/admin/brands">
                        <Button variant="ghost" className="rounded-2xl h-11 px-6 font-bold uppercase tracking-widest text-[11px] hover:bg-white text-zinc-500 hover:text-zinc-900">
                            Discard
                        </Button>
                    </Link>
                    <Button
                        onClick={handleSave}
                        disabled={isPending}
                        className="rounded-2xl h-11 px-6 font-bold uppercase tracking-widest text-[11px] gap-2 shadow-lg shadow-black/5 hover:scale-[1.02] active:scale-95 transition-all"
                    >
                        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        Save Changes
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Basic Info */}
                    <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] rounded-[2.5rem] bg-white overflow-hidden">
                        <CardHeader className="border-b border-zinc-50 px-10 py-5">
                            <div className="flex items-center gap-3">
                                <div className="h-9 w-9 rounded-2xl bg-zinc-900 flex items-center justify-center">
                                    <Info className="h-4.5 w-4.5 text-white" />
                                </div>
                                <CardTitle className="text-xl font-black tracking-tight">Brand Identity</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="px-10 pb-10 pt-4 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                                <div className="space-y-2">
                                    <Label htmlFor="title" className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">Brand Name</Label>
                                    <Input
                                        id="title"
                                        placeholder="e.g. Nike, Apple, Sony"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="h-12 rounded-2xl border-zinc-100 bg-zinc-50/50 focus-visible:ring-1 focus-visible:ring-zinc-200 font-medium"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="slug" className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">Url Slug</Label>
                                    <div className="relative">
                                        <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
                                        <Input
                                            id="slug"
                                            placeholder="brand-name"
                                            value={slug}
                                            onChange={(e) => setSlug(e.target.value)}
                                            className="h-12 pl-11 rounded-2xl border-zinc-100 bg-zinc-50/50 focus-visible:ring-1 focus-visible:ring-zinc-200 font-medium"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description" className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">Brand Description</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Tell your customers about the history and quality of this brand..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="min-h-[160px] rounded-[1.5rem] border-zinc-100 bg-zinc-50/50 focus-visible:ring-1 focus-visible:ring-zinc-200 resize-none p-5 text-sm font-medium leading-relaxed"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                    {/* Media / Assets */}
                    <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] rounded-[2.5rem] bg-white overflow-hidden">
                        <CardHeader className="border-b border-zinc-50 px-8 py-5">
                            <div className="flex items-center gap-3">
                                <div className="h-9 w-9 rounded-2xl bg-zinc-900 flex items-center justify-center">
                                    <Award className="h-4.5 w-4.5 text-white" />
                                </div>
                                <CardTitle className="text-xl font-black tracking-tight">Brand Assets</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="px-8 pb-10 pt-4 space-y-6">
                            <div className="space-y-4">
                                <Label className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">Brand Logo</Label>

                                {logoUrl ? (
                                    <div className="group relative rounded-[2rem] overflow-hidden aspect-square border-2 border-zinc-100 bg-zinc-50">
                                        <img src={logoUrl} alt="Logo" className="w-full h-full object-contain p-4" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                            <Button size="sm" variant="secondary" onClick={() => setIsGalleryOpen(true)} className="rounded-full">
                                                Change
                                            </Button>
                                            <Button size="sm" variant="destructive" onClick={() => setLogoUrl("")} className="rounded-full">
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div
                                        onClick={() => setIsGalleryOpen(true)}
                                        className="border-2 border-dashed border-zinc-100 rounded-[2rem] aspect-square flex flex-col items-center justify-center p-8 text-center hover:bg-zinc-50/50 transition-colors cursor-pointer group"
                                    >
                                        <div className="h-16 w-16 bg-zinc-50 rounded-[1.5rem] flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                                            <ImagePlus className="h-8 w-8 text-zinc-300" />
                                        </div>
                                        <p className="text-xs font-black text-zinc-900 uppercase tracking-widest">Upload Logo</p>
                                        <p className="text-[10px] text-zinc-400 mt-2 font-medium leading-relaxed">
                                            Use a high-quality SVG or PNG with transparent background.
                                        </p>
                                    </div>
                                )}

                                <MediaGalleryModal
                                    open={isGalleryOpen}
                                    onOpenChange={setIsGalleryOpen}
                                    onSelect={(url) => setLogoUrl(url)}
                                    bucket="brands"
                                />
                            </div>

                            <div className="bg-zinc-50/50 rounded-2xl p-5 border border-zinc-100">
                                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">Pro Tip</p>
                                <p className="text-[11px] text-zinc-500 font-medium leading-relaxed italic">
                                    "Logos should be clear and minimalist to maintain the store's clean aesthetic."
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
