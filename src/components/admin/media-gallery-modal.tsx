"use client"

import * as React from "react"
import { Check, ImagePlus, Loader2, RefreshCw, Trash2, Upload, ImageIcon, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface MediaGalleryModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSelect: (url: string) => void
    bucket?: string
}

interface StorageFile {
    name: string
    id: string
    metadata: Record<string, any>
}

export function MediaGalleryModal({ open, onOpenChange, onSelect, bucket = 'products' }: MediaGalleryModalProps) {
    const [activeTab, setActiveTab] = React.useState("library")
    const [images, setImages] = React.useState<StorageFile[]>([])
    const [isLoading, setIsLoading] = React.useState(false)
    const [isUploading, setIsUploading] = React.useState(false)
    const [selectedImage, setSelectedImage] = React.useState<string | null>(null)
    const [currentBucket, setCurrentBucket] = React.useState(bucket)

    const supabase = createClient()
    // Available buckets
    const BUCKETS = ['products', 'categories', 'brands', 'profile']

    // Reset current bucket when modal opens or prop changes
    React.useEffect(() => {
        if (open) {
            setCurrentBucket(bucket)
            setSelectedImage(null) // Reset selection on open
        }
    }, [open, bucket])

    const fetchImages = React.useCallback(async () => {
        setIsLoading(true)
        try {
            const { data, error } = await supabase.storage.from(currentBucket).list('', {
                limit: 100,
                offset: 0,
                sortBy: { column: 'created_at', order: 'desc' },
            })

            if (error) throw error
            setImages(data || [])
        } catch (error: any) {
            console.error("Error fetching images:", error)
        } finally {
            setIsLoading(false)
        }
    }, [currentBucket])

    React.useEffect(() => {
        if (open && activeTab === "library") {
            fetchImages()
        }
    }, [open, activeTab, fetchImages, currentBucket])

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setIsUploading(true)
        try {
            const fileExt = file.name.split('.').pop()
            const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
            const filePath = `${fileName}`

            const targetBucket = bucket

            const { error: uploadError } = await supabase.storage
                .from(targetBucket)
                .upload(filePath, file)

            if (uploadError) throw uploadError

            toast.success("Image uploaded successfully")

            setActiveTab("library")
            setCurrentBucket(targetBucket)

        } catch (error: any) {
            console.error(error)
            toast.error("Upload failed: " + (error.message || "Unknown error"))
        } finally {
            setIsUploading(false)
        }
    }

    const getPublicUrl = (path: string) => {
        const { data } = supabase.storage.from(currentBucket).getPublicUrl(path)
        return data.publicUrl
    }

    const handleSelect = () => {
        if (selectedImage) {
            onSelect(getPublicUrl(selectedImage))
            onOpenChange(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-4xl h-[85vh] flex flex-col p-0 gap-0 bg-white overflow-hidden rounded-[2.5rem] border-none shadow-2xl">
                <div className="px-10 py-6 border-b border-zinc-50 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-20">
                    <div>
                        <DialogTitle className="text-2xl font-black tracking-tight">Media Gallery</DialogTitle>
                        <DialogDescription className="text-zinc-500 font-medium">Select assets from {currentBucket} or other buckets.</DialogDescription>
                    </div>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
                    <div className="px-10 py-4 flex items-center justify-between gap-4 bg-zinc-50/30">
                        <TabsList className="grid w-48 grid-cols-2 rounded-2xl bg-zinc-100/80 p-1.5 backdrop-blur-sm">
                            <TabsTrigger value="library" className="rounded-xl font-bold uppercase tracking-widest text-[10px]">Library</TabsTrigger>
                            <TabsTrigger value="upload" className="rounded-xl font-bold uppercase tracking-widest text-[10px]">Upload</TabsTrigger>
                        </TabsList>

                        {activeTab === 'library' && (
                            <Select value={currentBucket} onValueChange={setCurrentBucket}>
                                <SelectTrigger className="w-[200px] h-11 rounded-2xl border-none bg-white shadow-sm font-black uppercase tracking-widest text-[10px] text-zinc-600 focus:ring-1 focus:ring-zinc-200">
                                    <SelectValue placeholder="Select Bucket" />
                                </SelectTrigger>
                                <SelectContent className="rounded-[1.5rem] shadow-2xl border-none p-2">
                                    {BUCKETS.map(b => (
                                        <SelectItem key={b} value={b} className="text-[10px] font-black uppercase tracking-widest rounded-xl cursor-pointer py-3">
                                            {b}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    </div>

                    <TabsContent value="library" className="flex-1 flex flex-col min-h-0 outline-none m-0">
                        <div className="px-10 py-4 flex justify-between items-center bg-white/50 border-b border-zinc-50">
                            <p className="text-[10px] text-zinc-400 font-black uppercase tracking-widest">{images.length} Assets in {currentBucket}</p>
                            <Button variant="ghost" size="icon" onClick={fetchImages} disabled={isLoading} className="rounded-full hover:bg-zinc-100">
                                <RefreshCw className={cn("h-4 w-4 text-zinc-400", isLoading && "animate-spin")} />
                            </Button>
                        </div>
                        <ScrollArea className="flex-1 px-10 pt-6">
                            {isLoading && images.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-[300px] gap-4">
                                    <Loader2 className="h-10 w-10 animate-spin text-zinc-900" />
                                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Loading assets...</p>
                                </div>
                            ) : images.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-[300px] text-zinc-400 gap-4">
                                    <div className="h-20 w-20 rounded-[2rem] bg-zinc-50 flex items-center justify-center">
                                        <ImageIcon className="h-8 w-8 opacity-20" />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm font-bold text-zinc-900">No images found</p>
                                        <p className="text-xs font-medium text-zinc-400 mt-1">Bucket {currentBucket} is currently empty</p>
                                    </div>
                                    <Button variant="outline" onClick={() => setActiveTab('upload')} className="rounded-2xl mt-2 font-bold uppercase tracking-widest text-[10px]">
                                        Upload New Asset
                                    </Button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 pb-10">
                                    {images.map((file) => {
                                        const isSelected = selectedImage === file.name
                                        const url = getPublicUrl(file.name)
                                        return (
                                            <div
                                                key={file.id}
                                                className={cn(
                                                    "group relative aspect-square rounded-[2rem] overflow-hidden border-2 cursor-pointer transition-all bg-zinc-50 shadow-sm hover:shadow-xl hover:-translate-y-1",
                                                    isSelected ? "border-zinc-900 ring-4 ring-zinc-900/5 shadow-2xl" : "border-transparent hover:border-zinc-200"
                                                )}
                                                onClick={() => setSelectedImage(file.name)}
                                            >
                                                <img
                                                    src={url}
                                                    alt={file.name}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                    loading="lazy"
                                                />
                                                <div className={cn(
                                                    "absolute inset-0 transition-opacity duration-300 flex items-center justify-center",
                                                    isSelected ? "bg-zinc-900/20 opacity-100" : "bg-black/40 opacity-0 group-hover:opacity-100"
                                                )}>
                                                    <div className={cn(
                                                        "h-10 w-10 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-300 translate-y-2 group-hover:translate-y-0",
                                                        isSelected ? "bg-white text-zinc-900 scale-100" : "bg-white/90 text-zinc-900 scale-90"
                                                    )}>
                                                        {isSelected ? <Check className="h-5 w-5 font-bold" /> : <ImagePlus className="h-5 w-5" />}
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </ScrollArea>
                        <div className="px-10 py-6 border-t border-zinc-100 flex justify-end gap-3 bg-white/80 backdrop-blur-md sticky bottom-0 z-20">
                            <Button variant="ghost" onClick={() => onOpenChange(false)} className="rounded-2xl font-bold uppercase tracking-widest text-[10px] h-12 px-8">
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSelect}
                                disabled={!selectedImage}
                                className="rounded-2xl font-black uppercase tracking-widest text-[10px] h-12 px-8 shadow-xl shadow-zinc-900/10 hover:shadow-2xl hover:scale-[1.02] active:scale-95 transition-all"
                            >
                                Insert Selected Asset
                            </Button>
                        </div>
                    </TabsContent>

                    <TabsContent value="upload" className="flex-1 flex flex-col min-h-0 outline-none m-0">
                        <div className="flex-1 flex items-center justify-center p-12">
                            <div className="relative w-full max-w-md border-2 border-dashed border-zinc-100 rounded-[3rem] p-16 text-center hover:bg-zinc-50/50 transition-all duration-500 cursor-pointer group flex flex-col items-center justify-center">
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleUpload}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    disabled={isUploading}
                                />
                                <div className="h-24 w-24 bg-white rounded-[2rem] flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-50">
                                    {isUploading ? <Loader2 className="h-10 w-10 text-zinc-900 animate-spin" /> : <Upload className="h-10 w-10 text-zinc-400 group-hover:text-zinc-900 transition-colors" />}
                                </div>
                                <h3 className="text-xl font-black text-zinc-900 mb-2 tracking-tight">Post Brand New Media</h3>
                                <p className="text-xs font-medium text-zinc-400 mb-6 px-10">Click or drag your high-quality product images directly into the {bucket} collection.</p>
                                <div className="flex gap-2">
                                    <span className="text-[9px] font-black uppercase tracking-widest bg-zinc-100 px-3 py-1.5 rounded-xl text-zinc-500">WEBP</span>
                                    <span className="text-[9px] font-black uppercase tracking-widest bg-zinc-100 px-3 py-1.5 rounded-xl text-zinc-500">PNG</span>
                                    <span className="text-[9px] font-black uppercase tracking-widest bg-zinc-100 px-3 py-1.5 rounded-xl text-zinc-500">JPG</span>
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    )
}
