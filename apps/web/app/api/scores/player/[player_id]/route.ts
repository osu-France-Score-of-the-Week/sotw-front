import { type NextRequest, NextResponse } from "next/server"

const BACKEND_API = process.env.BACKEND_API_URL || "http://localhost:8080/api/v1"

const VALID_SORTS = new Set(["recent", "best"])

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ player_id: string }> }
) {
  try {
    const { player_id } = await context.params
    const { searchParams } = new URL(request.url)

    const page = searchParams.get("page")
    const sort = searchParams.get("sort")?.toLowerCase() || "recent"
    const from = searchParams.get("from")
    const to = searchParams.get("to")

    if (!player_id) {
      return NextResponse.json({ error: "Missing player_id" }, { status: 400 })
    }

    if (!VALID_SORTS.has(sort)) {
      return NextResponse.json(
        { error: 'Invalid sort value. Use "recent" or "best".' },
        { status: 400 }
      )
    }

    if (page && (Number.isNaN(Number(page)) || Number(page) < 1)) {
      return NextResponse.json(
        { error: "Invalid page value. Use an integer >= 1." },
        { status: 400 }
      )
    }

    const backendUrl = new URL(`${BACKEND_API}/scores/player/${player_id}`)

    if (page) {
      backendUrl.searchParams.append("page", page)
    }

    if (sort !== "recent") {
      backendUrl.searchParams.append("sort", sort)
    }

    if (from) {
      backendUrl.searchParams.append("from", from)
    }

    if (to) {
      backendUrl.searchParams.append("to", to)
    }

    const response = await fetch(backendUrl.toString(), {
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
