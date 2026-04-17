/**
 * API service for fetching osu! scores
 */

import type { ScoresResponse } from "./types"

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
}
