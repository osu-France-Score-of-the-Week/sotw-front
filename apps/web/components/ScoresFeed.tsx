"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { ScoreCard } from "./ScoreCard"
import { useScores } from "@/hooks/useScores"
import { Alert, AlertDescription, AlertTitle } from "@workspace/ui/components/alert"
import { Button } from "@workspace/ui/components/button"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { Separator } from "@workspace/ui/components/separator"

export function ScoresFeed() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const sort = searchParams.get("sort") === "best" ? "best" : "recent"
  const { scores, isLoading, error, hasMore, fetchNextPage } = useScores(sort)

  const updateSort = (nextSort: "recent" | "best") => {
    const params = new URLSearchParams(searchParams.toString())

    if (nextSort === "best") {
      params.set("sort", "best")
    } else {
      params.delete("sort")
    }

    const query = params.toString()
    router.push(query ? `${pathname}?${query}` : pathname)
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Alert variant="destructive" className="max-w-lg">
          <AlertTitle>Error loading scores</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      </div>
    )
  }



  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      <div>
        <h1 className="text-3xl font-bold">Scores</h1>
        <p className="text-gray-600 dark:text-gray-400">
          {sort === "best" ? "Top scores (pagination cursor)" : "Flux live des scores récents"}
        </p>
      </div>


      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          size="sm"
          variant={sort === "recent" ? "default" : "outline"}
          onClick={() => updateSort("recent")}
        >
          Récents
        </Button>
        <Button
          type="button"
          size="sm"
          variant={sort === "best" ? "default" : "outline"}
          onClick={() => updateSort("best")}
        >
          Best
        </Button>
      </div>

      <Separator />

      {scores.length === 0 && isLoading ? (
        <div className="space-y-2 py-2">
          <Skeleton className="h-[90px] w-full" />
          <Skeleton className="h-[90px] w-full" />
          <Skeleton className="h-[90px] w-full" />
        </div>
      ) : (
        <>
          <div className="space-y-2">
            {scores.map((score) => (
              <ScoreCard key={score.ID} score={score} />
            ))}
          </div>

          {sort === "best" ? (
            <div className="pt-3">
              <Button type="button" variant="outline" onClick={() => void fetchNextPage()} disabled={!hasMore || isLoading}>
                {hasMore ? "Charger les 50 suivants" : "Plus de scores"}
              </Button>
            </div>
          ) : null}
        </>
      )}
    </div>
  )
}
