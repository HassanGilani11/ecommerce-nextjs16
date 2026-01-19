"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowLeft, Save, Info, Link as LinkIcon, Hash, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createTag } from "../actions"
import { toast } from "sonner"

export default function AddTagPage() {
    const [isPending, startTransition] = React.useTransition()
    const [name, setName] = React.useState("")
    const [slug, setSlug] = React.useState("")
    const [description, setDescription] = React.useState("")

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
        formData.append("slug", slug)
        formData.append("description", description)

        startTransition(async () => {
            const result = await createTag(null, formData)
            if (result?.error) {
                toast.error(result.error)
            } else {
                toast.success("Tag created successfully")
            }
        })
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/tags">
                        <Button variant="ghost" size="icon" className="rounded-2xl hover:bg-white shadow-sm border border-transparent hover:border-zinc-100 transition-all">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tighter">Add Tag</h1>
                        <p className="text-zinc-500 text-sm">Create a new tag to label your products.</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Link href="/admin/tags">
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
                        Save Tag
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
                                <CardTitle className="text-xl font-bold tracking-tight">Tag Details</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="px-10 pb-10 pt-4 space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="title" className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Tag Name</Label>
                                <Input
                                    id="title"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. Eco-Friendly"
                                    className="h-12 rounded-2xl border-zinc-100 bg-zinc-50/50 focus-visible:ring-1 focus-visible:ring-zinc-200"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="slug" className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Tag Slug</Label>
                                <div className="relative">
                                    <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
                                    <Input
                                        id="slug"
                                        value={slug}
                                        onChange={(e) => setSlug(e.target.value)}
                                        placeholder="eco-friendly"
                                        className="h-12 pl-11 rounded-2xl border-zinc-100 bg-zinc-50/50 focus-visible:ring-1 focus-visible:ring-zinc-200"
                                    />
                                </div>
                                <p className="text-[10px] text-zinc-400 font-medium px-2 italic">
                                    Used for URL filtering. Use lowercase and hyphens.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description" className="text-xs font-bold uppercase tracking-widest text-zinc-500 ml-1">Description</Label>
                                <Textarea
                                    id="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="What does this tag represent?"
                                    className="min-h-[140px] rounded-[1.5rem] border-zinc-100 bg-zinc-50/50 focus-visible:ring-1 focus-visible:ring-zinc-200 resize-none p-5"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-8">
                    <Card className="border-none shadow-sm rounded-[2.5rem] bg-zinc-900 text-white overflow-hidden p-8">
                        <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center mb-6">
                            <Hash className="h-6 w-6 text-zinc-400" />
                        </div>
                        <h3 className="text-xl font-bold tracking-tight mb-2">Tag Usage</h3>
                        <p className="text-zinc-400 text-sm leading-relaxed">
                            Tags help customers filter products in your store. Once created, you can assign this tag to any product from the product editor.
                        </p>
                        <div className="mt-8 pt-8 border-t border-white/5">
                            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                                <span>Status</span>
                                <span className="text-emerald-500">Ready to assign</span>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}
