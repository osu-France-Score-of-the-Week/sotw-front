/**
 * API Route - Proxy to backend scores endpoint
 */

import { type NextRequest, NextResponse } from "next/server"

const BACKEND_API = process.env.BACKEND_API_URL || "http://localhost:8080/api/v1"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const cursor = searchParams.get("cursor")

    const backendUrl = new URL(`${BACKEND_API}/scores`)
    if (cursor) {
      backendUrl.searchParams.append("cursor", cursor)
    }

    console.log("[PROXY] Fetching from backend:", backendUrl.toString())

    const response = await fetch(backendUrl.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      console.error("[PROXY] Backend error:", response.status)
      return NextResponse.json(
        { error: `Backend error: ${response.status}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("[PROXY] Error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}
