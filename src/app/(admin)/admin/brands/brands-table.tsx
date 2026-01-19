"use client"

import * as React from "react"
import Link from "next/link"
import {
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
import { toast } from "sonner"
import { deleteBrand } from "./actions" // We will create this
import { useRouter } from "next/navigation"

interface Brand {
    id: string
    name: string // DB column is 'name', dummy data was 'title'. I will align to DB.
    description: string | null
    slug: string
    logo_url: string | null
    product_count?: number // We might need to fetch this
}

interface BrandsTableProps {
    brands: Brand[]
}

export function BrandsTable({ brands }: BrandsTableProps) {
    const router = useRouter()
    const [searchQuery, setSearchQuery] = React.useState("")
    const [isDeleting, setIsDeleting] = React.useState(false)

    const filteredBrands = React.useMemo(() => {
        return brands.filter(brand =>
            brand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            brand.slug.toLowerCase().includes(searchQuery.toLowerCase())
        )
    }, [brands, searchQuery])

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this brand?")) return

        setIsDeleting(true)
        try {
            const result = await deleteBrand(id)
            if (result.error) {
                toast.error(result.error)
            } else {
                toast.success("Brand deleted successfully")
            }
        } catch (error) {
            toast.error("Failed to delete brand")
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <div className="bg-white rounded-[2rem] shadow-sm border border-zinc-100 overflow-hidden">
            <div className="flex flex-col sm:flex-row items-center gap-4 p-6 border-b border-zinc-50">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                    <Input
                        placeholder="Search brands..."
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
                            <TableHead className="w-[80px] px-8 text-[10px] font-bold uppercase tracking-widest">Logo</TableHead>
                            <TableHead className="text-[10px] font-bold uppercase tracking-widest">Brand Name</TableHead>
                            <TableHead className="text-[10px] font-bold uppercase tracking-widest hidden md:table-cell">Description</TableHead>
                            <TableHead className="text-[10px] font-bold uppercase tracking-widest">Slug</TableHead>
                            <TableHead className="text-[10px] font-bold uppercase tracking-widest text-center">Products</TableHead>
                            <TableHead className="text-right pr-8 text-[10px] font-bold uppercase tracking-widest">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredBrands.map((brand) => (
                            <TableRow key={brand.id} className="group border-zinc-50 hover:bg-zinc-50/50 transition-colors">
                                <TableCell className="px-8 py-4">
                                    <div className="h-12 w-12 rounded-xl bg-white overflow-hidden border border-zinc-100 transition-transform group-hover:scale-105 p-2 flex items-center justify-center">
                                        {brand.logo_url ? (
                                            <img
                                                src={brand.logo_url}
                                                alt={brand.name}
                                                className="h-full w-full object-contain"
                                            />
                                        ) : (
                                            <div className="h-full w-full bg-zinc-50 flex items-center justify-center text-zinc-300 font-bold text-xs uppercase">
                                                {brand.name.substring(0, 2)}
                                            </div>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="font-bold text-zinc-900">{brand.name}</TableCell>
                                <TableCell className="text-zinc-500 text-xs hidden md:table-cell max-w-[200px] truncate">
                                    {brand.description || "-"}
                                </TableCell>
                                <TableCell>
                                    <code className="text-[10px] font-mono bg-zinc-100 text-zinc-500 px-1.5 py-0.5 rounded uppercase tracking-tighter">
                                        {brand.slug}
                                    </code>
                                </TableCell>
                                <TableCell className="text-center">
                                    <Badge variant="secondary" className="bg-zinc-100 text-zinc-900 rounded-lg font-bold text-[10px]">
                                        {brand.product_count || 0}
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
                                            <Link href={`/admin/brands/${brand.id}/edit`}>
                                                <DropdownMenuItem className="rounded-lg gap-2 text-xs font-medium cursor-pointer">
                                                    <Edit2 className="h-3.5 w-3.5 text-zinc-400" /> Edit Brand Details
                                                </DropdownMenuItem>
                                            </Link>
                                            <DropdownMenuItem asChild className="rounded-lg gap-2 text-xs font-medium cursor-pointer">
                                                <Link href={`/brands/${brand.slug}`} target="_blank">
                                                    <ExternalLink className="h-3.5 w-3.5 text-zinc-400" /> View Brand Page
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                onClick={() => handleDelete(brand.id)}
                                                className="rounded-lg gap-2 text-xs font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 cursor-pointer"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" /> Delete Brand
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                        {filteredBrands.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-zinc-500 text-sm">
                                    No brands found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="p-6 border-t border-zinc-50 bg-zinc-50/30">
                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-[0.2em] text-center">
                    Total {brands.length} authorized brands
                </p>
            </div>
        </div>
    )
}
