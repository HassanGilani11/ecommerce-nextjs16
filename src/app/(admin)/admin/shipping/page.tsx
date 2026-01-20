import * as React from "react"
import { getShippingZones } from "@/app/actions/shipping"
import { ShippingClient } from "./shipping-client"

export default async function ShippingPage() {
    const zones = await getShippingZones()

    return (
        <div className="container mx-auto">
            <ShippingClient initialZones={zones} />
        </div>
    )
}
