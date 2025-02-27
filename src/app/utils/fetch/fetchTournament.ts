import noStoreFetch from "./noStoreFetch";

export interface PlayerStats {
  id: string;
  name: string;
  handle: string;
  sponsor: string;
  kills: number;
  deaths: number;
  assists: number;
  kd: number;
  team?: string;
  matchesPlayed?: number;
  totalRounds?: number;
  avatarUrl?: string;
  socialLink?: string;
}

export interface MatchStats {
  id: string;
  team1: {
    name: string;
    score: number;
    players: PlayerStats[];
  };
  team2: {
    name: string;
    score: number;
    players: PlayerStats[];
  };
  status: "upcoming" | "live" | "completed";
  round: string;
  map: string;
  scheduledTime?: string; // Optional scheduled time for upcoming matches
}

export interface TournamentData {
  name: string;
  streamUrl: string;
  matches: MatchStats[];
}

// API base URL
const API_BASE_URL = "https://wavescan-production.up.railway.app/api/v1/tournament";

// Helper function to create a default player
const createDefaultPlayer = (id: string, name: string, handle: string, sponsor: string): PlayerStats => ({
  id,
  name,
  handle,
  sponsor,
  kills: 0,
  deaths: 0,
  assists: 0,
  kd: 0,
  avatarUrl: `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 70)}.jpg`,
  socialLink: `https://twitter.com/${handle.toLowerCase()}`
});

// Helper function to create a default match
export const createDefaultMatch = (id: string, round: string): MatchStats => ({
  id,
  team1: {
    name: "TBD Team 1",
    score: 0,
    players: [
      createDefaultPlayer(`${id}_t1p1`, "Player 1", "Player1", "Monark"),
      createDefaultPlayer(`${id}_t1p2`, "Player 2", "Player2", "Vector"),
      createDefaultPlayer(`${id}_t1p3`, "Player 3", "Player3", "Bloom"),
    ]
  },
  team2: {
    name: "TBD Team 2",
    score: 0,
    players: [
      createDefaultPlayer(`${id}_t2p1`, "Player 1", "Player1", "Ghostlink"),
      createDefaultPlayer(`${id}_t2p2`, "Player 2", "Player2", "Morrgen"),
      createDefaultPlayer(`${id}_t2p3`, "Player 3", "Player3", "Umbra"),
    ]
  },
  status: "upcoming",
  round,
  map: "",
  scheduledTime: "TBD"
});

// This function fetches tournament data from the API
export async function fetchTournament(tournamentId: string = 'optic-invitational'): Promise<TournamentData> {
  try {
    const response = await noStoreFetch(`${API_BASE_URL}?id=${tournamentId}`);
    const data = await response.json();
    
    // Check if the response has the expected structure
    if (data && typeof data === 'object') {
      // If the API returns data in a nested structure (e.g., { data: { ... } })
      if (data.data && typeof data.data === 'object' && Array.isArray(data.data.matches)) {
        return data.data;
      }
      
      // If the API returns data directly but might be missing matches
      if (!Array.isArray(data.matches)) {
        console.error("API response missing matches array:", data);
        // Return a safe default structure
        return {
          name: data.name || "Tournament",
          streamUrl: data.streamUrl || "https://www.youtube.com/embed/gUxWaHvGAuU?autoplay=1&mute=1",
          matches: []
        };
      }
      
      // If the data has the expected structure, return it directly
      return data;
    }
    
    throw new Error("Invalid API response format");
  } catch (error) {
    console.error("Error fetching tournament data:", error);
    // Return a safe default structure in case of error
    return {
      name: "Tournament",
      streamUrl: "https://www.youtube.com/embed/gUxWaHvGAuU?autoplay=1&mute=1",
      matches: []
    };
  }
}

// Function to authenticate admin
export async function authenticateAdmin(password: string): Promise<{ success: boolean, error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}?action=auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });
    return await response.json();
  } catch (error) {
    console.error("Error authenticating admin:", error);
    return { success: false, error: 'Authentication failed' };
  }
}

// Function to logout admin
export async function logoutAdmin(): Promise<{ success: boolean }> {
  try {
    const response = await fetch(`${API_BASE_URL}?action=logout`, {
      method: 'POST'
    });
    return await response.json();
  } catch (error) {
    console.error("Error logging out admin:", error);
    return { success: false };
  }
}

// Function to update tournament data
export async function updateTournament(data: TournamentData, tournamentId: string = 'default'): Promise<TournamentData> {
  try {
    const response = await fetch(`${API_BASE_URL}?id=${tournamentId}&action=update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await response.json();
    return result.data || result;
  } catch (error) {
    console.error("Error updating tournament data:", error);
    throw error;
  }
}

// Function to add a new match
export async function addMatch(match: MatchStats, tournamentId: string = 'default'): Promise<TournamentData> {
  try {
    const response = await fetch(`${API_BASE_URL}?id=${tournamentId}&action=add-match`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(match)
    });
    const result = await response.json();
    return result.data || result;
  } catch (error) {
    console.error("Error adding match:", error);
    throw error;
  }
}

// Function to update a match
export async function updateMatch(matchId: string, updatedMatch: MatchStats, tournamentId: string = 'default'): Promise<TournamentData> {
  try {
    const response = await fetch(`${API_BASE_URL}?id=${tournamentId}&action=update-match`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ matchId, match: updatedMatch })
    });
    const result = await response.json();
    return result.data || result;
  } catch (error) {
    console.error("Error updating match:", error);
    throw error;
  }
}

// Function to delete a match
export async function deleteMatch(matchId: string, tournamentId: string = 'default'): Promise<TournamentData> {
  try {
    const response = await fetch(`${API_BASE_URL}?id=${tournamentId}&action=delete-match`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ matchId })
    });
    const result = await response.json();
    return result.data || result;
  } catch (error) {
    console.error("Error deleting match:", error);
    throw error;
  }
}

// Function to create a new match
export async function createMatch(round: string, tournamentId: string = 'default'): Promise<{ success: boolean, tournament?: TournamentData, newMatch?: MatchStats, error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}?id=${tournamentId}&action=create-match`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ round })
    });
    return await response.json();
  } catch (error) {
    console.error("Error creating match:", error);
    return { success: false, error: 'Failed to create match' };
  }
}

// Function to reset tournament data to default (for testing)
export async function resetTournamentData(tournamentId: string = 'default'): Promise<TournamentData> {
  try {
    const response = await fetch(`${API_BASE_URL}?id=${tournamentId}&action=reset`, {
      method: 'POST'
    });
    const result = await response.json();
    return result.data || result;
  } catch (error) {
    console.error("Error resetting tournament data:", error);
    throw error;
  }
} 