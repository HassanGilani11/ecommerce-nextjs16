"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
    LayoutDashboard,
    Package,
    ShoppingBag,
    Menu,
    LogOut,
    User,
    Settings,
    Bell,
    Layers,
    Tag as TagIcon,
    Award,
    BarChart3,
    Ticket
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const ADMIN_NAV = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Products", href: "/admin/products", icon: Package },
    { name: "Categories", href: "/admin/categories", icon: Layers },
    { name: "Brands", href: "/admin/brands", icon: Award },
    { name: "Tags", href: "/admin/tags", icon: TagIcon },
    { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
    { name: "Coupons", href: "/admin/coupons", icon: Ticket },
    { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    { name: "Users", href: "/admin/users", icon: User },
    { name: "Settings", href: "/admin/settings", icon: Settings },
]

export default function AdminShell({
    children,
    settings,
    user
}: {
    children: React.ReactNode,
    settings: any,
    user: any
}) {
    const router = useRouter()
    const pathname = usePathname()
    const [isMobileOpen, setIsMobileOpen] = React.useState(false)
    const [isPending, startTransition] = React.useTransition()
    const [navigatingTo, setNavigatingTo] = React.useState<string | null>(null)

    const handleNav = (href: string) => {
        setNavigatingTo(href)
        startTransition(() => {
            router.push(href)
        })
    }

    const getInitials = (name: string) => {
        if (!name) return "U"
        return name
            .split(" ")
            .filter(Boolean)
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .substring(0, 2)
    }

    const getRoleLabel = (role: string) => {
        const roles: Record<string, string> = {
            admin: "System Administrator",
            shop_manager: "Shop Manager",
            editor: "Content Editor",
            moderator: "Moderator",
            author: "Author",
            customer: "Customer"
        }
        return roles[role] || role
    }

    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-zinc-950 text-zinc-400 py-6">
            <div className="px-6 mb-10">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="h-10 w-10 rounded-2xl bg-white flex items-center justify-center overflow-hidden shadow-lg shadow-black/20 shrink-0">
                        {settings?.favicon_url ? (
                            <img src={settings.favicon_url} alt="Logo" className="h-full w-full object-cover" />
                        ) : (
                            <div className="h-full w-full bg-zinc-800 flex items-center justify-center">
                                <span className="text-white font-black text-xl">
                                    {(settings?.site_title || "A")[0].toUpperCase()}
                                </span>
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl font-bold tracking-tighter text-white leading-none">
                            {settings?.site_title || "AVANT-GARDE"}
                        </span>
                        <span className="text-[10px] text-zinc-500 font-bold tracking-[0.2em] uppercase mt-1">
                            Admin Account
                        </span>
                    </div>
                </Link>
            </div>

            <nav className="flex-1 px-3 space-y-1">
                {ADMIN_NAV.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href
                    const isNavigating = navigatingTo === item.href && isPending

                    return (
                        <button
                            key={item.href}
                            onClick={() => handleNav(item.href)}
                            className={cn(
                                "w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group text-sm font-medium",
                                isActive || isNavigating
                                    ? "bg-white text-black shadow-lg shadow-white/5 scale-[1.02]"
                                    : "hover:bg-white/5 hover:text-white"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <Icon className={cn("h-5 w-5", isActive || isNavigating ? "text-black" : "group-hover:text-white")} />
                                {item.name}
                            </div>
                            {isNavigating && (
                                <div className="h-4 w-4 rounded-full border-2 border-zinc-200 border-t-zinc-800 animate-spin" />
                            )}
                        </button>
                    )
                })}
            </nav>

            <div className="px-3 mt-auto pt-6 border-t border-white/5 space-y-2">
                <button
                    onClick={() => handleNav("/")}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5"
                >
                    <ShoppingBag className="h-5 w-5" />
                    Storefront
                </button>
                <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl"
                    onClick={async () => {
                        const { logout } = await import("@/app/(main)/(auth)/logout/actions")
                        await logout()
                    }}
                >
                    <LogOut className="h-5 w-5" />
                    Log out
                </Button>
            </div>
        </div>
    )

    return (
        <div className="flex min-h-screen bg-zinc-50">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex w-64 flex-col fixed inset-y-0 z-50">
                <SidebarContent />
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 lg:pl-64 flex flex-col">
                {/* Header */}
                <header className="h-16 flex items-center justify-between px-4 sm:px-8 bg-white border-b sticky top-0 z-40">
                    {/* Progress Bar Loader - Perceived Performance Fix */}
                    {isPending && (
                        <div className="absolute top-0 left-0 right-0 h-[2px] overflow-hidden z-[60]">
                            <div className="h-full bg-zinc-900 animate-progress origin-left w-full" />
                        </div>
                    )}
                    <style jsx global>{`
                        @keyframes progress {
                            0% { transform: scaleX(0); }
                            50% { transform: scaleX(0.7); }
                            100% { transform: scaleX(0.9); }
                        }
                        .animate-progress {
                            animation: progress 20s cubic-bezier(0.1, 0.05, 0, 1) forwards;
                        }
                    `}</style>
                    <div className="flex items-center gap-4">
                        <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="lg:hidden text-zinc-600">
                                    <Menu className="h-6 w-6" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="p-0 w-64 border-none">
                                <SidebarContent />
                            </SheetContent>
                        </Sheet>
                        <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-widest hidden sm:block">
                            {ADMIN_NAV.find(item => item.href === pathname)?.name ||
                                ADMIN_NAV.find(item => pathname.startsWith(item.href) && item.href !== "/admin")?.name ||
                                "Admin"}
                        </h2>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-4">
                        <Button variant="ghost" size="icon" className="rounded-full relative text-zinc-600">
                            <Bell className="h-5 w-5" />
                            <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border-2 border-white" />
                        </Button>
                        <Separator orientation="vertical" className="h-6 hidden sm:block" />
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-10 w-auto rounded-full pl-0 hover:bg-transparent">
                                    <div className="flex items-center gap-3 pl-2 sm:pl-0">
                                        <div className="text-right hidden sm:block">
                                            <p className="text-xs font-bold text-zinc-900 leading-none tracking-tight uppercase">
                                                {user?.full_name || user?.username || "Admin Account"}
                                            </p>
                                            <p className="text-[10px] text-zinc-500 font-medium">
                                                {getRoleLabel(user?.role || "admin")}
                                            </p>
                                        </div>
                                        <div className="h-8 w-8 rounded-full bg-zinc-900 flex items-center justify-center text-white text-xs font-bold ring-2 ring-white ring-offset-2 overflow-hidden shadow-md">
                                            {user?.avatar_url ? (
                                                <img src={user.avatar_url} alt={user.full_name} className="h-full w-full object-cover" />
                                            ) : (
                                                getInitials(user?.full_name || user?.username || "Admin")
                                            )}
                                        </div>
                                    </div>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-64 p-2 rounded-2xl border-zinc-100 shadow-2xl" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal p-3">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-bold leading-none text-zinc-900">
                                            {user?.full_name || user?.username || "Admin Account"}
                                        </p>
                                        <p className="text-xs leading-none text-zinc-500 font-medium">
                                            {user?.email || "admin@avantgarde.com"}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-zinc-100 mx-2" />
                                <DropdownMenuItem asChild className="rounded-xl m-1 cursor-pointer">
                                    <Link href="/admin/profile" className="flex items-center">
                                        <User className="mr-3 h-4 w-4 text-zinc-500" />
                                        <span className="font-medium">Profile</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild className="rounded-xl m-1 cursor-pointer">
                                    <Link href="/admin/settings" className="flex items-center">
                                        <Settings className="mr-3 h-4 w-4 text-zinc-500" />
                                        <span className="font-medium">Settings</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-zinc-100 mx-2" />
                                <DropdownMenuItem className="text-red-600 focus:text-red-600 cursor-pointer rounded-xl m-1 font-bold" onClick={async () => {
                                    const { logout } = await import("@/app/(main)/(auth)/logout/actions")
                                    await logout()
                                }}>
                                    <LogOut className="mr-3 h-4 w-4" />
                                    <span>Log out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 p-4 sm:p-8 w-full">
                    {children}
                </main>
            </div>
        </div>
    )
}
