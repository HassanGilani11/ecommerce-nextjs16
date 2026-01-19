"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Minus, Plus } from "lucide-react"
import { AddToCartButton } from "./add-to-cart-button"

interface ProductInteractionProps {
    product: {
        id: string
        name: string
        price: number
        image: string
        slug: string
        category: string
    }
}

export function ProductInteraction({ product }: ProductInteractionProps) {
    const [quantity, setQuantity] = useState(1)

    const increment = () => setQuantity(q => q + 1)
    const decrement = () => setQuantity(q => (q > 1 ? q - 1 : 1))

    return (
        <div className="space-y-6">
            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
                <span className="font-semibold text-xs sm:text-sm uppercase tracking-wider">Quantity:</span>
                <div className="flex items-center border rounded-full overflow-hidden h-10">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-full w-10 rounded-none hover:bg-muted"
                        onClick={decrement}
                        disabled={quantity <= 1}
                    >
                        <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-12 text-center text-sm font-medium">{quantity}</span>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-full w-10 rounded-none hover:bg-muted"
                        onClick={increment}
                    >
                        <Plus className="h-3 w-3" />
                    </Button>
                </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <AddToCartButton
                    product={product}
                    quantity={quantity}
                />
                <Button size="lg" variant="outline" className="w-full sm:flex-1 rounded-full text-sm sm:text-base h-12 sm:h-14">
                    Buy Now
                </Button>
            </div>
        </div>
    )
}
