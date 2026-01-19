import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-4 md:p-6 animate-fade-in relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl opacity-50 animate-float"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-3xl opacity-50 animate-float [animation-delay:2s]"></div>
      </div>

      <div className="w-full max-w-sm relative z-10">
        <div className="mb-8 text-center animate-slide-in-down">
          <div className="flex justify-center mb-4">
            <img src="/logo.png" alt="MindCare AI" className="w-16 h-16 object-contain" />
          </div>
          <h1 className="text-2xl font-bold">MindCare AI</h1>
        </div>

        <Card className="border-border/50 backdrop-blur-sm bg-card/80 animate-scale-in shadow-xl">
          <CardHeader className="gap-3 text-center">
            <div className="flex justify-center mb-4 animate-float">
              <CheckCircle2 className="w-12 h-12 text-primary" />
            </div>
            <CardTitle className="text-2xl">Account Created!</CardTitle>
            <CardDescription>Welcome to MindCare AI</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground text-center">
              Your account has been successfully created. You can now sign in and start your mental health journey.
            </p>
            <Link href="/auth/login">
              <Button className="w-full bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:shadow-primary/50 transition-all duration-300">
                Go to Login
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
