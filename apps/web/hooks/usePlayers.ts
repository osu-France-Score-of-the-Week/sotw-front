"use client"

import { useEffect, useState } from "react"

import { ScoresAPI } from "@/lib/api/scores"
import type { Player } from "@/lib/api/types"

interface UsePlayersResult {
  players: Player[]
  page: number
  totalPages: number
  isLoading: boolean
  error: Error | null
}

export function usePlayers(page = 1): UsePlayersResult {
  const [players, setPlayers] = useState<Player[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const response = await ScoresAPI.getPlayers(page)
        setPlayers(response.players)
        setCurrentPage(response.page)
        setTotalPages(response.totalPages)
      } catch (err) {
        setPlayers([])
        setCurrentPage(1)
        setTotalPages(1)
        setError(err instanceof Error ? err : new Error("Unknown error"))
      } finally {
        setIsLoading(false)
      }
    }

    void fetchPlayers()
  }, [page])

  return {
    players,
    page: currentPage,
    totalPages,
    isLoading,
    error,
  }
}
