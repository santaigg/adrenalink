"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchLeaderboard } from "../utils/fetch/fetchLeaderboard";
import type { LeaderboardId } from "../utils/types/leaderboard";

import BackgroundImage from "../components/cosmetic/BackgroundImage";
import BackgroundImageData from "../assets/images/background/background-spectators.png";
import { Searchbox } from "../components/input/Searchbox";
import Constrict from "../components/layout/Constrict";
import Image from "next/image";
import SpectreLogoImage from "../assets/images/brand/spectre-logo.png";
import { SponsorImage } from "../components/cosmetic/SponsorImageFromString";
import NoticeBanner from "../components/information/NoticeBanner";

import { PlayerSteamProfile } from "../utils/types/wavescan.types";
import noStoreFetch from "@/app/utils/fetch/noStoreFetch";

import Extrusion, { CornerLocation } from "../components/cosmetic/Extrusion";
import HomeStatTable from "../components/tables/HomeStatTable";

interface PlayerRow {
  username: string;
  placement: number;
  soloRank: string;
  playerId: string;
  rating: number;
}

export default function Home() {
  const router = useRouter();
  const season = "season0";
  const [leaderboard, setLeaderboard] = useState<PlayerRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      const data = await fetchLeaderboard(season as LeaderboardId);
      setLeaderboard(data.slice(0, 3));
      setLoading(false);
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
          `https://wavescan-production.up.railway.app/api/v1/player/${leaderboard[player].playerId}/steam_profile`
        );

        const data: PlayerSteamProfile = await response.json();
        images[player] = data.steam_profile.avatar?.large;
      }
      setProfileImages(images);
    };

    loadImages();
  }, [leaderboard]);

  const sponsors = [
    "Morrgen United",
    "Pinnacle International",
    "Ryker Industries",
    "Bloom Technologies",
    "Ghostlink Collective",
  ];

  const getRandomStat = () => (Math.random() * 100).toFixed(2);

  return (
    <main className="h-full flex flex-col">
      <div className="relative -mt-4 w-full border-b border-secondary pb-20">
        <BackgroundImage image={BackgroundImageData} />
        <NoticeBanner
          className="text-center hidden"
          noticeTitle="Santai.GG \\ Flashpoint"
          noticeBottomText="Brand new website, polished experience."
          ver={2}
        />
        <Constrict className="h-full px-4 flex flex-col sm:flex-row items-start justify-start sm:space-x-8 mt-24">
          <div
            className={`h-60 group flex justify-center flex-col mx-auto pb-8 ${
              loading ? "w-1/2" : "w-full"
            }`}
          >
            <div className="flex flex-row">
              <h2 className="mb-1 text-primary-foreground">Player Search</h2>
              <Image
                src={SpectreLogoImage}
                alt="Spectre Divide wordmark."
                className="h-6 w-auto ml-auto mt-auto mb-2 brightness-75"
              />
            </div>
            <Searchbox placeholder="Username or Steam64..." />
            {/* <div className="h-0 bg-accent rounded w-full mt-8 opacity-0 flex items-center justify-center text-accent-foreground text-sm font-medium"></div> */}
          </div>
          <div
            className={`h-full flex justify-center items-center space-x-4 ${
              loading ? "" : "w-full"
            }`}
          >
            {leaderboard.map((player, index) => {
              const pfp = profileImages[index];
              return (
                <div
                  key={index}
                  className="group w-36 h-60 bg-secondary/70 border border-primary-foreground/5 cursor-pointer flex flex-col rounded-primary corner-clip-sm"
                  onClick={() => router.push(`/p/${player.playerId}`)}
                >
                  <div className="px-4 pt-4 flex flex-col items-center justify-center">
                    {pfp ? (
                      <img
                        src={profileImages[index]}
                        className="size-20 rounded-primary w-full object-cover corner-clip mx-auto"
                      ></img>
                    ) : (
                      <div className="size-20 bg-neutral-600 corner-clip animate-pulse"></div>
                    )}
                    <p className="text-lg mt-2">{player.username}</p>
                    <p className="text-sm mt-2 text-accent/75">
                      Top {player.placement}
                    </p>
                    <p className="text-2xl">
                      {player.rating} <span className="text-base">RR</span>
                    </p>
                  </div>
                  <div className="mt-auto w-full py-1 shrink-0 flex items-center text-sm justify-center px-4 transition-all bg-secondary-foreground/[0.01] group-hover:bg-secondary-foreground/5">
                    Leaderboard
                  </div>
                </div>
              );
            })}
          </div>
        </Constrict>
      </div>
      <div className="h-full bg-primary w-full">
        <div className="flex justify-center items-start w-full">
          <Extrusion
            className="border-secondary min-w-36"
            cornerLocation={CornerLocation.BottomLeft}
          />
          <Extrusion
            className="border-secondary min-w-36"
            cornerLocation={CornerLocation.BottomRight}
          />
        </div>
        <Constrict className="px-4 py-16">
          <div className="flex w-full space-x-6">
            <HomeStatTable title="Sponsors" buttonHidden>
              <>
                {sponsors.map((sponsor, index) => {
                  return (
                    <div
                      key={index}
                      className="w-full even:bg-seconday/50 border-y border-secondary px-4 h-14 flex items-center justify-start"
                    >
                      <div className="w-5/12 shrink-0 flex items-center justify-start overflow-x-scroll scrollbar-hide">
                        <SponsorImage
                          className="w-8 !h-auto mr-2 shrink-0"
                          sponsor={sponsor.split(" ")[0]}
                        />
                        <p className="text-nowrap">{sponsor}</p>
                      </div>
                      <div className="w-full flex items-center justify-center">
                        <p>{getRandomStat()}%</p>
                      </div>
                      <div className="w-full flex items-center justify-center">
                        <p>{getRandomStat()}%</p>
                      </div>
                      <div className="w-full flex items-center justify-center">
                        <p>{getRandomStat()}</p>
                      </div>
                    </div>
                  );
                })}
              </>
            </HomeStatTable>
            {/* <HomeStatTable title="Team Comps">
              <>
                {sponsors.map((sponsor, index) => {
                  return (
                    <div
                      key={index}
                      className="w-full border-y border-secondary px-4 h-14 flex items-center justify-start"
                    >
                      <div className="w-5/12 shrink-0 flex items-center justify-start overflow-x-scroll scrollbar-hide">
                        <div className="mr-2">
                          <SponsorImage
                            className="w-8 !h-auto shrink-0"
                            sponsor={sponsor.split(" ")[0]}
                          />
                        </div>
                        <p className="text-nowrap">{sponsor}</p>
                      </div>
                      <div className="w-full flex items-center justify-center">
                        <p>{getRandomStat()}%</p>
                      </div>
                      <div className="w-full flex items-center justify-center">
                        <p>{getRandomStat()}%</p>
                      </div>
                      <div className="w-full flex items-center justify-center">
                        <p>{getRandomStat()}</p>
                      </div>
                    </div>
                  );
                })}
              </>
            </HomeStatTable> */}
          </div>
        </Constrict>
      </div>
    </main>
  );
}
