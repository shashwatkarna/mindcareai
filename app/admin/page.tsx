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
    <div className="container max-w-4xl py-10 px-4 md:px-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">Admin Console</h1>
            <p className="text-muted-foreground mt-1">Authorized Access Only</p>
          </div>
        </div>
        <AdminLogoutButton />
      </div>

      <div className="grid gap-8">
        <PushNotificationForm />
        
        {/* We can add more admin tools here in the future! */}
      </div>
    </div>
  )
}
