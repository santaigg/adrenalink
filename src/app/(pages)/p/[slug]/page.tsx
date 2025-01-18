"use client";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

import BackgroundImage from "../../../components/cosmetic/BackgroundImage";
import BackgroundImageData from "../../../assets/images/background/background-spectators.png";
import Constrict from "@/app/components/layout/Constrict";

import { fetchPlayerProfile } from "@/app/utils/fetch/fetchPlayerProfile";
import { PlayerFullProfile } from "@/app/utils/types/wavescan.types";
import getSoloRankFromNumber from "@/app/utils/types/rank";
import Image from "next/image";

import { Card, CurrentRankCard, SponsorsCard, MapsCard } from "@/app/components/information/Card";

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
    <main className="min-h-screen">
      <BackgroundImage className="mix-bl" image={BackgroundImageData} />
      {loading ? (
        <p>Loading player profile...</p>
      ) : playerProfile ? (
        <>
          <div className="w-full -mt-4 h-48 relative">
            {/* <Image
              className="-z-50 absolute top-0 size-full object-cover"
              alt="Banner"
              src={BannerImageData}
            /> */}
            <div className="size-full absolute top-0 -z-50 bg-input" />
            <Constrict className="h-full flex">
              {/* <p className="text-muted">{playerId}</p> */}
              <p className="text-muted">{status}</p>
              {/* <h1 className="mt-auto mb-2 ml-36">{playerProfile.name}</h1> */}
              <div className="bg-secondary flex justify-center items-center absolute bottom-0 translate-y-1/2 corner-clip">
                <img
                  src={playerProfile.steam_profile.avatar?.large}
                  alt={`${playerProfile.name}'s avatar`}
                  className="w-32 h-32"
                />
              </div>
            </Constrict>
          </div>
          <Constrict className="flex flex-col">
            <div className="ml-36">
              <h1>{playerProfile.name}</h1>
            </div>
            <div className="grid grid-cols-4 mt-8 gap-6">
              <div className="gap-y-4 flex-col flex">
                {/* Current Rank */}
                <CurrentRankCard stats={playerProfile.stats}/>
                {/* Sponsors */}
                <SponsorsCard sponsorStats={playerProfile.extended_stats?.sponsor_stats!}/>
                {/* Maps */}
                <MapsCard mapStats={playerProfile.extended_stats?.map_stats!}/>
              </div>
              <div className="col-span-3 flex flex-col gap-y-4">
                {/* Overview */}
                <Card>
                  <h2>Season Overview</h2>
                </Card>
                <Card>
                  <h2>Last 20</h2>
                </Card>
                <Card>
                  <h2>Matches</h2>
                </Card>
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
