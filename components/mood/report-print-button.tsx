"use client"

import { Button } from "@/components/ui/button"
import { Printer } from "lucide-react"

export function ReportPrintButton() {
    return (
        <Button
            onClick={() => window.print()}
            className="print:hidden bg-primary text-white shadow-md hover:scale-105 transition-transform"
        >
            <Printer className="w-4 h-4 mr-2" />
            Print / Save as PDF
        </Button>
    )
}
