"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Clock, ShieldCheck, Check } from "lucide-react"
import { cn } from "@/lib/utils"

export type Doctor = {
    id: string
    name: string
    specialty: string
    image: string
    rating: number
    reviewCount: number
    price: number
    location: string
    availability: string[]
    tags: string[]
}

export const DOCTORS: Doctor[] = [
    {
        id: "dr-sarah",
        name: "Dr. Sarah Wilson",
        specialty: "Clinical Psychologist",
        image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=300",
        rating: 4.9,
        reviewCount: 128,
        price: 150,
        location: "Online & In-person",
        availability: ["Mon", "Tue", "Thu"],
        tags: ["Anxiety", "Depression", "CBT"]
    },
    {
        id: "dr-james",
        name: "Dr. James Chen",
        specialty: "Psychiatrist",
        image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300&h=300",
        rating: 4.8,
        reviewCount: 95,
        price: 200,
        location: "Online Only",
        availability: ["Wed", "Fri", "Sat"],
        tags: ["Medication", "ADHD", "Sleep"]
    },
    {
        id: "dr-emily",
        name: "Dr. Emily Brooks",
        specialty: "Family Therapist",
        image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=300&h=300",
        rating: 4.9,
        reviewCount: 210,
        price: 130,
        location: "In-person",
        availability: ["Mon", "Wed", "Fri"],
        tags: ["Relationships", "Family", "Trauma"]
    },
    {
        id: "dr-michael",
        name: "Dr. Michael Ross",
        specialty: "Head of Psychiatry",
        image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300&h=300",
        rating: 5.0,
        reviewCount: 340,
        price: 250,
        location: "Online & In-person",
        availability: ["Tue", "Thu"],
        tags: ["Severe Disorders", "Leadership", "Consultation"]
    }
]

interface DoctorSelectionProps {
    onSelect: (doctor: Doctor) => void
    selectedDoctorId?: string
}

export function DoctorSelection({ onSelect, selectedDoctorId }: DoctorSelectionProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {DOCTORS.map((doctor) => (
                <Card
                    key={doctor.id}
                    className={cn(
                        "cursor-pointer transition-all hover:shadow-md border-2 relative overflow-hidden group",
                        selectedDoctorId === doctor.id ? "border-primary bg-primary/5 shadow-md" : "border-transparent hover:border-primary/20"
                    )}
                    onClick={() => onSelect(doctor)}
                >
                    {selectedDoctorId === doctor.id && (
                        <div className="absolute top-2 right-2 bg-primary text-white p-1 rounded-full shadow-sm z-10">
                            <Check className="w-4 h-4" />
                        </div>
                    )}

                    <CardContent className="p-4 flex gap-4">
                        {/* Image */}
                        <div className="relative shrink-0">
                            <img
                                src={doctor.image}
                                alt={doctor.name}
                                className="w-20 h-20 rounded-full object-cover border-2 border-background shadow-sm group-hover:scale-105 transition-transform"
                            />
                            <div className="absolute bottom-0 right-0 bg-green-500 w-4 h-4 rounded-full border-2 border-white" title="Available"></div>
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="font-bold text-foreground truncate flex items-center gap-1">
                                        {doctor.name}
                                        <ShieldCheck className="w-4 h-4 text-blue-500" />
                                    </h3>
                                    <p className="text-sm text-primary font-medium">{doctor.specialty}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-1 mt-1">
                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                <span className="text-xs font-bold">{doctor.rating}</span>
                                <span className="text-xs text-muted-foreground">({doctor.reviewCount} reviews)</span>
                            </div>

                            <div className="flex flex-wrap gap-1 mt-3">
                                {doctor.tags.slice(0, 2).map((tag) => (
                                    <Badge key={tag} variant="secondary" className="text-[10px] h-5 px-1.5">{tag}</Badge>
                                ))}
                                {doctor.tags.length > 2 && (
                                    <Badge variant="secondary" className="text-[10px] h-5 px-1.5">+{doctor.tags.length - 2}</Badge>
                                )}
                            </div>
                        </div>
                    </CardContent>

                    {/* Footer Info */}
                    <div className="bg-secondary/30 px-4 py-2 flex items-center justify-between text-xs text-muted-foreground border-t border-border/50">
                        <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {doctor.location}
                        </div>
                        <div className="font-semibold text-foreground">
                            ${doctor.price}/hr
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    )
}
