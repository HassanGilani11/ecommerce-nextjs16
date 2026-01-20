import Link from "next/link"
import { getCategories } from "@/actions/get-categories"
import { getSettings } from "@/actions/get-settings"

import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react"

export async function Footer() {
    const [categories, settings] = await Promise.all([
        getCategories(),
        getSettings()
    ])

    const socialLinks = [
        { icon: Facebook, href: settings?.facebook_url, label: "Facebook" },
        { icon: Twitter, href: settings?.twitter_url, label: "Twitter" },
        { icon: Instagram, href: settings?.instagram_url, label: "Instagram" },
        { icon: Linkedin, href: settings?.linkedin_url, label: "LinkedIn" },
    ].filter(link => link.href)

    return (
        <footer className="border-t bg-background">
            <div className="container mx-auto py-12 md:py-16 px-4">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="col-span-2">
                        <Link href="/" className="mb-4 block">
                            {settings?.logo_url ? (
                                <img src={settings.logo_url} alt={settings?.site_title || "AVANT-GARDE"} className="h-10 w-auto object-contain" />
                            ) : (
                                <span className="text-xl font-bold tracking-tighter">{settings?.site_title || "AVANT-GARDE"}</span>
                            )}
                        </Link>
                        <p className="text-muted-foreground max-w-xs text-sm leading-relaxed font-medium">
                            {settings?.site_tagline || "Curating the finest minimalist essentials for the modern lifestyle. Quality meets aesthetic."}
                        </p>
                        {socialLinks.length > 0 && (
                            <div className="flex gap-4 mt-6">
                                {socialLinks.map((social) => {
                                    const Icon = social.icon
                                    return (
                                        <a
                                            key={social.label}
                                            href={social.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="h-9 w-9 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-400 hover:bg-zinc-900 hover:text-white transition-all duration-300"
                                        >
                                            <Icon className="h-4 w-4" />
                                            <span className="sr-only">{social.label}</span>
                                        </a>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                    <div>
                        <h4 className="font-bold mb-6 text-[11px] uppercase tracking-[0.2em] text-zinc-900">Shop</h4>
                        <ul className="space-y-4 text-sm text-muted-foreground font-medium">
                            <li><Link href="/shop" className="hover:text-primary transition-colors">All Products</Link></li>
                            {categories.map((cat: any) => (
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
                    <p>© {new Date().getFullYear()} {settings?.site_title || "AVANT-GARDE"}. All rights reserved.</p>
                    <div className="flex gap-8">
                        <Link href="/privacy" className="hover:text-primary">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-primary">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
