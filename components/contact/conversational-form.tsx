"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, User, Loader2, MessageCircle, X, Sparkles } from "lucide-react";
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

interface ConversationalFormProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    initialSubject?: string;
}

export function ConversationalForm({ open, onOpenChange, initialSubject }: ConversationalFormProps) {
    const [internalIsOpen, setInternalIsOpen] = useState(false);
    const isOpen = open !== undefined ? open : internalIsOpen;
    const setIsOpen = onOpenChange || setInternalIsOpen;

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
            isTyping: true,
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
    }, [messages, isOpen]);

    // Handle initial subject
    useEffect(() => {
        if (initialSubject && isOpen && currentStep === "name") {
            setFormData(prev => ({ ...prev, subject: initialSubject }));
        }
    }, [initialSubject, isOpen, currentStep]);

    // Handle typing simulation
    useEffect(() => {
        if (!isOpen) return;
        const typingMessage = messages.find(m => m.isTyping);
        if (typingMessage) {
            const timer = setTimeout(() => {
                setMessages(prev => prev.map(m => m.id === typingMessage.id ? { ...m, isTyping: false } : m));
            }, 800);
            return () => clearTimeout(timer);
        }
    }, [messages, isOpen]);


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
                } else {
                    setFormData((prev) => ({ ...prev, email: userMessage.text as string }));
                    // If we have an initial subject, skip the subject question or auto-fill it
                    if (formData.subject) {
                        addBotMessage(`Got it. I see you're contacting us about "${formData.subject}". Please type your message below.`);
                        setCurrentStep("message");
                    } else {
                        addBotMessage("Got it. What is this regarding? (Subject)");
                        setCurrentStep("subject");
                    }
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
                await handleSubmit({ ...formData, message: finalMessage });
                break;
        }
    };

    const addBotMessage = (text: string) => {
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
        setMessages((prev) => [...prev, { id: "sending", sender: "bot", text: "Sending your message...", isTyping: true }]);

        try {
            const result = await submitContactMessage(data);

            if (result.success) {
                setMessages((prev) => prev.filter(m => m.id !== "sending"));
                addBotMessage("Message sent successfully! We'll be in touch soon. ✅");
                setCurrentStep("completed");
                toast.success("Message sent!");
            } else {
                setMessages((prev) => prev.filter(m => m.id !== "sending"));
                addBotMessage("Oh no, something went wrong. Please try again later.");
                toast.error(result.error || "Failed to send");
                setIsSubmitting(false);
            }
        } catch (error) {
            setMessages((prev) => prev.filter(m => m.id !== "sending"));
            addBotMessage("An error occurred. Please check your connection.");
            setIsSubmitting(false);
        }
    };

    const resetChat = () => {
        setMessages([
            {
                id: "intro-1",
                sender: "bot",
                text: "Hi there! I'm the MindCare AI assistant. 👋",
            },
            {
                id: "intro-2",
                sender: "bot",
                text: "I can help you get in touch with our team. What should I call you?",
                isTyping: true,
            },
        ]);
        setCurrentStep("name");
        setFormData({ name: "", email: "", subject: initialSubject || "", message: "" });
        setIsSubmitting(false);
    };

    if (!isOpen) {
        return (
            <motion.div
                layoutId="chat-container"
                className="w-full max-w-md mx-auto aspect-video sm:aspect-[4/3] max-h-[400px] flex items-center justify-center"
            >
                <div
                    onClick={() => setIsOpen(true)}
                    className="group relative cursor-pointer"
                >
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative h-24 sm:h-32 px-8 sm:px-12 bg-card border border-border rounded-full flex items-center gap-4 sm:gap-6 shadow-xl hover:scale-105 transition-transform">
                        <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-primary/10 flex items-center justify-center">
                            <MessageCircle className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                        </div>
                        <div className="text-left">
                            <h3 className="font-bold text-lg sm:text-2xl">Chat with Us</h3>
                            <p className="text-sm text-muted-foreground">Click to start conversation</p>
                        </div>
                        <Sparkles className="h-5 w-5 text-yellow-500 animate-pulse ml-2" />
                    </div>
                </div>
            </motion.div>
        )
    }

    return (
        <motion.div
            layoutId="chat-container"
            className="w-full h-full flex flex-col border-none bg-transparent"
        >
            {/* Header */}
            <div className="p-4 border-b bg-muted/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-sm">MindCare Assistant</h3>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                            Online
                        </p>
                    </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8 rounded-full">
                    <X className="h-4 w-4" />
                </Button>
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
                                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${message.sender === "user"
                                    ? "bg-primary text-primary-foreground rounded-tr-none"
                                    : "bg-muted/50 text-foreground rounded-tl-none border border-border/50"
                                    }`}
                            >
                                {message.isTyping ? (
                                    <span className="flex gap-1 h-5 items-center px-1">
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
            {currentStep !== "completed" ? (
                <div className="p-3 border-t bg-background">
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
                                className="min-h-[50px] max-h-[100px] resize-none py-3"
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
                                className="h-12"
                            />
                        )}

                        <Button
                            type="submit"
                            size="icon"
                            disabled={!inputText.trim() || isSubmitting}
                            className="shrink-0 rounded-full h-10 w-10 mb-1"
                        >
                            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                        </Button>
                    </form>
                </div>
            ) : (
                <div className="p-4 border-t bg-background text-center">
                    <Button onClick={resetChat} variant="outline" size="sm" className="w-full">
                        Start New Conversation
                    </Button>
                </div>
            )}
        </motion.div>
    );
}
