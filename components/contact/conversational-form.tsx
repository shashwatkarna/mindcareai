"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, User, Mail, MessageSquare, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { submitContactMessage } from "@/actions/contact";
import { toast } from "sonner";

type Message = {
    id: string;
    sender: "bot" | "user";
    text: React.ReactNode;
    isTyping?: boolean;
};

type Step = "name" | "email" | "subject" | "message" | "completed";

export function ConversationalForm() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "intro-1",
            sender: "bot",
            text: "Hi there! I'm the MindCare AI assistant. 👋",
        },
        {
            id: "intro-2",
            sender: "bot",
            text: "I can help you get in touch with our team. What should I call you?",
            isTyping: true, // Simulate typing delay for the second message
        },
    ]);
    const [currentStep, setCurrentStep] = useState<Step>("name");
    const [inputText, setInputText] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    // Handle typing simulation
    useEffect(() => {
        const typingMessage = messages.find(m => m.isTyping);
        if (typingMessage) {
            const timer = setTimeout(() => {
                setMessages(prev => prev.map(m => m.id === typingMessage.id ? { ...m, isTyping: false } : m));
            }, 800);
            return () => clearTimeout(timer);
        }
    }, [messages]);


    const handleInputSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!inputText.trim()) return;

        const userMessage: Message = {
            id: `user-${Date.now()}`,
            sender: "user",
            text: inputText,
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputText("");

        // Process step
        switch (currentStep) {
            case "name":
                setFormData((prev) => ({ ...prev, name: userMessage.text as string }));
                addBotMessage(`Nice to meet you, ${userMessage.text}! What's your email address?`);
                setCurrentStep("email");
                break;

            case "email":
                if (!validateEmail(userMessage.text as string)) {
                    addBotMessage("Hmm, that doesn't look like a valid email. Could you try again?");
                    // Don't advance step
                } else {
                    setFormData((prev) => ({ ...prev, email: userMessage.text as string }));
                    addBotMessage("Got it. What is this regarding? (Subject)");
                    setCurrentStep("subject");
                }
                break;

            case "subject":
                setFormData((prev) => ({ ...prev, subject: userMessage.text as string }));
                addBotMessage("Understood. Please type your message below.");
                setCurrentStep("message");
                break;

            case "message":
                const finalMessage = userMessage.text as string;
                setFormData((prev) => ({ ...prev, message: finalMessage }));
                // Trigger submission immediately
                await handleSubmit({ ...formData, message: finalMessage });
                break;
        }
    };

    const addBotMessage = (text: string) => {
        // Add a dummy "typing" message first? Or just delay.
        // For simplicity, we add it with isTyping: true (if we had logic for that) or just add it.
        // Let's simulate a small delay before showing the bot message
        setTimeout(() => {
            setMessages((prev) => [
                ...prev,
                { id: `bot-${Date.now()}`, sender: "bot", text, isTyping: true },
            ]);
        }, 500);
    };

    const validateEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleSubmit = async (data: typeof formData) => {
        setIsSubmitting(true);
        // Add a temporary "Sending..." message
        setMessages((prev) => [...prev, { id: "sending", sender: "bot", text: "Sending your message...", isTyping: true }]);

        try {
            const result = await submitContactMessage(data);

            if (result.success) {
                setMessages((prev) => prev.filter(m => m.id !== "sending")); // Remove sending
                addBotMessage("Message sent successfully! We'll be in touch soon. ✅");
                setCurrentStep("completed");
                toast.success("Message sent!");
            } else {
                setMessages((prev) => prev.filter(m => m.id !== "sending"));
                addBotMessage("Oh no, something went wrong. Please try again later.");
                toast.error(result.error || "Failed to send");
                setIsSubmitting(false); // Allow retry? or just validation fail
            }
        } catch (error) {
            setMessages((prev) => prev.filter(m => m.id !== "sending"));
            addBotMessage("An error occurred. Please check your connection.");
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto h-[600px] border border-border rounded-2xl overflow-hidden bg-card shadow-sm flex flex-col">
            {/* Header */}
            <div className="p-4 border-b bg-muted/30 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                    <h3 className="font-semibold">MindCare Assistant</h3>
                    <p className="text-xs text-muted-foreground">Always here to help</p>
                </div>
            </div>

            {/* Chat Area */}
            <div
                className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
                ref={scrollRef}
            >
                <AnimatePresence initial={false}>
                    {messages.map((message) => (
                        <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.3 }}
                            className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${message.sender === "user"
                                        ? "bg-primary text-primary-foreground rounded-tr-none"
                                        : "bg-muted/50 text-foreground rounded-tl-none border border-border/50"
                                    }`}
                            >
                                {message.isTyping ? (
                                    <span className="flex gap-1 h-5 items-center">
                                        <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                        <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                        <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce"></span>
                                    </span>
                                ) : (
                                    message.text
                                )}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Input Area */}
            {currentStep !== "completed" && (
                <div className="p-4 border-t bg-background">
                    <form
                        onSubmit={handleInputSubmit}
                        className="flex items-end gap-2"
                    >
                        {currentStep === "message" ? (
                            <Textarea
                                placeholder="Type your message..."
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleInputSubmit();
                                    }
                                }}
                                className="min-h-[60px] resize-none"
                                disabled={isSubmitting}
                                autoFocus
                            />
                        ) : (
                            <Input
                                placeholder={
                                    currentStep === "name" ? "Type your name..." :
                                        currentStep === "email" ? "Type your email..." :
                                            "Type your response..."
                                }
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                disabled={isSubmitting}
                                autoFocus
                            />
                        )}

                        <Button
                            type="submit"
                            size="icon"
                            disabled={!inputText.trim() || isSubmitting}
                            className="shrink-0 rounded-full h-10 w-10"
                        >
                            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                        </Button>
                    </form>
                </div>
            )}

            {currentStep === "completed" && (
                <div className="p-4 border-t bg-background text-center">
                    <Button onClick={() => window.location.reload()} variant="outline" size="sm">
                        Start New Conversation
                    </Button>
                </div>
            )}
        </div>
    );
}
