/**
 * API service for fetching osu! scores
 */

import type {
  Player,
  PlayerPageResponse,
  PlayersResponse,
  ScorePageResponse,
  ScoresResponse,
} from "./types"

// Use relative URL to call our own API route (no CORS issues)
const API_BASE = "/api"

export class ScoresAPI {
  static async getScores(options?: { cursor?: string; sort?: "recent" | "best" }): Promise<ScoresResponse> {
    const searchParams = new URLSearchParams()
    if (options?.cursor) {
      searchParams.append("cursor", options.cursor)
    }

    if (options?.sort === "best") {
      searchParams.append("sort", "best")
    }

    const query = searchParams.toString()
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

  static async getPlayers(page?: number): Promise<PlayerPageResponse> {
    const searchParams = new URLSearchParams()
    if (page && page > 1) {
      searchParams.append("page", String(page))
    }

    const query = searchParams.toString()
    const url = `${API_BASE}/players${query ? `?${query}` : ""}`

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

    const data = (await response.json()) as Player[] | PlayersResponse | PlayerPageResponse

    if (
      typeof data === "object" &&
      data !== null &&
      "players" in data &&
      Array.isArray(data.players) &&
      "page" in data &&
      "totalPages" in data &&
      typeof data.page === "number" &&
      typeof data.totalPages === "number"
    ) {
      return data
    }

    if (Array.isArray(data)) {
      return {
        players: data,
        page: 1,
        totalPages: 1,
      }
    }

    if (typeof data === "object" && data !== null && "players" in data && Array.isArray(data.players)) {
      return {
        players: data.players as Player[],
        page: 1,
        totalPages: 1,
      }
    }

    throw new Error("Invalid players response format")
  }
}
