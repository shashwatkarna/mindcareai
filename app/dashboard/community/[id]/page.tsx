import { getCirclePosts, createServiceClient, getUserId } from "@/actions/community"
import { notFound } from "next/navigation"
import { ChatRoom } from "@/components/community/chat-room"

export default async function CirclePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createServiceClient()
  const currentUserId = await getUserId()
  
  if (!currentUserId) {
    notFound()
  }

  // 1. Fetch circle details
  const { data: circle } = await supabase
    .from("circles")
    .select("*")
    .eq("id", id)
    .single()

  if (!circle) {
    notFound()
  }

  // 2. Fetch current user's membership to get their pseudonym
  const { data: member } = await supabase
    .from("circle_members")
    .select("pseudonym")
    .eq("circle_id", id)
    .eq("user_id", currentUserId)
    .single()

  const currentUserPseudonym = member?.pseudonym || "Unknown User"

  // 3. Fetch posts ordered by newest first, then reverse for chat
  const postsRaw = await getCirclePosts(id)
  const posts = [...postsRaw].reverse()

  return (
    <ChatRoom 
      circle={circle} 
      initialPosts={posts} 
      currentUserId={currentUserId}
      currentUserPseudonym={currentUserPseudonym}
    />
  )
}
