/**
 * Type definitions for osu! Scores API
 */

export interface Mods {
  acronym: string
  settings: unknown
}

export interface Statistics {
  great: number
  ok?: number
  meh?: number
  miss: number
}

export interface Player {
  ID: number
  Username: string
  GlobalRank: number
  Pp: number
  scoreCount: number
}

export interface Beatmapset {
  ID: number
  Artist: string
  Creator: string
  Title: string
  Status: string
}

export interface Beatmap {
  ID: number
  BeatmapsetID: number
  Beatmapset: Beatmapset
  DifficultyRating: number
  Version: string
}

export interface Score {
  ID: number
  Accuracy: number
  BeatmapID: number
  Beatmap: Beatmap
  EndedAt: number
  HasReplay: boolean
  MaxCombo: number
  Mods: Mods[]
  Pp: number
  Rank: string
  Statistics: Statistics
  PlayerID: number
  Player: Player
  Attributes: BeatmapAttributes
}

export interface ScoresResponse {
  scores: Score[]
  cursor?: string
}

export interface ScorePageResponse {
  scores: Score[]
  page: number
  totalPages: number
}

export interface PlayersResponse {
  players: Player[]
}

export interface PlayerPageResponse {
  players: Player[]
  page: number
  totalPages: number
}

export interface BeatmapAttributes {
  StarRating: number
  MaxCombo: number
}
