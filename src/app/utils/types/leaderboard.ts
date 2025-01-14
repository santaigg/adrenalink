import noStoreFetch from "../fetch/noStoreFetch";
import type { SoloPayload } from "./payload";
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
				"https://wavescan-production.up.railway.app/api/v1/leaderboard/solo_ranked",
			);
			const data = await res.json() as {
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
} satisfies Record<string, Leaderboard>;
