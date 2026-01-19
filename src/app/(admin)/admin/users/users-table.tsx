"use client"

import * as React from "react"
import Link from "next/link"
import {
    Search,
    MoreHorizontal,
    Edit2,
    Trash2,
    Filter,
    ArrowUpDown,
    Mail,
    User,
    Shield,
    CheckCircle2,
    XCircle,
    Clock,
    UserCheck,
    MessageSquare,
    Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { deleteUser, updateUser } from "@/app/actions/admin-users"
import { toast } from "sonner"

const ROLE_CONFIG = {
    admin: {
        label: "Admin",
        icon: Shield,
        class: "bg-red-50 text-red-600 border-red-100"
    },
    moderator: {
        label: "Moderator",
        icon: UserCheck,
        class: "bg-blue-50 text-blue-600 border-blue-100"
    },
    customer: {
        label: "Customer",
        icon: User,
        class: "bg-zinc-50 text-zinc-600 border-zinc-100"
    },
    user: {
        label: "User",
        icon: User,
        class: "bg-zinc-50 text-zinc-600 border-zinc-100"
    }
}

const STATUS_CONFIG = {
    active: {
        label: "Active",
        icon: CheckCircle2,
        class: "bg-emerald-50 text-emerald-600 border-emerald-100"
    },
    pending: {
        label: "Pending",
        icon: Clock,
        class: "bg-amber-50 text-amber-600 border-amber-100"
    },
    banned: {
        label: "Banned",
        icon: XCircle,
        class: "bg-rose-50 text-rose-600 border-rose-100"
    },
    suspended: {
        label: "Suspended",
        icon: XCircle,
        class: "bg-zinc-50 text-zinc-600 border-zinc-100"
    }
}

interface UsersTableProps {
    initialUsers: any[]
}

export function UsersTable({ initialUsers }: UsersTableProps) {
    const [searchQuery, setSearchQuery] = React.useState("")
    const [isDeleting, setIsDeleting] = React.useState<string | null>(null)

    const filteredUsers = initialUsers.filter(user => {
        const searchStr = `${user.username} ${user.full_name} ${user.email}`.toLowerCase()
        return searchStr.includes(searchQuery.toLowerCase())
    })

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this user profile?")) return

        setIsDeleting(id)
        const result = await deleteUser(id)
        setIsDeleting(null)

        if (result.success) {
            toast.success("User profile deleted successfully")
        } else {
            toast.error(result.error || "Failed to delete user")
        }
    }

    const handleToggleStatus = async (id: string, currentStatus: string) => {
        const newStatus = currentStatus === 'active' ? 'suspended' : 'active'
        const result = await updateUser(id, { status: newStatus })

        if (result.success) {
            toast.success(`User status updated to ${newStatus}`)
        } else {
            toast.error(result.error || "Failed to update status")
        }
    }

    return (
        <div className="bg-white rounded-[2rem] shadow-sm border border-zinc-100 overflow-hidden">
            <div className="flex flex-col sm:flex-row items-center gap-4 p-6 border-b border-zinc-50">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                    <input
                        placeholder="Search by name, email or username..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-11 h-11 rounded-xl border border-zinc-100 bg-zinc-50/50 focus:outline-none focus:ring-1 focus:ring-zinc-200 text-sm transition-all"
                    />
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Button variant="outline" className="flex-1 sm:flex-none rounded-xl h-11 px-4 gap-2 border-zinc-100 text-zinc-600 font-bold uppercase tracking-widest text-[10px]">
                        <Filter className="h-3.5 w-3.5" />
                        Filter
                    </Button>
                    <Button variant="outline" className="flex-1 sm:flex-none rounded-xl h-11 px-4 gap-2 border-zinc-100 text-zinc-600 font-bold uppercase tracking-widest text-[10px]">
                        <ArrowUpDown className="h-3.5 w-3.5" />
                        Sort
                    </Button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent border-zinc-50">
                            <TableHead className="px-8 text-[10px] font-bold uppercase tracking-widest">Username</TableHead>
                            <TableHead className="text-[10px] font-bold uppercase tracking-widest">Full Name</TableHead>
                            <TableHead className="text-[10px] font-bold uppercase tracking-widest hidden lg:table-cell">Email</TableHead>
                            <TableHead className="text-[10px] font-bold uppercase tracking-widest">Role</TableHead>
                            <TableHead className="text-[10px] font-bold uppercase tracking-widest">Status</TableHead>
                            <TableHead className="text-[10px] font-bold uppercase tracking-widest hidden md:table-cell">Registered At</TableHead>
                            <TableHead className="text-[10px] font-bold uppercase tracking-widest text-center">Posts</TableHead>
                            <TableHead className="text-right pr-8 text-[10px] font-bold uppercase tracking-widest">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredUsers.map((user) => {
                            const role = ROLE_CONFIG[user.role as keyof typeof ROLE_CONFIG] || ROLE_CONFIG.user
                            const status = STATUS_CONFIG[user.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.pending
                            const RoleIcon = role.icon
                            const StatusIcon = status.icon

                            return (
                                <TableRow key={user.id} className="group border-zinc-50 hover:bg-zinc-50/50 transition-colors">
                                    <TableCell className="px-8 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="h-9 w-9 rounded-full bg-zinc-100 border border-zinc-200 overflow-hidden flex-shrink-0">
                                                {user.avatar_url ? (
                                                    <img src={user.avatar_url} alt={user.username} className="h-full w-full object-cover" />
                                                ) : (
                                                    <div className="h-full w-full flex items-center justify-center bg-zinc-900 text-white text-[10px] font-bold">
                                                        {(user.full_name || user.username || 'U').charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                            </div>
                                            <span className="font-bold text-zinc-900 font-mono text-xs">
                                                {user.username ? `@${user.username}` : 'N/A'}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="font-bold text-zinc-900 text-sm">{user.full_name || 'Anonymous'}</span>
                                    </TableCell>
                                    <TableCell className="hidden lg:table-cell">
                                        <div className="flex items-center gap-2 text-zinc-500 text-xs">
                                            <Mail className="h-3 w-3" />
                                            {user.email}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={cn("rounded-lg border px-2 py-0.5 gap-1.5 font-bold text-[10px] uppercase tracking-wider", role.class)}>
                                            <RoleIcon className="h-3 w-3" />
                                            {role.label}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={cn("rounded-lg border px-2 py-0.5 gap-1.5 font-bold text-[10px] uppercase tracking-wider", status.class)}>
                                            <StatusIcon className="h-3 w-3" />
                                            {status.label}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-zinc-500 text-xs hidden md:table-cell">
                                        {new Date(user.created_at).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-center font-black text-zinc-900 text-xs">
                                        <div className="flex items-center justify-center gap-1.5">
                                            <MessageSquare className="h-4 w-4 text-zinc-400" />
                                            {user.post_count || 0}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right pr-8">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-zinc-400 hover:text-zinc-900 hover:bg-white shadow-none transition-all">
                                                    {isDeleting === user.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <MoreHorizontal className="h-3.5 w-3.5" />}
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="rounded-xl border-zinc-100 shadow-xl">
                                                <DropdownMenuLabel className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 px-2 py-1.5">Profile Options</DropdownMenuLabel>
                                                <Link href={`/admin/users/${user.id}/edit`}>
                                                    <DropdownMenuItem className="rounded-lg gap-2 text-xs font-medium cursor-pointer">
                                                        <Edit2 className="h-3.5 w-3.5 text-zinc-400" /> Edit User Profile
                                                    </DropdownMenuItem>
                                                </Link>
                                                <DropdownMenuItem
                                                    className="rounded-lg gap-2 text-xs font-medium cursor-pointer"
                                                    onClick={() => handleToggleStatus(user.id, user.status)}
                                                >
                                                    {user.status === 'suspended' ? 'Activate User' : 'Suspend User'}
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuLabel className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400 px-2 py-1">Quick Role Change</DropdownMenuLabel>
                                                <DropdownMenuItem
                                                    className="rounded-lg gap-2 text-xs font-medium cursor-pointer"
                                                    onClick={async () => {
                                                        const result = await updateUser(user.id, { role: 'admin' })
                                                        if (result.success) toast.success("Role updated to Admin")
                                                    }}
                                                >
                                                    Make Admin
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="rounded-lg gap-2 text-xs font-medium cursor-pointer"
                                                    onClick={async () => {
                                                        const result = await updateUser(user.id, { role: 'moderator' })
                                                        if (result.success) toast.success("Role updated to Moderator")
                                                    }}
                                                >
                                                    Make Moderator
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="rounded-lg gap-2 text-xs font-medium cursor-pointer"
                                                    onClick={async () => {
                                                        const result = await updateUser(user.id, { role: 'customer' })
                                                        if (result.success) toast.success("Role updated to Customer")
                                                    }}
                                                >
                                                    Make Customer
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    className="rounded-lg gap-2 text-xs font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 cursor-pointer"
                                                    onClick={() => handleDelete(user.id)}
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" /> Delete Profile
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </div>

            <div className="p-6 border-t border-zinc-50 bg-zinc-50/30">
                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-[0.2em] text-center">
                    Managing {filteredUsers.length} global accounts
                </p>
            </div>
        </div >
    )
}
