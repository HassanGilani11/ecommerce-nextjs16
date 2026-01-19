import { Truck, Clock, Globe, RotateCcw } from "lucide-react"

export default function ShippingPage() {
    return (
        <div className="container mx-auto py-12 sm:py-24 max-w-4xl space-y-16">
            <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl font-bold tracking-tighter">Shipping & Delivery</h1>
                <p className="text-muted-foreground text-lg">Everything you need to know about getting your items home.</p>
            </div>

            <div className="grid gap-12">
                <div className="flex gap-6 items-start p-6 sm:p-8 bg-secondary/30 rounded-3xl border border-secondary/50">
                    <Truck className="h-8 w-8 text-primary shrink-0" />
                    <div className="space-y-2">
                        <h3 className="text-xl font-bold tracking-tight">Complimentary Shipping</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            We offer free standard shipping on all orders over $150. For orders under $150, a flat rate of $10 applies for standard delivery.
                        </p>
                    </div>
                </div>

                <div className="flex gap-6 items-start p-6 sm:p-8 bg-secondary/30 rounded-3xl border border-secondary/50">
                    <Clock className="h-8 w-8 text-primary shrink-0" />
                    <div className="space-y-2">
                        <h3 className="text-xl font-bold tracking-tight">Processing Times</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            Orders are typically processed within 24-48 business hours. You'll receive a tracking number as soon as your package is on its way.
                        </p>
                    </div>
                </div>

                <div className="flex gap-6 items-start p-6 sm:p-8 bg-secondary/30 rounded-3xl border border-secondary/50">
                    <Globe className="h-8 w-8 text-primary shrink-0" />
                    <div className="space-y-2">
                        <h3 className="text-xl font-bold tracking-tight">International Delivery</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            We ship worldwide. International orders typically take 7-14 business days depending on the destination. Duties and taxes are calculated at checkout.
                        </p>
                    </div>
                </div>

                <div className="flex gap-6 items-start p-6 sm:p-8 bg-secondary/30 rounded-3xl border border-secondary/50">
                    <RotateCcw className="h-8 w-8 text-primary shrink-0" />
                    <div className="space-y-2">
                        <h3 className="text-xl font-bold tracking-tight">Returns & Exchanges</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            Not quite right? Most items can be returned within 30 days of delivery. Items must be in original condition with all tags attached.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
