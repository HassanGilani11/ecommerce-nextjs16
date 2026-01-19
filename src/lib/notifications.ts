import { createClient } from "./supabase/server"

export async function sendOrderStatusEmail(email: string, orderId: string, status: string) {
    const supabase = await createClient()

    // Check if notifications are enabled
    const { data: settings } = await supabase
        .from('settings')
        .select('store_notifications')
        .eq('id', 1)
        .single()

    if (!settings || !settings.store_notifications) {
        console.log(`[Notifications] Disabled in settings. Skipping email for Order #${orderId}`)
        return { success: true }
    }

    // This is a placeholder for a real email service integration
    // (e.g., Resend, Postmark, AWS SES, or Supabase Edge Functions)

    console.log(`
    --- MOCK EMAIL SENT ---
    To: ${email}
    Subject: Order #${orderId.slice(0, 8)} Status Update
    Body: Your order status has been updated to: ${status.toUpperCase()}.
    -----------------------
    `)

    return { success: true }
}
