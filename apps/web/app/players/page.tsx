"use client"

import { useMemo, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { Alert, AlertDescription, AlertTitle } from "@workspace/ui/components/alert"
import { Input } from "@workspace/ui/components/input"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@workspace/ui/components/pagination"
import { Separator } from "@workspace/ui/components/separator"
import { Skeleton } from "@workspace/ui/components/skeleton"

import { PlayerCard } from "@/components/PlayerCard"
import { usePlayers } from "@/hooks/usePlayers"

function toValidPage(value: string | null): number {
  const parsed = Number(value)
  if (!Number.isFinite(parsed) || parsed < 1) {
    return 1
  }

  return Math.floor(parsed)
}

export default function PlayersPage() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const pageParam = toValidPage(searchParams.get("page"))
  const { players, page, totalPages, isLoading, error } = usePlayers(pageParam)
  const [search, setSearch] = useState("")

  const filteredPlayers = useMemo(() => {
    const query = search.trim().toLowerCase()

    if (!query) {
      return players
    }

    return players.filter((player) => {
      return (
        player.Username.toLowerCase().includes(query) ||
        String(player.ID).includes(query)
      )
    })
  }, [players, search])

  const safePage = Math.min(page, totalPages || 1)
  const canPrev = safePage > 1
  const canNext = safePage < totalPages

  const buildHref = (nextPage: number) => {
    const params = new URLSearchParams(searchParams.toString())

    if (nextPage > 1) {
      params.set("page", String(nextPage))
    } else {
      params.delete("page")
    }

    const query = params.toString()
    return query ? `${pathname}?${query}` : pathname
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 dark:bg-slate-950">
      <div className="mx-auto w-full max-w-4xl space-y-4">
        <div>
          <h1 className="text-3xl font-bold">Joueurs</h1>
          <p className="text-gray-600 dark:text-gray-400">Liste des joueurs draft</p>
        </div>

        <Separator />

        <div className="flex items-center gap-2">
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Rechercher par pseudo ou ID"
            className="max-w-md"
          />
        </div>

        {error ? (
          <Alert variant="destructive">
            <AlertTitle>Erreur de chargement</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        ) : null}

        {isLoading ? (
          <div className="space-y-2 py-2">
            <Skeleton className="h-[74px] w-full" />
            <Skeleton className="h-[74px] w-full" />
            <Skeleton className="h-[74px] w-full" />
          </div>
        ) : filteredPlayers.length === 0 ? (
          <Alert>
            <AlertTitle>Aucun joueur trouvé</AlertTitle>
            <AlertDescription>
              {search.trim()
                ? "Aucun joueur ne correspond à la recherche."
                : "La route /players n'a renvoyé aucun joueur pour le moment."}
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-2">
            {filteredPlayers.map((player) => (
              <PlayerCard key={player.ID} player={player} />
            ))}
          </div>
        )}

        {!isLoading && filteredPlayers.length > 0 ? (
          <>
            <Separator />

            <Pagination className="justify-between pt-1">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href={canPrev ? buildHref(safePage - 1) : "#"}
                    text="Précédent"
                    onClick={(event) => {
                      if (!canPrev) {
                        event.preventDefault()
                        return
                      }

                      event.preventDefault()
                      router.push(buildHref(safePage - 1))
                    }}
                    className={canPrev ? undefined : "pointer-events-none opacity-50"}
                    aria-disabled={!canPrev}
                    tabIndex={canPrev ? undefined : -1}
                  />
                </PaginationItem>
              </PaginationContent>

              <p className="flex items-center text-sm text-muted-foreground">
                Page {safePage} / {totalPages}
              </p>

              <PaginationContent>
                <PaginationItem>
                  <PaginationNext
                    href={canNext ? buildHref(safePage + 1) : "#"}
                    text="Suivant"
                    onClick={(event) => {
                      if (!canNext) {
                        event.preventDefault()
                        return
                      }

                      event.preventDefault()
                      router.push(buildHref(safePage + 1))
                    }}
                    className={canNext ? undefined : "pointer-events-none opacity-50"}
                    aria-disabled={!canNext}
                    tabIndex={canNext ? undefined : -1}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </>
        ) : null}
      </div>
    </div>
  )
}
