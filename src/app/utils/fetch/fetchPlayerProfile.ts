import noStoreFetch from "../fetch/noStoreFetch";
import { PlayerFullProfile } from "../types/wavescan.types";

export async function fetchPlayerProfile(playerId: string): Promise<PlayerFullProfile | null> {
    try {
        const response = await noStoreFetch(
          `https://wavescan-production.up.railway.app/api/v1/player/${playerId}/full_profile`
        );
    
        if (!response.ok) {
          console.error(`Failed to fetch player profile: ${response.statusText}`);
          return null;
        }
    
        const data: PlayerFullProfile = await response.json();
        return data;
      } catch (error) {
        console.error("Error fetching player profile:", error);
        return null;
    }
}