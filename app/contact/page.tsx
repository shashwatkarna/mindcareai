"use client"

import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, MapPin, Phone } from "lucide-react"

export default function ContactPage() {
    return (
        <div className="min-h-screen flex flex-col font-sans">
            <Navbar />
            <main className="flex-1 bg-background">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">

                    <div className="grid md:grid-cols-2 gap-16">
                        <div className="animate-slide-in-up">
                            <h1 className="text-4xl font-bold mb-6">Get in Touch</h1>
                            <p className="text-xl text-muted-foreground mb-12">
                                Have questions about MindCare AI? Our team is here to help you.
                            </p>

                            <div className="space-y-8">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-primary/10 rounded-lg text-primary">
                                        <Mail className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg">Email Us</h3>
                                        <p className="text-muted-foreground">support@mindcare.ai</p>
                                        <p className="text-muted-foreground">partners@mindcare.ai</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-primary/10 rounded-lg text-primary">
                                        <Phone className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg">Call Us</h3>
                                        <p className="text-muted-foreground">+1 (888) 123-4567</p>
                                        <p className="text-xs text-muted-foreground">Mon-Fri 9am-6pm EST</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-primary/10 rounded-lg text-primary">
                                        <MapPin className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg">Office</h3>
                                        <p className="text-muted-foreground">123 Wellness Way</p>
                                        <p className="text-muted-foreground">San Francisco, CA 94105</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-card border border-border rounded-2xl p-8 shadow-sm animate-slide-in-up [animation-delay:200ms]">
                            <h2 className="text-2xl font-bold mb-6">Send a Message</h2>
                            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">First Name</label>
                                        <Input placeholder="Jane" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Last Name</label>
                                        <Input placeholder="Doe" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Email</label>
                                    <Input type="email" placeholder="jane@example.com" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Subject</label>
                                    <Input placeholder="How can we help?" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Message</label>
                                    <Textarea placeholder="Tell us more..." className="h-32" />
                                </div>

                                <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                                    Send Message
                                </Button>
                            </form>
                        </div>
                    </div>

                </div>
            </main>
            <Footer />
        </div>
    )
}
