"use client"

import * as React from "react"
import {
    Plus,
    Truck,
    MoreVertical,
    Edit,
    Trash2,
    ChevronDown,
    Globe,
    Box,
    CircleDollarSign,
    Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { LOCATIONS } from "@/data/locations"
import {
    createShippingZone,
    updateShippingZone,
    deleteShippingZone,
    createShippingRate,
    updateShippingRate,
    deleteShippingRate
} from "@/app/actions/shipping"

export function ShippingClient({ initialZones }: { initialZones: any[] }) {
    const [zones, setZones] = React.useState(initialZones)
    const [isZoneModalOpen, setIsZoneModalOpen] = React.useState(false)
    const [isRateModalOpen, setIsRateModalOpen] = React.useState(false)
    const [editingZone, setEditingZone] = React.useState<any>(null)
    const [editingRate, setEditingRate] = React.useState<any>(null)
    const [selectedZoneId, setSelectedZoneId] = React.useState<string | null>(null)
    const [loading, setLoading] = React.useState(false)

    // Form States
    const [zoneName, setZoneName] = React.useState("")
    const [zoneZipCodes, setZoneZipCodes] = React.useState("")
    const [zoneCountries, setZoneCountries] = React.useState<string[]>([])
    const [rateData, setRateData] = React.useState({
        name: "",
        type: "flat",
        base_cost: "0",
        min_weight: "0",
        max_weight: "",
        price_per_kg: "0",
        min_order_subtotal: "0",
        estimated_delivery: ""
    })

    const handleSaveZone = async () => {
        if (!zoneName) return toast.error("Zone name is required")
        setLoading(true)
        const result = editingZone
            ? await updateShippingZone(editingZone.id, { name: zoneName, countries: zoneCountries, zip_codes: zoneZipCodes, is_active: true })
            : await createShippingZone({ name: zoneName, countries: zoneCountries, zip_codes: zoneZipCodes })

        if (result.success) {
            toast.success(editingZone ? "Zone updated" : "Zone created")
            window.location.reload()
        } else {
            toast.error(result.error || "Action failed")
        }
        setLoading(false)
    }

    const handleDeleteZone = async (id: string) => {
        if (!confirm("Are you sure? This will delete all rates in this zone.")) return
        const result = await deleteShippingZone(id)
        if (result.success) {
            toast.success("Zone deleted")
            window.location.reload()
        } else {
            toast.error(result.error || "Delete failed")
        }
    }

    const handleSaveRate = async () => {
        if (!rateData.name) return toast.error("Rate name is required")
        setLoading(true)
        const data = { ...rateData, zone_id: selectedZoneId }
        const result = editingRate
            ? await updateShippingRate(editingRate.id, data)
            : await createShippingRate(data)

        if (result.success) {
            toast.success(editingRate ? "Rate updated" : "Rate created")
            window.location.reload()
        } else {
            toast.error(result.error || "Action failed")
        }
        setLoading(false)
    }

    const handleDeleteRate = async (id: string) => {
        if (!confirm("Delete this rate?")) return
        const result = await deleteShippingRate(id)
        if (result.success) {
            toast.success("Rate deleted")
            window.location.reload()
        } else {
            toast.error(result.error || "Delete failed")
        }
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-zinc-900">Shipping</h1>
                    <p className="text-zinc-500 text-sm font-medium mt-1">Manage geographic zones and shipping rate architectures.</p>
                </div>
                <Button
                    onClick={() => {
                        setEditingZone(null)
                        setZoneName("")
                        setZoneZipCodes("")
                        setZoneCountries([])
                        setIsZoneModalOpen(true)
                    }}
                    className="rounded-2xl h-11 px-6 bg-zinc-900 text-white font-bold uppercase tracking-widest text-[11px] gap-2 shadow-xl shadow-zinc-900/10 hover:scale-[1.02] active:scale-95 transition-all"
                >
                    <Plus className="h-4 w-4" />
                    Create New Zone
                </Button>
            </div>

            {/* Zones Grid */}
            <div className="grid grid-cols-1 gap-8">
                {zones.map((zone) => (
                    <Card key={zone.id} className="border-none shadow-[0_8px_40px_rgb(0,0,0,0.03)] rounded-[2.5rem] bg-white overflow-hidden">
                        <CardHeader className="px-10 py-8 border-b border-zinc-50 bg-zinc-50/50">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-5">
                                    <div className="h-14 w-14 rounded-2xl bg-zinc-900 flex items-center justify-center shadow-lg shadow-zinc-900/20">
                                        <Globe className="h-7 w-7 text-white" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-2xl font-black tracking-tight">{zone.name}</CardTitle>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Badge variant="secondary" className="rounded-lg font-black uppercase tracking-widest text-[9px]">
                                                {zone.rates?.length || 0} Methods Available
                                            </Badge>
                                            {zone.zip_codes && (
                                                <Badge variant="outline" className="rounded-lg font-black uppercase tracking-widest text-[9px] border-zinc-200">
                                                    ZIP Match Enabled
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            setSelectedZoneId(zone.id)
                                            setEditingRate(null)
                                            setRateData({
                                                name: "",
                                                type: "flat",
                                                base_cost: "0",
                                                min_weight: "0",
                                                max_weight: "",
                                                price_per_kg: "0",
                                                min_order_subtotal: "0",
                                                estimated_delivery: ""
                                            })
                                            setIsRateModalOpen(true)
                                        }}
                                        className="rounded-xl h-9 px-4 font-black uppercase tracking-widest text-[10px] gap-2 border-zinc-100 hover:bg-white transition-all shadow-sm"
                                    >
                                        <Plus className="h-3.5 w-3.5" />
                                        Add Method
                                    </Button>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="rounded-xl h-9 w-9 text-zinc-400 hover:text-zinc-900 hover:bg-white transition-all">
                                                <MoreVertical className="h-5 w-5" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-48 p-2 rounded-2xl border-zinc-100 shadow-xl">
                                            <DropdownMenuItem
                                                onClick={() => {
                                                    setEditingZone(zone)
                                                    setZoneName(zone.name)
                                                    setZoneZipCodes(zone.zip_codes || "")
                                                    setZoneCountries(zone.countries || [])
                                                    setIsZoneModalOpen(true)
                                                }}
                                                className="rounded-xl flex items-center gap-3 p-3 cursor-pointer"
                                            >
                                                <Edit className="h-4 w-4 text-zinc-500" />
                                                <span className="font-bold text-xs uppercase tracking-widest">Edit Zone</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => handleDeleteZone(zone.id)}
                                                className="rounded-xl flex items-center gap-3 p-3 cursor-pointer text-rose-500 focus:text-rose-600 focus:bg-rose-50"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                                <span className="font-bold text-xs uppercase tracking-widest">Delete Zone</span>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-zinc-50">
                                            <th className="px-10 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Shipping Method</th>
                                            <th className="px-10 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Type</th>
                                            <th className="px-10 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Configuration</th>
                                            <th className="px-10 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Base Cost</th>
                                            <th className="px-10 py-5"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-50">
                                        {zone.rates?.map((rate: any) => (
                                            <tr key={rate.id} className="group hover:bg-zinc-50/50 transition-all">
                                                <td className="px-10 py-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="h-10 w-10 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-500 group-hover:bg-white group-hover:text-zinc-900 transition-all">
                                                            <Truck className="h-5 w-5" />
                                                        </div>
                                                        <div>
                                                            <div className="font-black text-sm text-zinc-900 uppercase tracking-tight">{rate.name}</div>
                                                            <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-0.5">{rate.estimated_delivery || "No estimate"}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-10 py-6">
                                                    <Badge variant="outline" className="rounded-lg py-1 px-3 border-zinc-100 font-black uppercase tracking-widest text-[9px] bg-white">
                                                        {rate.type.replace('_', ' ')}
                                                    </Badge>
                                                </td>
                                                <td className="px-10 py-6">
                                                    <div className="flex flex-col gap-1">
                                                        {rate.type === 'weight_based' ? (
                                                            <>
                                                                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                                                                    {rate.min_weight}kg - {rate.max_weight || '∞'}kg
                                                                </span>
                                                                <span className="text-[10px] font-bold text-emerald-600">
                                                                    +${rate.price_per_kg}/kg
                                                                </span>
                                                            </>
                                                        ) : rate.type === 'free' ? (
                                                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">
                                                                Orders over ${rate.min_order_subtotal}
                                                            </span>
                                                        ) : (
                                                            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 italic">No Conditions</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-10 py-6">
                                                    <div className="flex items-center gap-2">
                                                        <CircleDollarSign className="h-4 w-4 text-emerald-500" />
                                                        <span className="font-black text-lg text-zinc-900 tracking-tighter">${rate.base_cost}</span>
                                                    </div>
                                                </td>
                                                <td className="px-10 py-6 text-right">
                                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => {
                                                                setSelectedZoneId(zone.id)
                                                                setEditingRate(rate)
                                                                setRateData({
                                                                    name: rate.name,
                                                                    type: rate.type,
                                                                    base_cost: rate.base_cost.toString(),
                                                                    min_weight: rate.min_weight.toString(),
                                                                    max_weight: rate.max_weight?.toString() || "",
                                                                    price_per_kg: rate.price_per_kg.toString(),
                                                                    min_order_subtotal: rate.min_order_subtotal?.toString() || "0",
                                                                    estimated_delivery: rate.estimated_delivery || ""
                                                                })
                                                                setIsRateModalOpen(true)
                                                            }}
                                                            className="h-8 w-8 rounded-lg hover:bg-white text-zinc-400 hover:text-zinc-900 border border-transparent hover:border-zinc-100"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleDeleteRate(rate.id)}
                                                            className="h-8 w-8 rounded-lg hover:bg-rose-50 text-zinc-400 hover:text-rose-500"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        {(!zone.rates || zone.rates.length === 0) && (
                                            <tr>
                                                <td colSpan={5} className="px-10 py-12 text-center">
                                                    <div className="flex flex-col items-center gap-3">
                                                        <div className="h-12 w-12 rounded-2xl bg-zinc-50 flex items-center justify-center text-zinc-300">
                                                            <Box className="h-6 w-6" />
                                                        </div>
                                                        <p className="text-xs font-bold text-zinc-400 uppercase tracking-[0.2em]">No shipping methods configured.</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {zones.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 px-10 text-center bg-white rounded-[2.5rem] border-2 border-dashed border-zinc-100 italic">
                        <Truck className="h-12 w-12 text-zinc-200 mb-4" />
                        <h3 className="text-zinc-900 font-black uppercase tracking-widest text-sm mb-2">No Shipping Zones Detected</h3>
                        <p className="text-zinc-400 text-xs font-bold tracking-widest uppercase">Start by creating your first geographic region.</p>
                    </div>
                )}
            </div>

            {/* Zone Modal */}
            <Dialog open={isZoneModalOpen} onOpenChange={setIsZoneModalOpen}>
                <DialogContent className="rounded-[2.5rem] p-10 border-none shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-3xl font-black tracking-tight">{editingZone ? "Edit Shipping Zone" : "New Shipping Zone"}</DialogTitle>
                        <p className="text-zinc-500 text-sm font-medium">Define a geographic target for your shipping architecture.</p>
                    </DialogHeader>
                    <div className="space-y-6 pt-6">
                        <div className="space-y-2">
                            <Label htmlFor="zoneName" className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">Zone Name</Label>
                            <Input
                                id="zoneName"
                                value={zoneName}
                                onChange={(e) => setZoneName(e.target.value)}
                                placeholder="e.g. Domestic, International"
                                className="h-14 rounded-2xl border-zinc-100 bg-zinc-50/50 focus-visible:ring-zinc-200 font-bold transition-all px-6"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="zoneZipCodes" className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">Matching ZIP / Post Codes</Label>
                            <Input
                                id="zoneZipCodes"
                                value={zoneZipCodes}
                                onChange={(e) => setZoneZipCodes(e.target.value)}
                                placeholder="e.g. 4000, 4122, 5000-* (Comma separated, use * for wildcards)"
                                className="h-14 rounded-2xl border-zinc-100 bg-zinc-50/50 focus-visible:ring-zinc-200 font-bold transition-all px-6"
                            />
                            <p className="text-[9px] text-zinc-400 font-bold uppercase ml-1">If set, this zone will automatically match these codes during checkout.</p>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">Target Country</Label>
                            <Select
                                value={zoneCountries[0] || ""}
                                onValueChange={(val) => setZoneCountries([val])}
                            >
                                <SelectTrigger className="h-14 rounded-2xl border-zinc-100 bg-zinc-50/50 font-bold px-6">
                                    <SelectValue placeholder="Select Country" />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border-zinc-100 p-2 shadow-xl">
                                    {LOCATIONS.map(c => (
                                        <SelectItem key={c.name} value={c.name} className="rounded-xl p-3 font-bold uppercase tracking-widest text-[10px]">
                                            {c.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <p className="text-[9px] text-zinc-400 font-bold uppercase ml-1">Only orders matching this country will use this zone.</p>
                        </div>
                    </div>
                    <DialogFooter className="mt-8 flex gap-3">
                        <Button variant="ghost" onClick={() => setIsZoneModalOpen(false)} className="rounded-2xl h-12 px-6 font-black uppercase tracking-widest text-[11px] hover:bg-zinc-50">Cancel</Button>
                        <Button
                            onClick={handleSaveZone}
                            disabled={loading}
                            className="rounded-2xl h-12 px-8 bg-zinc-900 text-white font-black uppercase tracking-widest text-[11px] shadow-xl shadow-zinc-900/10 hover:scale-[1.02] active:scale-95 transition-all"
                        >
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (editingZone ? "Update Zone" : "Create Zone")}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Rate Modal */}
            <Dialog open={isRateModalOpen} onOpenChange={setIsRateModalOpen}>
                <DialogContent className="rounded-[2.5rem] p-10 border-none shadow-2xl max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-3xl font-black tracking-tight">{editingRate ? "Edit Shipping Method" : "Add Shipping Method"}</DialogTitle>
                        <p className="text-zinc-500 text-sm font-medium">Configure costs and logic for this geographic zone.</p>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-8 pt-6">
                        <div className="space-y-4 col-span-2">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">Method Name</Label>
                                <Input
                                    value={rateData.name}
                                    onChange={(e) => setRateData({ ...rateData, name: e.target.value })}
                                    placeholder="e.g. Express Delivery, Ground Shipping"
                                    className="h-14 rounded-2xl border-zinc-100 bg-zinc-50/50 focus-visible:ring-zinc-200 font-bold transition-all px-6"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">Rate Type</Label>
                            <Select
                                value={rateData.type}
                                onValueChange={(v) => setRateData({ ...rateData, type: v })}
                            >
                                <SelectTrigger className="h-14 rounded-2xl border-zinc-100 bg-zinc-50/50 font-bold px-6">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border-zinc-100 p-2 shadow-xl">
                                    <SelectItem value="flat" className="rounded-xl p-3 font-bold uppercase tracking-widest text-[10px]">Flat Rate</SelectItem>
                                    <SelectItem value="weight_based" className="rounded-xl p-3 font-bold uppercase tracking-widest text-[10px]">Weight Based</SelectItem>
                                    <SelectItem value="free" className="rounded-xl p-3 font-bold uppercase tracking-widest text-[10px]">Free Shipping</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">Base Cost ($)</Label>
                            <Input
                                type="number"
                                value={rateData.base_cost}
                                onChange={(e) => setRateData({ ...rateData, base_cost: e.target.value })}
                                className="h-14 rounded-2xl border-zinc-100 bg-zinc-50/50 focus-visible:ring-zinc-200 font-bold transition-all px-6"
                            />
                        </div>

                        {rateData.type === 'weight_based' && (
                            <>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">Min Weight (kg)</Label>
                                    <Input
                                        type="number"
                                        value={rateData.min_weight}
                                        onChange={(e) => setRateData({ ...rateData, min_weight: e.target.value })}
                                        className="h-14 rounded-2xl border-zinc-100 bg-zinc-50/50 focus-visible:ring-zinc-200 font-bold transition-all px-6"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">Max Weight (kg)</Label>
                                    <Input
                                        type="number"
                                        value={rateData.max_weight}
                                        onChange={(e) => setRateData({ ...rateData, max_weight: e.target.value })}
                                        placeholder="No limit"
                                        className="h-14 rounded-2xl border-zinc-100 bg-zinc-50/50 focus-visible:ring-zinc-200 font-bold transition-all px-6"
                                    />
                                </div>
                                <div className="space-y-2 col-span-2">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">Price per Kilogram ($)</Label>
                                    <Input
                                        type="number"
                                        value={rateData.price_per_kg}
                                        onChange={(e) => setRateData({ ...rateData, price_per_kg: e.target.value })}
                                        className="h-14 rounded-2xl border-zinc-100 bg-zinc-50/50 focus-visible:ring-zinc-200 font-bold transition-all px-6"
                                    />
                                </div>
                            </>
                        )}

                        {rateData.type === 'free' && (
                            <div className="space-y-2 col-span-2">
                                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">Minimum Order Subtotal ($)</Label>
                                <Input
                                    type="number"
                                    value={rateData.min_order_subtotal}
                                    onChange={(e) => setRateData({ ...rateData, min_order_subtotal: e.target.value })}
                                    className="h-14 rounded-2xl border-zinc-100 bg-zinc-50/50 focus-visible:ring-zinc-200 font-bold transition-all px-6"
                                />
                            </div>
                        )}

                        <div className="space-y-2 col-span-2">
                            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">Estimated Delivery</Label>
                            <Input
                                value={rateData.estimated_delivery}
                                onChange={(e) => setRateData({ ...rateData, estimated_delivery: e.target.value })}
                                placeholder="e.g. 3-5 business days"
                                className="h-14 rounded-2xl border-zinc-100 bg-zinc-50/50 focus-visible:ring-zinc-200 font-bold transition-all px-6"
                            />
                        </div>
                    </div>
                    <DialogFooter className="mt-12 flex gap-3">
                        <Button variant="ghost" onClick={() => setIsRateModalOpen(false)} className="rounded-2xl h-12 px-6 font-black uppercase tracking-widest text-[11px] hover:bg-zinc-50">Cancel</Button>
                        <Button
                            onClick={handleSaveRate}
                            disabled={loading}
                            className="rounded-2xl h-12 px-8 bg-zinc-900 text-white font-black uppercase tracking-widest text-[11px] shadow-xl shadow-zinc-900/10 hover:scale-[1.02] active:scale-95 transition-all"
                        >
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (editingRate ? "Update Method" : "Add Method")}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
