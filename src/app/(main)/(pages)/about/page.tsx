import { Badge } from "@/components/ui/badge"
import Image from "next/image"

export default function AboutPage() {
    return (
        <div className="flex flex-col gap-16 sm:gap-24 py-12 sm:py-20">
            {/* Mission Section */}
            <section className="container mx-auto">
                <div className="max-w-3xl space-y-6 sm:space-y-8">
                    <Badge className="rounded-full px-4 py-1 text-[10px] sm:text-xs font-bold uppercase tracking-widest">Our Story</Badge>
                    <h1 className="text-4xl sm:text-6xl font-bold tracking-tighter leading-tight">
                        Redefining minimalism for the modern era.
                    </h1>
                    <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
                        AVANT-GARDE was born from a simple observation: the world is increasingly cluttered. We believe that true luxury lies in simplicity, quality, and intention. Our mission is to provide a curated selection of essentials that empower individuals to live more with less.
                    </p>
                </div>
            </section>

            {/* Visual Section */}
            <section className="relative h-[400px] sm:h-[600px] overflow-hidden">
                <Image
                    src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1600&auto=format&fit=crop"
                    alt="Studio atmosphere"
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-black/20" />
            </section>

            {/* Philosophy Section */}
            <section className="container mx-auto grid lg:grid-cols-3 gap-8 sm:gap-12">
                <div className="space-y-4">
                    <h3 className="text-xl font-bold tracking-tight">Ethical Sourcing</h3>
                    <p className="text-muted-foreground leading-relaxed italic">
                        "Every thread matters. We partner exclusively with artisans who share our commitment to fair wages and sustainable practices."
                    </p>
                </div>
                <div className="space-y-4">
                    <h3 className="text-xl font-bold tracking-tight">Timeless Design</h3>
                    <p className="text-muted-foreground leading-relaxed">
                        We don't follow trends. We create pieces that are designed to remain relevant in your wardrobe for years, not just a season.
                    </p>
                </div>
                <div className="space-y-4">
                    <h3 className="text-xl font-bold tracking-tight">Radical Transparency</h3>
                    <p className="text-muted-foreground leading-relaxed">
                        From the origin of our materials to our pricing structure, we believe you have the right to know exactly what you are buying.
                    </p>
                </div>
            </section>
        </div>
    )
}
