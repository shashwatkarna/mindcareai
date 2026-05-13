import { Suspense } from "react"
import { getAllCircles, getUserCircles } from "@/actions/community"
import { CircleCard } from "@/components/community/circle-card"
import { CommunityOnboarding } from "@/components/community/onboarding-dialog"
import { CreateCircleDialog } from "@/components/community/create-circle-dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Info } from "lucide-react"

export const metadata = {
  title: "Community Circles - MindCare AI",
  description: "Join anonymous support groups and share your journey.",
}

async function CirclesContent() {
  const [allCircles, myJoinedCircles] = await Promise.all([
    getAllCircles(),
    getUserCircles()
  ])

  const joinedCircleIds = myJoinedCircles.map((mc: any) => mc.circle_id)
  
  const myCircles = myJoinedCircles.map((mc: any) => ({
    circle: allCircles.find((c: any) => c.id === mc.circle_id) || mc.circles,
    pseudonym: mc.pseudonym
  }))
  
  const discoverCircles = allCircles.filter(
    (c: any) => !joinedCircleIds.includes(c.id)
  )

  return (
    <div className="lg:col-span-2 space-y-8">
      {myCircles.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">My Circles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myCircles.map((data: any) => (
              <CircleCard 
                key={data.circle.id} 
                circle={data.circle} 
                isJoined={true}
                pseudonym={data.pseudonym}
              />
            ))}
          </div>
        </section>
      )}

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-foreground">Discover Circles</h2>
        {discoverCircles.length === 0 ? (
          <p className="text-muted-foreground">You have joined all available circles!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {discoverCircles.map((circle: any) => (
              <CircleCard 
                key={circle.id} 
                circle={circle} 
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

function CirclesSkeleton() {
  return (
    <div className="lg:col-span-2 space-y-8">
      <section className="space-y-4">
        <div className="h-8 w-40 bg-muted/50 rounded-md animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-32 bg-muted/30 rounded-xl animate-pulse"></div>
          <div className="h-32 bg-muted/30 rounded-xl animate-pulse"></div>
        </div>
      </section>
      <section className="space-y-4">
        <div className="h-8 w-48 bg-muted/50 rounded-md animate-pulse mt-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-32 bg-muted/30 rounded-xl animate-pulse"></div>
          <div className="h-32 bg-muted/30 rounded-xl animate-pulse"></div>
          <div className="h-32 bg-muted/30 rounded-xl animate-pulse"></div>
          <div className="h-32 bg-muted/30 rounded-xl animate-pulse"></div>
        </div>
      </section>
    </div>
  )
}

export default function CommunityPage() {
  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <CommunityOnboarding />
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Users className="w-8 h-8 text-primary" />
            Support Circles
          </h1>
          <p className="text-muted-foreground mt-1 text-lg">
            Join topic-based safe spaces to connect, share, and heal anonymously.
          </p>
        </div>
        <CreateCircleDialog />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content: Circles wrapped in Suspense */}
        <Suspense fallback={<CirclesSkeleton />}>
          <CirclesContent />
        </Suspense>

        {/* Sidebar: Info */}
        <div className="space-y-6">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-xl overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 pointer-events-none" />
            <CardHeader className="pb-3 border-b border-border/30 relative z-10">
              <CardTitle className="text-lg flex items-center gap-2 text-foreground">
                <Info className="w-5 h-5 text-purple-500" />
                How Circles Work
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 relative z-10 space-y-4 text-sm text-muted-foreground leading-relaxed">
              <p>
                <strong className="text-foreground">Total Anonymity:</strong> When you join a circle, you'll be assigned a random pseudonym (like "Brave Panda"). Your real name is never revealed.
              </p>
              <p>
                <strong className="text-foreground">Safe Space:</strong> This community is heavily monitored to ensure a supportive environment. Any toxic behavior will result in an immediate ban.
              </p>
              <p>
                <strong className="text-foreground">Support Others:</strong> Read what others are going through, share your own experiences, and realize you are not alone.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
