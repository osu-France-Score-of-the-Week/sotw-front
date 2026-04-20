import { NextResponse } from "next/server"

const BACKEND_API = process.env.BACKEND_API_URL || "http://localhost:8080/api/v1"

export async function GET() {
  try {
    const backendUrl = `${BACKEND_API}/players`

    const response = await fetch(backendUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: `Backend error: ${response.status}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}
