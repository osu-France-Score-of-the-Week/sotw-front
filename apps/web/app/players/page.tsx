"use client"

import { useMemo, useState } from "react"

import { Alert, AlertDescription, AlertTitle } from "@workspace/ui/components/alert"
import { Input } from "@workspace/ui/components/input"
import { Separator } from "@workspace/ui/components/separator"
import { Skeleton } from "@workspace/ui/components/skeleton"

import { PlayerCard } from "@/components/PlayerCard"
import { usePlayers } from "@/hooks/usePlayers"

export default function PlayersPage() {
  const { players, isLoading, error } = usePlayers()
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
            <Skeleton className="h-[74px] w-full rounded-lg" />
            <Skeleton className="h-[74px] w-full rounded-lg" />
            <Skeleton className="h-[74px] w-full rounded-lg" />
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
      </div>
    </div>
  )
}
