"use client"

import { useEffect, useState } from "react"

import { ScoresAPI } from "@/lib/api/scores"
import type { Player } from "@/lib/api/types"

interface UsePlayersResult {
  players: Player[]
  isLoading: boolean
  error: Error | null
}

export function usePlayers(): UsePlayersResult {
  const [players, setPlayers] = useState<Player[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const response = await ScoresAPI.getPlayers()
        setPlayers(response)
      } catch (err) {
        setPlayers([])
        setError(err instanceof Error ? err : new Error("Unknown error"))
      } finally {
        setIsLoading(false)
      }
    }

    void fetchPlayers()
  }, [])

  return {
    players,
    isLoading,
    error,
  }
}
