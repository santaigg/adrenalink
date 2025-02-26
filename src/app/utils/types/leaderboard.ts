import noStoreFetch from "../fetch/noStoreFetch";
import type PlayerStats from "./playerStats";
import getSoloRankFromNumber from "./rank";

export type Leaderboard = {
  enabled: boolean;

  id: number;
  name: string;

  fetchData: () => Promise<any>;
  transformData?: (data: any[]) => any[];
};

export const defaultLeaderboardId: number = 0;
export const leaderboardIdsToPrefetch: number[] = [0];

export const leaderboards: Record<number, Leaderboard> = {
  0: {
    enabled: true,

    id: 0,
    name: "Season 0",

    fetchData: async () => {
      const res = await noStoreFetch(
        "https://wavescan-production.up.railway.app/api/v1/leaderboard/solo_ranked?season=0"
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
  1: {
    enabled: true,

    id: 1,
    name: "Season 1",

    fetchData: async () => {
      const res = await noStoreFetch(
        "https://wavescan-production.up.railway.app/api/v1/leaderboard/solo_ranked?season=1"
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
} satisfies Record<number, Leaderboard>;
