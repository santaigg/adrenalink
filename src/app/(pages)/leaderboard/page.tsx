"use client";
import { useState, useEffect } from "react";
// IMAGES
import BackgroundImage from "../../components/cosmetic/BackgroundImage";
import BackgroundImageData from "../../assets/images/background/background-spectators.png";
import soloRank from "../../assets/ranks/rank-solo.svg";
import Image from "next/image";
// LEADERBOARD
import PlayerLeaderboardTable from "../../components/tables/PlayerLeaderboardTable";
import { fetchLeaderboard } from "../../utils/fetch/fetchLeaderboard";
import type { LeaderboardId } from "../../utils/types/leaderboard";
// STYLING
import Extrusion, { CornerLocation } from "../../components/cosmetic/Extrusion";
import { cn } from "../../utils/cn";

// COMPONENTS
import { Input } from "@/app/components/input/Input";
import { SeasonSelector } from "@/app/components/input/SeasonSelector";
import { PlayerLeaderboardPagination } from "@/app/components/navigation/PlayerLeaderboardPagination";

// UNFINISHED
// Need to rework the pagination so that it only pulls needed entries, to reduce load time.
// Need to check it doesnt break on mobile view, though it looks fine on my phone.

export default function Leaderboard() {
  const DEFAULT_SEASON_VALUE = "Season 0";

  const [page, setPage] = useState<number>(1);
  const [season, setSeason] = useState<string | null>(DEFAULT_SEASON_VALUE);
  const [leaderboard, setLeaderboard] = useState([]);

  const formatSeasonKey = (season: string | null): string => {
    return season ? season.toLowerCase().replace(" ", "") : "";
  };

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      const formattedSeason = formatSeasonKey(season);
      const data = await fetchLeaderboard(formattedSeason as LeaderboardId);
      setLeaderboard(data);
    };

    fetchLeaderboardData();
  }, [season]);

  return (
    <main>
      <BackgroundImage image={BackgroundImageData} />

      <div className="container px-2 mx-auto">
        {/* TITLE START */}
        <div className="flex justify-start items-center mt-2">
          <div className="mr-8">
            <h2 className="text-3xl font-light">PLAYERS</h2>
            <h1 className="text-5xl">TOP 1000</h1>
          </div>
          <Image src={soloRank} alt="Spectre Divide solo rank icon." className="w-24" />
        </div>
        {/* FILTERS START */}
        <div className="w-full flex my-8 gap-x-2 items-center">
          <div className="w-96 mr-auto">
            <Input />
          </div>
          <div className="w-48">{/* <SeasonSelector defaultValue={DEFAULT_SEASON_VALUE} onChange={setSeason} /> */}</div>
          <div className="">
            <PlayerLeaderboardPagination totalCount={leaderboard.length} pageSize={50} page={page} onChange={setPage} />
          </div>
        </div>

        <div className="flex justify-end items-end pb-4 sm:pb-0"></div>
        {/* TABLE START */}
        <PlayerLeaderboardTable playerRows={leaderboard} page={page} />
      </div>
    </main>
  );
}
