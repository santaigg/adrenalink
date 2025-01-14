import type { LeaderboardId } from "../types/leaderboard";
import { leaderboards } from "../types/leaderboard";

export async function fetchLeaderboard(leaderboardId: LeaderboardId) {
	const leaderboard = leaderboards[leaderboardId];
	const data = await leaderboard.fetchData();

	// If the leaderboard has a transformData function, use it and return the transformed data
	if ("transformData" in leaderboard) {
		// @ts-ignore TS doesn't know what this funcion is because it's not used at times
		const transformedData = leaderboard.transformData(data);
		return transformedData;
	}

	return data;
}
