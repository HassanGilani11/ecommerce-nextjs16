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
    Loader2,
    Eye,
    Download,
    Upload
} from "lucide-react"
import { exportProductsToCSV } from "./import-export-actions"
import { ImportProductsModal } from "./import-products-modal"
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
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { deleteProduct } from "./actions"
import { toast } from "sonner"

interface Product {
    id: string
    title: string
    slug: string
    price: number
    stock: number
    status: string
    featured_image: string | null
    category: {
        name: string
    } | null
    brand: {
        name: string
    } | null
    tags: {
        tag: {
            name: string
        }
    }[]
}

interface ProductsTableProps {
    products: Product[]
}

export function ProductsTable({ products }: ProductsTableProps) {
    const [searchQuery, setSearchQuery] = React.useState("")
    const [isExporting, setIsExporting] = React.useState(false)

    const handleExport = async () => {
        setIsExporting(true)
        try {
            const result = await exportProductsToCSV()
            if (result.success && result.csv) {
                const blob = new Blob([result.csv], { type: 'text/csv;charset=utf-8;' })
                const url = URL.createObjectURL(blob)
                const link = document.createElement('a')
                link.setAttribute('href', url)
                link.setAttribute('download', `products-export-${new Date().toISOString().split('T')[0]}.csv`)
                link.style.visibility = 'hidden'
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
                toast.success("Products exported successfully")
            } else {
                toast.error(result.error || "Failed to export products")
            }
        } catch (err) {
            toast.error("An error occurred during export")
        } finally {
            setIsExporting(false)
        }
    }


    const filteredProducts = React.useMemo(() => {
        return products.filter(product =>
            product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.category?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.brand?.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
    }, [products, searchQuery])

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-[2rem] shadow-sm border border-zinc-100">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                    <Input
                        placeholder="Search products..."
                        className="pl-11 h-12 rounded-2xl border-none bg-zinc-50 focus-visible:ring-1 focus-visible:ring-zinc-200"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <ImportProductsModal />
                    <Button
                        variant="outline"
                        className="h-12 rounded-2xl gap-2 border-zinc-200 hover:bg-zinc-50 font-semibold px-4 flex-1 sm:flex-initial"
                        onClick={handleExport}
                        disabled={isExporting}
                    >
                        {isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                        Export
                    </Button>
                    <Button variant="outline" className="h-12 rounded-2xl gap-2 border-zinc-200 hover:bg-zinc-50 font-semibold px-4 flex-1 sm:flex-initial">
                        <Filter className="h-4 w-4" />
                        Filters
                    </Button>
                </div>
            </div>

            <div className="bg-white rounded-[2rem] shadow-sm border border-zinc-100 overflow-hidden">
                <Table>
                    <TableHeader className="bg-zinc-50/50">
                        <TableRow className="hover:bg-transparent border-zinc-100">
                            <TableHead className="w-[80px] text-[10px] font-bold uppercase tracking-widest pl-8">Image</TableHead>
                            <TableHead className="text-[10px] font-bold uppercase tracking-widest">
                                <div className="flex items-center gap-2">
                                    Product Name
                                    <ArrowUpDown className="h-3 w-3" />
                                </div>
                            </TableHead>
                            <TableHead className="text-[10px] font-bold uppercase tracking-widest">Category</TableHead>
                            <TableHead className="text-[10px] font-bold uppercase tracking-widest">Brand</TableHead>
                            <TableHead className="text-[10px] font-bold uppercase tracking-widest">Tags</TableHead>
                            <TableHead className="text-[10px] font-bold uppercase tracking-widest text-right px-6">Price</TableHead>
                            <TableHead className="text-[10px] font-bold uppercase tracking-widest text-center">Stock</TableHead>
                            <TableHead className="text-[10px] font-bold uppercase tracking-widest pr-8 text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredProducts.map((product) => (
                            <TableRow key={product.id} className="group border-zinc-50 hover:bg-zinc-50/50 transition-colors">
                                <TableCell className="pl-8">
                                    <div className="h-12 w-12 rounded-2xl overflow-hidden shadow-sm border border-zinc-100 bg-zinc-50">
                                        {product.featured_image ? (
                                            <img
                                                src={product.featured_image}
                                                alt={product.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <div className="w-4 h-4 rounded-full bg-zinc-200" />
                                            </div>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-zinc-900 leading-tight">{product.title}</span>
                                        <span className="text-[10px] text-zinc-400 font-medium tracking-tight mt-0.5 uppercase">ID: {product.id.slice(0, 8)}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="secondary" className="bg-zinc-100 text-zinc-600 rounded-lg font-bold text-[10px] px-2 py-0 border-none">
                                        {product.category?.name || "Uncategorized"}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-tight">
                                        {product.brand?.name || "—"}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-wrap gap-1">
                                        {product.tags && product.tags.length > 0 ? (
                                            product.tags.slice(0, 3).map(({ tag }) => (
                                                <span
                                                    key={tag?.name}
                                                    className="text-[9px] font-bold bg-zinc-50 border border-zinc-100 text-zinc-400 px-1.5 py-0.5 rounded-md uppercase tracking-tighter"
                                                >
                                                    {tag?.name}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-zinc-300 text-[10px] italic">No tags</span>
                                        )}
                                        {product.tags && product.tags.length > 3 && (
                                            <span className="text-[9px] font-bold bg-zinc-50 border border-zinc-100 text-zinc-400 px-1.5 py-0.5 rounded-md uppercase tracking-tighter">
                                                +{product.tags.length - 3}
                                            </span>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="text-right px-6 font-bold text-zinc-900">
                                    ${Number(product.price).toFixed(2)}
                                </TableCell>
                                <TableCell className="text-center">
                                    <div className="flex flex-col items-center">
                                        <span className="font-bold text-zinc-900">{product.stock}</span>
                                        <div className="w-12 h-1 bg-zinc-100 rounded-full mt-1.5 overflow-hidden">
                                            <div
                                                className={`h-full w-3/4 ${product.stock > 10 ? "bg-emerald-500" : product.stock > 0 ? "bg-amber-500" : "bg-rose-500"}`}
                                            />
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="pr-8 text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-zinc-900 rounded-lg">
                                                <MoreHorizontal className="h-5 w-5" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="rounded-2xl p-2 min-w-[160px] shadow-2xl border-zinc-100">
                                            <DropdownMenuLabel className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 px-3 py-2">Actions</DropdownMenuLabel>
                                            <Link href={`/products/${product.slug}`} target="_blank">
                                                <DropdownMenuItem className="rounded-xl px-3 py-2.5 gap-3 cursor-pointer group">
                                                    <Eye className="h-4 w-4 text-zinc-400 group-hover:text-zinc-900" />
                                                    <span className="font-semibold text-sm">View Product</span>
                                                </DropdownMenuItem>
                                            </Link>
                                            <Link href={`/admin/products/${product.id}/edit`}>
                                                <DropdownMenuItem className="rounded-xl px-3 py-2.5 gap-3 cursor-pointer group">
                                                    <Edit2 className="h-4 w-4 text-zinc-400 group-hover:text-zinc-900" />
                                                    <span className="font-semibold text-sm">Edit Details</span>
                                                </DropdownMenuItem>
                                            </Link>
                                            <DropdownMenuSeparator className="bg-zinc-100 my-1 mx-2" />
                                            <DropdownMenuItem
                                                className="rounded-xl px-3 py-2.5 gap-3 cursor-pointer group text-rose-500 focus:text-rose-600 focus:bg-rose-50"
                                                onClick={async (e) => {
                                                    e.preventDefault()
                                                    if (!confirm("Are you sure you want to delete this product?")) return

                                                    const result = await deleteProduct(product.id)
                                                    if (result?.error) {
                                                        toast.error(result.error)
                                                    } else {
                                                        toast.success("Product deleted successfully")
                                                    }
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4 opacity-70" />
                                                <span className="font-semibold text-sm">Delete Product</span>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {filteredProducts.length === 0 && (
                    <div className="py-24 text-center">
                        <div className="h-20 w-20 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Plus className="h-10 w-10 text-zinc-200 rotate-45" />
                        </div>
                        <h3 className="text-lg font-bold text-zinc-900">No products found</h3>
                        <p className="text-zinc-500 text-sm mt-1">Try adjusting your search query or filters.</p>
                        <Button
                            variant="ghost"
                            className="mt-4 text-primary font-bold hover:bg-zinc-50 rounded-xl"
                            onClick={() => setSearchQuery("")}
                        >
                            Clear search
                        </Button>
                    </div>
                )}

                <div className="p-6 border-t border-zinc-50 bg-zinc-50/30 flex items-center justify-between">
                    <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">
                        Showing {filteredProducts.length} items
                    </p>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="rounded-xl border-zinc-200 h-9 font-bold text-[11px] uppercase tracking-widest px-4" disabled>
                            Previous
                        </Button>
                        <Button variant="outline" size="sm" className="rounded-xl border-zinc-200 h-9 font-bold text-[11px] uppercase tracking-widest px-4" disabled>
                            Next
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
