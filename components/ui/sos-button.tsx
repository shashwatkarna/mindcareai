"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CircleAlert as AlertCircle, Phone, MessageSquare, X, Heart, Wind } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"

export function SosButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [isBreathing, setIsBreathing] = useState(false)

  const crisisResources = [
    { name: "National Suicide Prevention Lifeline", phone: "988", description: "Available 24/7 in English and Spanish" },
    { name: "Crisis Text Line", phone: "Text HOME to 741741", description: "Connect with a volunteer Crisis Counselor" },
    { name: "The Trevor Project", phone: "1-866-488-7386", description: "Crisis support for LGBTQ young people" },
    { name: "Veterans Crisis Line", phone: "988, then press 1", description: "24/7 confidential crisis support" },
  ]

  return (
    <>
      <motion.div 
        className="fixed bottom-6 right-6 z-[60]"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
      >
        <button
          className="h-16 w-16 rounded-full border-[3px] border-black bg-[#ff4d4f] text-white font-black text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex flex-col items-center justify-center gap-0.5"
          onClick={() => setIsOpen(true)}
        >
          <AlertCircle className="w-5 h-5 stroke-[3px]" />
          <span className="text-[10px] leading-none">SOS</span>
        </button>
      </motion.div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px] max-h-[95vh] overflow-y-auto bg-background/95 backdrop-blur-xl border-destructive/20 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-destructive flex items-center gap-2">
              <Heart className="w-6 h-6 fill-destructive" />
              You're Not Alone
            </DialogTitle>
            <DialogDescription>
              We're here for you. Choose an immediate resource or a quick grounding exercise.
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="hotlines" className="mt-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="hotlines">Hotlines</TabsTrigger>
              <TabsTrigger value="grounding">Grounding</TabsTrigger>
            </TabsList>
            
            <TabsContent value="hotlines" className="space-y-4 pt-4">
              {crisisResources.map((resource) => (
                <div key={resource.name} className="p-3 rounded-lg bg-muted/50 border border-border/50 hover:border-destructive/30 transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-sm">{resource.name}</h4>
                    <Button variant="ghost" size="sm" className="h-8 w-8 rounded-full text-destructive hover:bg-destructive/10" asChild>
                       <a href={`tel:${resource.phone.split(',')[0]}`}>
                         <Phone className="w-4 h-4" />
                       </a>
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">{resource.description}</p>
                  <p className="text-sm font-mono mt-2 text-primary">{resource.phone}</p>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="grounding" className="pt-4">
               <div className="flex flex-col items-center justify-center space-y-8 py-4">
                  <p className="text-sm text-center text-muted-foreground">Focus on your breath. Follow the circle.</p>
                  
                  <motion.div
                    className="relative flex items-center justify-center"
                    animate={isBreathing ? {
                        scale: [1, 1.5, 1],
                    } : {}}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                  >
                    <div className="w-32 h-32 rounded-full bg-primary/20 border-2 border-primary/50 blur-sm absolute" />
                    <div className="w-24 h-24 rounded-full bg-primary/40 border-2 border-primary flex items-center justify-center relative z-10 shadow-[0_0_30px_rgba(var(--primary),0.3)]">
                        <Wind className="w-10 h-10 text-white" />
                    </div>
                  </motion.div>

                  <div className="text-center">
                    <p className="font-bold text-lg h-8">
                       {isBreathing ? "Breathe In... Breathe Out..." : "Click to Start"}
                    </p>
                    <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-4"
                        onClick={() => setIsBreathing(!isBreathing)}
                    >
                        {isBreathing ? "Stop" : "Start 4-7-8 Breathing"}
                    </Button>
                  </div>
               </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  )
}
