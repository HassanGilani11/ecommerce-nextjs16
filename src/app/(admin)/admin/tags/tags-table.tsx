"use client"

import * as React from "react"
import Link from "next/link"
import {
    MoreHorizontal,
    Edit2,
    Trash2,
    Search,
    Filter,
    ArrowUpDown,
    Hash,
    ExternalLink
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { deleteTag } from "./actions"
import { toast } from "sonner"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Tag {
    id: string
    name: string
    slug: string
    description: string | null
    created_at: string
    _count?: {
        products: number
    }
}

interface TagsTableProps {
    initialTags: Tag[]
}

export function TagsTable({ initialTags }: TagsTableProps) {
    const [searchQuery, setSearchQuery] = React.useState("")
    const [tagToDelete, setTagToDelete] = React.useState<string | null>(null)
    const [isDeleting, setIsDeleting] = React.useState(false)

    // Filter tags based on search query
    const filteredTags = React.useMemo(() => {
        return initialTags.filter(tag =>
            tag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tag.slug.toLowerCase().includes(searchQuery.toLowerCase())
        )
    }, [initialTags, searchQuery])

    const handleDelete = async () => {
        if (!tagToDelete) return

        setIsDeleting(true)
        try {
            const result = await deleteTag(tagToDelete)
            if (result.error) {
                toast.error(result.error)
            } else {
                toast.success("Tag deleted successfully")
            }
        } catch (error) {
            toast.error("Failed to delete tag")
        } finally {
            setIsDeleting(false)
            setTagToDelete(null)
        }
    }

    return (
        <div className="bg-white rounded-[2rem] shadow-sm border border-zinc-100 overflow-hidden">
            <div className="flex flex-col sm:flex-row items-center gap-4 p-6 border-b border-zinc-50">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                    <Input
                        placeholder="Search tags..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-11 h-11 rounded-xl border-zinc-100 bg-zinc-50/50 focus-visible:ring-1 focus-visible:ring-zinc-200"
                    />
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Button variant="outline" className="flex-1 sm:flex-none rounded-xl h-11 px-4 gap-2 border-zinc-100 text-zinc-600 font-bold uppercase tracking-widest text-[10px]">
                        <Filter className="h-3.5 w-3.5" />
                        Filter
                    </Button>
                    <Button variant="outline" className="flex-1 sm:flex-none rounded-xl h-11 px-4 gap-2 border-zinc-100 text-zinc-600 font-bold uppercase tracking-widest text-[10px]">
                        <ArrowUpDown className="h-3.5 w-3.5" />
                        Sort
                    </Button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent border-zinc-50">
                            <TableHead className="px-8 text-[10px] font-bold uppercase tracking-widest w-[250px]">Tag Name</TableHead>
                            <TableHead className="text-[10px] font-bold uppercase tracking-widest">Slug</TableHead>
                            <TableHead className="text-[10px] font-bold uppercase tracking-widest hidden md:table-cell">Description</TableHead>
                            <TableHead className="text-[10px] font-bold uppercase tracking-widest text-center">Usage Count</TableHead>
                            <TableHead className="text-right pr-8 text-[10px] font-bold uppercase tracking-widest">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredTags.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center text-zinc-500">
                                    No tags found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredTags.map((tag) => (
                                <TableRow key={tag.id} className="group border-zinc-50 hover:bg-zinc-50/50 transition-colors">
                                    <TableCell className="px-8 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-zinc-100 flex items-center justify-center shrink-0">
                                                <Hash className="h-4 w-4 text-zinc-500" />
                                            </div>
                                            <span className="font-bold text-zinc-900">{tag.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <code className="text-[10px] font-mono bg-zinc-100 text-zinc-500 px-1.5 py-0.5 rounded uppercase tracking-tighter">
                                            {tag.slug}
                                        </code>
                                    </TableCell>
                                    <TableCell className="text-zinc-500 text-xs hidden md:table-cell max-w-[300px] truncate">
                                        {tag.description || "-"}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant="secondary" className="rounded-lg font-bold text-[10px] px-2 py-0.5 border-none bg-zinc-100 text-zinc-600">
                                            {tag._count?.products || 0} Products
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right pr-8">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-zinc-400 hover:text-zinc-900 hover:bg-white shadow-none transition-all">
                                                    <MoreHorizontal className="h-3.5 w-3.5" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="rounded-xl border-zinc-100 shadow-xl">
                                                <DropdownMenuLabel className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 px-2 py-1.5">Options</DropdownMenuLabel>
                                                <Link href={`/admin/tags/${tag.id}/edit`}>
                                                    <DropdownMenuItem className="rounded-lg gap-2 text-xs font-medium cursor-pointer">
                                                        <Edit2 className="h-3.5 w-3.5 text-zinc-400" /> Edit Tag Details
                                                    </DropdownMenuItem>
                                                </Link>
                                                <Link href={`/tag/${tag.slug}`} target="_blank">
                                                    <DropdownMenuItem className="rounded-lg gap-2 text-xs font-medium cursor-pointer">
                                                        <ExternalLink className="h-3.5 w-3.5 text-zinc-400" /> View Live Tag
                                                    </DropdownMenuItem>
                                                </Link>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    className="rounded-lg gap-2 text-xs font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 cursor-pointer"
                                                    onClick={() => setTagToDelete(tag.id)}
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" /> Delete Tag
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="p-6 border-t border-zinc-50 bg-zinc-50/30">
                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-[0.2em] text-center">
                    Managing {filteredTags.length} globally active tags
                </p>
            </div>

            <AlertDialog open={!!tagToDelete} onOpenChange={() => setTagToDelete(null)}>
                <AlertDialogContent className="rounded-2xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the tag
                            and remove it from all associated products.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="bg-red-600 hover:bg-red-700 rounded-xl"
                        >
                            {isDeleting ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
