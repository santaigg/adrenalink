export interface PlayerProfile {
  id: string;
  name: string;
  discriminator?: string;
  steam_profile: {
    id?: string;
    avatar?: {
      small: string;
      medium: string;
      large: string;
      hash: string;
    };
    url?: string;
  };
  stats: {
    rank_rating?: number;
    current_solo_rank?: number;
    highest_team_rank?: number;
    rank_rating_last_updated?: string | null;
  };
}

export interface Match_Team {
  id: string;
  team_id: string;
  team_index: number;
  rounds_won: number;
  rounds_played: number;
  xp_earned: number;
  fans_earned: number;
  used_team_rank: boolean;
  team_rank: number;
  previous_team_rank: number;
  num_ranked_matches: number;
  ranked_rating: number;
  ranked_rating_delta: number;
  previous_ranked_rating: number;
  is_full_party: boolean;
  players: {
    id: string;
    name: string;
    kills: number;
    assists: number;
    deaths: number;
    damage_dealt: number;
    teammate_index: number;
    sponsor_id: string;
    sponsor_name: string;
    ranked_rating: number;
    previous_ranked_rating: number;
    ranked_rating_delta: number;
    rank_id: string;
    previous_rank_id: string;
    banner_id: string;
    crew_score: number;
    crew_id: string;
    team_id: string;
    division_id: string;
    num_ranked_matches: number;
    is_anonymous: boolean;
  }[];
}

export interface PlayerMatch {
  id: string;
  region: string;
  is_ranked: boolean;
  queue_name: string;
  map: string;
  game_mode: string;
  surrended_team: number;
  is_abandoned: boolean;
  match_date: Date;
  rounds: number;
  winner: -1 | 0 | 1;
  player_team: Match_Team;
  opponent_team: Match_Team | null;
}

export interface PlayerExtendedStats {
  total_kills: number;
  total_assists: number;
  total_deaths: number;
  total_damage_dealt: number;
  total_wins: number;
  total_losses: number;
  total_draws: number;
  total_rounds_played: number;
  top_damage_dealt: number;
  top_kills: number;
  top_assists: number;
  top_deaths: number;
  average_win_percentage: number;
  average_damage_per_round: number;
  average_kills_per_round: number;
  average_assists_per_round: number;
  average_deaths_per_round: number;
}

// Update the SeasonStats interface
export interface SeasonStats extends PlayerExtendedStats {
  season: string;
  top_rank_id: string;
  top_rank_rating: number;
}

export interface MapStats extends PlayerExtendedStats {
  map: string;
}

export interface SponsorStats extends PlayerExtendedStats {
  sponsor_id: string;
  sponsor_name: string;
}

export interface PlayerFullProfile extends PlayerProfile {
  matches: PlayerMatch[];
  extended_stats?: {
    season_stats: { [key: string]: SeasonStats };
    last_20_matches_avg_stats: PlayerExtendedStats;
    map_stats: { [key: string]: PlayerExtendedStats };
    sponsor_stats: { [key: string]: SponsorStats };
  };
}

export interface SteamProfile {
  steamID: string;
  avatar: Avatar;
  url: string;
  visible: boolean;
  personaState: number;
  personaStateFlags: number;
  allowsComments: boolean;
  nickname: string;
  createdTimestamp: number;
  primaryGroupID: string;
  countryCode: string;
}

export interface Avatar {
  small: string;
  medium: string;
  large: string;
  hash: string;
}

export interface PlayerSteamProfile {
  success: boolean;
  steam_profile: SteamProfile;
}
