"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Trash2, BarChart2, X, RefreshCw, Lock } from "lucide-react";

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
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);
    
    useEffect(() => {
        // Initial focus on mount
        inputRef.current?.focus();
    }, []);

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
            // Auto-focus the input field after sending
            setTimeout(() => inputRef.current?.focus(), 100);
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
        <div className="-m-4 md:-m-6 flex flex-col h-[calc(100vh-4rem)] bg-background border-t border-border/50">
            {/* Header - Sleek Immersive Style */}
            <div className="flex-none bg-card border-b border-border/50 px-4 py-3 flex items-center justify-between z-10 shadow-sm relative">
                <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 opacity-[0.03] pointer-events-none" />
                
                <div className="flex items-center gap-4 relative z-10 w-full">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-xl shadow-sm border border-border/50 shrink-0">
                        🧠
                    </div>
                    <div className="flex flex-col flex-1 min-w-0">
                        <h1 className="text-base font-semibold text-foreground flex items-center gap-2 leading-tight truncate">
                            MindCare AI
                        </h1>
                        <p className="flex items-center text-xs text-muted-foreground mt-0.5 truncate gap-1">
                            <Lock className="w-3 h-3 text-emerald-500 shrink-0" />
                            Private ephemeral session
                        </p>
                    </div>
                    
                    <div className="flex gap-2 shrink-0">
                        <Button variant="ghost" size="icon" onClick={() => setShowSummary(!showSummary)} title="Summary" className="h-8 w-8 hover:bg-muted/50 rounded-full text-muted-foreground">
                            {showSummary ? <X className="w-4 h-4" /> : <BarChart2 className="w-4 h-4" />}
                        </Button>
                        <Button variant="ghost" size="icon" onClick={clearChat} title="Clear Session" className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive rounded-full text-muted-foreground transition-colors">
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {showSummary && (
                <div className="bg-card border-b border-border shadow-sm p-4 animate-in fade-in slide-in-from-top-2 relative z-20">
                    <div className="prose dark:prose-invert text-sm whitespace-pre-line max-w-none">
                        {getSummary()}
                    </div>
                </div>
            )}

            {/* Chat Area */}
            <ScrollArea className="flex-1 bg-muted/10 relative flex flex-col" ref={scrollRef}>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none mix-blend-overlay" />
                
                <div className="space-y-6 p-4 sm:p-6 pb-4 w-full h-full flex flex-col min-h-full">
                    {messages.length === 0 && (
                        <div className="flex-1 flex items-center justify-center min-h-[200px]">
                            <div className="text-center bg-card/60 backdrop-blur-sm px-6 py-8 rounded-2xl border border-border/30 shadow-sm max-w-sm w-full mx-auto animate-fade-in-up">
                                <div className="text-5xl mb-4">👋</div>
                                <h3 className="text-xl font-medium mb-2 text-foreground">Welcome to MindCare</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    I'm here to listen and support you. Share what's on your mind—I'm ready to help.
                                </p>
                            </div>
                        </div>
                    )}

                    {messages.map((msg, index) => {
                        const isMe = msg.role === "user";
                        return (
                            <div
                                key={index}
                                className={`flex items-end gap-2 w-full animate-fade-in-up ${isMe ? "justify-end" : "justify-start"}`}
                            >
                                {!isMe && (
                                    <Avatar className="w-8 h-8 bg-primary/10 border border-primary/20 shrink-0 mb-1 shadow-sm">
                                        <div className="flex items-center justify-center w-full h-full text-sm">🧠</div>
                                    </Avatar>
                                )}

                                <div className={`flex flex-col max-w-[85%] sm:max-w-[70%]`}>
                                    <div
                                        className={`px-4 py-2.5 text-[15px] shadow-sm leading-relaxed relative ${isMe
                                            ? "bg-primary text-primary-foreground rounded-2xl rounded-br-sm"
                                            : "bg-card text-foreground border border-border/50 rounded-2xl rounded-bl-sm"
                                        } ${msg.isCrisis ? "border-red-500 bg-red-50 dark:bg-red-950/30" : ""}`}
                                    >
                                        {msg.role === "assistant" && msg.isCrisis && (
                                            <div className="font-bold text-red-600 dark:text-red-400 mb-1 flex items-center gap-2 text-xs uppercase tracking-wider">
                                                🚨 Crisis Support
                                            </div>
                                        )}

                                        <div className="whitespace-pre-wrap break-words">{msg.content}</div>
                                        
                                        <div className={`text-[10px] text-right mt-1.5 opacity-70 flex items-center justify-end gap-1 ${isMe ? 'text-primary-foreground' : 'text-muted-foreground'}`}>
                                            {msg.timestamp}
                                            {msg.sentiment && (
                                                <span className="text-xs ml-1" title={`Mood: ${msg.sentiment.label}`}>
                                                    {msg.sentiment.emoji}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {isLoading && (
                        <div className="flex items-end gap-2 w-full animate-fade-in-up justify-start">
                            <Avatar className="w-8 h-8 bg-primary/10 border border-primary/20 shrink-0 mb-1 shadow-sm">
                                <div className="flex items-center justify-center w-full h-full text-sm">🧠</div>
                            </Avatar>
                            <div className="bg-card text-foreground border border-border/50 rounded-2xl rounded-bl-sm px-4 py-3.5 shadow-sm">
                                <div className="flex gap-1.5 items-center justify-center">
                                    <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={scrollRef} className="h-1" />
                </div>
            </ScrollArea>

            {/* Input Area Container */}
            <div className="flex-none bg-card border-t border-border/50 relative">
                <div className="p-3 sm:p-4 w-full">
                    <div className="flex items-end gap-2 max-w-full">
                        <div className="relative flex-1 bg-muted/40 rounded-3xl border border-border/50 focus-within:border-primary/50 focus-within:bg-background transition-colors overflow-hidden flex items-end">
                            <Input
                                ref={inputRef}
                                placeholder="Share what's on your mind..."
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleKeyPress}
                                className="min-h-[44px] h-[44px] bg-transparent border-0 focus-visible:ring-0 text-[15px] py-3 px-4 w-full rounded-none shadow-none"
                                disabled={isLoading}
                                autoComplete="off"
                            />
                        </div>
                        <Button
                            onClick={handleSendMessage}
                            disabled={isLoading || !inputValue.trim()}
                            size="icon"
                            className="h-[44px] w-[44px] rounded-full bg-primary hover:bg-primary/90 text-primary-foreground flex-shrink-0 shadow-md transition-all active:scale-95"
                        >
                            {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 ml-0.5" />}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
