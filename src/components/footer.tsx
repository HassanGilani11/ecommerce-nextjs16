import Link from "next/link"
import { getCategories } from "@/actions/get-categories"

export async function Footer() {
    const categories = await getCategories()

    return (
        <footer className="border-t bg-background">
            <div className="container mx-auto py-12 md:py-16 px-4">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="col-span-2">
                        <Link href="/" className="text-xl font-bold tracking-tighter mb-4 block">
                            AVANT-GARDE
                        </Link>
                        <p className="text-muted-foreground max-w-xs text-sm leading-relaxed font-medium">
                            Curating the finest minimalist essentials for the modern lifestyle. Quality meets aesthetic.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold mb-6 text-[11px] uppercase tracking-[0.2em] text-zinc-900">Shop</h4>
                        <ul className="space-y-4 text-sm text-muted-foreground font-medium">
                            <li><Link href="/shop" className="hover:text-primary transition-colors">All Products</Link></li>
                            {categories.map((cat) => (
                                <li key={cat.id}>
                                    <Link href={`/product-category/${cat.slug}`} className="hover:text-primary transition-colors">
                                        {cat.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-6 text-[11px] uppercase tracking-[0.2em] text-zinc-900">Support</h4>
                        <ul className="space-y-4 text-sm text-muted-foreground font-medium">
                            <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                            <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
                            <li><Link href="/shipping" className="hover:text-primary transition-colors">Shipping</Link></li>
                            <li><Link href="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-16 pt-8 border-t flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    <p>© {new Date().getFullYear()} AVANT-GARDE. All rights reserved.</p>
                    <div className="flex gap-8">
                        <Link href="/privacy" className="hover:text-primary">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-primary">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
