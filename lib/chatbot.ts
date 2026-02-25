import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.GEMINI_API_KEY || "";

const SYSTEM_PROMPT = `You are a friendly empathetic mental health companion and counsellor.
You are the "MindCare AI chatbot model". If asked who built you or how you were made, state clearly that you were built by fine-tuning using the Mistral 7B Instruct model.
Listen carefully, detect emotional tone, respond kindly with motivational support and to turn the user to positivity and fuel with motivation.
Keep responses concise (3-5 sentences always replying in cefr c2 level english).
Automatically detect and respond in the user's language.`;

const CRISIS_KEYWORDS = [
  "suicide", "kill myself", "end my life", "want to die",
  "no reason to live", "self harm", "hurt myself", "can't go on"
];

export function validateInput(text: string): { isValid: boolean; errorMessage: string } {
  if (!text || !text.trim()) {
    return { isValid: false, errorMessage: "Please enter a message." };
  }
  if (text.length > 2000) {
    return { isValid: false, errorMessage: "Message too long. Please keep it under 2000 characters." };
  }
  // Basic spam/gibberish detection (simplified from original)
  if (new Set(text).size < 5 && text.length > 20) {
    return { isValid: false, errorMessage: "Invalid message detected." };
  }
  return { isValid: true, errorMessage: "" };
}

export function detectCrisis(text: string): boolean {
  const textLower = text.toLowerCase();
  return CRISIS_KEYWORDS.some(keyword => textLower.includes(keyword));
}

export function getCrisisResponse(): string {
  return `🚨 **I'm concerned about your safety.** Please reach out for immediate help:

**Emergency Resources:**
- **India**: AASRA: 91-22-27546669, Vandrevala Foundation: 1860-2662-345
- **US**: 988 Suicide & Crisis Lifeline
- **UK**: Samaritans: 116 123
- **International**: findahelpline.com

You don't have to face this alone. Professional help is available 24/7. 💙`;
}

export function analyzeSentiment(text: string): { label: string; emoji: string } {
  const textLower = text.toLowerCase();

  const anxietyKeywords = ["anxious", "worried", "nervous", "panic", "stress"];
  const sadnessKeywords = ["sad", "depressed", "lonely", "empty", "hopeless"];
  const positiveKeywords = ["happy", "good", "great", "excellent", "excited", "joy", "love"];

  if (anxietyKeywords.some(word => textLower.includes(word))) {
    return { label: "anxious", emoji: "😰" };
  }

  if (sadnessKeywords.some(word => textLower.includes(word))) {
    return { label: "sad", emoji: "😔" };
  }

  if (positiveKeywords.some(word => textLower.includes(word))) {
    return { label: "positive", emoji: "😊" };
  }

  // Fallback as we don't have TextBlob in JS easily without heavy libs, 
  // and we want to keep it simple.
  return { label: "neutral", emoji: "😐" };
}

export async function generateAIResponse(userInput: string, sentiment: string): Promise<string> {
  try {
    if (!API_KEY) {
      console.error("GEMINI_API_KEY is not set");
      return "⚠️ I'm having trouble providing a response due to configuration issues.";
    }

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); // Using 2.5-flash as per user's original setup

    const prompt = `${SYSTEM_PROMPT}\nUser mood:${sentiment}\nUser:${userInput}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating AI response:", error);
    return "⚠️ I'm having trouble connecting right now. Please try again in a moment.";
  }
}
