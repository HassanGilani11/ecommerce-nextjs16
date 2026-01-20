"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ShoppingCart, Menu, Search, User, Home, ShoppingBag, Shirt, Watch, Footprints, X, Package, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { PRODUCTS } from "@/lib/data"
import { ProductCard } from "@/components/product-card"
import { useCart } from "@/context/cart-context"

function SearchDialog() {
    const [open, setOpen] = React.useState(false)
    const [query, setQuery] = React.useState("")

    const filteredProducts = React.useMemo(() => {
        if (!query.trim()) return []
        return PRODUCTS.filter(product =>
            product.name.toLowerCase().includes(query.toLowerCase()) ||
            product.category.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 4)
    }, [query])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button className="flex items-center justify-center h-9 w-9 rounded-md transition-colors hover:bg-accent hover:text-accent-foreground">
                    <Search className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="sr-only">Search</span>
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden border-none shadow-2xl bg-background/80 backdrop-blur-2xl">
                <div className="relative border-b px-4 py-4 flex items-center">
                    <Search className="h-5 w-5 text-muted-foreground mr-3" />
                    <Input
                        placeholder="Type to search..."
                        className="border-none focus-visible:ring-0 bg-transparent text-lg h-10 p-0"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        autoFocus
                    />
                    {query && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 rounded-full"
                            onClick={() => setQuery("")}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </div>
                <div className="max-h-[400px] overflow-y-auto p-4">
                    {query === "" ? (
                        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-2">
                            <Search className="h-10 w-10 opacity-20" />
                            <p className="text-sm font-medium">Search for products, categories...</p>
                        </div>
                    ) : filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-2 gap-4">
                            {filteredProducts.map(product => (
                                <div key={product.id} onClick={() => setOpen(false)}>
                                    <ProductCard product={product} />
                                </div>
                            ))}
                            {query && filteredProducts.length > 0 && (
                                <Link
                                    href="/shop"
                                    className="col-span-full pt-4 text-center border-t mt-2 group"
                                    onClick={() => setOpen(false)}
                                >
                                    <p className="text-sm font-semibold group-hover:text-primary transition-colors">
                                        View all products for "{query}"
                                    </p>
                                </Link>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-2">
                            <Search className="h-10 w-10 opacity-20" />
                            <p className="text-sm font-medium">No results found for "{query}"</p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}

export function NavbarClient({ settings, categories, user }: { settings: any, categories: any[], user?: any }) {
    const pathname = usePathname()
    const { totalItems } = useCart()

    const accountHref = user
        ? (user.role === 'admin' ? "/admin" : "/profile")
        : "/login"

    // Map static and dynamic items
    const navItems = [
        { name: "Home", href: "/", icon: Home },
        { name: "Shop", href: "/shop", icon: ShoppingBag },
        ...categories.map(cat => ({
            name: cat.name,
            href: `/product-category/${cat.slug}`,
            icon: cat.slug === 'apparel' ? Shirt : cat.slug === 'accessories' ? Watch : cat.slug === 'footwear' ? Footprints : Package
        }))
    ]

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-14 sm:h-16 items-center justify-between px-4">
                <div className="flex items-center gap-4 sm:gap-8">
                    <Link href="/" className="flex items-center gap-2 text-lg sm:text-xl font-bold tracking-tighter hover:text-primary transition-colors">
                        {settings?.logo_url ? (
                            <img src={settings.logo_url} alt={settings?.site_title || "AVANT-GARDE"} className="h-8 w-auto object-contain" />
                        ) : (
                            settings?.site_title || "AVANT-GARDE"
                        )}
                    </Link>
                    <nav className="hidden lg:flex gap-6">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`text-[13px] font-bold uppercase tracking-widest transition-colors hover:text-primary ${pathname === item.href ? "text-primary border-b-2 border-primary" : "text-muted-foreground"
                                    }`}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                </div>

                <div className="flex items-center gap-1 sm:gap-2">
                    <SearchDialog />
                    <Link href={accountHref} className="hidden sm:flex" id="account-link">
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                            <User className="h-4 w-4 sm:h-5 sm:w-5" />
                            <span className="sr-only">{user ? "Account" : "Login"}</span>
                        </Button>
                    </Link>
                    <Link href="/cart">
                        <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-full">
                            <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
                            {totalItems > 0 && (
                                <Badge className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-[10px] bg-primary text-primary-foreground font-bold border-2 border-background">
                                    {totalItems}
                                </Badge>
                            )}
                            <span className="sr-only">Cart</span>
                        </Button>
                    </Link>

                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="lg:hidden rounded-full h-9 w-9">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[300px] sm:w-[350px] pr-0 rounded-l-[2.5rem] border-l-0 shadow-2xl">
                            <SheetHeader className="px-6 text-left py-6">
                                <SheetTitle className="text-2xl font-black tracking-tighter">
                                    {settings?.logo_url ? (
                                        <img src={settings.logo_url} alt={settings?.site_title || "AVANT-GARDE"} className="h-10 w-auto object-contain" />
                                    ) : (
                                        settings?.site_title || "AVANT-GARDE"
                                    )}
                                </SheetTitle>
                            </SheetHeader>
                            <div className="flex flex-col h-full py-2">
                                <nav className="flex flex-col gap-1 px-3">
                                    <div className="px-4 py-3 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Explore</div>
                                    {navItems.map((item) => {
                                        const Icon = item.icon
                                        return (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                className={`flex items-center gap-4 px-4 py-4 rounded-3xl transition-all duration-300 group ${pathname === item.href
                                                    ? "bg-zinc-900 text-white shadow-xl shadow-zinc-200"
                                                    : "hover:bg-zinc-50 text-muted-foreground hover:text-zinc-900"
                                                    }`}
                                            >
                                                <Icon className={`h-5 w-5 ${pathname === item.href ? "text-white" : "group-hover:scale-110 transition-transform"}`} />
                                                <span className="font-bold text-sm uppercase tracking-widest">{item.name}</span>
                                            </Link>
                                        )
                                    })}

                                    <div className="px-4 py-6">
                                        <Separator className="bg-zinc-100" />
                                    </div>

                                    <div className="px-4 py-3 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{user ? "Session" : "Profile"}</div>
                                    <Link
                                        href={accountHref}
                                        className="flex items-center gap-4 px-4 py-4 rounded-3xl hover:bg-zinc-50 text-muted-foreground hover:text-zinc-900 transition-all font-bold text-sm uppercase tracking-widest"
                                    >
                                        <User className="h-5 w-5" />
                                        {user ? "Dashboard" : "Account"}
                                    </Link>
                                    {user && (
                                        <button
                                            onClick={async () => {
                                                const { logout } = await import("@/app/(main)/(auth)/logout/actions")
                                                await logout()
                                            }}
                                            className="flex items-center gap-4 px-4 py-4 rounded-3xl hover:bg-rose-50 text-rose-500 transition-all font-bold text-sm uppercase tracking-widest"
                                        >
                                            <LogOut className="h-5 w-5" />
                                            Log Out
                                        </button>
                                    )}
                                </nav>

                                <div className="mt-auto px-6 py-10">
                                    <Link href="/shop" className="block group">
                                        <Button className="w-full rounded-2xl h-14 font-black uppercase tracking-[.15em] text-[10px] shadow-lg shadow-zinc-200 transition-all active:scale-95 group-hover:bg-zinc-800">
                                            Shop Collection
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    )
}
