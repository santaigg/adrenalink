export async function GET(req) {
    const LEADERBOARD_URL = "https://wavescan-production.up.railway.app/api/v1/leaderboard/solo_ranked";
    const PLAYER_PROFILE_URL = "https://wavescan-production.up.railway.app/api/v1/player";
    const API_DELAY = 0;

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    async function fetchLeaderboard() {
        try {
            const response = await fetch(LEADERBOARD_URL);
            const data = await response.json();
            return data.leaderboard.slice(0, 1000);
        } catch (error) {
            console.error("Error fetching leaderboard:", error.message);
            return [];
        }
    }

    async function fetchPlayerData(playerId) {
        try {
            const response = await fetch(`${PLAYER_PROFILE_URL}/${playerId}/full_profile`);
            return await response.json();
        } catch (error) {
            console.error(`Error fetching player data (${playerId}):`, error.message);
            return null;
        }
    }

    function analyzeMatches(matches) {
        const stats = { mostUsedSponsor: null, mostDeaths: 0, mostKills: 0 };
        const sponsorCount = {};

        matches.forEach(match => {
            match.player_team.players.forEach(player => {
                const sponsor = player.sponsor_name || "Unknown";
                sponsorCount[sponsor] = (sponsorCount[sponsor] || 0) + 1;

                stats.mostDeaths = Math.max(stats.mostDeaths, player.deaths || 0);
                stats.mostKills = Math.max(stats.mostKills, player.kills || 0);
            });
        });

        stats.mostUsedSponsor = Object.keys(sponsorCount).reduce((a, b) => sponsorCount[a] > sponsorCount[b] ? a : b, null);
        return stats;
    }

    const leaderboard = await fetchLeaderboard();
    if (!leaderboard.length) {
        return Response.json({ error: "No data retrieved from leaderboard." }, { status: 500 });
    }

    const aggregatedData = [];
    for (const player of leaderboard) {
        console.log(`Fetching data for player: ${player.display_name} (${player.id})`);
        const playerData = await fetchPlayerData(player.id);

        if (playerData?.matches?.length) {
            const stats = analyzeMatches(playerData.matches);
            aggregatedData.push({ player: player.display_name, stats });
        } else {
            console.warn(`No matches found for player: ${player.display_name} (${player.id})`);
        }
        await sleep(API_DELAY);
    }

    const globalStats = aggregatedData.reduce(
        (acc, { stats }) => {
            acc.mostDeaths = Math.max(acc.mostDeaths, stats.mostDeaths);
            acc.mostKills = Math.max(acc.mostKills, stats.mostKills);
            acc.sponsorUsage[stats.mostUsedSponsor] = (acc.sponsorUsage[stats.mostUsedSponsor] || 0) + 1;
            return acc;
        },
        { mostDeaths: 0, mostKills: 0, sponsorUsage: {} }
    );

    globalStats.mostUsedSponsor = Object.keys(globalStats.sponsorUsage).reduce(
        (a, b) => globalStats.sponsorUsage[a] > globalStats.sponsorUsage[b] ? a : b,
        null
    );

    return Response.json({ playerStats: aggregatedData, globalStats });
}
