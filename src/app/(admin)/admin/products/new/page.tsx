"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Info, Package, Tag, Layers, Settings2, ImagePlus, Upload, ImageIcon, Loader2, X } from "lucide-react"
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
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { createProduct } from "./actions"
import { toast } from "sonner"
import { MediaGalleryModal } from "@/components/admin/media-gallery-modal"

export default function AddProductPage() {
    const router = useRouter()
    const [isPending, startTransition] = React.useTransition()
    const [title, setTitle] = React.useState("")
    const [slug, setSlug] = React.useState("")
    const [description, setDescription] = React.useState("")
    const [price, setPrice] = React.useState("")
    const [stock, setStock] = React.useState("")
    const [status, setStatus] = React.useState("draft")
    const [category, setCategory] = React.useState("")
    const [selectedTags, setSelectedTags] = React.useState<string[]>([])
    const [imageUrl, setImageUrl] = React.useState("")
    const [galleryImages, setGalleryImages] = React.useState<string[]>([])
    const [isGalleryOpen, setIsGalleryOpen] = React.useState(false)
    const [isGalleryCollectionOpen, setIsGalleryCollectionOpen] = React.useState(false)
    const [categories, setCategories] = React.useState<{ id: string, name: string, slug: string }[]>([])
    const [availableTags, setAvailableTags] = React.useState<{ id: string, name: string }[]>([])
    const [brand, setBrand] = React.useState("none")
    const [brands, setBrands] = React.useState<{ id: string, name: string, slug: string }[]>([])

    React.useEffect(() => {
        const fetchData = async () => {
            const supabase = createClient()
            const { data: categoriesData } = await supabase.from('categories').select('id, name, slug').order('name')
            const { data: tagsData } = await supabase.from('tags').select('id, name').order('name')
            const { data: brandsData } = await supabase.from('brands').select('id, name, slug').order('name')

            if (categoriesData) setCategories(categoriesData)
            if (tagsData) setAvailableTags(tagsData)
            if (brandsData) setBrands(brandsData)
        }
        fetchData()
    }, [])

    // Auto-generate slug from title
    React.useEffect(() => {
        const generatedSlug = title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '')
        setSlug(generatedSlug)
    }, [title])

    const handleTagChange = (tagName: string, checked: boolean) => {
        if (checked) {
            setSelectedTags(prev => [...prev, tagName])
        } else {
            setSelectedTags(prev => prev.filter(t => t !== tagName))
        }
    }

    const handleSave = () => {
        const formData = new FormData()
        formData.append("title", title)
        formData.append("slug", slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'))
        formData.append("description", description)
        formData.append("price", price)
        formData.append("stock", stock)
        formData.append("status", status)
        formData.append("category", category)
        formData.append("brand", brand)
        formData.append("tags", JSON.stringify(selectedTags))
        formData.append("featured_image", imageUrl)
        formData.append("gallery", JSON.stringify(galleryImages))

        startTransition(async () => {
            const result = await createProduct(null, formData)
            if (result?.error) {
                toast.error(typeof result.error === 'string' ? result.error : "Validation failed")
            } else {
                toast.success("Product created successfully!")
                // Small delay to let the toast be seen
                setTimeout(() => {
                    router.push('/admin/products')
                }, 1000)
            }
        })
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header omitted for brevity */}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Form Area */}
                <div className="lg:col-span-2 space-y-8">
                    {/* General Information omitted */}

                    {/* Product Media */}
                    <Card className="border-none shadow-sm rounded-[2rem] bg-white overflow-hidden">
                        <CardHeader className="border-b border-zinc-50 px-8 py-4">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-xl bg-zinc-900 flex items-center justify-center">
                                    <ImageIcon className="h-4 w-4 text-white" />
                                </div>
                                <CardTitle className="text-lg font-bold">Product Media</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="px-8 pb-8 pt-4 space-y-8">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                <div className="space-y-4 flex flex-col">
                                    <Label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Featured Image</Label>

                                    {imageUrl ? (
                                        <div className="group relative rounded-[2rem] overflow-hidden aspect-video border-2 border-zinc-100 bg-zinc-50">
                                            <img src={imageUrl} alt="Featured" className="w-full h-full object-cover" />
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
                                            className="flex-1 border-2 border-dashed border-zinc-100 rounded-[2rem] p-8 text-center hover:bg-zinc-50/50 transition-colors cursor-pointer group flex flex-col items-center justify-center min-h-[200px]"
                                        >
                                            <div className="h-12 w-12 bg-zinc-50 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                                                <ImagePlus className="h-6 w-6 text-zinc-300" />
                                            </div>
                                            <p className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
                                                Select Image
                                            </p>
                                            <p className="text-[10px] text-zinc-400 mt-1 uppercase tracking-tighter">Choose from library or upload</p>
                                        </div>
                                    )}

                                    <MediaGalleryModal
                                        open={isGalleryOpen}
                                        onOpenChange={setIsGalleryOpen}
                                        onSelect={(url) => setImageUrl(url)}
                                        bucket="products"
                                    />

                                </div>
                                <div className="space-y-4">
                                    <Label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Gallery Images</Label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div
                                            onClick={() => setIsGalleryCollectionOpen(true)}
                                            className="border-2 border-dashed border-zinc-100 rounded-[1.5rem] aspect-square flex flex-col items-center justify-center gap-1 hover:bg-zinc-50/50 transition-colors cursor-pointer text-zinc-300 group"
                                        >
                                            <Upload className="h-5 w-5 group-hover:scale-110 transition-transform" />
                                            <span className="text-[9px] font-bold uppercase tracking-tighter">Add</span>
                                        </div>

                                        {galleryImages.map((img, idx) => (
                                            <div key={idx} className="relative group rounded-[1.5rem] overflow-hidden aspect-square flex items-center justify-center bg-zinc-50 border border-zinc-100">
                                                <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            setGalleryImages(prev => prev.filter((_, i) => i !== idx))
                                                        }}
                                                        className="h-8 w-8 rounded-full p-0"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <MediaGalleryModal
                                        open={isGalleryCollectionOpen}
                                        onOpenChange={setIsGalleryCollectionOpen}
                                        onSelect={(url) => setGalleryImages(prev => [...prev, url])}
                                        bucket="products"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Pricing & Inventory */}
                    <Card className="border-none shadow-sm rounded-[2rem] bg-white overflow-hidden">
                        <CardHeader className="border-b border-zinc-50 px-8 py-4">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-xl bg-zinc-900 flex items-center justify-center">
                                    <Package className="h-4 w-4 text-white" />
                                </div>
                                <CardTitle className="text-lg font-bold">Pricing & Inventory</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="px-8 pb-8 pt-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="price" className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Base Price ($) <span className="text-red-500">*</span></Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        placeholder="0.00"
                                        className="h-12 rounded-2xl border-zinc-100 bg-zinc-50/50 focus-visible:ring-1 focus-visible:ring-zinc-200"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="stock" className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Stock Quantity <span className="text-red-500">*</span></Label>
                                    <Input
                                        id="stock"
                                        type="number"
                                        value={stock}
                                        onChange={(e) => setStock(e.target.value)}
                                        placeholder="0"
                                        className="h-12 rounded-2xl border-zinc-100 bg-zinc-50/50 focus-visible:ring-1 focus-visible:ring-zinc-200"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar area for Organization & Status */}
                <div className="space-y-8">
                    {/* Status Card */}
                    <Card className="border-none shadow-sm rounded-[2rem] bg-white overflow-hidden">
                        <CardHeader className="border-b border-zinc-50 px-8 py-4">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-xl bg-zinc-900 flex items-center justify-center">
                                    <Settings2 className="h-4 w-4 text-white" />
                                </div>
                                <CardTitle className="text-lg font-bold">Status</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="px-8 pb-8 pt-4">
                            <div className="space-y-4">
                                <Select value={status} onValueChange={setStatus}>
                                    <SelectTrigger className="h-12 rounded-2xl border-zinc-100 bg-zinc-50/50 focus:ring-1 focus:ring-zinc-200">
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl border-zinc-100 shadow-2xl">
                                        <SelectItem value="draft" className="rounded-xl">Draft</SelectItem>
                                        <SelectItem value="active" className="rounded-xl">Active</SelectItem>
                                        <SelectItem value="archived" className="rounded-xl">Archived</SelectItem>
                                    </SelectContent>
                                </Select>
                                <p className="text-[10px] text-zinc-400 font-medium px-2 italic">
                                    Update the product visibility in your store.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Organization Card */}
                    <Card className="border-none shadow-sm rounded-[2rem] bg-white overflow-hidden">
                        <CardHeader className="border-b border-zinc-50 px-8 py-4">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-xl bg-zinc-900 flex items-center justify-center">
                                    <Layers className="h-4 w-4 text-white" />
                                </div>
                                <CardTitle className="text-lg font-bold">Organization</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="px-8 pb-8 pt-4 space-y-8">
                            {/* Category Select */}
                            <div className="space-y-3">
                                <Label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Product Category</Label>
                                <Select value={category} onValueChange={setCategory}>
                                    <SelectTrigger className="h-12 rounded-2xl border-zinc-100 bg-zinc-50/50 focus:ring-1 focus:ring-zinc-200">
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl border-zinc-100 shadow-2xl">
                                        {categories.map(cat => (
                                            <SelectItem key={cat.id} value={cat.slug} className="rounded-xl">
                                                {cat.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Brand Select */}
                            <div className="space-y-3">
                                <Label className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Product Brand</Label>
                                <Select value={brand} onValueChange={setBrand}>
                                    <SelectTrigger className="h-12 rounded-2xl border-zinc-100 bg-zinc-50/50 focus:ring-1 focus:ring-zinc-200">
                                        <SelectValue placeholder="Select brand" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl border-zinc-100 shadow-2xl">
                                        <SelectItem value="none" className="rounded-xl text-zinc-400">None</SelectItem>
                                        {brands.map(b => (
                                            <SelectItem key={b.id} value={b.slug} className="rounded-xl">
                                                {b.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Tags Selection */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 mb-1">
                                    <Tag className="h-3 w-3 text-zinc-400" />
                                    <Label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Product Tags</Label>
                                </div>
                                <div className="grid grid-cols-1 gap-3 px-1">
                                    {availableTags.length === 0 ? (
                                        <p className="text-sm text-zinc-400 italic">No tags found. Create tags in the <Link href="/admin/tags" className="text-primary underline">Tags</Link> page.</p>
                                    ) : availableTags.map((tag) => (
                                        <div key={tag.id} className="flex items-center space-x-3 group cursor-pointer">
                                            <Checkbox
                                                id={tag.id}
                                                checked={selectedTags.includes(tag.name)}
                                                onCheckedChange={(checked) => handleTagChange(tag.name, checked as boolean)}
                                                className="rounded-md border-zinc-200 data-[state=checked]:bg-zinc-900 data-[state=checked]:border-zinc-900 transition-all"
                                            />
                                            <Label
                                                htmlFor={tag.id}
                                                className="text-sm font-medium text-zinc-600 group-hover:text-zinc-900 cursor-pointer transition-colors"
                                            >
                                                {tag.name}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Bottom Actions for Mobile */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t flex gap-4 z-50">
                <Button variant="outline" className="flex-1 h-12 rounded-2xl font-bold uppercase tracking-widest text-[11px]">
                    Discard
                </Button>
                <Button
                    onClick={handleSave}
                    disabled={isPending}
                    className="flex-1 h-12 rounded-2xl font-bold uppercase tracking-widest text-[11px] shadow-lg shadow-primary/20"
                >
                    {isPending ? "Saving..." : "Save Product"}
                </Button>
            </div>
        </div>
    )
}
