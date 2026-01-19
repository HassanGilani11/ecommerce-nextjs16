import { Skeleton } from "@/components/ui/skeleton"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

export function OrdersSkeleton() {
    return (
        <Table>
            <TableHeader>
                <TableRow className="hover:bg-transparent border-zinc-50 text-zinc-400">
                    <TableHead className="px-8 text-[10px] font-black uppercase tracking-widest h-14">Order ID</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest h-14">Customer</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest hidden md:table-cell h-14">Date</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest h-14">Total Amount</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest h-14">Status</TableHead>
                    <TableHead className="text-right pr-8 text-[10px] font-black uppercase tracking-widest h-14">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {[...Array(5)].map((_, i) => (
                    <TableRow key={i} className="border-zinc-50">
                        <TableCell className="px-8 py-5">
                            <Skeleton className="h-4 w-16 rounded" />
                        </TableCell>
                        <TableCell>
                            <div className="flex flex-col gap-1.5">
                                <Skeleton className="h-3 w-24 rounded" />
                                <Skeleton className="h-2.5 w-32 rounded" />
                            </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                            <Skeleton className="h-3 w-20 rounded" />
                        </TableCell>
                        <TableCell>
                            <Skeleton className="h-4 w-16 rounded" />
                        </TableCell>
                        <TableCell>
                            <Skeleton className="h-6 w-24 rounded-xl" />
                        </TableCell>
                        <TableCell className="text-right pr-8">
                            <div className="flex items-center justify-end gap-1">
                                <Skeleton className="h-8 w-8 rounded-xl" />
                                <Skeleton className="h-8 w-8 rounded-xl" />
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
