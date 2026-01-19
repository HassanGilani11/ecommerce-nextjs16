"use client"

import * as React from "react"
import Link from "next/link"
import {
    Plus,
    Search,
    MoreHorizontal,
    Edit2,
    Trash2,
    Filter,
    ArrowUpDown,
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
import { deleteCategory } from "./actions"
import { toast } from "sonner"

interface Category {
    id: string
    name: string
    description: string | null
    slug: string
    image_url: string | null
    _count?: {
        products: number
    }
}

interface CategoriesTableProps {
    categories: Category[]
}

export function CategoriesTable({ categories }: CategoriesTableProps) {
    const [searchQuery, setSearchQuery] = React.useState("")

    const filteredCategories = React.useMemo(() => {
        return categories.filter(category =>
            category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            category.slug.toLowerCase().includes(searchQuery.toLowerCase())
        )
    }, [categories, searchQuery])

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this category?")) return

        const result = await deleteCategory(id)
        if (result?.error) {
            toast.error(result.error)
        } else {
            toast.success("Category deleted successfully")
        }
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Table Area */}
            <div className="bg-white rounded-[2rem] shadow-sm border border-zinc-100 overflow-hidden">
                <div className="flex flex-col sm:flex-row items-center gap-4 p-6 border-b border-zinc-50">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                        <Input
                            placeholder="Search categories..."
                            className="pl-11 h-11 rounded-xl border-zinc-100 bg-zinc-50/50 focus-visible:ring-1 focus-visible:ring-zinc-200"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
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
                                <TableHead className="w-[80px] px-8 text-[10px] font-bold uppercase tracking-widest">Image</TableHead>
                                <TableHead className="text-[10px] font-bold uppercase tracking-widest">Category Title</TableHead>
                                <TableHead className="text-[10px] font-bold uppercase tracking-widest hidden md:table-cell">Description</TableHead>
                                <TableHead className="text-[10px] font-bold uppercase tracking-widest">Slug</TableHead>
                                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-center">Products</TableHead>
                                <TableHead className="text-right pr-8 text-[10px] font-bold uppercase tracking-widest">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredCategories.map((category) => (
                                <TableRow key={category.id} className="group border-zinc-50 hover:bg-zinc-50/50 transition-colors">
                                    <TableCell className="px-8 py-4">
                                        <div className="h-12 w-12 rounded-xl bg-zinc-100 overflow-hidden border border-zinc-200 transition-transform group-hover:scale-105">
                                            {category.image_url ? (
                                                <img
                                                    src={category.image_url}
                                                    alt={category.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-zinc-300">
                                                    <div className="h-4 w-4 rounded-full bg-zinc-200" />
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-bold text-zinc-900">{category.name}</TableCell>
                                    <TableCell className="text-zinc-500 text-xs hidden md:table-cell max-w-[200px] truncate">
                                        {category.description || "-"}
                                    </TableCell>
                                    <TableCell>
                                        <code className="text-[10px] font-mono bg-zinc-100 text-zinc-500 px-1.5 py-0.5 rounded uppercase tracking-tighter">
                                            /{category.slug}
                                        </code>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant="secondary" className="bg-zinc-100 text-zinc-900 rounded-lg font-bold text-[10px]">
                                            {category._count?.products || 0}
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
                                                <Link href={`/admin/categories/${category.id}/edit`}>
                                                    <DropdownMenuItem className="rounded-lg gap-2 text-xs font-medium cursor-pointer">
                                                        <Edit2 className="h-3.5 w-3.5 text-zinc-400" /> Edit Category
                                                    </DropdownMenuItem>
                                                </Link>
                                                <Link href={`/product-category/${category.slug}`} target="_blank">
                                                    <DropdownMenuItem className="rounded-lg gap-2 text-xs font-medium cursor-pointer">
                                                        <ExternalLink className="h-3.5 w-3.5 text-zinc-400" /> View Live Category
                                                    </DropdownMenuItem>
                                                </Link>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    className="rounded-lg gap-2 text-xs font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 cursor-pointer"
                                                    onClick={() => handleDelete(category.id)}
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" /> Delete Category
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <div className="p-6 border-t border-zinc-50 bg-zinc-50/30">
                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-[0.2em] text-center">
                        Total {categories.length} categories active
                    </p>
                </div>
            </div>
        </div>
    )
}
