"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import type { Score } from "@/lib/api/types"
import { ScoresAPI } from "@/lib/api/scores"

interface UseScoresResult {
  scores: Score[]
  isLoading: boolean
  error: Error | null
  cursor: string | undefined
  hasMore: boolean
  fetchNextPage: () => Promise<void>
}

const COOLDOWN_MS = 5000 // 5 secondes

export function useScores(options?: {
  sort?: "recent" | "best"
  from?: string
  to?: string
}): UseScoresResult {
  const sort = options?.sort ?? "recent"
  const from = options?.from
  const to = options?.to

  const [scores, setScores] = useState<Score[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [cursor, setCursor] = useState<string | undefined>(undefined)
  const [hasMore, setHasMore] = useState(true)
  const lastRequestAtRef = useRef(0)
  const inFlightRef = useRef(false)

  const prependUniqueScores = useCallback((currentScores: Score[], incomingScores: Score[]) => {
    if (incomingScores.length === 0) return currentScores

    const existingIds = new Set(currentScores.map((score) => score.ID))
    const uniqueIncoming = incomingScores.filter((score) => !existingIds.has(score.ID))

    if (uniqueIncoming.length === 0) return currentScores
    return [...uniqueIncoming, ...currentScores]
  }, [])

  const appendUniqueScores = useCallback((currentScores: Score[], incomingScores: Score[]) => {
    if (incomingScores.length === 0) return currentScores

    const existingIds = new Set(currentScores.map((score) => score.ID))
    const uniqueIncoming = incomingScores.filter((score) => !existingIds.has(score.ID))

    if (uniqueIncoming.length === 0) return currentScores
    return [...currentScores, ...uniqueIncoming]
  }, [])

  const fetchAfterCursor = useCallback(async () => {
    if (!cursor || inFlightRef.current) return

    const now = Date.now()
    if (sort === "recent" && now - lastRequestAtRef.current < COOLDOWN_MS) return

    inFlightRef.current = true
    lastRequestAtRef.current = now

    try {
      const response = await ScoresAPI.getScores({ cursor, sort, from, to })
      setScores((prev) =>
        sort === "best"
          ? appendUniqueScores(prev, response.scores)
          : prependUniqueScores(prev, response.scores)
      )
      setCursor(response.cursor)
      setHasMore(!!response.cursor)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"))
    } finally {
      inFlightRef.current = false
    }
  }, [appendUniqueScores, cursor, from, prependUniqueScores, sort, to])

  // Fetch initial scores
  useEffect(() => {
    const fetchInitialScores = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await ScoresAPI.getScores({ sort, from, to })
        setScores(response.scores)
        setCursor(response.cursor)
        setHasMore(!!response.cursor)
        lastRequestAtRef.current = Date.now()
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error"))
        setHasMore(false)
      } finally {
        setIsLoading(false)
      }
    }

    fetchInitialScores()
  }, [from, sort, to])

  useEffect(() => {
    if (sort !== "recent") return
    if (!cursor) return

    const intervalId = setInterval(() => {
      void fetchAfterCursor()
    }, COOLDOWN_MS)

    return () => clearInterval(intervalId)
  }, [cursor, fetchAfterCursor, sort])

  // Fetch next page
  const fetchNextPage = useCallback(async () => {
    if (isLoading) return
    await fetchAfterCursor()
  }, [fetchAfterCursor, isLoading])

  return {
    scores,
    isLoading,
    error,
    cursor,
    hasMore,
    fetchNextPage,
  }
}
