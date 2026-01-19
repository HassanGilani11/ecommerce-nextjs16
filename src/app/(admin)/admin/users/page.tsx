import * as React from "react"
import Link from "next/link"
import { UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getUsers } from "@/app/actions/admin-users"
import { UsersTable } from "./users-table"

export const dynamic = "force-dynamic"

export default async function UsersManagementPage() {
    const users = await getUsers()

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-bold tracking-tighter">User Directory</h1>
                    <p className="text-zinc-500 text-sm">Manage store administrators, staff, and customer accounts.</p>
                </div>
                <Link href="/admin/users/new">
                    <Button className="rounded-2xl h-11 px-6 font-bold uppercase tracking-widest text-[11px] gap-2 shadow-lg shadow-black/5 transition-all hover:scale-[1.02] active:scale-95">
                        <UserPlus className="h-4 w-4" />
                        Add User
                    </Button>
                </Link>
            </div>

            {/* Table Area */}
            <UsersTable initialUsers={users} />
        </div>
    )
}
