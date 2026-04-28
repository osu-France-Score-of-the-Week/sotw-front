"use client"

import Link from "next/link"
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation"

import { Alert, AlertDescription, AlertTitle } from "@workspace/ui/components/alert"
import { Button } from "@workspace/ui/components/button"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@workspace/ui/components/pagination"
import { Separator } from "@workspace/ui/components/separator"
import { Skeleton } from "@workspace/ui/components/skeleton"

import { ScoreCard } from "@/components/ScoreCard"
import { DatePickerWithRange } from "@/components/DatePicker"
import { usePlayerScores } from "@/hooks/usePlayerScores"

type SortValue = "recent" | "best"

function toValidPage(value: string | null): number {
  const parsed = Number(value)
  if (!Number.isFinite(parsed) || parsed < 1) {
    return 1
  }

  return Math.floor(parsed)
}

export default function PlayerScoresPage() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const routeParams = useParams<{ playerId: string }>()
  const playerId = routeParams.playerId

  const sort: SortValue = searchParams.get("sort") === "best" ? "best" : "recent"
  const page = toValidPage(searchParams.get("page"))
  const from = searchParams.get("from") ?? undefined
  const to = searchParams.get("to") ?? undefined
  const bestFrom = sort === "best" ? from : undefined
  const bestTo = sort === "best" ? to : undefined

  const { scores, isLoading, error, totalPages } = usePlayerScores({
    playerId,
    sort,
    page,
    from: bestFrom,
    to: bestTo,
  })

  const canPrev = page > 1
  const canNext = page < totalPages

  const buildHref = (next: { sort?: SortValue; page?: number }) => {
    const paramsValue = new URLSearchParams(searchParams.toString())

    const nextSort = next.sort ?? sort
    const nextPage = next.page ?? page

    if (nextSort === "best") {
      paramsValue.set("sort", "best")
    } else {
      paramsValue.delete("sort")
      paramsValue.delete("from")
      paramsValue.delete("to")
    }

    if (nextPage > 1) {
      paramsValue.set("page", String(nextPage))
    } else {
      paramsValue.delete("page")
    }

    const query = paramsValue.toString()
    return query ? `${pathname}?${query}` : pathname
  }

  const updateQuery = (next: { sort?: SortValue; page?: number }) => {
    router.push(buildHref(next))
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 dark:bg-slate-950">
      <div className="mx-auto w-full max-w-4xl space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h1 className="text-3xl font-bold">Scores joueur</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Player #{playerId} • {sort === "best" ? "Meilleurs scores" : "Scores récents"}
            </p>
          </div>
          <Button asChild size="sm" variant="outline">
            <Link href="/players">Retour joueurs</Link>
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant={sort === "recent" ? "default" : "outline"}
            onClick={() => updateQuery({ sort: "recent", page: 1 })}
          >
            Récents
          </Button>
          <Button
            type="button"
            variant={sort === "best" ? "default" : "outline"}
            onClick={() => updateQuery({ sort: "best", page: 1 })}
          >
            Best
          </Button>

          {sort === "best" ? <DatePickerWithRange /> : null}
        </div>

        <Separator />

        {error ? (
          <Alert variant="destructive">
            <AlertTitle>Erreur de chargement</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        ) : null}

        {isLoading ? (
          <div className="space-y-2 py-2">
            <Skeleton className="h-[90px] w-full" />
            <Skeleton className="h-[90px] w-full" />
            <Skeleton className="h-[90px] w-full" />
          </div>
        ) : scores.length === 0 ? (
          <Alert>
            <AlertTitle>Aucun score</AlertTitle>
            <AlertDescription>Ce joueur n'a pas encore de score</AlertDescription>
          </Alert>
        ) : (
          <>
            <div className="space-y-2">
              {scores.map((score) => (
                <ScoreCard key={score.ID} score={score} />
              ))}
            </div>

            <Separator />

            <Pagination className="justify-between pt-1">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href={canPrev ? buildHref({ page: page - 1 }) : "#"}
                    text="Précédent"
                    className={canPrev ? undefined : "pointer-events-none opacity-50"}
                    aria-disabled={!canPrev}
                    tabIndex={canPrev ? undefined : -1}
                  />
                </PaginationItem>
              </PaginationContent>

              <p className="flex items-center text-sm text-muted-foreground">
                Page {Math.min(page, totalPages)} / {totalPages}
              </p>

              <PaginationContent>
                <PaginationItem>
                  <PaginationNext
                    href={canNext ? buildHref({ page: page + 1 }) : "#"}
                    text="Suivant"
                    className={canNext ? undefined : "pointer-events-none opacity-50"}
                    aria-disabled={!canNext}
                    tabIndex={canNext ? undefined : -1}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </>
        )}
      </div>
    </div>
  )
}
