"use client"

import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { useCart } from "@/context/cart-context"

interface AddToCartButtonProps {
    product: {
        id: string
        name: string
        price: number
        image: string
        slug: string
        category: string
    }
    quantity?: number
    className?: string
}

export function AddToCartButton({ product, quantity = 1, className }: AddToCartButtonProps) {
    const { addToCart } = useCart()

    return (
        <Button
            size="lg"
            className={`w-full sm:flex-1 rounded-full text-sm sm:text-base h-12 sm:h-14 ${className}`}
            onClick={() => addToCart(product, quantity)}
        >
            <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 mr-4" />
            Add to Cart
        </Button>
    )
}
