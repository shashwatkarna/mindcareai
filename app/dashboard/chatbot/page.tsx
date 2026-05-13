import { ChatInterface } from "@/components/dashboard/chatbot/chat-interface";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "MindSpace AI | MindCare",
    description: "Your empathetic AI mental health companion",
};

export default function ChatbotPage() {
    return (
        <ChatInterface />
    );
}
