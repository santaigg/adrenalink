"use client";
import { useState, useEffect } from "react";
// IMAGES
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
import { SearchLeaderboard } from "@/app/components/input/SearchLeaderboard";
import { SeasonSelector } from "@/app/components/input/SeasonSelector";
import { PlayerLeaderboardPagination } from "@/app/components/navigation/PlayerLeaderboardPagination";
import Constrict from "@/app/components/layout/Constrict";

// UNFINISHED
// Need to rework the pagination so that it only pulls needed entries, to reduce load time.
// Need to check it doesnt break on mobile view, though it looks fine on my phone.

export default function Leaderboard() {
  const DEFAULT_SEASON_VALUE = "season0";
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [season, setSeason] = useState<string>(DEFAULT_SEASON_VALUE);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      setLoading(true);
      const data = await fetchLeaderboard(season as LeaderboardId);
      setLeaderboard(data);
      setLoading(false);
    };

    fetchLeaderboardData();
  }, [season]);

  useEffect(() => {
    if (leaderboard) {
      setTotalRows(leaderboard.length);
    }
  }, [leaderboard]);

  return (
    <main className="bg-input -mt-4 min-h-[82svh] -z-10 py-8">
      {/* <BackgroundImage image={BackgroundImageData} /> */}

      <Constrict className="flex flex-col">
        {/* TITLE START */}
        <div className="flex justify-start items-center px-2 sm:px-0">
          <div className="mr-8">
            <h2 className="text-3xl text-primary-foreground">PLAYERS</h2>
            <h1 className="text-5xl text-secondary-foreground">TOP 1000</h1>
          </div>
          <Image
            src={soloRank}
            alt="Spectre Divide solo rank icon."
            className="w-24"
          />
        </div>
        {/* FILTERS START */}
        <div className="w-full flex flex-col-reverse items-center mt-8 sm:mb-16 gap-y-4 sm:px-0 sm:flex-row sm:gap-x-2 sm:items-start">
          <div className="w-full sm:w-96 mr-auto">
            <SearchLeaderboard value={search} setValue={setSearch} />
          </div>
          <div className="w-full sm:w-52">
            <SeasonSelector
              loading={loading}
              defaultValue={DEFAULT_SEASON_VALUE}
              setSeason={setSeason}
            />
          </div>
          <div className="hidden sm:block">
            <div className="bg-secondary border border-secondary rounded-primary rounded-br-none h-9">
              <PlayerLeaderboardPagination
                totalCount={totalRows}
                pageSize={50}
                page={page}
                onChange={setPage}
                keyPrefix="top"
              />
            </div>
            {Math.ceil(totalRows / 50) > 3 ? (
              <Extrusion
                className={cn(
                  "min-w-24 border-secondary rounded-br-primary ml-auto"
                )}
                cornerLocation={CornerLocation.BottomLeft}
              />
            ) : (
              <div></div>
            )}
          </div>
        </div>

        <div className="flex justify-end items-end pb-4 sm:pb-0"></div>
        {/* TABLE START */}
        <PlayerLeaderboardTable
          playerRows={leaderboard}
          page={page}
          searchQuery={search}
          loading={loading}
          updateTotalRows={setTotalRows}
        />
        <div className="bg-secondary w-full h-24 rounded-b-primary flex justify-center sm:justify-end items-center px-8 border-t border-muted">
          <div className="bg-primary rounded-[calc(var(--rounding)+4px)] border border-primary p-0.5">
            <PlayerLeaderboardPagination
              totalCount={totalRows}
              pageSize={50}
              page={page}
              onChange={setPage}
              keyPrefix="btm"
            />
          </div>
        </div>
      </Constrict>
    </main>
  );
}
