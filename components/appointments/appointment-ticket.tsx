"use client"

import { useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { QRCodeSVG } from "qrcode.react"
import { Calendar, Clock, MapPin, Download, Share2, Loader2, Check } from "lucide-react"

interface AppointmentTicketProps {
    appointmentId: string
    doctorName: string
    doctorRole: string
    date: string
    time: string
    location: string
    onDownload?: () => void
}

export function AppointmentTicket({
    appointmentId,
    doctorName,
    doctorRole,
    date,
    time,
    location
}: AppointmentTicketProps) {
    const ticketRef = useRef<HTMLDivElement>(null)
    const [isDownloading, setIsDownloading] = useState(false)
    const [isSharing, setIsSharing] = useState(false)

    const handleDownload = async () => {
        if (!ticketRef.current) return
        setIsDownloading(true)

        try {
            const html2canvas = (await import("html2canvas")).default
            const jsPDF = (await import("jspdf")).default

            const canvas = await html2canvas(ticketRef.current, {
                scale: 2,
                backgroundColor: "#ffffff",
                useCORS: true
            })

            const imgData = canvas.toDataURL("image/png")
            const pdf = new jsPDF({
                orientation: "portrait",
                unit: "px",
                format: [canvas.width, canvas.height]
            })

            pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height)
            pdf.save(`MindCare-Ticket-${appointmentId.slice(0, 8)}.pdf`)
        } catch (err) {
            console.error("Failed to generate PDF", err)
            alert("Failed to download ticket. Please try again.")
        } finally {
            setIsDownloading(false)
        }
    }

    const handleShare = async () => {
        setIsSharing(true)
        const shareData = {
            title: 'MindCare Appointment',
            text: `Confirmed appointment with ${doctorName} on ${date} at ${time}. Ref: ${appointmentId.slice(0, 8)}`,
            url: window.location.href // Or a specific status URL if available
        }

        try {
            if (navigator.share) {
                await navigator.share(shareData)
            } else {
                await navigator.clipboard.writeText(
                    `Appointment Confirmed!\nDoctor: ${doctorName}\nDate: ${date} ${time}\nRef: ${appointmentId}`
                )
                alert("Appointment details copied to clipboard!")
            }
        } catch (err) {
            console.error("Error sharing:", err)
        } finally {
            setIsSharing(false)
        }
    }

    return (
        <Card ref={ticketRef} className="max-w-md mx-auto border-2 border-dashed border-primary/20 bg-card relative overflow-hidden shadow-lg animate-in fade-in zoom-in-95 duration-500 print:shadow-none print:border-none">
            {/* Visual Ticket Notch Top */}
            <div className="absolute -left-3 top-1/2 w-6 h-6 bg-background rounded-full transform -translate-y-1/2 border border-border/50 print:hidden"></div>
            <div className="absolute -right-3 top-1/2 w-6 h-6 bg-background rounded-full transform -translate-y-1/2 border border-border/50 print:hidden"></div>

            <CardHeader className="text-center pb-2 border-b border-dashed border-border/50">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2 text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                </div>
                <CardTitle className="text-xl text-primary">Booking Confirmed</CardTitle>
                <CardDescription>Your appointment is locked in.</CardDescription>
                <p className="font-mono text-xs text-muted-foreground mt-1 uppercase tracking-widest">REF: {appointmentId.slice(0, 8)}</p>
            </CardHeader>

            <CardContent className="pt-6 space-y-6">
                {/* Doctor Info */}
                <div className="text-center">
                    <h3 className="font-bold text-lg text-foreground">{doctorName}</h3>
                    <p className="text-sm text-muted-foreground">{doctorRole}</p>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4 bg-secondary/30 p-4 rounded-lg">
                    <div className="flex flex-col gap-1">
                        <span className="text-xs text-muted-foreground uppercase tracking-wide">Date</span>
                        <span className="font-semibold text-sm flex items-center gap-1.5 text-foreground">
                            <Calendar className="w-3.5 h-3.5 text-primary" /> {date}
                        </span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-xs text-muted-foreground uppercase tracking-wide">Time</span>
                        <span className="font-semibold text-sm flex items-center gap-1.5 text-foreground">
                            <Clock className="w-3.5 h-3.5 text-primary" /> {time}
                        </span>
                    </div>
                    <div className="flex flex-col gap-1 col-span-2">
                        <span className="text-xs text-muted-foreground uppercase tracking-wide">Location/Link</span>
                        <span className="font-semibold text-sm flex items-center gap-1.5 text-foreground">
                            <MapPin className="w-3.5 h-3.5 text-primary" /> {location}
                        </span>
                    </div>
                </div>

                {/* QR Code */}
                <div className="flex justify-center py-2">
                    <div className="p-2 bg-white rounded-lg shadow-sm border">
                        <QRCodeSVG value={`https://mindcare.ai/verify/${appointmentId}`} size={80} />
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 print:hidden">
                    <Button variant="outline" className="flex-1" size="sm" onClick={handleShare} disabled={isSharing}>
                        {isSharing ? <Check className="w-4 h-4 mr-2" /> : <Share2 className="w-4 h-4 mr-2" />}
                        {isSharing ? "Shared" : "Share"}
                    </Button>
                    <Button className="flex-1" size="sm" onClick={handleDownload} disabled={isDownloading}>
                        {isDownloading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
                        {isDownloading ? "Saving..." : "Save PDF"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
