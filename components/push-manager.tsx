"use client"

import { useEffect } from "react"
import { toast } from "sonner"

// Utility function to convert VAPID public key
function urlB64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/")

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

export function PushManager() {
  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      registerServiceWorkerAndSubscribe()
    }
  }, [])

  const registerServiceWorkerAndSubscribe = async () => {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js")
      
      // Check if we already have permission
      if (Notification.permission === "granted") {
        await subscribeUser(registration)
      } else if (Notification.permission !== "denied") {
        // We can ask for permission (could be tied to a UI button instead of automatic)
        const permission = await Notification.requestPermission()
        if (permission === "granted") {
          await subscribeUser(registration)
          toast.success("Push notifications enabled!")
        }
      }
    } catch (error) {
      console.error("Service Worker Error", error)
    }
  }

  const subscribeUser = async (registration: ServiceWorkerRegistration) => {
    const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
    if (!vapidPublicKey) return

    try {
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlB64ToUint8Array(vapidPublicKey),
      })

      // Send subscription to our server
      await fetch("/api/notifications/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subscription),
      })
    } catch (error) {
      console.error("Failed to subscribe the user: ", error)
    }
  }

  return null
}
