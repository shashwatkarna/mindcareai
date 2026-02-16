"use client"

import Link from "next/link"

export function Footer({ home = false }: { home?: boolean }) {
    const footerClass = home
        ? "bg-[#0A0118] border-t border-white/10 text-white"
        : "bg-card border-t border-border pt-16 pb-8"

    const textClass = home ? "text-gray-400" : "text-muted-foreground"
    const headingClass = home ? "text-white" : ""

    return (
        <footer className={`${footerClass} pt-16 pb-8 transition-colors duration-500`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <img src="/logo.png" alt="MindCare AI" className="w-8 h-8 object-contain" />
                            <span className={`font-bold text-lg ${headingClass}`}>MindCare AI</span>
                        </div>
                        <p className={`text-sm ${textClass} leading-relaxed`}>
                            Empowering your mental wellness journey through technology, privacy, and compassionate design.
                        </p>
                    </div>

                    <div>
                        <h4 className={`font-semibold mb-4 ${headingClass}`}>Product</h4>
                        <ul className={`space-y-2 text-sm ${textClass}`}>
                            <li><Link href="/features" className="hover:text-primary transition-colors">Features</Link></li>
                            <li><Link href="/pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">For Therapists</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className={`font-semibold mb-4 ${headingClass}`}>Company</h4>
                        <ul className={`space-y-2 text-sm ${textClass}`}>
                            <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                            <li><Link href="/contact" className="hover:text-primary transition-colors">Careers</Link></li>
                            <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className={`font-semibold mb-4 ${headingClass}`}>Legal</h4>
                        <ul className={`space-y-2 text-sm ${textClass}`}>
                            <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Cookie Policy</Link></li>
                        </ul>
                    </div>
                </div>

                <div className={`border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm ${textClass} ${home ? "border-white/10" : "border-border"}`}>
                    <p>&copy; {new Date().getFullYear()} MindCare AI. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link href="https://x.com/shashwat_karna" className="hover:text-primary transition-colors">Twitter</Link>
                        <Link href="https://www.linkedin.com/in/shashwatkarna/" className="hover:text-primary transition-colors">LinkedIn</Link>
                        <Link href="https://www.instagram.com/karn_shashwat/" className="hover:text-primary transition-colors">Instagram</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
