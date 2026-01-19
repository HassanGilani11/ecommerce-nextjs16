"use client"

import * as React from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface ProductGalleryProps {
    images: string[]
    title: string
}

export function ProductGallery({ images, title }: ProductGalleryProps) {
    const [selectedImage, setSelectedImage] = React.useState(images[0])

    return (
        <div className="space-y-4">
            <div className="aspect-[4/5] relative rounded-2xl sm:rounded-3xl overflow-hidden bg-muted group">
                <Image
                    src={selectedImage}
                    alt={title}
                    fill
                    className="object-cover transition-all duration-500 group-hover:scale-105"
                    priority
                />
            </div>
            {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2 sm:gap-4">
                    {images.map((image, i) => (
                        <div
                            key={i}
                            onClick={() => setSelectedImage(image)}
                            className={cn(
                                "aspect-square relative rounded-lg sm:rounded-xl overflow-hidden bg-muted cursor-pointer transition-all duration-300",
                                selectedImage === image ? "ring-2 ring-primary ring-offset-2" : "hover:opacity-80"
                            )}
                        >
                            <Image
                                src={image}
                                alt={`${title} ${i + 1}`}
                                fill
                                className="object-cover"
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
