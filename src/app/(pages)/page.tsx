'use client'
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

interface PlayerRow {
  username: string;
  placement: number;
  soloRank: string;
  playerId: string;
  rating: number;
}

export default function Home() {
  const season = "season0"
    const [leaderboard, setLeaderboard] = useState<PlayerRow[]>([]);
  
    useEffect(() => {
      const fetchLeaderboardData = async () => {
        const data = await fetchLeaderboard(season as LeaderboardId);
        setLeaderboard(data);
      };
  
      fetchLeaderboardData();
    }, [season]);


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
      <Constrict className="h-full px-4 flex flex-col gap-8">
        <div className="flex flex-col gap-8 text-primary-foreground">
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
        <div className="flex justify-center gap-x-8 flex-row">
          {leaderboard.slice(0, 3).map((player, index) => (
            <div
              key={player.id} // Assuming each player has a unique ID
              className={`flex flex-col items-center ${
                index === 0
                  ? "order-2" // First object in the middle
                  : index === 1
                  ? "order-1" // Second object on the left
                  : "order-3" // Third object on the right
              }`}
            >
              <div
                className={`hover:-translate-y-2 transition-all ${
                  index === 0 ? "" : "mt-4"
                }`}
              >
                <div
                  className={`w-24 text-input pl-4 py-0.5 flex justify-start items-center ${
                    index === 0
                      ? "bg-amber-500"
                      : index === 1
                      ? "bg-stone-500"
                      : "bg-amber-900"
                  }`}
                  style={{
                    clipPath:
                      "polygon(0 0, calc(100px - 15px) 0%, 100% 15px, 100% 100%, 0% 100%)",
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
                  className="w-52 aspect-[2/3] bg-primary border-secondary border flex flex-col overflow-hidden hover:bg-primary/85 transition-all cursor-pointer"
                  style={{
                    clipPath:
                      "polygon(100% 0%, 0% 0%, 0% 100%, calc(100% - 30px) 100%, 100% calc(100% - 30px))",
                  }}
                >
                  <div className="flex flex-col p-4 w-full">
                    <div className="size-24 corner-clip bg-neutral-600 animate-pulse"></div>
                    <h2 className="mt-2">{player.username}</h2>
                    <h3>{player.rating} RR</h3>
                  </div>
                  <div className="mt-auto bg-secondary hover:bg-muted/50 transition-all w-full py-4 flex justify-center items-center cursor-pointer">
                    <p>Leaderboard</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Constrict>
    </main>
  );
}
