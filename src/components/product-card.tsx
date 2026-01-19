"use client"

import Link from "next/link"
import Image from "next/image"
import { Product } from "@/lib/data"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/context/cart-context"
import { Plus } from "lucide-react"

interface ProductCardProps {
    product: Product
}

export function ProductCard({ product }: ProductCardProps) {
    const { addToCart } = useCart()

    const handleQuickAdd = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            slug: product.slug,
            category: product.category
        })
    }

    return (
        <Card className="overflow-hidden border-none shadow-none group bg-transparent p-0 gap-0">
            <CardContent className="p-0 relative aspect-[4/5] overflow-hidden rounded-xl bg-muted">
                <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <Badge className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-background/80 backdrop-blur text-foreground border-none text-[8px] sm:text-[10px] px-1.5 py-0.5">
                    {product.category}
                </Badge>
                {/* Desktop Quick Add Overlay */}
                <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity hidden lg:block">
                    <Button
                        variant="secondary"
                        className="w-full rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md bg-white/70 hover:bg-white text-black border-none shadow-lg"
                        onClick={handleQuickAdd}
                    >
                        Quick Add
                    </Button>
                </div>
                {/* Mobile Quick Add Button */}
                <div className="absolute right-2 bottom-2 lg:hidden">
                    <Button
                        size="icon"
                        variant="secondary"
                        className="h-8 w-8 rounded-full backdrop-blur-md bg-white/70 hover:bg-white text-black border-none shadow-lg"
                        onClick={handleQuickAdd}
                    >
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>
            </CardContent>
            <CardFooter className="flex flex-col items-start p-2 sm:p-3 gap-0">
                <h3 className="font-medium text-[13px] sm:text-sm lg:text-[15px] leading-snug">
                    <Link href={`/products/${product.slug}`} className="hover:underline line-clamp-1">
                        {product.name}
                    </Link>
                </h3>
                <p className="text-muted-foreground text-[12px] sm:text-[13px] font-semibold">${product.price}</p>
            </CardFooter>
        </Card>
    )
}
