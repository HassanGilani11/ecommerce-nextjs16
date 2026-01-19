"use client"

import * as React from "react"
import Link from "next/link"
import {
    ArrowLeft,
    Save,
    Info,
    Truck,
    CreditCard,
    ShoppingBag,
    Plus,
    Trash2,
    Calculator,
    User,
    Mail,
    MapPin,
    Calendar,
    Clock,
    StickyNote
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

export default function AddOrderPage() {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/orders">
                        <Button variant="ghost" size="icon" className="rounded-2xl hover:bg-white shadow-sm border border-transparent hover:border-zinc-100 transition-all">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tighter">Add new order</h1>
                        <p className="text-zinc-500 text-sm font-medium">Manually create a new purchase record.</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Main Content Area */}
                <div className="lg:col-span-3 space-y-8">
                    {/* Order Details Card */}
                    <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] rounded-[2.5rem] bg-white overflow-hidden">
                        <CardHeader className="border-b border-zinc-50 px-10 py-5">
                            <CardTitle className="text-xl font-black tracking-tight flex items-center gap-3">
                                <div className="h-8 w-8 rounded-xl bg-zinc-900 flex items-center justify-center">
                                    <ShoppingBag className="h-4 w-4 text-white" />
                                </div>
                                Order #16666 details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="px-10 pb-10 pt-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                                {/* General Section */}
                                <div className="space-y-6">
                                    <h3 className="text-xs font-black uppercase tracking-widest text-zinc-900 border-b border-zinc-100 pb-2">General</h3>

                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Date created <span className="text-rose-500">*</span></Label>
                                        <div className="flex gap-2">
                                            <div className="relative flex-1">
                                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
                                                <Input type="date" defaultValue="2026-01-13" className="h-10 pl-9 rounded-xl border-zinc-100 bg-zinc-50/50 text-xs font-medium" />
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Input placeholder="17" className="h-10 w-12 text-center rounded-xl border-zinc-100 bg-zinc-50/50 text-xs font-medium" />
                                                <span className="text-zinc-400">:</span>
                                                <Input placeholder="24" className="h-10 w-12 text-center rounded-xl border-zinc-100 bg-zinc-50/50 text-xs font-medium" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Status <span className="text-rose-500">*</span></Label>
                                        <Select defaultValue="pending">
                                            <SelectTrigger className="h-10 rounded-xl border-zinc-100 bg-zinc-50/50 text-xs font-medium">
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl border-zinc-100">
                                                <SelectItem value="pending" className="text-xs font-medium">Pending payment</SelectItem>
                                                <SelectItem value="processing" className="text-xs font-medium">Processing</SelectItem>
                                                <SelectItem value="on-hold" className="text-xs font-medium">On hold</SelectItem>
                                                <SelectItem value="completed" className="text-xs font-medium">Completed</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Customer <span className="text-rose-500">*</span></Label>
                                        <Select defaultValue="guest">
                                            <SelectTrigger className="h-10 rounded-xl border-zinc-100 bg-zinc-50/50 text-xs font-medium">
                                                <div className="flex items-center gap-2">
                                                    <User className="h-3 w-3 text-zinc-400" />
                                                    <SelectValue placeholder="Select customer" />
                                                </div>
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl border-zinc-100">
                                                <SelectItem value="guest" className="text-xs font-medium">Guest</SelectItem>
                                                <SelectItem value="user1" className="text-xs font-medium">Sarah Johnson</SelectItem>
                                                <SelectItem value="user2" className="text-xs font-medium">Michael Chen</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {/* Billing Section */}
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
                                        <h3 className="text-xs font-black uppercase tracking-widest text-zinc-900">Billing</h3>
                                        <Button variant="ghost" size="icon" className="h-6 w-6 rounded-lg text-zinc-400">
                                            <Plus className="h-3 w-3" />
                                        </Button>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Address <span className="text-rose-500">*</span></Label>
                                        <Textarea placeholder="No billing address set." className="min-h-[80px] rounded-xl border-zinc-100 bg-zinc-50/50 text-xs font-medium resize-none" />
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Email address <span className="text-rose-500">*</span></Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
                                            <Input placeholder="email@example.com" className="h-10 pl-9 rounded-xl border-zinc-100 bg-zinc-50/50 text-xs font-medium" />
                                        </div>
                                    </div>
                                </div>

                                {/* Shipping Section */}
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
                                        <h3 className="text-xs font-black uppercase tracking-widest text-zinc-900">Shipping</h3>
                                        <Button variant="ghost" size="icon" className="h-6 w-6 rounded-lg text-zinc-400">
                                            <Plus className="h-3 w-3" />
                                        </Button>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Address <span className="text-rose-500">*</span></Label>
                                        <Textarea placeholder="No shipping address set." className="min-h-[80px] rounded-xl border-zinc-100 bg-zinc-50/50 text-xs font-medium resize-none" />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Items Table Card */}
                    <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] rounded-[2.5rem] bg-white overflow-hidden">
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-zinc-50/50 hover:bg-zinc-50/50 border-zinc-100">
                                        <TableHead className="px-10 text-[10px] font-black uppercase tracking-widest py-5">Item</TableHead>
                                        <TableHead className="text-[10px] font-black uppercase tracking-widest text-right">Price</TableHead>
                                        <TableHead className="text-[10px] font-black uppercase tracking-widest text-center w-[100px]">Qty</TableHead>
                                        <TableHead className="text-[10px] font-black uppercase tracking-widest text-right pr-10 w-[150px]">Total</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow className="border-zinc-50">
                                        <TableCell colSpan={4} className="h-32 text-center text-zinc-400 text-xs italic">
                                            No items added to this order.
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>

                            <div className="bg-zinc-50/30 p-8 flex flex-col items-end gap-3 border-t border-zinc-50">
                                <div className="flex items-center justify-between w-48 text-xs">
                                    <span className="font-bold text-zinc-400">Items Subtotal:</span>
                                    <span className="font-black text-zinc-900">$0.00</span>
                                </div>
                                <div className="flex items-center justify-between w-48 text-sm">
                                    <span className="font-bold text-zinc-900">Order Total:</span>
                                    <span className="font-black text-rose-600">$0.00</span>
                                </div>
                            </div>

                            <div className="p-8 border-t border-zinc-50 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Button variant="outline" className="rounded-xl h-10 px-6 font-bold uppercase tracking-widest text-[10px] border-zinc-100 hover:bg-white text-zinc-600 shadow-sm">
                                        Add item(s)
                                    </Button>
                                    <Button variant="outline" className="rounded-xl h-10 px-6 font-bold uppercase tracking-widest text-[10px] border-zinc-100 hover:bg-white text-zinc-600 shadow-sm">
                                        Apply coupon
                                    </Button>
                                </div>
                                <Button className="rounded-xl h-10 px-6 font-bold uppercase tracking-widest text-[10px] gap-2 shadow-lg shadow-black/5 hover:scale-[1.02] active:scale-95 transition-all">
                                    <Calculator className="h-3.5 w-3.5" />
                                    Recalculate
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar area */}
                <div className="space-y-8">
                    {/* Order Actions */}
                    <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] rounded-[2.5rem] bg-white overflow-hidden">
                        <CardHeader className="border-b border-zinc-50 px-8 py-4">
                            <CardTitle className="text-lg font-black tracking-tight">Order actions</CardTitle>
                        </CardHeader>
                        <CardContent className="px-8 pb-8 pt-4 space-y-6">
                            <div className="space-y-2">
                                <Select>
                                    <SelectTrigger className="h-11 rounded-xl border-zinc-100 bg-zinc-50/50 text-xs font-medium">
                                        <SelectValue placeholder="Choose an action..." />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-zinc-100">
                                        <SelectItem value="email" className="text-xs font-medium">Email order details</SelectItem>
                                        <SelectItem value="invoice" className="text-xs font-medium">Generate packing slip</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-zinc-50">
                                <Button variant="ghost" className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 font-bold uppercase tracking-widest text-[10px] h-auto p-0 underline-offset-4 hover:underline">
                                    Move to Trash
                                </Button>
                                <Button className="rounded-xl h-10 px-8 font-extrabold uppercase tracking-widest text-[10px] gap-2 shadow-lg shadow-black/5 hover:scale-[1.02] active:scale-95 transition-all">
                                    Create
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Order Attribution */}
                    <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] rounded-[2.5rem] bg-white overflow-hidden">
                        <CardHeader className="border-b border-zinc-50 px-8 py-4">
                            <CardTitle className="text-lg font-black tracking-tight">Order attribution</CardTitle>
                        </CardHeader>
                        <CardContent className="px-8 pb-8 pt-4">
                            <div className="space-y-4">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Origin</p>
                                    <p className="text-sm font-bold text-zinc-900 mt-1">Unknown</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Order Notes */}
                    <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.02)] rounded-[2.5rem] bg-white overflow-hidden">
                        <CardHeader className="border-b border-zinc-50 px-8 py-4">
                            <CardTitle className="text-lg font-black tracking-tight flex items-center gap-2">
                                <StickyNote className="h-4 w-4 text-zinc-400" />
                                Order notes
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="px-8 pb-8 pt-4 space-y-6">
                            <div className="text-center py-4 bg-zinc-50/50 rounded-2xl border border-dashed border-zinc-100">
                                <p className="text-[10px] text-zinc-400 font-bold italic">There are no notes yet.</p>
                            </div>

                            <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Add note</Label>
                                <Textarea placeholder="..." className="min-h-[100px] rounded-xl border-zinc-100 bg-zinc-50/50 text-xs font-medium resize-none p-4" />

                                <div className="flex gap-2">
                                    <Select defaultValue="private">
                                        <SelectTrigger className="h-10 rounded-xl border-zinc-100 bg-zinc-50/50 text-[10px] font-bold uppercase tracking-widest">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl border-zinc-100">
                                            <SelectItem value="private" className="text-xs font-medium">Private note</SelectItem>
                                            <SelectItem value="customer" className="text-xs font-medium">Note to customer</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Button variant="outline" className="rounded-xl h-10 px-6 font-bold uppercase tracking-widest text-[10px] border-zinc-100 hover:bg-white text-zinc-900 shadow-sm">
                                        Add
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
