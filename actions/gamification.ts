"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function unlockPremium() {
    const supabase = await createClient()

    try {
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return { success: false, error: "Not authenticated" }
        }

        const { error } = await supabase
            .from("profiles")
            .update({ is_premium: true })
            .eq("id", user.id)


        if (error) {
            console.error("Error unlocking premium:", error)
            return { success: false, error: error.message }
        }

        revalidatePath("/dashboard")
        revalidatePath("/dashboard/exercises")
        return { success: true }
    } catch (e) {
        return { success: false, error: "Internal Server Error" }
    }
}
