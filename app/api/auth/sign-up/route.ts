import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import bcrypt from "bcryptjs"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { username, password, fullName } = await request.json()

    // Validation
    if (!username || username.length < 3) {
      return NextResponse.json({ error: "Username must be at least 3 characters" }, { status: 400 })
    }

    if (!password || password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 })
    }

    const cookieStore = await cookies()
    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          } catch {
            // Handle errors during cookie setting
          }
        },
      },
    })

    const { data: existingUser, error: checkError } = await supabase
      .from("users")
      .select("id")
      .eq("username", username)
      .maybeSingle()

    if (checkError) {
      console.error("[Auth] Error checking username:", checkError)
      return NextResponse.json({ error: "Error checking username availability" }, { status: 500 })
    }

    if (existingUser) {
      return NextResponse.json({ error: "Username already exists" }, { status: 400 })
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10)

    // Create Supabase auth user first
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: `${username}@mindcare.local`,
      password: password, // Use the original password for Supabase auth
      email_confirm: true, // Auto-confirm the email
      user_metadata: {
        username: username,
        full_name: fullName || username,
      },
    })

    if (authError) {
      console.error("[Auth] Error creating auth user:", authError)
      return NextResponse.json({ error: "Error creating user account" }, { status: 400 })
    }

    // Create user in custom table
    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          id: authUser.user.id, // Use the same ID as the auth user
          username,
          password_hash: passwordHash,
          full_name: fullName || username,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("[Auth] Error creating user:", error)
      // Try to delete the auth user if custom user creation failed
      await supabase.auth.admin.deleteUser(authUser.user.id)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, user: data }, { status: 201 })
  } catch (error) {
    console.error("[Auth] Sign up error:", error)
    return NextResponse.json({ error: "An error occurred during sign up" }, { status: 500 })
  }
}
