
import { NextRequest, NextResponse } from "next/server";
import { generateMoodInsights } from "@/lib/ai-mood";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Fetch last 30 mood logs for the user
        const { data: moodLogs, error } = await supabase
            .from("mood_logs")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })
            .limit(30);

        if (error) {
            throw error;
        }

        const insights = await generateMoodInsights(moodLogs || []);

        return NextResponse.json(insights);
    } catch (error) {
        console.error("Error in mood insights API:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
