import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Image from "next/image"

export default async function PrintOrderPage({
    params
}: {
    params: Promise<{ orderId: string }>
}) {
    const { orderId } = await params
    const supabase = await createClient()

    const { data: order, error } = await supabase
        .from('orders')
        .select(`
            *,
            order_items (
                *,
                products (
                    title,
                    price,
                    featured_image
                )
            )
        `)
        .eq('id', orderId)
        .single()

    if (error || !order) {
        notFound()
    }

    return (
        <div className="bg-white p-8 max-w-4xl mx-auto print:max-w-none print:p-0">
            {/* Invoice Header */}
            <div className="flex justify-between items-start border-b-2 border-zinc-900 pb-8 mb-8">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">Invoice</h1>
                    <div className="text-zinc-500 font-mono text-xs">
                        <p>Order ID: {order.id.toUpperCase()}</p>
                        <p>Date: {new Date(order.created_at).toLocaleString()}</p>
                    </div>
                </div>
                <div className="text-right">
                    <h2 className="text-xl font-bold tracking-tight">AVANT-GARDE</h2>
                    <p className="text-xs text-zinc-500 font-medium">123 Fashion Ave, NY 10001</p>
                    <p className="text-xs text-zinc-500 font-medium">contact@avantgarde.com</p>
                </div>
            </div>

            {/* Customer Details */}
            <div className="grid grid-cols-2 gap-12 mb-12">
                <div>
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">Bill To:</h3>
                    <p className="text-sm font-bold text-zinc-900 mb-1">{order.email}</p>
                    <p className="text-xs text-zinc-500 font-medium leading-relaxed whitespace-pre-wrap">
                        {order.billing_address || order.shipping_address}
                    </p>
                </div>
                <div>
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">Ship To:</h3>
                    <p className="text-sm font-bold text-zinc-900 mb-1">{order.email}</p>
                    <p className="text-xs text-zinc-500 font-medium leading-relaxed whitespace-pre-wrap">
                        {order.shipping_address}
                    </p>
                </div>
            </div>

            {/* Order Items */}
            <table className="w-full mb-12">
                <thead>
                    <tr className="border-b border-zinc-200">
                        <th className="text-left py-3 text-[10px] font-black uppercase tracking-widest text-zinc-400">Item Description</th>
                        <th className="text-center py-3 text-[10px] font-black uppercase tracking-widest text-zinc-400">Qty</th>
                        <th className="text-right py-3 text-[10px] font-black uppercase tracking-widest text-zinc-400">Price</th>
                        <th className="text-right py-3 text-[10px] font-black uppercase tracking-widest text-zinc-400">Total</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                    {order.order_items.map((item: any) => (
                        <tr key={item.id}>
                            <td className="py-4">
                                <div className="flex items-center gap-4">
                                    <span className="text-sm font-bold text-zinc-900">{item.products?.title}</span>
                                </div>
                            </td>
                            <td className="py-4 text-center text-sm font-medium text-zinc-600">{item.quantity}</td>
                            <td className="py-4 text-right text-sm font-medium text-zinc-600">${Number(item.price).toFixed(2)}</td>
                            <td className="py-4 text-right text-sm font-black text-zinc-900">${(item.quantity * item.price).toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Totals */}
            <div className="flex justify-end">
                <div className="w-64 space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-zinc-500 font-medium whitespace-nowrap">Subtotal</span>
                        <span className="font-bold text-zinc-900">${Number(order.subtotal).toFixed(2)}</span>
                    </div>
                    {Number(order.discount) > 0 && (
                        <div className="flex justify-between text-sm text-rose-600">
                            <span className="font-medium">Discount</span>
                            <span className="font-bold">-${Number(order.discount).toFixed(2)}</span>
                        </div>
                    )}
                    <div className="flex justify-between text-sm">
                        <span className="text-zinc-500 font-medium">Shipping</span>
                        <span className="font-bold text-zinc-900">$10.00</span>
                    </div>
                    <div className="pt-3 border-t-2 border-zinc-900 flex justify-between items-end">
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-900">Grand Total</span>
                        <span className="text-2xl font-black tracking-tighter text-zinc-900">${Number(order.total).toFixed(2)}</span>
                    </div>
                </div>
            </div>

            {/* Print Script */}
            <script dangerouslySetInnerHTML={{ __html: 'window.onload = () => { setTimeout(() => window.print(), 500); }' }} />
        </div>
    )
}
