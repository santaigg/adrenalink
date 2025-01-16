"use client";
import { useState, useEffect } from "react";
// IMAGES
import BackgroundImage from "../../components/cosmetic/BackgroundImage";
import BackgroundImageData from "../../assets/images/background/background-spectators.png";
import soloRank from "../../assets/images/ranks/solo_ranks/icon.svg";
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
import { SearchLeaderboard } from "@/app/components/input/SearchLeaderboard";
import { SeasonSelector } from "@/app/components/input/SeasonSelector";
import { PlayerLeaderboardPagination } from "@/app/components/navigation/PlayerLeaderboardPagination";
import Constrict from "@/app/components/layout/Constrict";

const PRIMARY_COL_HEIGHT = "300px";

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
    <main className="bg-input py-8">
      {/* <BackgroundImage image={BackgroundImageData} /> */}

      <Constrict className="flex flex-col">
        {/* TITLE START */}
        <div className="flex justify-start items-center">
          <div className="mr-8">
            <h2 className="text-3xl text-primary-foreground">PLAYERS</h2>
            <h1 className="text-5xl text-secondary-foreground">TOP 1000</h1>
          </div>
          <Image src={soloRank} alt="Spectre Divide solo rank icon." className="w-24" />
        </div>
        {/* FILTERS START */}
        <div className="w-full flex mt-8 mb-16 gap-x-2 items-start">
          <div className="w-96 mr-auto">
            <SearchLeaderboard />
          </div>
          <div className="w-52">
            <SeasonSelector
            // defaultValue={DEFAULT_SEASON_VALUE}
            // onChange={setSeason}
            />
          </div>
          <div className="">
            <div className="bg-secondary border border-secondary rounded-t rounded-bl h-9">
              <PlayerLeaderboardPagination
                totalCount={leaderboard.length}
                pageSize={50}
                page={page}
                onChange={setPage}
              />
            </div>{" "}
            <Extrusion
              className={cn("min-w-24 border-secondary rounded-br ml-auto")}
              cornerLocation={CornerLocation.BottomLeft}
            />
          </div>
        </div>

        <div className="flex justify-end items-end pb-4 sm:pb-0"></div>
        {/* TABLE START */}
        <PlayerLeaderboardTable playerRows={leaderboard} page={page} />
        <div className="bg-secondary w-full h-24 rounded-b flex justify-end items-center px-8">
          <div className="bg-primary rounded-md border border-primary p-0.5">
            <PlayerLeaderboardPagination
              totalCount={leaderboard.length}
              pageSize={50}
              page={page}
              onChange={setPage}
            />
          </div>
        </div>
      </Constrict>
    </main>
  );
}
