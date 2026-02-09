
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);

// Use the same model that worked for the chatbot
const MODEL_NAME = "gemini-2.5-flash";

export interface MoodAnalysisResult {
    mood: string;
    intensity: number;
    activities: string[];
    notes_summary?: string;
}

export async function analyzeMoodFromText(text: string): Promise<MoodAnalysisResult> {
    if (!API_KEY) {
        throw new Error("GEMINI_API_KEY is not set");
    }

    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const prompt = `
    Analyze the following text describing a person's day/feeling and extract:
    1. The dominant mood (one of: happy, sad, anxious, calm, stressed, energetic). If none fit perfectly, pick the closest.
    2. An intensity level from 1-10.
    3. A list of likely activities mentioned or implied (e.g., Work, Exercise, Social, Sleep, Eating, Hobby, Rest).
    
    Text: "${text}"
    
    Return ONLY a JSON object with keys: "mood", "intensity", "activities".
    Example: {"mood": "stressed", "intensity": 8, "activities": ["Work"]}
  `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const textResponse = response.text();

        // Clean up markdown code blocks if any
        const cleanText = textResponse.replace(/```json/g, "").replace(/```/g, "").trim();
        return JSON.parse(cleanText);
    } catch (error) {
        console.error("Error analyzing mood:", error);
        // Fallback default
        return { mood: "calm", intensity: 5, activities: [] };
    }
}

export async function generateMoodInsights(moodLogs: any[]): Promise<{ advice: string; prediction: string }> {
    if (!API_KEY) {
        throw new Error("GEMINI_API_KEY is not set");
    }

    if (!moodLogs || moodLogs.length === 0) {
        return {
            advice: "Start logging your mood to get personalized insights!",
            prediction: "We need more data to predict your future mood trends."
        };
    }

    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    // Simplify logs for token efficiency
    const simpleLogs = moodLogs.map(log => ({
        date: new Date(log.created_at).toLocaleDateString(),
        mood: log.mood,
        intensity: log.intensity,
        activities: log.activities,
        notes: log.notes
    })).slice(0, 20); // Analyze last 20 logs

    const prompt = `
    Analyze these recent mood logs for a user:
    ${JSON.stringify(simpleLogs)}
    
    1. Provide a short, empathetic insight or advice based on patterns (max 2 sentences).
    2. Predict the likely mood trend for the next few days based on recent history (max 1 sentence).
    
    Return ONLY a JSON object with keys: "advice", "prediction".
  `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const textResponse = response.text();
        const cleanText = textResponse.replace(/```json/g, "").replace(/```/g, "").trim();
        return JSON.parse(cleanText);
    } catch (error) {
        console.error("Error generating insights:", error);
        return {
            advice: "Keep tracking your mood to see patterns over time.",
            prediction: "Consistent tracking helps understand emotional trends."
        };
    }
}
