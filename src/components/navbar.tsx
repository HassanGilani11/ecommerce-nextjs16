import { getSettings } from "@/actions/get-settings"
import { getCategories } from "@/actions/get-categories"
import { NavbarClient } from "./navbar-client"

export async function Navbar() {
    const [settings, categories] = await Promise.all([
        getSettings(),
        getCategories()
    ])

    return <NavbarClient settings={settings} categories={categories} />
}
