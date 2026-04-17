"use client"

import type { Score } from "@/lib/api/types"
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar"
import { Badge } from "@workspace/ui/components/badge"
import { Card, CardContent } from "@workspace/ui/components/card"
import { useRelativeTime } from "@/hooks/useRelativeTime"

interface ScoreCardProps {
  score: Score
}

const rankBadgeVariant: Record<string, string> = {
  SSH: "bg-slate-300 text-black",
  SH: "bg-slate-300 text-black",
  SS: "bg-yellow-400 text-black",
  S: "bg-yellow-400 text-black",
  A: "bg-green-500 text-white",
  B: "bg-blue-500 text-white",
  C: "bg-purple-500 text-white",
  D: "bg-red-500 text-white",
}

const mapStatusBadgeClass: Record<string, string> = {
  ranked: "bg-blue-500 text-white",
  approved: "bg-blue-500 text-white",
  qualified: "bg-green-500 text-white",
  loved: "bg-pink-500 text-white",
  graveyard: "bg-slate-500 text-white",
  wip: "bg-slate-500 text-white",
  pending: "bg-slate-500 text-white",
}

export function ScoreCard({ score }: ScoreCardProps) {
  const relativeTime = useRelativeTime(score.EndedAt)
  const fallback = score.Player.Username.slice(0, 2).toUpperCase()
  const beatmapCoverUrl = `https://assets.ppy.sh/beatmaps/${score.Beatmap.BeatmapsetID}/covers/card@2x.jpg`
  const mapStatus = (score.Beatmap.Beatmapset.Status || "pending").toLowerCase()
  const mapStatusClass = mapStatusBadgeClass[mapStatus] || "bg-slate-500 text-white"
  const mapStatusLabel = mapStatus.charAt(0).toUpperCase() + mapStatus.slice(1)
  const attrSr = score.Attributes.StarRating.toFixed(2);
  const diffSr = score.Beatmap.DifficultyRating.toFixed(2);

  const starRating = attrSr !== diffSr
    ? `${attrSr}★ (${diffSr}★)`
    : `${diffSr}★`;

  return (
    <Card size="default" className="relative overflow-hidden py-2">
      <div className="absolute left-0 top-0 bottom-0 w-48 overflow-hidden">
        <Badge className={`absolute left-2 top-2 z-20 h-5 px-2 text-[10px] font-semibold ${mapStatusClass}`}>
          {mapStatusLabel.toUpperCase()}
        </Badge>
        <img
          src={beatmapCoverUrl}
          alt={score.Beatmap.Beatmapset.Title}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-transparent via-card/40 to-card" />
      </div>

      <CardContent className="relative z-20">
        <div className="flex items-start justify-between gap-3 pl-50">
          <div className="min-w-0 flex-1 space-y-1">
            <p className="truncate text-sm font-medium leading-tight">
              {score.Beatmap.Beatmapset.Title}
              <span className="ml-2 text-[11px] font-normal text-muted-foreground">
                {score.Beatmap.Beatmapset.Artist}
              </span>
            </p>
            <p className="text-[11px] text-muted-foreground leading-tight">
              {score.Beatmap.Version} • {starRating}
            </p>

            <div className="flex items-center gap-1.5 pt-0.5">
              <Avatar size="sm">
                <AvatarImage src={`https://a.ppy.sh/${score.PlayerID}`} alt={score.Player.Username} />
                <AvatarFallback>{fallback}</AvatarFallback>
              </Avatar>
              <div className="text-left">
                <p className="text-xs font-medium leading-tight">{score.Player.Username}</p>
                <p className="text-[11px] text-muted-foreground leading-tight">#{score.Player.GlobalRank}</p>
              </div>
            </div>
          </div>

          <div className="flex self-center flex-col items-end text-right">
            <div className="flex flex-wrap items-center gap-1">
              <Badge className={`h-4 px-1.5 text-[10px] ${rankBadgeVariant[score.Rank] || "bg-muted text-foreground"}`}>
                {score.Rank}
              </Badge>
              {score.Mods.length > 0 ? (
                score.Mods.map((mod) => (
                  <Badge key={mod.acronym} variant="secondary" className="h-4 px-1.5 text-[10px]">
                    {mod.acronym}
                  </Badge>
                ))
              ) : (
                <Badge variant="secondary" className="h-4 px-1.5 text-[10px]">
                  NM
                </Badge>
              )}
            </div>
            <p className="text-sm font-semibold leading-tight pt-1">{score.Pp.toFixed(2)}pp</p>
            <div className="mt-0.5 flex items-center justify-end gap-1.5 text-[11px] leading-tight">
              <span className="font-semibold text-muted-foreground">{score.MaxCombo}x • {(score.Accuracy * 100).toFixed(2)}%</span>
              <span className="font-semibold text-muted-foreground"> • </span>
              <span className="text-[9px] font-medium text-blue-400">{score.Statistics.great}</span>
              {score.Statistics.ok !== undefined && (
                <>
                  <span className="font-semibold text-muted-foreground"> • </span>
                  <span className="text-[9px] font-medium text-green-400">{score.Statistics.ok}</span>
                </>
              )}
              {score.Statistics.meh !== undefined && (
                <>
                  <span className="font-semibold text-muted-foreground"> • </span>
                  <span className="text-[9px] font-medium text-yellow-400">{score.Statistics.meh}</span>
                </>
              )}
              {score.Statistics.miss > 0 && (
                <>
                  <span className="font-semibold text-muted-foreground"> • </span>
                  <span className="text-[11px] font-medium text-red-400">{score.Statistics.miss}</span>
                </>
              )}
            </div>
            <p className="text-sm text-[9px] font-semibold text-muted-foreground">{relativeTime}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
