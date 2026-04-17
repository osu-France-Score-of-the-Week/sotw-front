"use client"

import { useEffect, useState } from "react"

export function useRelativeTime(timestampSeconds: number): string {
  const [relativeTime, setRelativeTime] = useState<string>("")

  useEffect(() => {
    const updateRelativeTime = () => {
      const now = Date.now()
      const scoreTime = timestampSeconds * 1000
      const diffMs = now - scoreTime
      const diffSec = Math.floor(diffMs / 1000)
      const diffMin = Math.floor(diffSec / 60)
      const diffHour = Math.floor(diffMin / 60)
      const diffDay = Math.floor(diffHour / 24)

      if (diffSec < 60) {
        setRelativeTime("now")
      } else if (diffMin < 60) {
        setRelativeTime(`${diffMin}m ago`)
      } else if (diffHour < 24) {
        setRelativeTime(`${diffHour}h ago`)
      } else if (diffDay < 7) {
        setRelativeTime(`${diffDay}d ago`)
      } else {
        setRelativeTime(`${Math.floor(diffDay / 7)}w ago`)
      }
    }

    updateRelativeTime()
    const interval = setInterval(updateRelativeTime, 30000) // Update every 30s

    return () => clearInterval(interval)
  }, [timestampSeconds])

  return relativeTime
}
