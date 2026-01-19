export async function getSession() {
  const response = await fetch("/api/auth/session", {
    method: "GET",
    credentials: "include",
  })

  if (!response.ok) {
    return null
  }

  return response.json()
}

export async function logout() {
  await fetch("/api/auth/logout", {
    method: "POST",
    credentials: "include",
  })
}
