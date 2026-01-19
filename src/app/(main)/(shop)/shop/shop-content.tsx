"use client"

import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { Search, X } from "lucide-react"

interface Product {
    id: string
    name: string
    slug: string
    price: number
    image: string
    category: string
}

interface ShopContentProps {
    products: Product[]
    currentCategory: string
    categories: string[]
    brands: string[]
    tags: string[]
}

export function ShopContent({
    products,
    currentCategory,
    categories,
    brands,
    tags
}: ShopContentProps) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || "")
    const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || "")
    const currentSort = searchParams.get('sort') || "newest"
    const currentBrand = searchParams.get('brand') || "All"
    const currentTag = searchParams.get('tag') || "All"

    const updateFilters = (updates: Record<string, string | null>) => {
        const params = new URLSearchParams(searchParams.toString())
        Object.entries(updates).forEach(([key, value]) => {
            if (value === null || value === "All") {
                params.delete(key)
            } else {
                params.set(key, value)
            }
        })
        router.push(`/shop?${params.toString()}`)
    }

    const handlePriceSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        updateFilters({ minPrice: minPrice || null, maxPrice: maxPrice || null })
    }

    const clearFilters = () => {
        setMinPrice("")
        setMaxPrice("")
        router.push('/shop')
    }

    return (
        <div className="container mx-auto py-8 sm:py-12 lg:py-20 flex flex-col gap-8 sm:gap-10 px-4">
            <div className="flex flex-col gap-2 sm:gap-4">
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tighter">Shop All</h1>
                <p className="text-muted-foreground text-base sm:text-lg">
                    Browse our full collection of minimalist essentials.
                </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                {/* Sidebar Filter */}
                <aside className="w-full lg:w-64 flex flex-col gap-8">
                    {/* Sort By */}
                    <div>
                        <h3 className="font-bold text-[10px] uppercase tracking-[0.2em] text-zinc-400 mb-4">Sort By</h3>
                        <div className="flex flex-col gap-1">
                            {[
                                { label: "Newest", value: "newest" },
                                { label: "Price: Low to High", value: "price-asc" },
                                { label: "Price: High to Low", value: "price-desc" }
                            ].map((sort) => (
                                <Button
                                    key={sort.value}
                                    variant="ghost"
                                    onClick={() => updateFilters({ sort: sort.value })}
                                    className={`w-full justify-start rounded-xl text-sm h-10 px-4 hover:bg-zinc-50 transition-colors ${currentSort === sort.value ? "bg-zinc-100 font-bold text-zinc-900" : "text-zinc-500"
                                        }`}
                                >
                                    {sort.label}
                                </Button>
                            ))}
                        </div>
                    </div>

                    <Separator className="opacity-50" />

                    {/* Price Range */}
                    <div>
                        <h3 className="font-bold text-[10px] uppercase tracking-[0.2em] text-zinc-400 mb-4">Price Range</h3>
                        <form onSubmit={handlePriceSubmit} className="flex flex-col gap-3">
                            <div className="flex items-center gap-2">
                                <div className="relative flex-1">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm">$</span>
                                    <Input
                                        type="number"
                                        placeholder="Min"
                                        value={minPrice}
                                        onChange={(e) => setMinPrice(e.target.value)}
                                        className="h-10 pl-7 rounded-xl border-zinc-100 focus:ring-zinc-900"
                                    />
                                </div>
                                <div className="relative flex-1">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm">$</span>
                                    <Input
                                        type="number"
                                        placeholder="Max"
                                        value={maxPrice}
                                        onChange={(e) => setMaxPrice(e.target.value)}
                                        className="h-10 pl-7 rounded-xl border-zinc-100 focus:ring-zinc-900"
                                    />
                                </div>
                            </div>
                            <Button type="submit" className="w-full h-10 rounded-xl bg-zinc-900 text-white font-bold text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all">
                                Apply Range
                            </Button>
                        </form>
                    </div>

                    <Separator className="opacity-50" />

                    {/* Categories */}
                    <div>
                        <h3 className="font-bold text-[10px] uppercase tracking-[0.2em] text-zinc-400 mb-4">Categories</h3>
                        <div className="flex flex-col gap-1">
                            {categories.map((category) => (
                                <Button
                                    key={category}
                                    variant="ghost"
                                    onClick={() => updateFilters({ category })}
                                    className={`w-full justify-start rounded-xl text-sm h-10 px-4 hover:bg-zinc-50 transition-colors ${currentCategory === category ? "bg-zinc-100 font-bold text-zinc-900" : "text-zinc-500"
                                        }`}
                                >
                                    {category}
                                </Button>
                            ))}
                        </div>
                    </div>

                    <Separator className="opacity-50" />

                    {/* Brands */}
                    <div>
                        <h3 className="font-bold text-[10px] uppercase tracking-[0.2em] text-zinc-400 mb-4">Brands</h3>
                        <div className="flex flex-col gap-1">
                            {["All", ...brands].map((brand) => (
                                <Button
                                    key={brand}
                                    variant="ghost"
                                    onClick={() => updateFilters({ brand })}
                                    className={`w-full justify-start rounded-xl text-sm h-10 px-4 hover:bg-zinc-50 transition-colors ${currentBrand === brand ? "bg-zinc-100 font-bold text-zinc-900" : "text-zinc-500"
                                        }`}
                                >
                                    {brand}
                                </Button>
                            ))}
                        </div>
                    </div>

                    <Separator className="opacity-50" />

                    {/* Tags */}
                    <div>
                        <h3 className="font-bold text-[10px] uppercase tracking-[0.2em] text-zinc-400 mb-4">Popular Tags</h3>
                        <div className="flex flex-wrap gap-2">
                            {["All", ...tags].map((tag) => (
                                <Button
                                    key={tag}
                                    variant="outline"
                                    size="sm"
                                    onClick={() => updateFilters({ tag })}
                                    className={`rounded-full px-4 h-8 text-[11px] font-bold uppercase tracking-wider transition-all ${currentTag === tag
                                            ? "bg-zinc-900 text-white border-zinc-900 shadow-lg shadow-black/10"
                                            : "bg-white text-zinc-500 border-zinc-100 hover:border-zinc-300"
                                        }`}
                                >
                                    {tag}
                                </Button>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Product Grid */}
                <div className="flex-1">
                    <div className="mb-6 flex items-center justify-between">
                        <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest">
                            Showing {products.length} products
                        </p>
                        {(searchParams.toString()) && (
                            <Button
                                variant="ghost"
                                onClick={clearFilters}
                                className="h-8 px-3 text-zinc-400 hover:text-rose-500 gap-2 text-[10px] font-black uppercase tracking-widest"
                            >
                                <X className="h-3 w-3" />
                                Clear All
                            </Button>
                        )}
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-10">
                        {products.length > 0 ? (
                            products.map((product) => (
                                <ProductCard key={product.id} product={product as any} />
                            ))
                        ) : (
                            <div className="col-span-full py-32 text-center border-2 border-dashed border-zinc-100 rounded-[2.5rem] bg-zinc-50/30">
                                <div className="h-16 w-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4">
                                    <Search className="h-6 w-6 text-zinc-300" />
                                </div>
                                <p className="text-zinc-900 text-lg font-black tracking-tight mb-1">No matches found</p>
                                <p className="text-zinc-400 text-sm mb-6">Try adjusting your filters or search terms.</p>
                                <Button
                                    onClick={clearFilters}
                                    className="rounded-xl h-11 px-8 bg-zinc-900 text-white font-bold uppercase tracking-widest text-[11px] hover:scale-[1.02] active:scale-95 transition-all"
                                >
                                    Clear all filters
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
