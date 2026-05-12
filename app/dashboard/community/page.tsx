import { getActiveChallenges, getUserEnrollments, getRecentNudges } from "@/actions/community"
import { ChallengeCard } from "@/components/community/challenge-card"
import { CommunityOnboarding } from "@/components/community/onboarding-dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Heart } from "lucide-react"

export const metadata = {
  title: "Community Challenges - MindCare AI",
  description: "Join challenges and support your peers.",
}

export default async function CommunityPage() {
  const [activeChallenges, enrollments, recentNudges] = await Promise.all([
    getActiveChallenges(),
    getUserEnrollments(),
    getRecentNudges()
  ])

  const enrolledChallengeIds = enrollments.map((e: any) => e.challenge_id)
  const myChallenges = enrollments.map((e: any) => ({
    challenge: activeChallenges.find((c: any) => c.id === e.challenge_id) || e.challenges,
    enrollment: e
  }))
  
  const availableChallenges = activeChallenges.filter(
    (c: any) => !enrolledChallengeIds.includes(c.id)
  )

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <CommunityOnboarding />
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Users className="w-8 h-8 text-primary" />
            Community Challenges
          </h1>
          <p className="text-muted-foreground mt-1 text-lg">
            Join shared wellness goals and encourage others on their journey.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content: Challenges */}
        <div className="lg:col-span-2 space-y-8">
          {myChallenges.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">My Active Challenges</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myChallenges.map((data: any) => (
                  <ChallengeCard 
                    key={data.challenge.id} 
                    challenge={data.challenge} 
                    enrollment={data.enrollment} 
                  />
                ))}
              </div>
            </section>
          )}

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">Discover Challenges</h2>
            {availableChallenges.length === 0 ? (
              <p className="text-muted-foreground">You have joined all active challenges!</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableChallenges.map((challenge: any) => (
                  <ChallengeCard 
                    key={challenge.id} 
                    challenge={challenge} 
                  />
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Sidebar: Nudges & Leaderboard */}
        <div className="space-y-6">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-xl overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-orange-500/10 pointer-events-none" />
            <CardHeader className="pb-3 border-b border-border/30 relative z-10">
              <CardTitle className="text-lg flex items-center gap-2 text-foreground">
                <Heart className="w-5 h-5 text-pink-500" />
                Recent Nudges
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 relative z-10">
              {recentNudges.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  <p className="text-sm">No nudges yet.</p>
                  <p className="text-xs mt-1">Join a challenge to interact with peers!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentNudges.map((nudge: any) => (
                    <div key={nudge.id} className="flex items-center gap-3 bg-muted/30 p-3 rounded-xl border border-border/30">
                      <div className="text-2xl bg-background rounded-full w-10 h-10 flex items-center justify-center shadow-sm">
                        {nudge.message}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          Someone cheered you on!
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          In: {nudge.challenges?.title}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-xl">
             <CardHeader className="pb-3 border-b border-border/30">
              <CardTitle className="text-lg flex items-center gap-2 text-foreground">
                ℹ️ About Challenges
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 text-sm text-muted-foreground leading-relaxed space-y-2">
              <p>Challenges are a safe space to build habits together.</p>
              <p>• Your privacy is protected.</p>
              <p>• Only your first name and progress are visible to peers.</p>
              <p>• Send nudges to keep the community motivated!</p>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  )
}
