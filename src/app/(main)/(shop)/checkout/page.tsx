"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/context/cart-context"
import { cn } from "@/lib/utils"
import { placeOrder } from "@/app/actions/orders"
import { validateCoupon } from "@/app/actions/coupons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
    Loader2,
    ArrowRight,
    CheckCircle2,
    CreditCard,
    Truck,
    Tag,
    Building2,
    Banknote,
    Terminal
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { toast } from "sonner"
import { getShippingZones } from "@/app/actions/shipping"
import { createCheckoutSession } from "@/app/actions/stripe"
import { getSettings } from "@/actions/get-settings"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { LOCATIONS } from "@/data/locations"

export default function CheckoutPage() {
    const router = useRouter()
    const { cart, subtotal, clearCart } = useCart()
    const [isLoading, setIsLoading] = useState(false)
    const [isCouponLoading, setIsCouponLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})
    const [isSuccess, setIsSuccess] = useState(false)
    const [orderId, setOrderId] = useState<string | null>(null)
    const [couponCode, setCouponCode] = useState("")
    const [discount, setDiscount] = useState(0)

    // Address States for Auto-matching
    const [customerCountry, setCustomerCountry] = useState("Australia")
    const [customerState, setCustomerState] = useState("")
    const [customerCity, setCustomerCity] = useState("")
    const [customerZip, setCustomerZip] = useState("")
    const [paymentMethod, setPaymentMethod] = useState<"COD" | "STRIPE" | "BANK">("COD")

    // Shipping States
    const [shippingZones, setShippingZones] = useState<any[]>([])
    const [selectedZoneId, setSelectedZoneId] = useState<string>("")
    const [selectedRateId, setSelectedRateId] = useState<string>("")
    const [isShippingLoading, setIsShippingLoading] = useState(true)
    const [settings, setSettings] = useState<any>(null)
    const [isSettingsLoading, setIsSettingsLoading] = useState(true)

    const selectedZone = useMemo(() =>
        shippingZones.find(z => z.id === selectedZoneId),
        [shippingZones, selectedZoneId])

    const availableRates = useMemo(() =>
        selectedZone?.rates || [],
        [selectedZone])

    // Filter available rates based on conditions (like Free Shipping threshold)
    const filteredRates = useMemo(() => {
        return availableRates.filter((rate: any) => {
            if (rate.type === 'free') {
                return subtotal >= (parseFloat(rate.min_order_subtotal) || 0)
            }
            return true
        })
    }, [availableRates, subtotal])

    const selectedRate = useMemo(() =>
        availableRates.find((r: any) => r.id === selectedRateId),
        [availableRates, selectedRateId])

    // ZIP Matching Helper (Strict Country + ZIP sync)
    const matchZone = (zip: string, country: string, zones: any[]) => {
        if (!country) return null

        // 1. Filter zones by country name (case-insensitive check)
        const countryMatchedZones = zones.filter(zone => {
            const countryArray = Array.isArray(zone.countries) ? zone.countries : [];
            return countryArray.some((c: string) => c.toLowerCase() === country.toLowerCase())
        })

        if (countryMatchedZones.length === 0) return null

        // 2. Find specific ZIP match within country-matched zones
        if (zip) {
            const zipMatched = countryMatchedZones.find(zone => {
                if (!zone.zip_codes) return false
                const zipList = zone.zip_codes.split(',').map((s: string) => s.trim().toLowerCase())
                return zipList.some((pattern: string) => {
                    if (pattern.endsWith('*')) {
                        return zip.toLowerCase().startsWith(pattern.slice(0, -1))
                    }
                    return pattern === zip.toLowerCase()
                })
            })
            if (zipMatched) return zipMatched.id
        }

        // 3. Fallback to a "catch-all" zone for this country (one with no zip_codes defined)
        const catchAllZone = countryMatchedZones.find(zone => !zone.zip_codes || zone.zip_codes.trim() === "")

        return catchAllZone?.id || null
    }

    // Calculate Dynamic Shipping Cost
    const shippingCost = useMemo(() => {
        if (!selectedRate) return 0

        if (selectedRate.type === 'free') return 0

        if (selectedRate.type === 'flat') {
            return parseFloat(selectedRate.base_cost) || 0
        }

        // Weight-based logic (dummy weight for now)
        const totalWeight = cart.reduce((acc, item) => acc + (item.quantity * 0.5), 0)
        const base = parseFloat(selectedRate.base_cost) || 0
        const perKg = parseFloat(selectedRate.price_per_kg) || 0
        return base + (totalWeight * perKg)
    }, [selectedRate, cart])

    const total = subtotal + shippingCost - discount

    // Fetch Shipping Zones & Settings
    useEffect(() => {
        const fetchData = async () => {
            setIsShippingLoading(true)
            setIsSettingsLoading(true)

            const [zones, siteSettings] = await Promise.all([
                getShippingZones(),
                getSettings()
            ])

            setShippingZones(zones)
            setSettings(siteSettings)

            // Set default payment method based on available options
            if (siteSettings) {
                if (siteSettings.enable_cod) setPaymentMethod("COD")
                else if (siteSettings.enable_stripe) setPaymentMethod("STRIPE")
                else if (siteSettings.enable_bank_transfer) setPaymentMethod("BANK" as any)
            }

            setIsShippingLoading(false)
            setIsSettingsLoading(false)
        }
        fetchData()
    }, [])

    // Auto-match zone when zip/country changes
    useEffect(() => {
        if (shippingZones.length > 0) {
            const matchedId = matchZone(customerZip, customerCountry, shippingZones) || ""
            if (matchedId !== selectedZoneId) {
                setSelectedZoneId(matchedId)
                setSelectedRateId("") // Reset rate when zone changes
            }
        }
    }, [customerZip, customerCountry, shippingZones, selectedZoneId])


    // Update selected rate based on logic
    useEffect(() => {
        if (filteredRates.length > 0) {
            const currentIsValid = filteredRates.find((r: any) => r.id === selectedRateId);
            const freeRate = filteredRates.find((r: any) => r.type === 'free');

            // Try to find a rate that matches the city or state name
            const locationMatchedRate = filteredRates.find((r: any) => {
                const name = r.name.toLowerCase();
                const city = customerCity.toLowerCase();
                const state = customerState.toLowerCase();
                return (city && name.includes(city)) || (state && name.includes(state));
            });

            let targetRateId = "";
            if (freeRate) {
                targetRateId = freeRate.id;
            } else if (locationMatchedRate) {
                targetRateId = locationMatchedRate.id;
            } else if (currentIsValid) {
                targetRateId = selectedRateId;
            } else {
                targetRateId = filteredRates[0].id;
            }

            if (targetRateId !== selectedRateId) {
                setSelectedRateId(targetRateId);
            }
        } else if (selectedRateId !== "") {
            setSelectedRateId("");
        }
    }, [filteredRates, selectedRateId, customerCity, customerState])

    const handleApplyCoupon = async () => {
        if (!couponCode) return
        setIsCouponLoading(true)
        const result = await validateCoupon(couponCode)
        setIsCouponLoading(false)

        if (result.success) {
            let discountAmount = 0
            if (result.discount_type === 'percentage') {
                discountAmount = (subtotal * (result.discount_value || 0)) / 100
            } else {
                discountAmount = result.discount_value || 0
            }
            setDiscount(discountAmount)
            toast.success(result.message)
        } else {
            setDiscount(0)
            toast.error(result.error)
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)
        setFieldErrors({})

        const formData = new FormData(e.currentTarget)

        try {
            const result = await placeOrder(formData)

            if (result.error) {
                setError(result.error)
                if (result.details) {
                    setFieldErrors(result.details as Record<string, string[]>)
                }
            } else if (result.success) {
                // If it's STRIPE, redirect to Stripe URL
                if (formData.get("paymentMethod") === "STRIPE") {
                    const stripeResult = await createCheckoutSession({
                        items: cart,
                        shippingCost,
                        discount,
                        orderId: result.orderId!, // Now we pass the orderId
                        couponCode: couponCode || undefined,
                        customerDetails: {
                            email: formData.get("email") as string,
                            firstName: formData.get("firstName") as string,
                            lastName: formData.get("lastName") as string,
                            address: formData.get("address") as string,
                            city: formData.get("city") as string,
                            state: formData.get("state") as string,
                            zipCode: formData.get("zipCode") as string,
                            country: formData.get("country") as string,
                            phone: formData.get("phone") as string
                        }
                    })

                    if (stripeResult.url) {
                        window.location.href = stripeResult.url
                        return
                    } else if (stripeResult.error) {
                        setError(stripeResult.error)
                        setIsLoading(false)
                        return
                    }
                }

                setIsSuccess(true)
                setOrderId(result.orderId!)
                clearCart()
            }
        } catch (err) {
            setError("An unexpected error occurred. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    if (isSuccess) {
        return (
            <div className="container mx-auto py-20 px-4 flex flex-col items-center justify-center text-center">
                <div className="h-20 w-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="h-10 w-10 text-green-600" />
                </div>
                <h1 className="text-4xl font-bold tracking-tighter mb-4">Order Placed Successfully!</h1>
                <p className="text-muted-foreground text-lg max-w-md mb-8">
                    Your order <span className="font-bold text-foreground">#{orderId?.slice(0, 8)}</span> has been received and is being processed.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                    <Button onClick={() => router.push('/')} className="rounded-full px-8 h-12 font-bold uppercase tracking-widest text-[10px]">
                        Back to Home
                    </Button>
                    <Button variant="outline" onClick={() => router.push('/shop')} className="rounded-full px-8 h-12 font-bold uppercase tracking-widest text-[10px]">
                        Continue Shopping
                    </Button>
                </div>
            </div>
        )
    }

    if (cart.length === 0 && !isSuccess) {
        return (
            <div className="container mx-auto py-20 px-4 text-center">
                <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
                <p className="text-muted-foreground mb-8">Add some items to your cart before checking out.</p>
                <Button onClick={() => router.push('/shop')} className="rounded-full px-8 h-12 font-bold uppercase tracking-widest text-[10px]">
                    Go to Shop
                </Button>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-8 lg:py-16 px-4">
            <h1 className="text-3xl lg:text-4xl font-bold tracking-tighter mb-10">Checkout</h1>

            <form onSubmit={handleSubmit} className="grid lg:grid-cols-12 gap-12">

                {/* Left Column: Form Details */}
                <div className="lg:col-span-7 space-y-10">
                    <section className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-zinc-900 text-white flex items-center justify-center text-xs font-bold">1</div>
                            <h2 className="text-xl font-bold">Billing & Shipping</h2>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="firstName" className="text-xs uppercase font-black tracking-widest text-muted-foreground">First Name</Label>
                                <Input id="firstName" name="firstName" placeholder="John" className="rounded-xl h-12" required />
                                {fieldErrors.firstName && <p className="text-xs text-destructive">{fieldErrors.firstName[0]}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName" className="text-xs uppercase font-black tracking-widest text-muted-foreground">Last Name</Label>
                                <Input id="lastName" name="lastName" placeholder="Doe" className="rounded-xl h-12" required />
                                {fieldErrors.lastName && <p className="text-xs text-destructive">{fieldErrors.lastName[0]}</p>}
                            </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-xs uppercase font-black tracking-widest text-muted-foreground">Email</Label>
                                <Input id="email" name="email" type="email" placeholder="john@example.com" className="rounded-xl h-12" required />
                                {fieldErrors.email && <p className="text-xs text-destructive">{fieldErrors.email[0]}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone" className="text-xs uppercase font-black tracking-widest text-muted-foreground">Phone</Label>
                                <Input id="phone" name="phone" type="tel" placeholder="+1 (555) 000-0000" className="rounded-xl h-12" required />
                                {fieldErrors.phone && <p className="text-xs text-destructive">{fieldErrors.phone[0]}</p>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="address" className="text-xs uppercase font-black tracking-widest text-muted-foreground">Street Address</Label>
                            <Input id="address" name="address" placeholder="123 Minimalist St." className="rounded-xl h-12" required />
                            {fieldErrors.address && <p className="text-xs text-destructive">{fieldErrors.address[0]}</p>}
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-xs uppercase font-black tracking-widest text-muted-foreground">Country</Label>
                                <Select
                                    name="country"
                                    value={customerCountry}
                                    onValueChange={(val) => {
                                        setCustomerCountry(val)
                                        setCustomerState("")
                                        setCustomerCity("")
                                    }}
                                >
                                    <SelectTrigger className="rounded-xl h-12">
                                        <SelectValue placeholder="Select Country" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {LOCATIONS.map(c => (
                                            <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {fieldErrors.country && <p className="text-xs text-destructive">{fieldErrors.country[0]}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs uppercase font-black tracking-widest text-muted-foreground">State / Region</Label>
                                <Select
                                    name="state"
                                    value={customerState}
                                    onValueChange={(val) => {
                                        setCustomerState(val)
                                        setCustomerCity("")
                                    }}
                                    disabled={!customerCountry}
                                >
                                    <SelectTrigger className="rounded-xl h-12">
                                        <SelectValue placeholder="Select State" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {LOCATIONS.find(c => c.name === customerCountry)?.states.map(s => (
                                            <SelectItem key={s.name} value={s.name}>{s.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {fieldErrors.state && <p className="text-xs text-destructive">{fieldErrors.state[0]}</p>}
                            </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-xs uppercase font-black tracking-widest text-muted-foreground">City</Label>
                                <Select
                                    name="city"
                                    value={customerCity}
                                    onValueChange={setCustomerCity}
                                    disabled={!customerState}
                                >
                                    <SelectTrigger className="rounded-xl h-12">
                                        <SelectValue placeholder="Select City" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {LOCATIONS.find(c => c.name === customerCountry)
                                            ?.states.find(s => s.name === customerState)
                                            ?.cities.map(city => (
                                                <SelectItem key={city} value={city}>{city}</SelectItem>
                                            ))
                                        }
                                    </SelectContent>
                                </Select>
                                {fieldErrors.city && <p className="text-xs text-destructive">{fieldErrors.city[0]}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="zipCode" className="text-xs uppercase font-black tracking-widest text-muted-foreground">Zip / Postcode</Label>
                                <Input
                                    id="zipCode"
                                    name="zipCode"
                                    placeholder="4122"
                                    className="rounded-xl h-12"
                                    required
                                    value={customerZip}
                                    onChange={(e) => setCustomerZip(e.target.value)}
                                />
                                {fieldErrors.zipCode && <p className="text-xs text-destructive">{fieldErrors.zipCode[0]}</p>}
                            </div>
                        </div>
                    </section>


                    <section className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-zinc-900 text-white flex items-center justify-center text-xs font-bold">2</div>
                            <h2 className="text-xl font-bold">Payment Method</h2>
                        </div>
                        <div className="grid gap-4">
                            {settings?.enable_cod && (
                                <Label
                                    htmlFor="payment-cod"
                                    className={cn(
                                        "flex items-center justify-between p-4 border-2 rounded-2xl cursor-pointer hover:bg-zinc-50 transition-all duration-200",
                                        paymentMethod === "COD" ? "border-zinc-900 bg-zinc-50/50" : "border-zinc-200"
                                    )}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-full bg-zinc-100 flex items-center justify-center">
                                            <Banknote className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="font-bold">Cash on Delivery (COD)</p>
                                            <p className="text-xs text-muted-foreground">Pay when your order arrives.</p>
                                        </div>
                                    </div>
                                    <input
                                        type="radio"
                                        id="payment-cod"
                                        name="paymentMethod"
                                        value="COD"
                                        checked={paymentMethod === "COD"}
                                        onChange={() => setPaymentMethod("COD")}
                                        className="h-4 w-4 accent-zinc-900"
                                    />
                                </Label>
                            )}

                            {settings?.enable_stripe && (
                                <Label
                                    htmlFor="payment-stripe"
                                    className={cn(
                                        "flex items-center justify-between p-4 border-2 rounded-2xl cursor-pointer hover:bg-zinc-50 transition-all duration-200",
                                        paymentMethod === "STRIPE" ? "border-zinc-900 bg-zinc-50/50" : "border-zinc-200"
                                    )}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-full bg-zinc-100 flex items-center justify-center">
                                            <Building2 className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="font-bold">Pay with Card (Stripe)</p>
                                            <p className="text-xs text-muted-foreground">Secure payment via Stripe.</p>
                                        </div>
                                    </div>
                                    <input
                                        type="radio"
                                        id="payment-stripe"
                                        name="paymentMethod"
                                        value="STRIPE"
                                        checked={paymentMethod === "STRIPE"}
                                        onChange={() => setPaymentMethod("STRIPE")}
                                        className="h-4 w-4 accent-zinc-900"
                                    />
                                </Label>
                            )}

                            {settings?.enable_bank_transfer && (
                                <div className="space-y-4">
                                    <Label
                                        htmlFor="payment-bank"
                                        className={cn(
                                            "flex items-center justify-between p-4 border-2 rounded-2xl cursor-pointer hover:bg-zinc-50 transition-all duration-200",
                                            paymentMethod === "BANK" ? "border-zinc-900 bg-zinc-50/50" : "border-zinc-200"
                                        )}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-full bg-zinc-100 flex items-center justify-center">
                                                <Terminal className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="font-bold">Direct Bank Transfer</p>
                                                <p className="text-xs text-muted-foreground">Transfer manually to our account.</p>
                                            </div>
                                        </div>
                                        <input
                                            type="radio"
                                            id="payment-bank"
                                            name="paymentMethod"
                                            value="BANK"
                                            checked={paymentMethod === "BANK"}
                                            onChange={() => setPaymentMethod("BANK")}
                                            className="h-4 w-4 accent-zinc-900"
                                        />
                                    </Label>

                                    {paymentMethod === "BANK" && (
                                        <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100 animate-in fade-in slide-in-from-top-2 duration-300">
                                            <p className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-2">Instructions</p>
                                            <p className="text-sm font-medium whitespace-pre-wrap">{settings.bank_transfer_details}</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {!isSettingsLoading && !settings?.enable_cod && !settings?.enable_stripe && !settings?.enable_bank_transfer && (
                                <div className="p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 text-sm font-medium">
                                    No payment methods are currently available. Please contact support.
                                </div>
                            )}

                            {isSettingsLoading && (
                                <div className="space-y-4">
                                    {[1, 2].map(i => (
                                        <div key={i} className="h-20 w-full bg-zinc-100 rounded-2xl animate-pulse" />
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>
                </div>

                {/* Right Column: Order Summary */}
                < div className="lg:col-span-5" >
                    <div className="bg-zinc-50 rounded-[2.5rem] p-8 border sticky top-24">
                        <h3 className="text-xl font-bold mb-8">Your Order</h3>

                        <div className="space-y-4 mb-8">
                            {cart.map((item) => (
                                <div key={item.id} className="flex gap-4 items-center">
                                    <div className="h-16 w-12 relative rounded-lg overflow-hidden bg-muted flex-shrink-0">
                                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-sm truncate">{item.name}</p>
                                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                                    </div>
                                    <p className="font-bold text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                            ))}
                        </div>

                        <Separator className="bg-zinc-200 mb-8" />

                        {/* Coupon Section */}
                        <div className="space-y-3 mb-8">
                            <Label htmlFor="coupon" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Promo Code</Label>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="coupon"
                                        placeholder="Enter code"
                                        className="pl-10 rounded-xl h-11 border-zinc-200"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value)}
                                    />
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="rounded-xl h-11 px-6 font-bold text-xs uppercase tracking-widest"
                                    onClick={handleApplyCoupon}
                                    disabled={isCouponLoading || !couponCode}
                                >
                                    {isCouponLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Apply"}
                                </Button>
                            </div>
                            {discount > 0 && <p className="text-[10px] text-green-600 font-bold uppercase tracking-widest">Coupon applied savings: -${discount.toFixed(2)}</p>}
                        </div>

                        <div className="space-y-4 text-sm mb-8">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground font-medium">Subtotal</span>
                                <span className="font-bold">${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground font-medium flex items-center gap-1.5 line-clamp-1 flex-1">
                                    <Truck className="h-3.5 w-3.5 shrink-0" />
                                    <span>
                                        Shipping {selectedRate ? `(${selectedRate.name})` : (customerZip ? "(No match found)" : "(Enter postcode)")}
                                    </span>
                                </span>
                                <span className={cn("font-bold shrink-0 ml-2", !selectedRate && "text-muted-foreground italic text-xs")}>
                                    {selectedRate ? (shippingCost > 0 ? `$${shippingCost.toFixed(2)}` : "FREE") : "—"}
                                </span>
                            </div>
                            {discount > 0 && (
                                <div className="flex justify-between text-green-600 font-bold">
                                    <span>Discount</span>
                                    <span>-${discount.toFixed(2)}</span>
                                </div>
                            )}
                            <Separator className="bg-zinc-200" />
                            <div className="flex justify-between text-lg font-bold">
                                <span>Total</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                        </div>

                        <input type="hidden" name="discount" value={discount} />
                        <input type="hidden" name="couponCode" value={couponCode} />
                        <input type="hidden" name="shippingRateId" value={selectedRateId} />
                        <input type="hidden" name="shippingCost" value={shippingCost} />

                        {error && (
                            <div className="p-4 rounded-xl bg-destructive/5 text-destructive border border-destructive/10 text-xs font-bold mb-6">
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            size="lg"
                            className="w-full rounded-2xl h-14 font-black uppercase tracking-[.15em] text-[10px] shadow-xl shadow-zinc-200"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-3 h-4 w-4 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    Complete Order
                                    <ArrowRight className="ml-3 h-4 w-4" />
                                </>
                            )}
                        </Button>

                        <p className="text-center text-[9px] text-zinc-400 mt-6 uppercase tracking-[0.2em] font-black">
                            Encrypted & Secure Payment
                        </p>
                    </div>
                </div >
            </form >
        </div >
    )
}
