"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Trash2, BarChart2, X, RefreshCw } from "lucide-react";

type Message = {
    role: "user" | "assistant";
    content: string;
    timestamp: string;
    sentiment?: { label: string; emoji: string };
    isCrisis?: boolean;
};

export function ChatInterface() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showSummary, setShowSummary] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const handleSendMessage = async () => {
        if (!inputValue.trim() || isLoading) return;

        const userMessage: Message = {
            role: "user",
            content: inputValue,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputValue("");
        setIsLoading(true);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userMessage.content }),
            });

            const data = await response.json();

            if (response.ok) {
                const aiMessage: Message = {
                    role: "assistant",
                    content: data.response,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    sentiment: data.sentiment,
                    isCrisis: data.isCrisis,
                };
                setMessages((prev) => [...prev, aiMessage]);
            } else {
                const errorMessage: Message = {
                    role: "assistant",
                    content: `⚠️ Error: ${data.error || "Something went wrong."}`,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                };
                setMessages((prev) => [...prev, errorMessage]);
            }
        } catch (error) {
            console.error("Failed to send message:", error);
            const errorMessage: Message = {
                role: "assistant",
                content: "⚠️ Network error. Please try again.",
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const clearChat = () => {
        setMessages([]);
        setShowSummary(false);
    };

    const getSummary = () => {
        if (messages.length < 4) return "Not enough conversation data for summary. Chat more!";

        const userMsgs = messages.filter(m => m.role === "user");
        // Simple mood count
        const sentimentCounts: Record<string, number> = {};
        userMsgs.forEach(msg => {
            // As we don't store sentiment on user msg in this simplified version (it's returned by API), 
            // we might need to adjust or just use the AI's reaction or store it in state if we want better summary.
            // For now let's just count total messages.
            // Ideally, we'd store the sentiment returned by the API for the *previous* user message, 
            // or analyze it client side (which we don't do).
            // Let's iterate through assistant messages that have sentiment attached to them 
            // derived from the user's previous message.
        });

        // Let's use assistant messages corresponding to user input to gauge sentiment
        const assistantMsgs = messages.filter(m => m.role === "assistant" && m.sentiment);
        assistantMsgs.forEach(msg => {
            if (msg.sentiment) {
                const label = msg.sentiment.label;
                sentimentCounts[label] = (sentimentCounts[label] || 0) + 1;
            }
        });

        let summary = `### 📊 Conversation Summary\n\n**Total Messages:** ${messages.length}\n\n**Emotional Journey:**\n`;

        Object.entries(sentimentCounts).forEach(([mood, count]) => {
            const percentage = ((count / assistantMsgs.length) * 100).toFixed(1);
            summary += `- ${mood}: ${count} (${percentage}%)\n`;
        });

        return summary;
    };

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)] gap-4 max-w-5xl mx-auto w-full">
            <div className="flex items-center justify-between mb-2">
                <div>
                    <h1 className="text-2xl font-bold">🧠 MindSpace AI</h1>
                    <p className="text-muted-foreground text-sm">Your empathetic mental health companion</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setShowSummary(!showSummary)}>
                        {showSummary ? <X className="w-4 h-4 mr-2" /> : <BarChart2 className="w-4 h-4 mr-2" />}
                        {showSummary ? "Close Summary" : "Summary"}
                    </Button>
                    <Button variant="outline" size="sm" onClick={clearChat} className="text-destructive hover:text-destructive">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Clear
                    </Button>
                </div>
            </div>

            {showSummary && (
                <Card className="bg-muted/50 border-primary/20 mb-4 animate-in fade-in slide-in-from-top-4">
                    <CardContent className="pt-6">
                        <div className="prose dark:prose-invert text-sm whitespace-pre-line">
                            {getSummary()}
                        </div>
                    </CardContent>
                </Card>
            )}

            <Card className="flex-1 flex flex-col shadow-lg border-primary/10 overflow-hidden">
                <CardContent className="flex-1 overflow-hidden p-0 relative">
                    <ScrollArea className="h-full p-4">
                        <div className="flex flex-col gap-4 pb-4">
                            {messages.length === 0 && (
                                <div className="text-center text-muted-foreground mt-20">
                                    <div className="text-4xl mb-4">👋</div>
                                    <h3 className="text-lg font-medium mb-2">Welcome to MindSpace</h3>
                                    <p className="max-w-sm mx-auto">
                                        I'm here to listen and support you. Share what's on your mind—I'm ready to help.
                                    </p>
                                </div>
                            )}

                            {messages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`flex items-start gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"
                                        }`}
                                >
                                    <Avatar className={`w-8 h-8 ${msg.role === "assistant" ? "bg-primary/10" : "bg-muted"}`}>
                                        {msg.role === "assistant" ? (
                                            <div className="flex items-center justify-center w-full h-full text-lg">🧠</div>
                                        ) : (
                                            <AvatarFallback>U</AvatarFallback>
                                        )}
                                    </Avatar>

                                    <div
                                        className={`flex flex-col max-w-[80%] ${msg.role === "user" ? "items-end" : "items-start"
                                            }`}
                                    >
                                        <div
                                            className={`px-4 py-2.5 rounded-2xl shadow-sm text-sm whitespace-pre-wrap ${msg.role === "user"
                                                    ? "bg-primary text-primary-foreground rounded-tr-none"
                                                    : "bg-muted text-foreground rounded-tl-none border border-border"
                                                } ${msg.isCrisis ? "border-red-500 bg-red-50 dark:bg-red-950/30" : ""}`}
                                        >
                                            {msg.role === "assistant" && msg.isCrisis && (
                                                <div className="font-bold text-red-600 dark:text-red-400 mb-1 flex items-center gap-2">
                                                    🚨 Crisis Support
                                                </div>
                                            )}

                                            {/* Render content - simple text for now, could use markdown parser if needed */}
                                            {msg.content}
                                        </div>

                                        <div className="flex items-center gap-2 mt-1 px-1">
                                            <span className="text-[10px] text-muted-foreground opacity-70">
                                                {msg.timestamp}
                                            </span>
                                            {msg.sentiment && (
                                                <span className="text-xs" title={`Mood: ${msg.sentiment.label}`}>
                                                    {msg.sentiment.emoji}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {isLoading && (
                                <div className="flex items-start gap-3">
                                    <Avatar className="w-8 h-8 bg-primary/10">
                                        <div className="flex items-center justify-center w-full h-full text-lg">🧠</div>
                                    </Avatar>
                                    <div className="bg-muted px-4 py-3 rounded-2xl rounded-tl-none border border-border">
                                        <div className="flex gap-1">
                                            <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                            <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                            <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce"></span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={scrollRef} />
                        </div>
                    </ScrollArea>
                </CardContent>

                <CardFooter className="p-4 border-t bg-muted/20">
                    <div className="flex w-full gap-2 items-end">
                        <Input
                            placeholder="Share what's on your mind..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyPress}
                            className="flex-1 min-h-[50px] bg-background border-muted-foreground/20 focus-visible:ring-primary shadow-sm"
                            disabled={isLoading}
                            autoComplete="off"
                        />
                        <Button
                            onClick={handleSendMessage}
                            disabled={isLoading || !inputValue.trim()}
                            size="icon"
                            className="h-[50px] w-[50px] shrink-0"
                        >
                            {isLoading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                        </Button>
                    </div>
                </CardFooter>
            </Card>

            <div className="text-center text-xs text-muted-foreground/60">
                MindSpace AI is a supportive companion, not a replacement for professional therapy.
            </div>
        </div>
    );
}
