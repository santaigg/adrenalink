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

export default function PlayerProfile() {
  const params = useParams<{ tag: string; slug: string }>();
  const playerId = params.slug;

  const [playerProfile, setPlayerProfile] = useState<PlayerFullProfile | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [status, setStatus] = useState<string>("");

  useEffect(() => {
    if (!playerId) return;

    const fetchData = async () => {
      setLoading(true);
      setStatus("Fetching...");
      const data = await fetchPlayerProfile(playerId);
      setStatus("Writing...");
      setPlayerProfile(data);
      setStatus("Done!");
      setLoading(false);
      setStatus("");
    };

    fetchData();
  }, [playerId]);
  return (
    <main>
      <BackgroundImage image={BackgroundImageData} />
      {loading ? (
        <SkeletonLoader />
      ) : playerProfile ? (
        <>
          <div className="w-full -mt-4 h-48 relative">
            {/* <Image
              className="-z-50 absolute top-0 size-full object-cover"
              alt="Banner"
              src={BannerImageData}
            /> */}
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
              <div className="flex justify-end items-end mb-auto mt-6 sm:mt-auto ml-auto sm:mb-4 gap-x-4">
              <div className="py-1.5 h-9 px-4 gap-x-1 flex items-center justify-center transition-all border border-secondary bg-primary rounded-primary cursor-pointer hover:bg-accent hover:border-accent hover:text-black">
                  <RefreshCcw className="size-5" />
                  <p className="leading-none mt-0.5">Refresh Matches</p>
                </div>
                <div className="py-1.5 h-9 px-4 gap-x-1 flex items-center justify-center transition-all border border-secondary bg-primary rounded-primary cursor-pointer hover:bg-accent hover:border-accent hover:text-black">
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
                  stats={playerProfile.stats}
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
