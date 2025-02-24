"use client";
import { useState, useEffect } from "react";
import { fetchLeaderboard } from "../utils/fetch/fetchLeaderboard";
import type { LeaderboardId } from "../utils/types/leaderboard";

import BackgroundImage from "../components/cosmetic/BackgroundImage";
import BackgroundImageData from "../assets/images/background/background-spectators.png";
import { Searchbox } from "../components/input/Searchbox";
import Constrict from "../components/layout/Constrict";
import Image from "next/image";
import SpectreLogoImage from "../assets/images/brand/spectre-logo.png";
import NoticeBanner from "../components/information/NoticeBanner";

import {
  PlayerProfile,
  PlayerSteamProfile,
} from "../utils/types/wavescan.types";
import noStoreFetch from "@/app/utils/fetch/noStoreFetch";

import { useRouter } from "next/navigation";
import Extrusion, { CornerLocation } from "../components/cosmetic/Extrusion";

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
    "Phantom Industries",
    "Eclipse Syndicate",
    "Oblivion Core",
    "Shadow Nexus",
    "Spectral Union",
  ];

  const getRandomStat = () => (Math.random() * 100).toFixed(2);

  return (
    <main className="h-full">
      {/* <NoticeBanner
        className="text-center"
        noticeTitle="Santai.GG \\ Flashpoint"
        noticeBottomText="Brand new website, polished experience."
        ver={2}
      /> */}
      <div className="w-full border-b border-secondary-foreground/15 h-[30rem]">
        <BackgroundImage
          className="max-h-full overflow-hidden blur-md object-top"
          image={BackgroundImageData}
        />
        <Constrict className="h-full flex items-start justify-start space-x-8">
          <div className={`w-1/2 h-full flex justify-center flex-col mx-auto`}>
            <div className="flex flex-row">
              <h2 className="mb-1 text-primary-foreground">Player Search</h2>
              <Image
                src={SpectreLogoImage}
                alt="Spectre Divide wordmark."
                className="h-6 w-auto ml-auto mt-auto mb-2 brightness-75"
              />
            </div>
            <Searchbox placeholder="Username or Steam64..." />
            <div className="h-8 bg-accent rounded w-full mt-8 opacity-0 flex items-center justify-center text-accent-foreground text-sm font-medium"></div>
          </div>
          <div
            className={`h-full flex justify-center items-center space-x-4 ${
              loading ? "" : "w-1/2"
            }`}
          >
            {leaderboard.map((player, index) => {
              const pfp = profileImages[index];
              return (
                <div className="w-36 h-56 bg-secondary/70 border border-primary-foreground/5 cursor-pointer flex flex-col items-center rounded-primary px-4 py-4">
                  {pfp ? (
                    <img
                      src={profileImages[index]}
                      className="size-20 rounded-primary w-full object-cover corner-clip mx-auto"
                    ></img>
                  ) : (
                    <div className="size-20 bg-neutral-600 corner-clip animate-pulse"></div>
                  )}
                  <p className="text-lg mt-2">{player.username}</p>
                  <p className="text-2xl mt-2">{player.rating}</p>
                </div>
              );
            })}
          </div>
        </Constrict>
      </div>
      <div className="py-16 w-full bg-primary">
        <Constrict>
          <div className="flex flex-col items-start justify-start">
            <Extrusion
              className="border-secondary min-w-[10%] rounded-tl"
              cornerLocation={CornerLocation.TopRight}
            />
            <div className="w-1/2 rounded border border-secondary rounded-tl-none flex flex-col">
              <div className="p-4">
                <h3>Statistics</h3>
              </div>
              <div className="w-full bg-secondary/50 border-y border-secondary px-4 h-10 flex items-center justify-start">
                <div className="w-5/12 shrink-0 flex items-center justify-start">
                  <p>Sponsor</p>
                </div>
                <div className="w-full flex items-center justify-center">
                  <p>Win %</p>
                </div>
                <div className="w-full flex items-center justify-center">
                  <p>Pick %</p>
                </div>
                <div className="w-full flex items-center justify-center">
                  <p>K/D</p>
                </div>
              </div>
              {sponsors.map((sponsor, index) => (
                <div
                  key={index}
                  className="w-full even:bg-secondary/50 border-y border-secondary px-4 h-12 flex items-center justify-start"
                >
                  <div className="w-5/12 shrink-0 flex items-center justify-start">
                    <p>{sponsor}</p>
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
              ))}
            </div>
          </div>
        </Constrict>
      </div>
    </main>
  );
}

// <Constrict className="h-full px-4 flex flex-col sm:flex-row gap-8">
//   <div className="flex sm:flex-1 flex-col gap-8 text-primary-foreground">
//     <div>
//       <div className="flex flex-row">
//         <h2 className="mb-1 text-primary-foreground">Player Search</h2>
//         <Image
//           src={SpectreLogoImage}
//           alt="Spectre Divide wordmark."
//           className="h-6 w-auto ml-auto mt-auto mb-2 brightness-75"
//         />
//       </div>
//       <Searchbox placeholder="Username or Steam64..." />
//     </div>
//     {/* <div className="h-full p-4 bg-primary">Real time logs.</div> */}
//   </div>
//   <div className="flex flex-1 justify-start gap-y-4 flex-col">
//     <div className="h-6">
//       <h2 className="mb-1 text-primary-foreground">Top 3</h2>
//     </div>
//     {leaderboard.map((player, index) => {
//       const pfp = profileImages[index];
//       return (
//         <div
//           key={player.playerId}
//           className={`flex flex-col items-center w-full`}
//         >
//           {/* whole thing */}
//           <div
//             className={`hover:-translate-y-2 transition-all w-full ${
//               index === 0 ? "" : ""
//             }`}
//           >
//             {/* number on top */}
//             <div
//               className={`w-48 rounded-tl-primary text-input pl-4 py-0.5 flex justify-start items-center ${
//                 index === 0
//                   ? "bg-amber-500"
//                   : index === 1
//                   ? "bg-stone-500"
//                   : "bg-amber-900"
//               }`}
//               style={{
//                 clipPath:
//                   "polygon(0 0, calc(100% - 15px) 0%, 100% 15px, 100% 100%, 0% 100%)",
//               }}
//             >
//               <p
//                 className={`${
//                   index === 0
//                     ? "text-amber-100"
//                     : index === 1
//                     ? "text-stone-100"
//                     : "text-amber-100"
//                 }`}
//               >
//                 #{index + 1}
//               </p>
//             </div>
//             {/* main body */}
//             <div
//               className="w-full rounded-tr-primary rounded-bl-primary bg-primary border-secondary border-y flex flex-col overflow-hidden hover:bg-primary/85 transition-all cursor-pointer"
//               style={{
//                 clipPath:
//                   "polygon(100% 0%, 0% 0%, 0% 100%, calc(100% - 30px) 100%, 100% calc(100% - 30px))",
//               }}
//               onClick={() => router.push(`/p/${player.playerId}`)}
//             >
//               <div className="flex gap-x-4 items-center justify p-4 w-full">
//                 {pfp ? (
//                   <img
//                     src={profileImages[index]}
//                     className="size-20 corner-clip"
//                   ></img>
//                 ) : (
//                   <div className="size-20 bg-neutral-600 corner-clip animate-pulse"></div>
//                 )}

//                 <div className="flex flex-col items-start justify-center">
//                   <h2 className="">{player.username}</h2>
//                   <h3 className="">{player.rating} RR</h3>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       );
//     })}
//     <button
//       className="bg-primary hover:bg-secondary/65 transition-all py-2 hover:text-accent flex justify-center items-center"
//       style={{
//         clipPath:
//           "polygon(15px 0%, 0% 15px, 0% 100%, calc(100% - 15px) 100%, 100% calc(100% - 15px), 100% 0%)",
//       }}
//       onClick={() => router.push(`/leaderboard`)}
//     >
//       Leaderboard
//     </button>
//   </div>
// </Constrict>;
