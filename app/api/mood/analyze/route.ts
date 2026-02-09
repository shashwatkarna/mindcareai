
import { NextRequest, NextResponse } from "next/server";
import { analyzeMoodFromText } from "@/lib/ai-mood";

export async function POST(req: NextRequest) {
    try {
        const { text } = await req.json();

        if (!text) {
            return NextResponse.json({ error: "Text is required" }, { status: 400 });
        }

        const analysis = await analyzeMoodFromText(text);

        return NextResponse.json(analysis);
    } catch (error) {
        console.error("Error in mood analysis API:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
