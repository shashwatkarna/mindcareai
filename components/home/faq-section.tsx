"use client"

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
    {
        question: "Is my data really private?",
        answer: "Absolutely. We use end-to-end encryption for all your journals and personal data. We are HIPAA compliant and never sell your data to advertisers.",
    },
    {
        question: "Can I use MindCare AI essentially for free?",
        answer: "Yes! The core features like mood tracking, journaling, and basic assessments are completely free. We offer premium plans for advanced AI insights and tele-health connections.",
    },
    {
        question: "Is the AI chatbot a replacement for a therapist?",
        answer: "No. The AI chatbot is a supportive tool for coping strategies, mindfulness, and listening. For deep psychological work, we recommend connecting with a licensed professional through our Appointments feature.",
    },
    {
        question: "How do the clinical assessments work?",
        answer: "We use standardized assessments like PHQ-9 (Depression) and GAD-7 (Anxiety). These are widely used in clinical settings to monitor symptom severity over time.",
    },
    {
        question: "Can I export my data to show my doctor?",
        answer: "Yes, you can generate a secure PDF report of your mood history and assessment scores to share with your healthcare provider.",
    },
]

export function FAQSection() {
    return (
        <section className="py-24 bg-[#0A0118] text-white">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">Frequently Asked Questions</h2>
                <Accordion type="single" collapsible className="w-full space-y-4">
                    {faqs.map((faq, i) => (
                        <AccordionItem key={i} value={`item-${i}`} className="border border-white/10 rounded-xl px-4 bg-white/5 data-[state=open]:bg-white/10 transition-colors">
                            <AccordionTrigger className="text-left text-lg hover:no-underline text-white dat-[state=open]:text-purple-400">{faq.question}</AccordionTrigger>
                            <AccordionContent className="text-gray-400 text-base pb-4">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    )
}
