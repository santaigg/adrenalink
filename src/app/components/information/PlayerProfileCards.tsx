import * as React from "react";

import { cn } from "@/app/utils/cn";
import { useState, useEffect } from "react";
import Extrusion, { CornerLocation } from "../cosmetic/Extrusion";
import getSoloRankFromNumber from "@/app/utils/types/rank";
import { RankImage } from "../cosmetic/RankImageFromRank";
import { Card } from "./Card";
import { SeasonStats } from "@/app/utils/types/wavescan.types";

const getPeakStats = (seasons: Record<string, SeasonStats>) => {
  const [peakRankRating, setPeakRankRating] = useState<number>(0);
  const [peakRankID, setPeakRankID] = useState<string>("");
  const [peakSeason, setPeakSeason] = useState<string>("");
  const [firstPass, setFirstPass] = useState<boolean>(true);

  for (var key in seasons) {
    const season = seasons[key];
    if (peakRankRating === 0 && firstPass) {
      // Updates values if top_rank_rating is 0, to prevent 'Unkown Season' from displaying on the peak rank card 
      setPeakRankRating(season.top_rank_rating);
      setPeakRankID(season.top_rank_id);
      setPeakSeason(season.season);
      setFirstPass(false);
    } else if (season.top_rank_rating > peakRankRating) {
      setPeakRankRating(season.top_rank_rating);
      setPeakRankID(season.top_rank_id);
      setPeakSeason(season.season);
    }
  }

  return [peakRankID, peakRankRating, peakSeason];
};

interface PlayerStats {
  rank_rating?: number;
  current_solo_rank?: number;
  highest_team_rank?: number;
  rank_rating_last_updated?: string | null;
}

interface CurrentRankCardProps extends React.HTMLAttributes<HTMLDivElement> {
  stats: PlayerStats;
  seasonStats: Record<string, SeasonStats>;
}

const CurrentRankCard = React.forwardRef<HTMLDivElement, CurrentRankCardProps>(
  ({ stats, seasonStats }, ref) => {
    const [peakRankID, peakRankRating, peakSeason] = getPeakStats(seasonStats);

    const formatSeasonTitle = (season: string) => {
      switch (season) {
        case "Beta": {
          return "Beta";
        }
        case "2024-S0": {
          return "Season 0";
        }
        case "2025-S1": {
          return "Season 1";
        }
        default: {
          return "Unknown Season";
        }
      }
    };

    return (
      <div ref={ref} className="">
        <Extrusion
          className={cn("min-w-36 border-secondary rounded-tl-primary")}
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
                rank={getSoloRankFromNumber(Number(peakRankID))}
              />
              <div className="flex-col flex justify-center ">
                <h3>{getSoloRankFromNumber(Number(peakRankID))}</h3>
                <p>
                  {peakRankRating} RR
                  <span className="text-xs opacity-50 my-auto mx-1">•</span>
                  {formatSeasonTitle(String(peakSeason))}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }
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
  ({ sponsorStats }, ref) => (
    <div ref={ref}>
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
        className={cn("min-w-36 border-secondary rounded-bl-primary")}
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
  ({ mapStats }, ref) => {
    const [mapImages, setMapImages] = useState<Record<string, string>>({});

    useEffect(() => {
      const loadImages = async () => {
        const images: Record<string, string> = {};
        for (const key in mapStats) {
          const mapName = getMapName(mapStats[key].map);
          const image = await import(
            `../../../app/assets/images/map-previews/${mapName}_800x800.webp`
          );
          images[mapName] = image.default;
        }
        setMapImages(images);
      };
      loadImages();
    }, [mapStats]);

    return (
      <div ref={ref}>
        <Extrusion
          className={cn("min-w-36 border-secondary rounded-tr-primary ml-auto")}
          cornerLocation={CornerLocation.TopLeft}
        />
        <Card className="rounded-bl-none">
          <h2>Maps</h2>
          {Object.entries(mapStats).map(([key, map]) => {
            const mapName = getMapName(map.map);
            const mapImage = mapImages[mapName];
            return (
              <div className="flex gap-x-4 py-2.5" key={key}>
                {mapImage && (
                  <Image
                    src={mapImage}
                    alt={`Image of ${mapName}`}
                    className="w-12 h-12 rounded-md"
                  />
                )}

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
            );
          })}
        </Card>
      </div>
    );
  }
);
MapsCard.displayName = "MapsCard";

import { cva, type VariantProps } from "class-variance-authority";

const overviewItemVariants = cva(
  "pl-4 flex flex-col justify-center items-start",
  {
    variants: {
      variant: {
        default: "",
        primary: "rounded-md bg-secondary",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const OverviewItem = React.forwardRef<HTMLDivElement, OverviewItemProps>(
  ({ variant = "default", title, value }, ref) => {
    return (
      <div ref={ref} className={overviewItemVariants({ variant })}>
        <p className="text-sm">{title}</p>
        <p className="text-lg font-semibold">{value}</p>
      </div>
    );
  }
);

interface OverviewItemProps {
  variant?: "default" | "primary";
  title: string;
  value: number;
}

import { SeasonSelector } from "../input/SeasonSelector";

interface OverviewCardProps extends React.HTMLAttributes<HTMLDivElement> {
  stats: PlayerStats;
  seasonStats: Record<string, SeasonStats>;
}

const OverviewCard = React.forwardRef<HTMLDivElement, OverviewCardProps>(
  ({ stats, seasonStats }, ref) => {
    const DEFAULT_SEASON_VALUE = "season0";
    const [season, setSeason] = useState<string>(DEFAULT_SEASON_VALUE);

    const formatSeasonTitle = (season: string | null): string => {
      if (!season) return "";
      const formattedSeason = season.replace(
        /^([a-z])([a-z]*)(\d+)/,
        (_, firstLetter, rest, number) =>
          `${firstLetter.toUpperCase()}${rest} ${number}`
      );
      return (
        String(formattedSeason).charAt(0).toUpperCase() +
        String(formattedSeason).slice(1)
      );
    };

    const formatSeasonKey = (season: string) => {
      switch (season) {
        case "beta": {
          return "Beta";
        }
        case "season0": {
          return "2024-S0";
        }
        case "season1": {
          return "2025-S1";
        }
        default: {
          return "2024-S0";
        }
      }
    };

    const seasonStatsSelected = seasonStats[formatSeasonKey(season)];

    return (
      <div className="" ref={ref}>
        <Extrusion
          className={cn("min-w-36 ml-auto border-secondary rounded-tr-primary")}
          cornerLocation={CornerLocation.TopLeft}
        />
        <Card className="rounded-tr-none p-0">
          <div className="px-6 py-6">
            <div className="flex justify-between items-center">
              <h2>{formatSeasonTitle(season)} Overview</h2>
              <SeasonSelector
                defaultValue={DEFAULT_SEASON_VALUE}
                showBeta={true}
                setSeason={setSeason}
              />
            </div>
            <div className="flex py-4 gap-x-4">
              <RankImage
                className="size-16"
                rank={getSoloRankFromNumber(
                  Number(seasonStatsSelected.top_rank_id)
                )}
              />
              <div className="flex flex-col justify-center">
                <p className="text-lg">
                  {getSoloRankFromNumber(
                    Number(seasonStatsSelected.top_rank_id)
                  )}
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
  ({ stats }, ref) => {
    return (
      <div ref={ref}>
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
          <div className="relative w-full h-1 rounded-primary overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-red-500"></div>
            <div
              style={{ width: `${stats.average_win_percentage.toFixed(0)}%` }}
              className="absolute top-0 left-0 h-full bg-green-500"
            ></div>
          </div>
        </Card>
        <Extrusion
          className={cn("min-w-36 border-secondary rounded-bl-primary")}
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
import { ChevronDown } from "lucide-react";

interface MatchCardProps extends React.HTMLAttributes<HTMLDivElement> {
  matches: PlayerMatch;
  playerId: string;
}

const MatchCard = React.forwardRef<HTMLDivElement, MatchCardProps>(
  ({ matches, playerId }, ref) => {
    const [limit, setLimit] = useState(20);
    const matchEntries = Object.entries(matches).slice(0, limit);

    const loadMoreMatches = () => {
      setLimit((prevLimit) =>
        Math.min(prevLimit + 20, Object.entries(matches).length)
      );
    };

    const [openStates, setOpenStates] = useState<Record<string, boolean>>({});

    const toggleOpen = (key: string) => {
      setOpenStates((prev) => ({
        ...prev,
        [key]: !prev[key],
      }));
    };
    
    return (
      <div ref={ref} className="flex flex-col gap-y-2">
        {matchEntries.map(([key, match]) => (
          <div key={key} className="">
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
                className={`flex pl-3 pr-0 rounded-l-none w-full bg-gradient-to-r  ${
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
                <div
                  className="w-10 h-full border-l border-l-secondary flex items-end justify-center cursor-pointer"
                  onClick={() => toggleOpen(key)}
                >
                  <ChevronDown
                    className={`w-5 h-5 stroke-primary-foreground transition-all ${
                      openStates[key] ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </Card>
            </div>
            <MatchDetailsCard
              open={openStates[key] || false}
              match={match}
              playerId={playerId}
            />
          </div>
        ))}
        {limit < Object.entries(matches).length && (
          <div
            onClick={loadMoreMatches}
            className="py-2 w-full flex justify-center items-center cursor-pointer rounded-primary hover:bg-muted/25"
          >
            Load More
          </div>
        )}
      </div>
    );
  }
);
MatchCard.displayName = "MatchCard";

export {
  CurrentRankCard,
  SponsorsCard,
  MapsCard,
  OverviewCard,
  Last20Card,
  MatchCard,
};

import Constrict from "../layout/Constrict";
import { MatchDetailsCard } from "./MatchDetailsCard";

const SkeletonLoader = React.forwardRef<HTMLDivElement>(({}, ref) => {
  return (
    <>
      <div className="w-full -mt-4 h-48 relative">
        <div className="size-full absolute top-0 -z-50 bg-input" />
        <Constrict className="h-full flex">
          <div className="bg-secondary flex justify-center items-center absolute bottom-0 translate-y-1/2 corner-clip animate-pulse">
            <div className="w-32 h-32 bg-neutral-600"></div>
          </div>
        </Constrict>
      </div>
      <Constrict className="flex flex-col text-primary-foreground">
        <div className="ml-36">
          <h1 className="font-medium">Loading profile, please wait...</h1>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-4 mt-8 gap-6">
          <div className="gap-y-4 flex-col flex">
            {/* Current Rank */}
            <div className="">
              <Extrusion
                className={cn("min-w-36 border-secondary rounded-tl-primary")}
                cornerLocation={CornerLocation.TopRight}
              />
              <Card className="rounded-tl-none p-0">
                <div className="px-6 py-4">
                  <h2 className="w-32 h-6 bg-neutral-600 animate-pulse rounded"></h2>
                  <div className="flex gap-x-4 mt-2.5">
                    <div className="w-14 h-14 bg-neutral-600 rounded-md"></div>
                    <div className="flex-col flex justify-center ">
                      <h2 className="w-32 h-6 bg-neutral-600 animate-pulse rounded"></h2>
                      <div className="w-16 h-6 bg-neutral-600 animate-pulse rounded mt-2"></div>
                    </div>
                  </div>
                </div>
                <div className="w-full py-4 px-6 bg-input">
                  <h2 className="w-32 h-6 bg-neutral-600 animate-pulse rounded"></h2>
                  <div className="flex gap-x-4 mt-2.5">
                    <div className="w-14 h-14 bg-neutral-600 rounded-md"></div>
                    <div className="flex-col flex justify-center ">
                      <h2 className="w-32 h-6 bg-neutral-600 animate-pulse rounded"></h2>
                      <div className="w-16 h-6 bg-neutral-600 animate-pulse rounded mt-2"></div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
            {/* Sponsors */}
            <div>
              <Card className="rounded-bl-none">
                <h2 className="w-32 h-6 bg-neutral-600 animate-pulse rounded"></h2>
                {Array.from({ length: 4 }).map((_, index) => (
                  <div className="flex gap-x-4 py-2.5" key={index}>
                    <div className="w-12 h-12 bg-neutral-600 rounded-md"></div>
                    <div className="flex h-12">
                      <div className="flex-col flex h-full justify-center items-start">
                        <div className="w-12 h-4 bg-neutral-600 animate-pulse rounded"></div>
                        <div className="w-16 h-6 bg-neutral-600 animate-pulse rounded mt-2"></div>
                      </div>
                    </div>
                    <div className="flex h-12 ml-auto">
                      <div className="flex-col flex h-full justify-center items-end text-right">
                        <div className="w-12 h-4 bg-neutral-600 animate-pulse rounded"></div>
                        <div className="w-16 h-6 bg-neutral-600 animate-pulse rounded mt-2"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </Card>
              <Extrusion
                className={cn("min-w-36 border-secondary rounded-bl-primary")}
                cornerLocation={CornerLocation.BottomRight}
              />
            </div>
            {/* Maps */}
            <div>
              <Extrusion
                className={cn("min-w-36 border-secondary rounded-tr-primary ml-auto")}
                cornerLocation={CornerLocation.TopLeft}
              />
              <Card className="rounded-tr-none">
                <h2 className="w-32 h-6 bg-neutral-600 animate-pulse rounded"></h2>
                {Array.from({ length: 4 }).map((_, index) => (
                  <div className="flex gap-x-4 py-2.5" key={index}>
                    <div className="w-12 h-12 bg-neutral-600 rounded-md"></div>
                    <div className="flex h-12">
                      <div className="flex-col flex h-full justify-center items-start">
                        <div className="w-12 h-4 bg-neutral-600 animate-pulse rounded"></div>
                        <div className="w-16 h-6 bg-neutral-600 animate-pulse rounded mt-2"></div>
                      </div>
                    </div>
                    <div className="flex h-12 ml-auto">
                      <div className="flex-col flex h-full justify-center items-end text-right">
                        <div className="w-12 h-4 bg-neutral-600 animate-pulse rounded"></div>
                        <div className="w-16 h-6 bg-neutral-600 animate-pulse rounded mt-2"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </Card>
            </div>
          </div>
          <div className="sm:col-span-3 flex flex-col gap-y-4">
            {/* Overview */}
            <div>
              <Extrusion
                className={cn("min-w-36 ml-auto border-secondary rounded-tr-primary")}
                cornerLocation={CornerLocation.TopLeft}
              />
              <Card className="rounded-tr-none p-0">
                <div className="px-6 py-6">
                  <div className="flex justify-between items-center">
                    <h2 className="w-32 h-6 bg-neutral-600 animate-pulse rounded"></h2>
                    <div className="w-24 h-6 bg-neutral-600 animate-pulse rounded"></div>
                  </div>
                  <div className="flex py-4 gap-x-4">
                    <div className="size-16 bg-neutral-600 animate-pulse rounded-md"></div>
                    <div className="flex flex-col justify-center">
                      <div className="w-16 h-5 bg-neutral-600 animate-pulse rounded"></div>
                      <div className="w-20 h-6 bg-neutral-600 animate-pulse rounded mt-2"></div>
                    </div>
                    <div className="pl-4 flex flex-col justify-center">
                      <div className="w-16 h-5 bg-neutral-600 animate-pulse rounded"></div>
                      <div className="w-16 h-5 bg-neutral-600 animate-pulse rounded mt-2"></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-5 gap-4 pt-2">
                    {Array.from({ length: 10 }).map((_, index) => (
                      <div key={index} className="flex flex-col">
                        <div className="w-12 h-4 bg-neutral-600 animate-pulse rounded"></div>
                        <div className="w-16 h-6 bg-neutral-600 animate-pulse rounded mt-2"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>

            {/* Last 20 Card */}
            <div ref={ref}>
              <Card className="rounded-bl-none">
                <div className="grid-cols-4 grid pb-2">
                  <div className="flex flex-col">
                    <div className="w-14 h-4 bg-neutral-600 animate-pulse rounded"></div>

                    <div className="w-16 h-6 my-2 bg-neutral-600 animate-pulse rounded"></div>
                  </div>
                  <div className="flex flex-col">
                    <div className="w-14 h-4 bg-neutral-600 animate-pulse rounded"></div>
                    <div className="w-16 h-6 my-2 bg-neutral-600 animate-pulse rounded"></div>
                  </div>
                  <div className="flex flex-col">
                    <div className="w-14 h-4 bg-neutral-600 animate-pulse rounded"></div>
                    <div className="w-16 h-6 my-2 bg-neutral-600 animate-pulse rounded"></div>
                  </div>
                  <div className="flex flex-col">
                    <div className="w-14 h-4 bg-neutral-600 animate-pulse rounded"></div>
                    <div className="w-16 h-6 my-2 bg-neutral-600 animate-pulse rounded"></div>
                  </div>
                </div>
                <div className="relative w-full h-1 rounded overflow-hidden">
                  <div className="absolute top-0 animate-pulse left-0 w-full h-full bg-neutral-500"></div>
                </div>
              </Card>
              <Extrusion
                className={cn("min-w-36 border-secondary rounded-bl-primary")}
                cornerLocation={CornerLocation.BottomRight}
              />
            </div>
            {/* Matches */}
            <div ref={ref} className="flex flex-col gap-y-2">
              {Array.from({ length: 20 }).map((_, index) => (
                <div key={index} className="flex h-28 w-full gap-x-1">
                  <div className="h-full w-2 bg-neutral-600"></div>
                  <Card className="flex pl-3 rounded-l-none w-full bg-gradient-to-r from-neutral-700/10">
                    <div className="flex">
                      <div className="w-12 h-12 rounded-md mt-1 bg-neutral-600 animate-pulse"></div>
                    </div>
                    <div className="flex-col flex w-full">
                      <div className="flex h-5 items-center gap-1 pl-4 mt-1">
                        <div className="w-16 h-4 bg-neutral-600 animate-pulse rounded"></div>
                        <span className="text-xs opacity-50 my-auto">•</span>
                        <div className="w-12 h-4 bg-neutral-600 animate-pulse rounded"></div>
                        <span className="text-xs opacity-50 my-auto">•</span>
                        <div className="w-20 h-4 bg-neutral-600 animate-pulse rounded"></div>
                        <span className="text-xs opacity-50 my-auto">•</span>
                        <div className="w-24 h-4 bg-neutral-600 animate-pulse rounded"></div>
                      </div>
                      <div className="w-full h-full grid grid-cols-4 pl-4 pt-2 gap-4">
                        {Array.from({ length: 4 }).map((_, i) => (
                          <div
                            key={i}
                            className="h-full w-full flex flex-col items-start justify-between"
                          >
                            <div className="w-12 h-4 bg-neutral-600 animate-pulse rounded"></div>
                            <div className="w-16 h-4 bg-neutral-600 animate-pulse rounded"></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-x-2"></div>
      </Constrict>
    </>
  );
});
SkeletonLoader.displayName = "SkeletonLoader";

export { SkeletonLoader };
