import noStoreFetch from "../fetch/noStoreFetch";
import type PlayerStats from "./playerStats";
import getSoloRankFromNumber from "./rank";

export type Leaderboard = {
  enabled: boolean;

  id: string;
  name: string;

  fetchData: () => Promise<any>;
  transformData?: (data: any[]) => any[];
};

export type LeaderboardId = keyof typeof leaderboards;
export const defaultLeaderboardId: LeaderboardId = "season0";
export const leaderboardIdsToPrefetch: LeaderboardId[] = ["season0"];

export const leaderboards = {
  season0: {
    enabled: true,

    id: "season0",
    name: "Season 0",

    fetchData: async () => {
      const res = await noStoreFetch(
        "https://wavescan-production.up.railway.app/api/v1/leaderboard/solo_ranked"
      );
      const data = (await res.json()) as {
        leaderboard: {
          id: string;
          display_name: string;
          current_solo_rank: number;
          rank_rating: number;
          rank: number;
        }[];
      };

      const playerStats = data.leaderboard.map((d) => {
        return {
          username: d.display_name,
          placement: d.rank,
          soloRank: getSoloRankFromNumber(d.current_solo_rank),
          playerId: d.id,
          rating: d.rank_rating,
        };
      });
      return playerStats as unknown as PlayerStats[];
    },
  },
  season1: {
    enabled: true,

    id: "season0",
    name: "Season 0",

    fetchData: async () => {
      return [
        {
          username: "Kr1stuX",
          placement: 1,
          soloRank: "Bronze 1",
          playerId: "gosaofdpjas",
          rating: 1,
        },
        {
          username: "SilasTares",
          placement: 2,
          soloRank: "Bronze 1",
          playerId: "ABC123",
          rating: 0.9,
        },
        {
          username: "s1player3",
          placement: 3,
          soloRank: "Champion",
          playerId: "GHI789",
          rating: 6895,
        },
        {
          username: "s1player4",
          placement: 4,
          soloRank: "Champion",
          playerId: "JKL012",
          rating: 6702,
        },
        {
          username: "s1player5",
          placement: 5,
          soloRank: "Champion",
          playerId: "MNO345",
          rating: 6550,
        },
      ];
    },
  },
} satisfies Record<string, Leaderboard>;
