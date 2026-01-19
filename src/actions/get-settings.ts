"use server"

import { createClient } from "@/lib/supabase/server"
import { unstable_noStore as noStore } from 'next/cache';

export async function getSettings() {
    noStore();
    const supabase = await createClient()
    const { data, error } = await supabase
        .from("settings")
        .select("*")
        .eq("id", 1)
        .single()

    if (error) {
        console.error("Error fetching settings:", error)
    }
    return data
}
