'use client'
import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react';

import BackgroundImage from "../../../components/cosmetic/BackgroundImage";
import BackgroundImageData from "../../../assets/images/background/background-spectators.png";
import Constrict from "@/app/components/layout/Constrict";

import { fetchPlayerProfile } from '@/app/utils/fetch/fetchPlayerProfile';
import { PlayerFullProfile } from '@/app/utils/types/wavescan.types';
import getSoloRankFromNumber from '@/app/utils/types/rank';

export default function PlayerProfile() {
  const params = useParams<{ tag: string; slug: string }>()
  const playerId = params.slug

  const [playerProfile, setPlayerProfile] = useState<PlayerFullProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true)
  const [status, setStatus] = useState<string>("")

  useEffect(() => {
    if (!playerId) return;

    const fetchData = async () => {
      setLoading(true);
      setStatus("Fetching...")
      const data = await fetchPlayerProfile(playerId);
      setStatus("Writing...")
      setPlayerProfile(data);
      setStatus("Done!")
      setLoading(false); 
      setStatus("")
    }

    fetchData()
  }, [playerId])
  return (
    <main>
      <BackgroundImage image={BackgroundImageData} />

      <Constrict className="flex flex-col">
        <div className="flex gap-x-2">        
          <p className="">{playerId}</p>
          <p className="">{status}</p>
          </div>

        {loading ? (
          <p>Loading player profile...</p>
        ) : playerProfile ? (
          <>
            <h1>{playerProfile.name}</h1>
            {playerProfile.steam_profile?.avatar?.large && (
              <img
                src={playerProfile.steam_profile.avatar.large}
                alt={`${playerProfile.name}'s avatar`}
                className="w-32 h-32 rounded-full"
              />
            )}
            <p>Rank Rating: {playerProfile.stats.rank_rating || "N/A"}</p>
            <p>Current Solo Rank: {getSoloRankFromNumber(playerProfile.stats.current_solo_rank) || "N/A"}</p>
            <p>ADR: {playerProfile.extended_stats?.last_20_matches_avg_stats.average_damage_per_round}</p>
            <p>Winrate: {playerProfile.extended_stats?.last_20_matches_avg_stats.average_win_percentage}</p>
            <p>Last 20W/L: {playerProfile.extended_stats?.last_20_matches_avg_stats.total_wins} / {playerProfile.extended_stats?.last_20_matches_avg_stats.total_losses}</p>
            <p>Winrate: {playerProfile.extended_stats?.last_20_matches_avg_stats.average_win_percentage}%</p>
            <div className="flex gap-x-4">
            {/* Display Sponsor Stats */}
            {playerProfile.extended_stats?.sponsor_stats && (
              <div className="mt-4">
                <h2>Sponsor Stats</h2>
                <ul>
                  {Object.entries(playerProfile.extended_stats.sponsor_stats).map(
                    ([sponsorId, stats]) => (
                      <li key={sponsorId} className="mb-2">
                        <p><strong>Sponsor Name:</strong> {stats.sponsor_name}</p>
                        <p><strong>Total Kills:</strong> {stats.total_kills}</p>
                        <p><strong>Total Assists:</strong> {stats.total_assists}</p>
                        <p><strong>Total Deaths:</strong> {stats.total_deaths}</p>
                        <p><strong>Total Damage Dealt:</strong> {stats.total_damage_dealt}</p>
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}
            {/* Display Map Stats */}
            {playerProfile.extended_stats?.map_stats && (
              <div className="mt-4">
                <h2>Map Stats</h2>
                <ul>
                  {Object.entries(playerProfile.extended_stats.map_stats).map(
                    ([map, stats]) => (
                      <li key={map} className="mb-2">
                        <p><strong>Map:</strong> {map}</p>
                        <p><strong>Total Kills:</strong> {stats.total_kills}</p>
                        <p><strong>Total Assists:</strong> {stats.total_assists}</p>
                        <p><strong>Total Deaths:</strong> {stats.total_deaths}</p>
                        <p><strong>Total Damage Dealt:</strong> {stats.total_damage_dealt}</p>
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}
            {/* Display Season Stats */}
            {playerProfile.extended_stats?.season_stats && (
              <div className="mt-4">
                <h2>Season Stats</h2>
                <ul>
                  {Object.entries(playerProfile.extended_stats.season_stats).map(
                    ([season, stats]) => (
                      <li key={season} className="mb-2">
                        <p><strong>Season:</strong> {season}</p>
                        <p><strong>Total Kills:</strong> {stats.total_kills}</p>
                        <p><strong>Total Assists:</strong> {stats.total_assists}</p>
                        <p><strong>Total Deaths:</strong> {stats.total_deaths}</p>
                        <p><strong>Total Damage Dealt:</strong> {stats.total_damage_dealt}</p>
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}
            {/* Display Match Stats */}
            {playerProfile.matches && (
              <div className="mt-4">
                <h2>Match Stats</h2>
                <ul>
                  {Object.entries(playerProfile.matches).map(
                    ([id, match]) => (
                      <li key={id} className="mb-2">
                        <p><strong>Winner:</strong>{match.winner}</p>
                        <p><strong>Player's team:</strong>{match.player_team.team_id}</p>
                        <p><strong>Op Team:</strong>{match.opponent_team?.team_id}</p>
                        <p><strong>Region:</strong> {match.region}</p>
                        <p><strong>Ranked?:</strong> {match.is_ranked}</p>
                        <p><strong>Map:</strong> {match.map}</p>
                        <p><strong>Game mode:</strong> {match.game_mode}</p>
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}
            </div>
          </>
        ) : (
          <p>Player profile not found.</p>
        )}
      </Constrict>
    </main>
  );
}
