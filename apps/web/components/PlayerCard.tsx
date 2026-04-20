"use client"

import Link from "next/link"

import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar"
import { Badge } from "@workspace/ui/components/badge"
import { Card, CardContent } from "@workspace/ui/components/card"

import type { Player } from "@/lib/api/types"

interface PlayerCardProps {
  player: Player
}

export function PlayerCard({ player }: PlayerCardProps) {
  const fallback = player.Username.slice(0, 2).toUpperCase()

  return (
    <Link href={`/players/${player.ID}`} className="block">
      <Card size="default" className="relative overflow-hidden py-2">
        <CardContent className="relative z-20">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <Avatar size="sm">
                <AvatarImage src={`https://a.ppy.sh/${player.ID}`} alt={player.Username} />
                <AvatarFallback>{fallback}</AvatarFallback>
              </Avatar>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold leading-tight">{player.Username}</p>
                <p className="text-[11px] text-muted-foreground leading-tight">#{player.GlobalRank} global</p>
              </div>
            </div>

            <div className="flex flex-col items-end gap-1 text-right">
              <Badge variant="secondary" className="h-5 px-2 text-[10px]">
                ID {player.ID}
              </Badge>
              <p className="text-sm font-semibold leading-tight">{player.Pp.toFixed(2)}pp</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
