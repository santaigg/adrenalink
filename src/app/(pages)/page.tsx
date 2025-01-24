"use client";
import { useState, useEffect } from "react";
import PlayerLeaderboardTable from "../components/tables/PlayerLeaderboardTable";
import { fetchLeaderboard } from "../utils/fetch/fetchLeaderboard";
import type { LeaderboardId } from "../utils/types/leaderboard";

import BackgroundImage from "../components/cosmetic/BackgroundImage";
import BackgroundImageData from "../assets/images/background/background-spectators.png";
import { Searchbox } from "../components/input/Searchbox";
import Constrict from "../components/layout/Constrict";
import Image from "next/image";
import SpectreLogoImage from "../assets/images/brand/spectre-logo.png";
import NoticeBanner from "../components/information/NoticeBanner";

import { PlayerProfile } from "../utils/types/wavescan.types";
import noStoreFetch from "@/app/utils/fetch/noStoreFetch";

interface PlayerRow {
  username: string;
  placement: number;
  soloRank: string;
  playerId: string;
  rating: number;
}

export default function Home() {
  const season = "season0";
  const [leaderboard, setLeaderboard] = useState<PlayerRow[]>([]);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      const data = await fetchLeaderboard(season as LeaderboardId);
      setLeaderboard(data.slice(0, 3));
    };

    fetchLeaderboardData();
  }, [season]);

  const [profileImages, setProfileImages] = useState<Record<string, string>>(
    {}
  );

  useEffect(() => {
    const loadImages = async () => {
      const images: Record<string, string> = {};
      for (const player in leaderboard) {
        const response = await noStoreFetch(
          `https://wavescan-production.up.railway.app/api/v1/player/${leaderboard[player].playerId}/full_profile`
        );

        const data: PlayerProfile = await response.json();
        images[player] = data.steam_profile.avatar?.large;
      }
      setProfileImages(images);
    };

    loadImages();
  }, [leaderboard]);

  return (
    <main className="h-full">
      <BackgroundImage image={BackgroundImageData} />
      <Constrict className="my-8 px-4">
        <NoticeBanner
          className="text-center"
          noticeTitle="Santai.GG \\ Flashpoint"
          noticeBottomText="Brand new website, polished experience."
        />
      </Constrict>
      <Constrict className="h-full px-4 flex gap-8">
        <div className="flex flex-1 flex-col gap-8 text-primary-foreground">
          <div>
            <div className="flex flex-row">
              <h2 className="mb-1 text-primary-foreground">Player Search</h2>
              <Image
                src={SpectreLogoImage}
                alt="Spectre Divide wordmark."
                className="h-6 w-auto ml-auto mt-auto mb-2 brightness-75"
              />
            </div>
            <Searchbox placeholder="Username or Steam64..." />
          </div>
          {/* <div className="h-full p-4 bg-primary">Real time logs.</div> */}
        </div>
        <div className="flex flex-1 justify-start gap-y-4 flex-col">
          {leaderboard.map((player, index) => {
            const pfp = profileImages[index];
            return (
              <div
                key={player.playerId}
                className={`flex flex-col items-center w-full`}
              >
                <div
                  className={`hover:-translate-y-2 transition-all w-full ${
                    index === 0 ? "" : ""
                  }`}
                >
                  <div
                    className={`w-48 text-input pl-4 py-0.5 flex justify-start items-center ${
                      index === 0
                        ? "bg-amber-500"
                        : index === 1
                        ? "bg-stone-500"
                        : "bg-amber-900"
                    }`}
                    style={{
                      clipPath:
                        "polygon(0 0, calc(100% - 15px) 0%, 100% 15px, 100% 100%, 0% 100%)",
                    }}
                  >
                    <p
                      className={`${
                        index === 0
                          ? "text-amber-100"
                          : index === 1
                          ? "text-stone-100"
                          : "text-amber-100"
                      }`}
                    >
                      #{index + 1}
                    </p>
                  </div>
                  <div
                    className="w-full bg-primary border-secondary border flex flex-col overflow-hidden hover:bg-primary/85 transition-all cursor-pointer"
                    style={{
                      clipPath:
                        "polygon(100% 0%, 0% 0%, 0% 100%, calc(100% - 30px) 100%, 100% calc(100% - 30px))",
                    }}
                  >
                    <div className="flex gap-x-4 items-center justify p-4 w-full">
                      {pfp && (
                        <img
                          src={pfp}
                          className="size-24 corner-clip bg-neutral-600 animate-pulse"
                        ></img>
                      )}

                      <div className="flex flex-col items-start justify-center">
                        <h2 className="">{player.username}</h2>
                        <h3>{player.rating} RR</h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Constrict>
    </main>
  );
}
