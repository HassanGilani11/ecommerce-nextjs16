"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowLeft, Save, Info, Layers, Link as LinkIcon, ImagePlus, Loader2, X } from "lucide-react"
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
import { CATEGORIES } from "@/lib/data"
import { createCategory } from "../actions"
import { toast } from "sonner"
import { MediaGalleryModal } from "@/components/admin/media-gallery-modal"
import { createClient } from "@/lib/supabase/client"

export default function AddCategoryPage() {
    const [isPending, startTransition] = React.useTransition()
    const [name, setName] = React.useState("")
    const [slug, setSlug] = React.useState("")
    const [description, setDescription] = React.useState("")
    const [parent, setParent] = React.useState("none")
    const [imageUrl, setImageUrl] = React.useState("")
    const [isGalleryOpen, setIsGalleryOpen] = React.useState(false)
    const [parentCategories, setParentCategories] = React.useState<{ id: string, name: string }[]>([])

    // Fetch parent categories on mount
    React.useEffect(() => {
        const fetchParents = async () => {
            const supabase = createClient()
            const { data } = await supabase.from('categories').select('id, name').order('name')
            if (data) setParentCategories(data)
        }
        fetchParents()
    }, [])

    // Auto-generate slug from name
    React.useEffect(() => {
        const generatedSlug = name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '')
        setSlug(generatedSlug)
    }, [name])

    const handleSave = () => {
        const formData = new FormData()
        formData.append("name", name)
        formData.append("slug", slug || name.toLowerCase().replace(/\s+/g, '-'))
        formData.append("description", description)
        if (imageUrl) formData.append("image", imageUrl)
        if (parent !== "none") formData.append("parent_id", parent)

        startTransition(async () => {
            const result = await createCategory(null, formData)
            if (result?.error) {
                toast.error(typeof result.error === 'string' ? result.error : "Validation failed")
            } else {
                toast.success("Category created successfully")
            }
        })
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/categories">
                        <Button variant="ghost" size="icon" className="rounded-2xl hover:bg-white shadow-sm border border-transparent hover:border-zinc-100 transition-all">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tighter">Add Category</h1>
                        <p className="text-zinc-500 text-sm">Create a new category to organize your products.</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Link href="/admin/categories">
                        <Button variant="ghost" className="rounded-2xl h-11 px-6 font-bold uppercase tracking-widest text-[11px]">
                            Discard
                        </Button>
                    </Link>
                    <Button
                        onClick={handleSave}
                        disabled={isPending}
                        className="rounded-2xl h-11 px-6 font-bold uppercase tracking-widest text-[11px] gap-2 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                    >
                        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        Save Category
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="md:col-span-2 space-y-8">
                    {/* Basic Info */}
                    <Card className="border-none shadow-sm rounded-[2.5rem] bg-white overflow-hidden">
                        <CardHeader className="border-b border-zinc-50 px-10 py-5">
                            <div className="flex items-center gap-3">
                                <div className="h-9 w-9 rounded-2xl bg-zinc-900 flex items-center justify-center">
                                    <Info className="h-4.5 w-4.5 text-white" />
                                </div>
                                <CardTitle className="text-xl font-bold tracking-tight">Basic Details</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="px-10 pb-10 pt-4 space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="title" className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Category Title <span className="text-red-500">*</span></Label>
                                <Input
                                    id="title"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. Summer Collection"
                                    className="h-12 rounded-2xl border-zinc-100 bg-zinc-50/50 focus-visible:ring-1 focus-visible:ring-zinc-200"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="slug" className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Category Slug</Label>
                                <div className="relative">
                                    <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
                                    <Input
                                        id="slug"
                                        value={slug}
                                        onChange={(e) => setSlug(e.target.value)}
                                        placeholder="summer-collection"
                                        className="h-12 pl-11 rounded-2xl border-zinc-100 bg-zinc-50/50 focus-visible:ring-1 focus-visible:ring-zinc-200"
                                    />
                                </div>
                                <p className="text-[10px] text-zinc-400 font-medium px-2 italic">
                                    The slug is used for the category URL. Use only lowercase and hyphens.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description" className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Description</Label>
                                <Textarea
                                    id="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="A brief description of this category..."
                                    className="min-h-[140px] rounded-[1.5rem] border-zinc-100 bg-zinc-50/50 focus-visible:ring-1 focus-visible:ring-zinc-200 resize-none p-5"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                    {/* Organization */}
                    <Card className="border-none shadow-sm rounded-[2.5rem] bg-white overflow-hidden">
                        <CardHeader className="border-b border-zinc-50 px-10 py-5">
                            <div className="flex items-center gap-3">
                                <div className="h-9 w-9 rounded-2xl bg-zinc-900 flex items-center justify-center">
                                    <Layers className="h-4.5 w-4.5 text-white" />
                                </div>
                                <CardTitle className="text-xl font-bold tracking-tight">Organization</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="px-10 pb-10 pt-4 space-y-8">
                            <div className="space-y-3">
                                <Label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Parent Category</Label>
                                <Select value={parent} onValueChange={setParent}>
                                    <SelectTrigger className="h-12 rounded-2xl border-zinc-100 bg-zinc-50/50 focus:ring-1 focus:ring-zinc-200">
                                        <SelectValue placeholder="None (Top Level)" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl border-zinc-100 shadow-2xl">
                                        <SelectItem value="none" className="rounded-xl">None (Top Level)</SelectItem>
                                        {parentCategories.map(cat => (
                                            <SelectItem key={cat.id} value={cat.id} className="rounded-xl">
                                                {cat.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-4">
                                <Label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Banner Image</Label>
                                {imageUrl ? (
                                    <div className="group relative rounded-[2rem] overflow-hidden aspect-square border-2 border-zinc-100 bg-zinc-50">
                                        <img src={imageUrl} alt="Banner" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                            <Button size="sm" variant="secondary" onClick={() => setIsGalleryOpen(true)} className="rounded-full">
                                                Change
                                            </Button>
                                            <Button size="sm" variant="destructive" onClick={() => setImageUrl("")} className="rounded-full">
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div
                                        onClick={() => setIsGalleryOpen(true)}
                                        className="border-2 border-dashed border-zinc-100 rounded-[2rem] aspect-square flex flex-col items-center justify-center p-6 text-center hover:bg-zinc-50/50 transition-colors cursor-pointer group"
                                    >
                                        <div className="h-14 w-14 bg-zinc-50 rounded-[1.25rem] flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                                            <ImagePlus className="h-7 w-7 text-zinc-300" />
                                        </div>
                                        <p className="text-xs font-bold text-zinc-900 uppercase tracking-widest">Upload Cover</p>
                                        <p className="text-[10px] text-zinc-400 mt-1 uppercase tracking-tighter">Recommended: 1200 x 600px</p>
                                    </div>
                                )}
                                <MediaGalleryModal
                                    open={isGalleryOpen}
                                    onOpenChange={setIsGalleryOpen}
                                    onSelect={(url) => setImageUrl(url)}
                                    bucket="categories"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
