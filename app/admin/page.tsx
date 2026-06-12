import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { PushNotificationForm } from "@/components/admin/push-notification-form"
import { AdminLogoutButton } from "@/components/admin/admin-logout-button"
import { ShieldCheck } from "lucide-react"

export const metadata = {
  title: "Admin Dashboard - MindCare AI",
  description: "Private admin dashboard for MindCare AI",
}

export default async function AdminPage() {
  const cookieStore = await cookies()
  const adminToken = cookieStore.get("mindcare_admin_token")?.value

  // Security Check: Is the user authenticated as admin?
  if (!adminToken) {
    redirect("/admin/login")
  }

  // Very basic token validation for demonstration. 
  // Real app might want to verify the JWT signature.
  if (!adminToken.startsWith(Buffer.from("admin:").toString("base64").substring(0, 5))) {
    redirect("/admin/login")
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-black">
      <header className="bg-white border-b border-black/10 py-4 px-6 flex justify-between items-center shadow-sm">
        <h1 className="text-xl font-bold">Admin Console</h1>
        <AdminLogoutButton />
      </header>

      <main className="container max-w-2xl mx-auto py-12 px-4">
        <PushNotificationForm />
      </main>
    </div>
  )
}
