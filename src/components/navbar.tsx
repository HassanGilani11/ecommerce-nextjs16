import { getSettings } from "@/actions/get-settings"
import { getCategories } from "@/actions/get-categories"
import { NavbarClient } from "./navbar-client"
import { getCurrentProfile } from "@/app/actions/admin-users"

export async function Navbar() {
    const [settings, categories, user] = await Promise.all([
        getSettings(),
        getCategories(),
        getCurrentProfile()
    ])

    return <NavbarClient settings={settings} categories={categories} user={user} />
}
