"use client"

import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, MapPin, Phone } from "lucide-react"
import { ConversationalForm } from "@/components/contact/conversational-form"

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
                                        <a href="mailto:shashwatkarna.07@gmail.com" className="text-muted-foreground hover:text-primary block transition-colors">shashwatkarna.07@gmail.com</a>
                                        <a href="mailto:busykainbox@gmail.com" className="text-muted-foreground hover:text-primary block transition-colors">busykainbox@gmail.com</a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-primary/10 rounded-lg text-primary">
                                        <Phone className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg">Call Us</h3>
                                        <a href="tel:+919971374395" className="text-muted-foreground hover:text-primary transition-colors">+91 9971374395</a>
                                        <p className="text-xs text-muted-foreground">Mon-Fri 9am-6pm IST</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-primary/10 rounded-lg text-primary">
                                        <MapPin className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg">Office</h3>
                                        <p className="text-muted-foreground">Sector-18, Noida</p>
                                        <p className="text-muted-foreground">India</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="h-full flex flex-col justify-center animate-slide-in-up [animation-delay:200ms]">
                            <ConversationalForm />
                        </div>
                    </div>

                </div>
            </main>
            <Footer />
        </div>
    )
}
