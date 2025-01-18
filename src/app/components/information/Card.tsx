import * as React from "react";

import { cn } from "@/app/utils/cn";
import Extrusion, { CornerLocation } from "../cosmetic/Extrusion";
import getSoloRankFromNumber from "@/app/utils/types/rank";
import { RankImage } from "../cosmetic/RankImageFromRank";

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded border-secondary border bg-primary text-primary-foreground py-4 px-6 overflow-hidden",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

interface PlayerStats {
  rank_rating?: number;
  current_solo_rank?: number;
  highest_team_rank?: number;
  rank_rating_last_updated?: string | null;
}

interface CurrentRankCardProps extends React.HTMLAttributes<HTMLDivElement> {
  stats: PlayerStats;
}

const CurrentRankCard = React.forwardRef<HTMLDivElement, CurrentRankCardProps>(
  ({ className, stats, ...props }, ref) => (
    <div className="">
      <Extrusion
        className={cn("min-w-36 border-secondary rounded-tl")}
        cornerLocation={CornerLocation.TopRight}
      />
      <Card className="rounded-tl-none p-0">
        <div className="px-6 py-4">
          <h2>Current Rank</h2>
          <div className="flex gap-x-4 mt-2.5">
            <RankImage
              className="size-14 min-w-14 min-h-14"
              rank={getSoloRankFromNumber(stats.current_solo_rank!)}
            />
            <div className="flex-col flex justify-center ">
              <h3
                className={`font-medium ${
                  stats.current_solo_rank == 29
                    ? "bg-gradient-to-r from-amber-200 to-yellow-500 inline-block bg-clip-text text-transparent"
                    : ""
                }`}
              >
                {getSoloRankFromNumber(stats.current_solo_rank!)}
              </h3>
              <p>{stats.rank_rating} RR</p>
            </div>
          </div>
        </div>
        <div className="w-full py-4 px-6 bg-input">
          <h3>Peak Rank</h3>
          <div className="flex gap-x-4 mt-2.5">
            <RankImage
              className="size-14 min-w-14 min-h-14"
              rank={getSoloRankFromNumber(stats.current_solo_rank!)}
            />
            <div className="flex-col flex justify-center ">
              <h3
                className={`font-medium ${
                  stats.current_solo_rank == 29 ? "" : ""
                }`}
              >
                {getSoloRankFromNumber(stats.current_solo_rank!)}
              </h3>
              <p>Season 0 ~ Hard Coded, CHANGE!!</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
);
CurrentRankCard.displayName = "CurrentRankCard";

import { SponsorImage } from "../cosmetic/SponsorImageFromString";

interface SponsorStats {
  sponsor_name: string;
  total_kills: number;
  total_assists: number;
  total_deaths: number;
  total_damage_dealt: number;
  total_wins: number;
  total_losses: number;
  average_damage_per_round: number;
  average_win_percentage: number;
}

interface SponsorsCardProps extends React.HTMLAttributes<HTMLDivElement> {
  sponsorStats: Record<string, SponsorStats>;
}

const SponsorsCard = React.forwardRef<HTMLDivElement, SponsorsCardProps>(
  ({ className, sponsorStats, ...props }, ref) => (
    <div>
      <Card className="rounded-bl-none">
        <h2>Sponsors</h2>
        {Object.entries(sponsorStats).map(([key, sponsor]) => (
          <div className="flex gap-x-4 py-2.5" key={key}>
            <SponsorImage sponsor={sponsor.sponsor_name} />
            <div className="flex h-10">
              <div className="flex-col h-full justify-center items-center">
                <p className="leading-none text-accent">
                  {sponsor.sponsor_name}
                </p>
                <h3 className="">
                  WR {sponsor.average_win_percentage.toFixed(1)}%
                </h3>
              </div>
            </div>
            <div className="flex h-10 ml-auto">
              <div className="flex-col h-full justify-center items-center text-right">
                <p className="leading-none">
                  {(sponsor.total_kills / sponsor.total_deaths).toFixed(2)} KD
                </p>
                <p className="">
                  {sponsor.total_wins}W - {sponsor.total_losses}L
                </p>
              </div>
            </div>
          </div>
        ))}
      </Card>
      <Extrusion
        className={cn("min-w-36 border-secondary rounded-bl")}
        cornerLocation={CornerLocation.BottomRight}
      />
    </div>
  )
);
SponsorsCard.displayName = "SponsorsCard";

import type { MapStats } from "@/app/utils/types/wavescan.types";
import Image from "next/image";

function getMapName(
  map: string
): "Commons" | "Metro" | "Mill" | "Skyway" | "Unknown" {
  switch (map.toLowerCase()) {
    case "commons_p":
      return "Commons";
    case "metro_p":
      return "Metro";
    case "greenbelt_p":
      return "Mill";
    case "junction_p":
      return "Skyway";
    default:
      return "Unknown";
  }
}

interface MapsCardProps extends React.HTMLAttributes<HTMLDivElement> {
  mapStats: Record<string, MapStats>;
}

const MapsCard = React.forwardRef<HTMLDivElement, MapsCardProps>(
  ({ className, mapStats, ...props }, ref) => (
    <div>
      <Extrusion
        className={cn("min-w-36 border-secondary rounded-tr ml-auto")}
        cornerLocation={CornerLocation.TopLeft}
      />
      <Card className="rounded-bl-none">
        <h2>Maps</h2>
        {Object.entries(mapStats).map(([key, map]) => (
          <div className="flex gap-x-4 py-2.5" key={key}>
            <Image
              src={require(`../../../app/assets/images/map-previews/${getMapName(
                map.map
              )}_800x800.webp`)}
              alt={`Image of ${getMapName(map.map)}`}
              className="w-12 h-12 rounded-md"
            />
            <div className="flex h-12">
              <div className="flex-col flex h-full justify-center items-start">
                <p className="leading-none text-accent">
                  {getMapName(map.map)}
                </p>
                <h3 className="">
                  WR {map.average_win_percentage.toFixed(0)}%
                </h3>
              </div>
            </div>
            <div className="flex h-12 ml-auto">
              <div className="flex-col flex h-full justify-center items-end text-right">
                <p className="leading-none">
                  {(map.total_kills / map.total_deaths).toFixed(2)} KD
                </p>
                <p className="">
                  {map.total_wins}W - {map.total_losses}L
                </p>
              </div>
            </div>
          </div>
        ))}
      </Card>
    </div>
  )
);
MapsCard.displayName = "MapsCard";

import type { SeasonStats } from "@/app/utils/types/wavescan.types";
import { SeasonSelector } from "../input/SeasonSelector";

interface OverviewCardProps extends React.HTMLAttributes<HTMLDivElement> {
  stats: PlayerStats;
  seasonStats: SeasonStats;
}

const OverviewCard = React.forwardRef<HTMLDivElement, OverviewCardProps>(
  ({ className, stats, seasonStats, ...props }, ref) => {
    const seasonStatsSelected = seasonStats["2024-S0"];
    return (
      <div className="">
        <Extrusion
          className={cn("min-w-36 ml-auto border-secondary rounded-tr")}
          cornerLocation={CornerLocation.TopLeft}
        />
        <Card className="rounded-tr-none p-0">
          <div className="px-6 py-6">
            <div className="flex justify-between items-center">
              <h2>Season 0 Overview</h2>
              <SeasonSelector defaultValue="season0" />
            </div>
            <div className="flex py-4 gap-x-4">
              <RankImage
                className="size-16"
                rank={getSoloRankFromNumber(seasonStatsSelected.top_rank_id)}
              />
              <div className="flex flex-col justify-center">
                <p className="text-lg">
                  {getSoloRankFromNumber(seasonStatsSelected.top_rank_id)}
                </p>
                <p className="font-semibold text-xl">{stats.rank_rating} RR</p>
              </div>
              <div className="pl-4 flex flex-col justify-center">
                <p className="leading-[1.8rem]">
                  {seasonStatsSelected.total_wins}W -{" "}
                  {seasonStatsSelected.total_losses}L
                </p>
                <p className="text-lg font-medium">
                  {seasonStatsSelected.average_win_percentage.toFixed(2)}%
                </p>
              </div>
            </div>
            <div className="grid grid-cols-5 gap-4 pt-2">
              <div className="flex flex-col">
                <p className="text-sm">ADR</p>
                <p className="text-lg font-semibold">
                  {seasonStatsSelected.average_damage_per_round.toFixed(2)}
                </p>
              </div>
              <div className="flex flex-col">
                <p className="text-sm">Wins</p>
                <p className="text-lg font-semibold">
                  {seasonStatsSelected.total_wins}
                </p>
              </div>
              <div className="flex flex-col">
                <p className="text-sm">Kills</p>
                <p className="text-lg font-semibold">
                  {seasonStatsSelected.total_kills}
                </p>
              </div>
              <div className="flex flex-col">
                <p className="text-sm">Deaths</p>
                <p className="text-lg font-semibold">
                  {seasonStatsSelected.total_deaths}
                </p>
              </div>
              <div className="flex flex-col">
                <p className="text-sm">Assists</p>
                <p className="text-lg font-semibold">
                  {seasonStatsSelected.total_assists}
                </p>
              </div>
              <div className="flex flex-col">
                <p className="text-sm">Damage/Round</p>
                <p className="text-lg font-semibold">
                  {seasonStatsSelected.average_damage_per_round.toFixed(1)}
                </p>
              </div>
              <div className="flex flex-col">
                <p className="text-sm">K/D</p>
                <p className="text-lg font-semibold">
                  {(
                    seasonStatsSelected.total_kills /
                    seasonStatsSelected.total_deaths
                  ).toFixed(2)}
                </p>
              </div>
              <div className="flex flex-col">
                <p className="text-sm">Kill/Round</p>
                <p className="text-lg font-semibold">
                  {seasonStatsSelected.average_kills_per_round.toFixed(2)}
                </p>
              </div>
              <div className="flex flex-col">
                <p className="text-sm">Top DMG</p>
                <p className="text-lg font-semibold">
                  {seasonStatsSelected.top_damage_dealt}
                </p>
              </div>
              <div className="flex flex-col">
                <p className="text-sm">Top Kills</p>
                <p className="text-lg font-semibold">
                  {seasonStatsSelected.top_kills}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }
);
OverviewCard.displayName = "OverviewCard";

import { PlayerExtendedStats } from "@/app/utils/types/wavescan.types";
interface Last20CardProps extends React.HTMLAttributes<HTMLDivElement> {
  stats: PlayerExtendedStats;
}

const Last20Card = React.forwardRef<HTMLDivElement, Last20CardProps>(
  ({ className, stats, ...props }, ref) => {
    return (
      <div>
        <Card className="rounded-bl-none">
          <div className="grid-cols-4 grid pb-2">
            <div className="flex flex-col">
              <p className="text-accent">Last 20 Matches</p>
              <p className="text-lg">
                {stats.total_wins}W - {stats.total_losses}L
              </p>
            </div>
            <div className="flex flex-col">
              <p className="text-accent">Winrate</p>
              <p className="text-lg">
                {" "}
                {stats.average_win_percentage.toFixed(2)}%
              </p>
            </div>
            <div className="flex flex-col">
              <p className="text-accent">K/D</p>
              <p className="text-lg">
                {(stats.total_kills / stats.total_deaths).toFixed(2)}
              </p>
            </div>
            <div className="flex flex-col">
              <p className="text-accent">ADR</p>
              <p className="text-lg">
                {stats.average_damage_per_round.toFixed(2)}
              </p>
            </div>
          </div>
          <div className="relative w-full h-1 rounded overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-red-500"></div>
            <div
              style={{ width: `${stats.average_win_percentage.toFixed(0)}%` }}
              className="absolute top-0 left-0 h-full bg-green-500"
            ></div>
          </div>
        </Card>
        <Extrusion
          className={cn("min-w-36 border-secondary rounded-bl")}
          cornerLocation={CornerLocation.BottomRight}
        />
      </div>
    );
  }
);
Last20Card.displayName = "Last20Card";

const getDate = (date: string | Date) => {
  const matchDate = new Date(date);
  const now = new Date();
  const diffTime = now.getTime() - matchDate.getTime();
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffTime / (1000 * 60));
  if (diffMinutes <= 60) {
    const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
    return rtf.format(-diffMinutes, "minute");
  }
  if (diffHours <= 24) {
    const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
    return rtf.format(-diffHours, "hour");
  }
  return matchDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

function getMatchQueueName(queueName: string, used_team_rank: boolean) {
  const lowerCaseQueueName = queueName.toLowerCase();
  switch (lowerCaseQueueName) {
    case "standard_ranked":
      if (used_team_rank) {
        return "Team Ranked";
      }
      return "Solo Ranked";
    case "standard_casual":
      return "Casual";
    default:
      return queueName;
  }
}

function getMatchOutcome(winner: number, player_team_index: number) {
  if (winner === -1) {
    return "Draw";
  } else if (winner === player_team_index) {
    return "Victory";
  } else {
    return "Defeat";
  }
}
import { PlayerMatch } from "@/app/utils/types/wavescan.types";
interface MatchCardProps extends React.HTMLAttributes<HTMLDivElement> {
  matches: PlayerMatch;
  playerId: string;
}

const MatchCard = React.forwardRef<HTMLDivElement, MatchCardProps>(
  ({ className, matches, playerId, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-y-2">
        <Card className="hidden">
          <h2>Matches</h2>
        </Card>
        {Object.entries(matches).map(([key, match]) => (
          <div className="flex h-28 w-full gap-x-1">
            <div
              className={`h-full w-2 ${
                match.winner == match.player_team.team_index
                  ? "bg-green-700"
                  : match.winner == match.opponent_team.team_index
                  ? "bg-red-700"
                  : "bg-neutral-600"
              }`}
            ></div>
            <Card
              className={`flex pl-3 rounded-l-none w-full bg-gradient-to-r  ${
                match.winner == match.player_team.team_index
                  ? "from-green-700/10"
                  : match.winner == match.opponent_team.team_index
                  ? "from-red-700/10"
                  : "from-neutral-700/10"
              }`}
            >
              <div className="">
                <SponsorImage
                  className="w-12 h-auto"
                  sponsor={
                    match?.player_team?.players?.find(
                      (player: any) => player.id === playerId
                    )?.sponsor_name
                  }
                />
              </div>
              <div className="flex-col flex w-full">
                <div className="flex h-5 items-center gap-1 pl-4 mt-1">
                  <p
                    className={`font-semibold ${
                      getMatchOutcome(
                        match.winner,
                        match.player_team?.team_index
                      ) === "Victory"
                        ? "text-green-500"
                        : getMatchOutcome(
                            match.winner,
                            match.player_team?.team_index
                          ) === "Defeat"
                        ? "text-red-500"
                        : "text-primary-foreground"
                    }`}
                  >
                    {getMatchOutcome(
                      match.winner,
                      match.player_team?.team_index
                    )}
                  </p>
                  <span className="text-xs opacity-50 my-auto">•</span>
                  <p
                    className={`text-sm font-medium ${
                      match?.player_team?.players?.find(
                        (player: any) => player.id === playerId
                      )?.ranked_rating_delta > 0
                        ? "text-green-500"
                        : match?.player_team?.players?.find(
                            (player: any) => player.id === playerId
                          )?.ranked_rating_delta < 0
                        ? "text-red-500"
                        : "text-primary-foreground"
                    }`}
                  >
                    {match?.player_team?.players?.find(
                      (player: any) => player.id === playerId
                    )?.ranked_rating_delta
                      ? match?.player_team?.players?.find(
                          (player: any) => player.id === playerId
                        )?.ranked_rating_delta > 0
                        ? `+${
                            match?.player_team?.players?.find(
                              (player: any) => player.id === playerId
                            )?.ranked_rating_delta
                          }`
                        : `${
                            match?.player_team?.players?.find(
                              (player: any) => player.id === playerId
                            )?.ranked_rating_delta
                          }`
                      : `${
                          match?.player_team?.players?.find(
                            (player: any) => player.id === playerId
                          )?.ranked_rating_delta
                        }`}
                  </p>
                  <span className="text-xs opacity-50 my-auto">•</span>
                  <p className="text-sm font-medium">
                    {getMatchQueueName(
                      match.queue_name,
                      match.player_team.used_team_rank
                    )}
                  </p>
                  <span className="text-xs opacity-50 my-auto">•</span>
                  <p className="text-sm">{getDate(match.match_date)}</p>
                </div>
                <div className="w-full h-full grid grid-cols-4 pl-4 pt-2">
                  <div className="h-full w-full flex flex-col items-start justify-between">
                    <p className="font-semibold">
                      {match.player_team.rounds_won} -{" "}
                      {match.opponent_team.rounds_won}
                    </p>
                    <p className="text-sm opacity-80">
                      {getMapName(match.map)}
                    </p>
                  </div>
                  <div className="h-full w-full flex flex-col items-start justify-between">
                    <p className="font-semibold">
                      {
                        match.player_team.players.find(
                          (player: any) => player.id === playerId
                        ).kills
                      }{" "}
                      /{" "}
                      {
                        match.player_team.players.find(
                          (player: any) => player.id === playerId
                        ).deaths
                      }{" "}
                      /{" "}
                      {
                        match.player_team.players.find(
                          (player: any) => player.id === playerId
                        ).assists
                      }
                    </p>
                    <p className="text-sm opacity-80">KDA</p>
                  </div>
                  <div className="h-full w-full flex flex-col items-start justify-between">
                    <p className="font-semibold">
                      {(
                        match.player_team.players.find(
                          (player: any) => player.id === playerId
                        ).kills / match.rounds
                      ).toFixed(2)}
                    </p>
                    <p className="text-sm opacity-80">KPR</p>
                  </div>
                  <div className=" h-full w-full flex flex-col items-start justify-between">
                    <p className="font-semibold">
                      {(
                        match.player_team.players.find(
                          (player: any) => player.id === playerId
                        ).damage_dealt / match.rounds
                      ).toFixed(2)}
                    </p>
                    <p className="text-sm opacity-80">ADR</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>
    );
  }
);
MatchCard.displayName = "MatchCard";

export {
  Card,
  CurrentRankCard,
  SponsorsCard,
  MapsCard,
  OverviewCard,
  Last20Card,
  MatchCard,
};
