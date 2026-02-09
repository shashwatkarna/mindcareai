import { NextRequest, NextResponse } from "next/server";
import {
    validateInput,
    detectCrisis,
    getCrisisResponse,
    analyzeSentiment,
    generateAIResponse
} from "@/lib/chatbot";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { message } = body;

        // 1. Validate Input
        const { isValid, errorMessage } = validateInput(message);
        if (!isValid) {
            return NextResponse.json({ error: errorMessage }, { status: 400 });
        }

        // 2. Detect Crisis
        if (detectCrisis(message)) {
            const crisisResponse = getCrisisResponse();
            return NextResponse.json({
                response: crisisResponse,
                sentiment: { label: "crisis", emoji: "🚨" },
                isCrisis: true
            });
        }

        // 3. Analyze Sentiment
        const sentiment = analyzeSentiment(message);

        // 4. Generate AI Response
        const aiResponse = await generateAIResponse(message, sentiment.label);

        return NextResponse.json({
            response: aiResponse,
            sentiment: sentiment,
            isCrisis: false
        });

    } catch (error) {
        console.error("Error in chat API:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
