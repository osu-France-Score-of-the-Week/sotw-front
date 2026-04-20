/**
 * API service for fetching osu! scores
 */

import type { Player, PlayersResponse, ScorePageResponse, ScoresResponse } from "./types"

// Use relative URL to call our own API route (no CORS issues)
const API_BASE = "/api"

export class ScoresAPI {
  static async getScores(cursor?: string): Promise<ScoresResponse> {
    const params = new URLSearchParams()
    if (cursor) {
      params.append("cursor", cursor)
    }

    const query = params.toString()
    const url = `${API_BASE}/scores${query ? `?${query}` : ""}`

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`API error: ${response.status} - ${errorText}`)
      }

      return (await response.json()) as ScoresResponse
    } catch (error) {
      throw error
    }
  }

  static async getPlayerScores(params: {
    playerId: string
    page?: number
    sort?: "recent" | "best"
  }): Promise<ScorePageResponse> {
    const searchParams = new URLSearchParams()

    if (params.page && params.page > 1) {
      searchParams.append("page", String(params.page))
    }

    if (params.sort === "best") {
      searchParams.append("sort", "best")
    }

    const query = searchParams.toString()
    const url = `${API_BASE}/scores/player/${params.playerId}${query ? `?${query}` : ""}`

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`API error: ${response.status} - ${errorText}`)
    }

    return (await response.json()) as ScorePageResponse
  }

  static async getPlayers(): Promise<Player[]> {
    const url = `${API_BASE}/players`

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`API error: ${response.status} - ${errorText}`)
    }

    const data = (await response.json()) as Player[] | PlayersResponse

    if (Array.isArray(data)) {
      return data
    }

    if (Array.isArray(data.players)) {
      return data.players
    }

    throw new Error("Invalid players response format")
  }
}
