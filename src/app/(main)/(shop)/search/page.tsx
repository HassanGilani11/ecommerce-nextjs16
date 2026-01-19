"use client"

import { useState, useMemo } from "react"
import { PRODUCTS } from "@/lib/data"
import { ProductCard } from "@/components/product-card"
import { Input } from "@/components/ui/input"
import { Search, X, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function SearchPage() {
    const [query, setQuery] = useState("")

    const filteredProducts = useMemo(() => {
        if (!query.trim()) return []
        return PRODUCTS.filter(product =>
            product.name.toLowerCase().includes(query.toLowerCase()) ||
            product.category.toLowerCase().includes(query.toLowerCase()) ||
            product.description.toLowerCase().includes(query.toLowerCase())
        )
    }, [query])

    return (
        <div className="container mx-auto px-4 py-8 min-h-[calc(100vh-4rem)] bg-background">
            <div className="flex flex-col gap-8">
                {/* Search Header */}
                <div className="flex items-center gap-4">
                    <Link href="/">
                        <Button variant="ghost" size="icon" className="rounded-full">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            autoFocus
                            placeholder="Search products..."
                            className="h-12 w-full pl-11 pr-11 rounded-2xl bg-muted/50 border-none focus-visible:ring-1 focus-visible:ring-primary"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                        {query && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 rounded-full hover:bg-muted"
                                onClick={() => setQuery("")}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </div>

                {/* Search Results */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                            {query ? `Results for "${query}"` : "Suggested Products"}
                        </h2>
                        {query && (
                            <span className="text-xs font-medium bg-muted px-2 py-1 rounded-full text-muted-foreground">
                                {filteredProducts.length} items found
                            </span>
                        )}
                    </div>

                    {query === "" ? (
                        <div className="grid grid-cols-2 gap-4">
                            {PRODUCTS.slice(4, 8).map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-2 gap-4 sm:gap-6">
                            {filteredProducts.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
                            <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center">
                                <Search className="h-8 w-8 text-muted-foreground opacity-20" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-lg font-bold">No results found</p>
                                <p className="text-sm text-muted-foreground">Try adjusting your search terms.</p>
                            </div>
                            <Button variant="outline" onClick={() => setQuery("")} className="mt-2 rounded-full">
                                Clear Search
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
