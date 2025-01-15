"use client";
import { useState, useEffect } from "react";
// IMAGES
import BackgroundImage from "../../components/cosmetic/BackgroundImage";
import BackgroundImageData from "../../assets/background-images/background-spectators.png";
import soloRank from "../../assets/ranks/rank-solo.svg";
import Image from "next/image";
// MANTINE
import { Container, SimpleGrid, Pagination, Select } from "@mantine/core";
// LEADERBOARD
import PlayerLeaderboardTable from "../../components/tables/PlayerLeaderboardTable";
import { fetchLeaderboard } from "../../utils/fetch/fetchLeaderboard";
import type { LeaderboardId } from "../../utils/types/leaderboard";
// STYLING
import Extrusion, { CornerLocation } from "../../components/cosmetic/Extrusion";
import { cn } from "../../utils/cn";
import { SeasonSelector } from "../../components/input/SeasonSelector";

// SHADCN
import { Input } from "@/app/components/input/Input";

const PRIMARY_COL_HEIGHT = "300px";

// UNFINISHED
// Need to rework the pagination so that it only pulls needed entries, to reduce load time.
// Need to check it doesnt break on mobile view, though it looks fine on my phone.

export default function Leaderboard() {
  const SECONDARY_COL_HEIGHT = `calc(${PRIMARY_COL_HEIGHT} / 2 - var(--mantine-spacing-md) / 2)`;
  const DEFAULT_SEASON_VALUE = "Season 0";

  const [page, setPage] = useState(1);
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

      <Container my="md" size="xl" px="0.5rem">
        {/* TITLE START */}
        <div className="flex justify-start items-center mt-2">
          <div className="mr-8">
            <h2 className="text-3xl font-light">PLAYERS</h2>
            <h1 className="text-5xl">TOP 1000</h1>
          </div>
          <Image
            src={soloRank}
            alt="Spectre Divide solo rank icon."
            className="w-24"
          />
        </div>
        {/* FILTERS START */}
        <div className="w-full flex my-8 gap-x-2 items-center">
          <div className="w-96 mr-auto">
            <Input />
          </div>
          <div className="w-48">
            <SeasonSelector
              defaultValue={DEFAULT_SEASON_VALUE}
              onChange={setSeason}
            />
          </div>
          <div className="">
          <Pagination
            total={leaderboard.length / 50}
            value={page}
            onChange={setPage}
            withControls={false}
          />
          </div>
        </div>

        <div className="flex justify-end items-end pb-4 sm:pb-0">

        </div>
        {/* TABLE START */}
        <PlayerLeaderboardTable playerRows={leaderboard} page={page} />
      </Container>
    </main>
  );
}
