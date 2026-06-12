import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password are required" }, { status: 400 })
    }

    const envUsername = process.env.ADMIN_USERNAME
    const envPassword = process.env.ADMIN_PASSWORD

    if (!envUsername || !envPassword) {
      console.error("Admin credentials are not set in environment variables.")
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }

    if (username === envUsername && password === envPassword) {
      // Create a simple signed/obscured token (for a real app, use a proper JWT)
      const token = Buffer.from(`admin:${Date.now()}:${envUsername}`).toString("base64")
      
      const cookieStore = await cookies()
      cookieStore.set("mindcare_admin_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24, // 24 hours
      })

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
