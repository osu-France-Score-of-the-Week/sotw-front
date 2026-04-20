"use client"

import { useEffect, useState } from "react"
import type { Score } from "@/lib/api/types"
import { ScoresAPI } from "@/lib/api/scores"

interface UsePlayerScoresOptions {
  playerId?: string
  page?: number
  sort?: "recent" | "best"
}

interface UsePlayerScoresResult {
  scores: Score[]
  page: number
  totalPages: number
  isLoading: boolean
  error: Error | null
}

export function usePlayerScores({
  playerId,
  page = 1,
  sort = "recent",
}: UsePlayerScoresOptions): UsePlayerScoresResult {
  const [scores, setScores] = useState<Score[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!playerId) {
      setScores([])
      setCurrentPage(1)
      setTotalPages(1)
      setIsLoading(false)
      setError(null)
      return
    }

    const fetchPlayerScores = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const response = await ScoresAPI.getPlayerScores({
          playerId,
          page,
          sort,
        })

        setScores(response.scores)
        setCurrentPage(response.page)
        setTotalPages(response.totalPages)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error"))
        setScores([])
      } finally {
        setIsLoading(false)
      }
    }

    void fetchPlayerScores()
  }, [playerId, page, sort])

  return {
    scores,
    page: currentPage,
    totalPages,
    isLoading,
    error,
  }
}
