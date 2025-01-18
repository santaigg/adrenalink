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

export { Card, CurrentRankCard, SponsorsCard, MapsCard };
