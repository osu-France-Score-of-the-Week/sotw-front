"use client"

import { ScoreCard } from "./ScoreCard"
import { useScores } from "@/hooks/useScores"
import { Alert, AlertDescription, AlertTitle } from "@workspace/ui/components/alert"
import { Skeleton } from "@workspace/ui/components/skeleton"

export function ScoresFeed() {
  const { scores, isLoading, error } = useScores()

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
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Scores temps réels</h1>
        <p className="text-gray-600 dark:text-gray-400">texte jsp</p>
      </div>

      {scores.length === 0 && isLoading ? (
        <div className="space-y-2 py-2">
          <Skeleton className="h-[90px] w-full rounded-lg" />
          <Skeleton className="h-[90px] w-full rounded-lg" />
          <Skeleton className="h-[90px] w-full rounded-lg" />
        </div>
      ) : (
        <>
          <div className="space-y-2">
            {scores.map((score) => (
              <ScoreCard key={score.ID} score={score} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
