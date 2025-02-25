"use client";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

import BackgroundImage from "../../../components/cosmetic/BackgroundImage";
import BackgroundImageData from "../../../assets/images/background/background-spectators.png";
import DefaultAvatar from "@/app/assets/images/avatars/default.png";
import Constrict from "@/app/components/layout/Constrict";

import { fetchPlayerProfile } from "@/app/utils/fetch/fetchPlayerProfile";
import { PlayerFullProfile } from "@/app/utils/types/wavescan.types";
import { Plus, RefreshCcw } from "lucide-react";
import Image from "next/image";

import {
  CurrentRankCard,
  SponsorsCard,
  MapsCard,
  OverviewCard,
  Last20Card,
  MatchCard,
  SkeletonLoader,
} from "@/app/components/information/PlayerProfileCards";
import {
  AddMatchModal,
  RefreshMatchButton,
} from "@/app/components/input/AddMatchModal";

import { useRouter } from "next/navigation";

interface dumpStatus {
  success: boolean;
  is_priority: boolean;
  queue_position: number | null;
  initially_dumped: boolean;
  in_progress: boolean;
  last_updated: number | null;
}

export default function PlayerProfile() {
  const params = useParams<{ tag: string; slug: string }>();
  const router = useRouter();
  const playerId = params.slug;

  const [ModalOpen, setModalOpen] = useState<boolean>(false);
  const [playerProfile, setPlayerProfile] = useState<PlayerFullProfile | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [dumpData, setDumpData] = useState<dumpStatus | null>(null);

  const MAX_RETRIES = 3;

  useEffect(() => {
    if (!playerId) return;

    let retries = 0;

    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await fetchPlayerProfile(playerId);

        if (data?.error) {
          console.error("Database timeout error:", data.error);

          if (retries < MAX_RETRIES) {
            retries++;
            const delay = Math.pow(2, retries) * 500;
            console.log(`Retrying in ${delay}ms...`);
            setTimeout(fetchData, delay);
            return;
          }

          console.log("Max retries reached. Refreshing the page...");
          router.refresh(); // Server-side refresh only if all retries fail
          return;
        }

        setPlayerProfile(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch player profile:", error);
      }
    };

    fetchData();
  }, [playerId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://wavescan-production.up.railway.app/api/v1/player/${playerId}/dump_status`
        );
        if (!response.ok) throw new Error("Failed to fetch dump status");
        const dumpStatus = (await response.json()) as dumpStatus;
        setDumpData(dumpStatus);
      } catch (error) {
        console.error("Error checking dump status:", error);
        return false;
      }
    };

    fetchData();
  }, [playerId]);

  async function isRefreshAllowed() {
    try {
      const response = await fetch(
        `https://wavescan-production.up.railway.app/api/v1/player/${playerProfile?.id}/dump_status`
      );
      if (!response.ok) throw new Error("Failed to fetch dump status");
      const dumpStatus = (await response.json()) as dumpStatus;
      return dumpStatus.initially_dumped;
    } catch (error) {
      console.error("Error checking dump status:", error);
      return false; // If there's an error, we'll disallow refresh to be safe
    }
  }

  async function refreshMatches() {
    if (!(await isRefreshAllowed())) {
      return;
    }

    setLoading(true);
    try {
      // Check dump status
      const dumpStatusResponse = await fetch(
        `https://wavescan-production.up.railway.app/api/v1/player/${playerProfile?.id}/dump_status`
      );
      if (!dumpStatusResponse.ok)
        throw new Error("Failed to fetch dump status");
      const dumpStatus = (await dumpStatusResponse.json()) as dumpStatus;

      const currentTime = new Date().getTime();
      const lastRefreshTime = localStorage.getItem(
        `lastRefresh_${playerProfile?.id}`
      );
      const lastDumpTime = dumpStatus.initially_dumped
        ? dumpStatus.last_updated ??
          localStorage.getItem(`lastDump_${playerProfile?.id}`)
          ? Number.parseInt(
              localStorage.getItem(`lastDump_${playerProfile?.id}`) ?? "0"
            )
          : 0
        : null;

      // Determine if we should refresh or dump
      const shouldDump = !lastDumpTime || currentTime - lastDumpTime > 900000; // 15 minutes
      const shouldRefresh =
        !lastRefreshTime ||
        currentTime - Number.parseInt(lastRefreshTime) > 300000; // 5 minutes

      if (shouldDump) {
        // Initiate a new dump
        const dumpResponse = await fetch(
          `https://wavescan-production.up.railway.app/api/v1/player/${playerProfile?.id}/dump`
        );
        if (!dumpResponse.ok) throw new Error("Failed to initiate dump");
        localStorage.setItem(
          `lastDump_${playerProfile?.id}`,
          currentTime.toString()
        );
        // You might want to handle the response here, e.g., show a message that dump is in progress
      } else if (shouldRefresh) {
        // Fetch full profile
        const response = await fetch(
          `https://wavescan-production.up.railway.app/api/v1/player/${playerProfile?.id}/full_profile`
        );
        if (!response.ok) throw new Error("Failed to fetch matches");
        setPlayerProfile(await response.json());
        // reactiveMatches = playerProfile?.matches.map((match) => ({
        //   ...match,
        //   expanded: false,
        //   result:
        //     match.winner === -1
        //       ? "Draw"
        //       : match.winner === match.player_team?.team_index
        //         ? "Victory"
        //         : "Defeat",
        // }));
        localStorage.setItem(
          `lastRefresh_${playerProfile?.id}`,
          currentTime.toString()
        );
      }
    } catch (error) {
      console.error("Error refreshing matches:", error);
      // You might want to set an error state here to display to the user
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <BackgroundImage image={BackgroundImageData} />
      {loading ? (
        <SkeletonLoader />
      ) : playerProfile ? (
        <>
          <AddMatchModal open={ModalOpen} setOpen={setModalOpen} />
          <div className="w-full -mt-4 h-48 relative">
            <div className="w-full h-full absolute top-0 -z-10 overflow-hidden">
              <img
                className="-z-10 absolute top-0 size-[200%] object-cover blur-3xl opacity-70 brightness-75"
                alt="Banner"
                src={playerProfile.steam_profile?.avatar?.large}
              />
            </div>
            <div className="size-full absolute top-0 -z-50 bg-input" />
            <Constrict className="h-full flex px-1">
              <div className="bg-secondary flex justify-center items-center absolute bottom-0 translate-y-1/2 corner-clip">
                {playerProfile.steam_profile?.avatar?.large ? (
                  <img
                    src={playerProfile.steam_profile.avatar.large}
                    alt={`${playerProfile.name}'s avatar`}
                    className="w-32 h-32"
                  />
                ) : (
                  <Image
                    src={DefaultAvatar}
                    alt={`Default avatar`}
                    className="w-32 h-32"
                  />
                )}
              </div>
              <div className="flex justify-end items-center mb-auto mt-6 sm:mt-auto ml-auto sm:mb-4 gap-x-4">
                {dumpData?.in_progress && (
                  <div className="h-9 flex items-center text-accent">
                    Processing matches soon... Queue Position:{" "}
                    {dumpData.queue_position}
                  </div>
                )}
                <div
                  onClick={refreshMatches}
                  className="py-1.5 h-9 px-4 gap-x-1 flex items-center justify-center transition-all border border-secondary bg-primary rounded-primary cursor-pointer hover:bg-accent hover:border-accent hover:text-black"
                >
                  <RefreshCcw className="size-5" />
                  <p className="leading-none mt-0.5">Refresh Matches</p>
                </div>
                <div
                  className="py-1.5 h-9 px-4 gap-x-1 flex items-center justify-center transition-all border border-secondary bg-primary rounded-primary cursor-pointer hover:bg-accent hover:border-accent hover:text-black"
                  onClick={() => setModalOpen(true)}
                >
                  <Plus className="size-5" />
                  <p className="leading-none mt-0.5">Add Match</p>
                </div>
              </div>
            </Constrict>
          </div>
          <Constrict className="flex flex-col text-primary-foreground px-1">
            <div className="ml-36">
              <h1 className="font-medium">{playerProfile.name}</h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 mt-8 gap-6">
              <div className="gap-y-4 flex-col flex w-full">
                {/* Current Rank */}
                <CurrentRankCard
                  stats={playerProfile.stats!}
                  seasonStats={playerProfile.extended_stats?.season_stats!}
                />
                {/* Sponsors */}
                <SponsorsCard
                  sponsorStats={
                    playerProfile.extended_stats?.sponsor_stats! || {}
                  }
                />
                {/* Maps */}
                <MapsCard mapStats={playerProfile.extended_stats?.map_stats!} />
              </div>
              <div className="md:col-span-3 flex flex-col gap-y-4">
                {/* Overview */}
                <OverviewCard
                  stats={playerProfile.stats}
                  seasonStats={playerProfile.extended_stats?.season_stats!}
                />
                <Last20Card
                  stats={
                    playerProfile.extended_stats?.last_20_matches_avg_stats!
                  }
                />
                <MatchCard
                  matches={playerProfile.matches}
                  playerId={playerProfile.id}
                />
              </div>
            </div>
            <div className="flex gap-x-2"></div>
          </Constrict>
        </>
      ) : (
        <Constrict className="flex flex-col">
          <p>Player profile not found.</p>
        </Constrict>
      )}
    </main>
  );
}
