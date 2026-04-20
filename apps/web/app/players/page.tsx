"use client"

import { Alert, AlertDescription, AlertTitle } from "@workspace/ui/components/alert"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { PlayerCard } from "@/components/PlayerCard"
import { usePlayers } from "@/hooks/usePlayers"

export default function PlayersPage() {
  const { players, isLoading, error } = usePlayers()

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 dark:bg-slate-950">
      <div className="mx-auto w-full max-w-4xl space-y-4">
        <div>
          <h1 className="text-3xl font-bold">Joueurs</h1>
          <p className="text-gray-600 dark:text-gray-400">Liste des joueurs draft</p>
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
        ) : players.length === 0 ? (
          <Alert>
            <AlertTitle>Aucun joueur trouvé</AlertTitle>
            <AlertDescription>La route /players n'a renvoyé aucun joueur pour le moment.</AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-2">
            {players.map((player) => (
              <PlayerCard key={player.ID} player={player} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
