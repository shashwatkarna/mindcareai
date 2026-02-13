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
        <section className="py-24 bg-[#FBF4EE] dark:bg-transparent transition-colors duration-500">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
                <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq, i) => (
                        <AccordionItem key={i} value={`item-${i}`}>
                            <AccordionTrigger className="text-left text-lg">{faq.question}</AccordionTrigger>
                            <AccordionContent className="text-muted-foreground text-base">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    )
}
