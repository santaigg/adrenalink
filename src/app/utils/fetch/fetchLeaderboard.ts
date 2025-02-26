import { leaderboards } from "../types/leaderboard";

export async function fetchLeaderboard(season: number) {
	if (season < 0) {
		throw new Error("Season must be a non-negative number.")
	}
	const leaderboard = leaderboards[season];
	if (!leaderboard) {
		throw new Error(`Leaderboard from season ${season} not found.`)
	}

	const data = await leaderboard.fetchData();

	// If the leaderboard has a transformData function, use it and return the transformed data
	if ("transformData" in leaderboard) {
		// @ts-ignore TS doesn't know what this funcion is because it's not used at times
		const transformedData = leaderboard.transformData(data);
		return transformedData;
	}

	return data;
}