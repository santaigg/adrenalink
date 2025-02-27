"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Constrict from "@/app/components/layout/Constrict";
import BackgroundImage from "@/app/components/cosmetic/BackgroundImage";
import BackgroundImageData from "@/app/assets/images/background/background-spectators.png";
import Extrusion, { CornerLocation } from "@/app/components/cosmetic/Extrusion";
import NoticeBanner from "@/app/components/information/NoticeBanner";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";
import {
  fetchTournament,
  TournamentData,
  MatchStats,
  PlayerStats,
} from "@/app/utils/fetch/fetchTournament";
import OpticGamingLogo from "@/app/components/cosmetic/OpticGamingLogo";
import { SponsorImage } from "@/app/components/cosmetic/SponsorImageFromString";
import Image from "next/image";

export default function TournamentPage() {
  const router = useRouter();
  const [tournamentData, setTournamentData] = useState<TournamentData | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [willAutoRefresh, setWillAutoRefresh] = useState<boolean>(false);
  const [selectedMatch, setSelectedMatch] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"overview" | "players">(
    "overview"
  );
  const [error, setError] = useState<string | null>(null);
  const [isMaximized, setIsMaximized] = useState<boolean>(false);
  const [mapImages, setMapImages] = useState<{ [key: string]: string }>({});
  const [overallPlayerStats, setOverallPlayerStats] = useState<PlayerStats[]>([]);
  const [tournamentWinner, setTournamentWinner] = useState<string | null>(null);

  // Function to load tournament data
  const loadTournamentData = async (isRefresh: boolean = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      }

      const data = await fetchTournament("optic-invitational");

      // Validate the data structure
      if (!data || !Array.isArray(data.matches)) {
        throw new Error("Invalid tournament data format");
      }

      setTournamentData(data);

      // Only set the selected match if it's not a refresh or if the currently selected match doesn't exist anymore
      if (
        !isRefresh ||
        !data.matches.find((match) => match.id === selectedMatch)
      ) {
        if (data.matches.length > 0) {
          // Try to find a live match first
          const liveMatch = data.matches.find(
            (match) => match.status === "live"
          );
          if (liveMatch) {
            setSelectedMatch(liveMatch.id);
          } else {
            // Otherwise, use the first match
            setSelectedMatch(data.matches[0].id);
          }
        }
      }

      setError(null);
    } catch (error) {
      console.error("Failed to load tournament data:", error);
      setError("Failed to load tournament data. Please try again later.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Calculate overall player stats and determine tournament winner
  useEffect(() => {
    if (tournamentData && tournamentData.matches) {
      // Create a map to track player stats across all matches
      const playerStatsMap = new Map<string, PlayerStats & { 
        matchesPlayed: number; 
        totalRounds: number;
        matchIds: Set<string>; // Track unique match IDs to prevent double-counting
      }>();
      
      // Process all completed matches
      const completedMatches = tournamentData.matches.filter(match => match.status === "completed");
      
      // Track team wins to determine tournament winner
      const teamWins = new Map<string, number>();
      
      completedMatches.forEach(match => {
        // Count team wins
        if (match.team1.score > match.team2.score) {
          teamWins.set(match.team1.name, (teamWins.get(match.team1.name) || 0) + 1);
        } else if (match.team2.score > match.team1.score) {
          teamWins.set(match.team2.name, (teamWins.get(match.team2.name) || 0) + 1);
        }
        
        // Calculate total rounds in this match
        const totalRounds = match.team1.score + match.team2.score;
        
        // Process team 1 players
        match.team1.players.forEach(player => {
          // Use player name as the key, fallback to handle if name is missing
          // normalize to lowercase for case-insensitive matching
          const playerName = player.name || player.handle;
          const playerKey = playerName ? playerName.toLowerCase().trim() : `player-${player.id}`;
          
          if (!playerStatsMap.has(playerKey)) {
            playerStatsMap.set(playerKey, {
              ...player,
              // Ensure name is set (use handle if name is missing)
              name: playerName,
              team: match.team1.name,
              kills: 0,
              deaths: 0,
              assists: 0,
              kd: 0,
              matchesPlayed: 0,
              totalRounds: 0,
              matchIds: new Set<string>() // Initialize empty set to track match IDs
            });
          }
          
          const existingStats = playerStatsMap.get(playerKey)!;
          
          // Only count this match if we haven't seen it before for this player
          if (!existingStats.matchIds.has(match.id)) {
            existingStats.matchIds.add(match.id);
            existingStats.matchesPlayed = existingStats.matchIds.size; // Update count based on set size
            existingStats.totalRounds += totalRounds;
          }
          
          existingStats.kills += player.kills;
          existingStats.deaths += player.deaths;
          existingStats.assists += player.assists;
          existingStats.kd = existingStats.deaths > 0 
            ? parseFloat((existingStats.kills / existingStats.deaths).toFixed(2)) 
            : existingStats.kills;
          
          playerStatsMap.set(playerKey, existingStats);
        });
        
        // Process team 2 players
        match.team2.players.forEach(player => {
          // Use player name as the key, fallback to handle if name is missing
          // normalize to lowercase for case-insensitive matching
          const playerName = player.name || player.handle;
          const playerKey = playerName ? playerName.toLowerCase().trim() : `player-${player.id}`;
          
          if (!playerStatsMap.has(playerKey)) {
            playerStatsMap.set(playerKey, {
              ...player,
              // Ensure name is set (use handle if name is missing)
              name: playerName,
              team: match.team2.name,
              kills: 0,
              deaths: 0,
              assists: 0,
              kd: 0,
              matchesPlayed: 0,
              totalRounds: 0,
              matchIds: new Set<string>() // Initialize empty set to track match IDs
            });
          }
          
          const existingStats = playerStatsMap.get(playerKey)!;
          
          // Only count this match if we haven't seen it before for this player
          if (!existingStats.matchIds.has(match.id)) {
            existingStats.matchIds.add(match.id);
            existingStats.matchesPlayed = existingStats.matchIds.size; // Update count based on set size
            existingStats.totalRounds += totalRounds;
          }
          
          existingStats.kills += player.kills;
          existingStats.deaths += player.deaths;
          existingStats.assists += player.assists;
          existingStats.kd = existingStats.deaths > 0 
            ? parseFloat((existingStats.kills / existingStats.deaths).toFixed(2)) 
            : existingStats.kills;
          
          playerStatsMap.set(playerKey, existingStats);
        });
      });
      
      // Debug: Log player match counts
      console.log("Player match counts:");
      playerStatsMap.forEach((stats, key) => {
        console.log(`${stats.name || stats.handle} (${key}): ${stats.matchesPlayed} matches, IDs: ${Array.from(stats.matchIds).join(', ')}`);
      });
      
      // Convert map to array, filter for players with at least 3 matches, and sort by kills
      const overallStats = Array.from(playerStatsMap.values())
        .filter(player => player.matchesPlayed >= 3)
        .sort((a, b) => b.kills - a.kills || b.kd - a.kd);
      
      setOverallPlayerStats(overallStats);
      
      // Determine tournament winner (team with most wins)
      if (teamWins.size > 0) {
        let maxWins = 0;
        let winner = null;
        
        teamWins.forEach((wins, team) => {
          if (wins > maxWins) {
            maxWins = wins;
            winner = team;
          }
        });
        
        setTournamentWinner(winner);
      }
    }
  }, [tournamentData]);

  // Initial load
  useEffect(() => {
    loadTournamentData();
  }, []);

  // Set up automatic refresh every 30 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      // Start animation 5 seconds before refresh
      setWillAutoRefresh(true);
      setTimeout(() => {
        setWillAutoRefresh(false);
        loadTournamentData(true);
      }, 1500);
    }, 30000);

    // Cleanup interval on component unmount
    return () => {
      clearInterval(intervalId);
      setWillAutoRefresh(false);
    };
  }, [selectedMatch]); // Include selectedMatch in dependencies to preserve selection state

  // Handle manual refresh
  const handleRefresh = () => {
    loadTournamentData(true);
  };

  // Safely access the current match
  const currentMatch =
    tournamentData?.matches && selectedMatch
      ? tournamentData.matches.find((match) => match.id === selectedMatch)
      : undefined;

  // Get all players from the current match with safe access
  const allPlayers = currentMatch
    ? [
        ...(currentMatch.team1?.players?.map((player) => ({
          ...player,
          team: currentMatch.team1.name,
        })) || []),
        ...(currentMatch.team2?.players?.map((player) => ({
          ...player,
          team: currentMatch.team2.name,
        })) || []),
      ]
    : [];

  // Sort players by kills for the leaderboard
  const sortedPlayers = [...allPlayers].sort((a, b) => b.kills - a.kills);

  // Function to open player social media in a new tab
  const openSocialMedia = (socialLink?: string) => {
    if (socialLink) {
      window.open(socialLink, "_blank");
    }
  };

  // Add effect to load map images when currentMatch changes
  useEffect(() => {
    if (currentMatch?.map) {
      const loadMapImage = async () => {
        try {
          const image = await import(
            `@/app/assets/images/map-previews/${currentMatch.map}_800x800.webp`
          );
          setMapImages((prev) => ({
            ...prev,
            [currentMatch.map]: image.default.src,
          }));
        } catch (error) {
          console.error("Failed to load map image:", error);
        }
      };

      if (!mapImages[currentMatch.map]) {
        loadMapImage();
      }
    }
  }, [currentMatch?.map]);

  if (loading) {
    return (
      <main className="h-full flex flex-col items-center justify-center">
        <div className="text-xl">Loading tournament data...</div>
      </main>
    );
  }

  if (error || !tournamentData) {
    return (
      <main className="h-full flex flex-col items-center justify-center">
        <div className="text-xl text-red-500">
          {error || "Failed to load tournament data"}
        </div>
        <button
          className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-primary corner-clip-sm"
          onClick={() => router.push("/")}
        >
          Return Home
        </button>
      </main>
    );
  }

  return (
    <main className="h-full flex flex-col">
      <div className="relative -mt-4 w-full border-b border-secondary pb-8">
        <BackgroundImage image={BackgroundImageData} />
        <Constrict className="p-4 opacity-75 flex">
          <div className="bg-accent rounded-primary px-2 py-0.5 text-accent-foreground flex">
            This page is currently in beta.
          </div>
        </Constrict>
        {/* Tournament Header - Compact for more stream space */}
        <Constrict
          className={`px-4 ${
            isMaximized ? "!max-w-none !w-full" : ""
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="bg-black/40 p-2 rounded-primary corner-clip-sm">
                <OpticGamingLogo size="md" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-primary-foreground">
                  {tournamentData.name}
                </h1>
                <div className="flex items-center space-x-2">
                  <span className="text-accent text-xs">●</span>
                  <span className="text-accent text-xs font-medium">
                    Completed
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsMaximized(!isMaximized)}
                className="text-xs px-3 py-1 bg-secondary/80 hover:bg-secondary text-secondary-foreground rounded-primary corner-clip-sm flex items-center space-x-1"
              >
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {isMaximized ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 9v6m0 0H4m5 0l-5-5m11 5l5-5m0 5v-6m0 0H15"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 16v4m0-4l5-5m11 4l-5-5m5 5v-4"
                    />
                  )}
                </svg>
                <span>{isMaximized ? "Minimize" : "Maximize"}</span>
              </button>
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className={`text-xs px-3 py-1 bg-secondary/80 hover:bg-secondary text-secondary-foreground rounded-primary corner-clip-sm flex items-center space-x-1 ${
                  refreshing ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <svg
                  className={`w-3 h-3 ${
                    refreshing || willAutoRefresh ? "animate-spin" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <span>
                  {refreshing
                    ? "Refreshing..."
                    : willAutoRefresh
                    ? "Auto-refreshing..."
                    : "Refresh"}
                </span>
              </button>
              <button
                onClick={() => router.push("/tournament/admin")}
                className="text-xs px-3 py-1 bg-secondary/80 hover:bg-secondary text-secondary-foreground rounded-primary corner-clip-sm"
              >
                Admin
              </button>
            </div>
          </div>

          {/* Match Selector - New horizontal scrollable design */}
          <div className="mb-4 overflow-x-auto pb-2 hide-scrollbar">
            <div className="flex space-x-2 min-w-max">
              {tournamentData.matches.map((match) => (
                <div
                  key={match.id}
                  onClick={() => setSelectedMatch(match.id)}
                  className={`flex-shrink-0 cursor-pointer p-2 rounded-primary corner-clip-sm border transition-all duration-200 ${
                    selectedMatch === match.id
                      ? "bg-primary border-accent shadow-glow-sm"
                      : "bg-secondary/50 border-secondary/50 hover:bg-secondary/70"
                  }`}
                >
                  <div className="flex flex-col w-40">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">{match.round}</span>
                      <span
                        className={`px-1.5 py-0.5 text-xs rounded-sm ${
                          match.status === "live"
                            ? "bg-accent/30 text-accent animate-pulse"
                            : match.status === "completed"
                            ? "bg-green-800/30 text-green-400"
                            : "bg-secondary-foreground/20 text-secondary-foreground"
                        }`}
                      >
                        {match.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="truncate max-w-[80px]">
                        {match.team1.name}
                      </span>
                      <div className="flex items-center space-x-1">
                        <span className="font-bold">{match.team1.score}</span>
                        <span>-</span>
                        <span className="font-bold">{match.team2.score}</span>
                      </div>
                      <span className="truncate max-w-[80px] text-right">
                        {match.team2.name}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col xl:flex-row gap-4">
            {/* Stream Section */}
            <div className="w-full xl:w-3/4 bg-secondary/70 border border-primary-foreground/5 rounded-primary corner-clip-sm overflow-hidden">
              <div className="aspect-video w-full">
                <iframe
                  src={tournamentData.streamUrl}
                  className="w-full h-full"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                ></iframe>
              </div>
              <div className="p-3 flex justify-between items-center">
                <div className="flex items-center">
                  <span className="text-base md:text-lg font-medium mr-2">
                    {currentMatch?.team1.name}
                  </span>
                  <span className="text-lg md:text-xl font-bold">
                    {currentMatch?.team1.score}
                  </span>
                  <span className="mx-2 text-secondary-foreground">vs</span>
                  <span className="text-lg md:text-xl font-bold">
                    {currentMatch?.team2.score}
                  </span>
                  <span className="text-base md:text-lg font-medium ml-2">
                    {currentMatch?.team2.name}
                  </span>
                </div>
                <div className="text-accent text-sm">
                  {currentMatch?.status === "live" ? (
                    <span className="animate-pulse">● LIVE</span>
                  ) : currentMatch?.status === "completed" ? (
                    "COMPLETED"
                  ) : (
                    "UPCOMING"
                  )}
                </div>
              </div>
            </div>

            {/* Match Stats Section */}
            <div className="w-full xl:w-1/4 bg-secondary/70 border border-primary-foreground/5 rounded-primary corner-clip-sm overflow-hidden">
              <div className="p-3 border-b border-secondary">
                <h2 className="text-lg font-bold text-primary-foreground">
                  Tournament Stats
                </h2>
              </div>

              <Tabs
                defaultValue="overview"
                onValueChange={(value) =>
                  setActiveTab(value as "overview" | "players")
                }
              >
                <TabsList className="w-full grid grid-cols-2 bg-secondary/50">
                  <TabsTrigger
                    value="overview"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    Overview
                  </TabsTrigger>
                  <TabsTrigger
                    value="players"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    Players
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="p-0">
                  {/* Match details content */}
                  <div className="p-3">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <h3 className="text-base font-medium">
                          {currentMatch?.round}
                        </h3>
                        <span
                          className={`px-2 py-0.5 text-xs rounded-sm ${
                            currentMatch?.status === "live"
                              ? "bg-accent text-accent-foreground animate-pulse"
                              : currentMatch?.status === "completed"
                              ? "bg-green-800/50 text-green-100"
                              : "bg-secondary-foreground/20 text-secondary-foreground"
                          }`}
                        >
                          {currentMatch?.status.toUpperCase()}
                        </span>
                      </div>

                      <div className="space-y-3">
                        {/* Team 1 - Add highlight for winner */}
                        <div
                          className={`bg-secondary/50 p-2 rounded-primary corner-clip-sm ${
                            currentMatch?.status === "completed" &&
                            currentMatch?.team1.score >
                              currentMatch?.team2.score
                              ? "border-2 border-accent/50"
                              : ""
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-medium">
                              {currentMatch?.team1.name}
                            </span>
                            <span className="text-lg font-bold">
                              {currentMatch?.team1.score}
                            </span>
                          </div>
                          <div className="mt-2 space-y-1">
                            {currentMatch?.team1.players.map((player) => (
                              <div
                                key={player.id}
                                className="flex items-center justify-between text-xs px-2 py-1 bg-primary/10 rounded-sm hover:bg-primary/20 cursor-pointer"
                                onClick={() =>
                                  openSocialMedia(player.socialLink)
                                }
                              >
                                <div className="flex items-center">
                                  <div className="mr-1 h-4 w-4">
                                    <SponsorImage
                                      sponsor={player.sponsor}
                                      className="h-4"
                                    />
                                  </div>
                                  <span>@{player.handle}</span>
                                </div>
                                <span className="text-secondary-foreground">
                                  {player.kills} K / {player.deaths} D
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Team 2 - Add highlight for winner */}
                        <div
                          className={`bg-secondary/50 p-2 rounded-primary corner-clip-sm ${
                            currentMatch?.status === "completed" &&
                            currentMatch?.team2.score >
                              currentMatch?.team1.score
                              ? "border-2 border-accent/50"
                              : ""
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-medium">
                              {currentMatch?.team2.name}
                            </span>
                            <span className="text-lg font-bold">
                              {currentMatch?.team2.score}
                            </span>
                          </div>
                          <div className="mt-2 space-y-1">
                            {currentMatch?.team2.players.map((player) => (
                              <div
                                key={player.id}
                                className="flex items-center justify-between text-xs px-2 py-1 bg-primary/10 rounded-sm hover:bg-primary/20 cursor-pointer"
                                onClick={() =>
                                  openSocialMedia(player.socialLink)
                                }
                              >
                                <div className="flex items-center">
                                  <div className="mr-1 h-4 w-4">
                                    <SponsorImage
                                      sponsor={player.sponsor}
                                      className="h-4"
                                    />
                                  </div>
                                  <span>@{player.handle}</span>
                                </div>
                                <span className="text-secondary-foreground">
                                  {player.kills} K / {player.deaths} D
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {currentMatch &&
                        currentMatch.map &&
                        mapImages[currentMatch.map] && (
                          <div className="mt-3">
                            <h4 className="text-xs font-medium mb-2">
                              Match Map
                            </h4>
                            <div className="relative aspect-video rounded-primary corner-clip-sm overflow-hidden">
                              <Image
                                src={mapImages[currentMatch.map]}
                                alt={currentMatch.map}
                                fill
                                className="object-cover"
                              />
                              <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2">
                                <p className="text-sm font-medium text-primary-foreground">
                                  {currentMatch.map}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                      {currentMatch?.status === "completed" && (
                        <div className="mt-3">
                          <h4 className="text-xs font-medium mb-1">
                            Match Statistics
                          </h4>
                          <div className="grid grid-cols-1 gap-2">
                            <div className="bg-secondary/30 p-2 rounded-primary corner-clip-sm">
                              <div className="text-xs text-secondary-foreground">
                                Rounds Won
                              </div>
                              <div className="text-sm">
                                {currentMatch.team1.score} -{" "}
                                {currentMatch.team2.score}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="players" className="p-3">
                  <h3 className="text-sm font-medium mb-2">
                    Player Stats - {currentMatch?.round}
                  </h3>
                  <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                    {sortedPlayers.map((player, index) => (
                      <div
                        key={player.id}
                        className="bg-secondary/50 p-2 rounded-primary corner-clip-sm flex items-center cursor-pointer hover:bg-secondary/70"
                        onClick={() => openSocialMedia(player.socialLink)}
                      >
                        <div className="flex-shrink-0 mr-2 relative">
                          {player.avatarUrl ? (
                            <img
                              src={player.avatarUrl}
                              alt={player.handle}
                              className="w-8 h-8 rounded-primary corner-clip-sm object-cover"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-primary corner-clip-sm bg-primary/20"></div>
                          )}
                          <div className="absolute -top-1 -left-1 w-4 h-4 bg-secondary rounded-full flex items-center justify-center text-[10px] font-bold">
                            {index + 1}
                          </div>
                        </div>
                        <div className="flex-grow min-w-0">
                          <div className="flex justify-between items-center">
                            <div className="truncate">
                              <span className="font-medium text-sm">
                                @{player.handle}
                              </span>
                              <span className="text-xs text-secondary-foreground ml-1">
                                ({player.team})
                              </span>
                            </div>
                            <span className="text-accent text-sm font-medium">
                              {player.kd.toFixed(2)} K/D
                            </span>
                          </div>
                          <div className="flex justify-between text-xs text-secondary-foreground mt-1">
                            <div className="flex items-center">
                              <div className="mr-1 h-4 w-4">
                                <SponsorImage
                                  sponsor={player.sponsor}
                                  className="h-4"
                                />
                              </div>
                              <span>{player.sponsor}</span>
                            </div>
                            <span>
                              {player.kills} K / {player.deaths} D /{" "}
                              {player.assists} A
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </Constrict>
      </div>

      {/* Bottom stats section */}
      <div className="h-full bg-primary w-full">
        <div className="flex justify-center items-start w-full">
          <Extrusion
            className="border-secondary min-w-36"
            cornerLocation={CornerLocation.BottomLeft}
          />
          <Extrusion
            className="border-secondary min-w-36"
            cornerLocation={CornerLocation.BottomRight}
          />
        </div>

        <Constrict
          className={`px-4 py-8 ${
            isMaximized ? "!max-w-none !w-full" : ""
          }`}
        >
          {/* Tournament Results Section */}
          <div className="mb-8">
            <div className="bg-secondary/70 border border-primary-foreground/5 rounded-primary corner-clip-sm p-4 mb-4">
              <h2 className="text-xl font-bold mb-4 text-center">Tournament Results</h2>
              
              {tournamentWinner && (
                <div className="flex flex-col items-center mb-6">
                  <div className="text-accent text-sm mb-2">TOURNAMENT CHAMPION</div>
                  <div className="text-2xl font-bold mb-2">{tournamentWinner}</div>
                  <div className="bg-accent/20 px-4 py-2 rounded-primary corner-clip-sm text-accent-foreground">
                    SANTAI CHAMPION
                  </div>
                </div>
              )}
              
              <div className="mt-6">
                <h3 className="text-lg font-bold mb-3">Overall Player Leaderboard</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-secondary">
                        <th className="text-left py-2 px-2">Rank</th>
                        <th className="text-left py-2 px-2">Player</th>
                        <th className="text-left py-2 px-2">Team</th>
                        <th className="text-right py-2 px-2">Matches</th>
                        <th className="text-right py-2 px-2">K</th>
                        <th className="text-right py-2 px-2">D</th>
                        <th className="text-right py-2 px-2">A</th>
                        <th className="text-right py-2 px-2">K/D</th>
                        <th className="text-right py-2 px-2">AKR</th>
                      </tr>
                    </thead>
                    <tbody>
                      {overallPlayerStats.map((player, index) => {
                        // Calculate AKR (Average Kills per Round)
                        const akr = player.totalRounds && player.totalRounds > 0 
                          ? parseFloat((player.kills / player.totalRounds).toFixed(2)) 
                          : 0;
                          
                        return (
                          <tr
                            key={`${player.name}-${player.team}-${index}`}
                            className="border-b border-secondary/30 hover:bg-secondary/30"
                          >
                            <td className="py-2 px-2">{index + 1}</td>
                            <td className="py-2 px-2">
                              <div className="flex items-center" onClick={() => openSocialMedia(player.socialLink)}>
                                {player.avatarUrl && (
                                  <img
                                    src={player.avatarUrl}
                                    alt={player.handle}
                                    className="w-6 h-6 rounded-primary corner-clip-sm object-cover mr-2"
                                  />
                                )}
                                <span className="text-primary-foreground">
                                  @{player.handle}
                                </span>
                              </div>
                            </td>
                            <td className="py-2 px-2">{player.team}</td>
                            <td className="py-2 px-2 text-right">{player.matchesPlayed}</td>
                            <td className="py-2 px-2 text-right">{player.kills}</td>
                            <td className="py-2 px-2 text-right">
                              {player.deaths}
                            </td>
                            <td className="py-2 px-2 text-right">
                              {player.assists}
                            </td>
                            <td className="py-2 px-2 text-right text-accent font-medium">
                              {player.kd.toFixed(2)}
                            </td>
                            <td className="py-2 px-2 text-right text-accent font-medium">
                              {akr.toFixed(2)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {activeTab === "overview" ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-secondary/70 border border-primary-foreground/5 rounded-primary corner-clip-sm p-3">
                <h3 className="text-base font-bold mb-3">
                  Tournament Schedule
                </h3>
                <div className="space-y-2">
                  {tournamentData.matches.map((match, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center py-1 border-b border-secondary/50"
                    >
                      <span className="text-sm">{match.round}</span>
                      <span
                        className={`text-sm ${
                          match.status === "live"
                            ? "text-accent animate-pulse"
                            : match.status === "completed"
                            ? "text-green-400"
                            : "text-secondary-foreground"
                        }`}
                      >
                        {match.status === "live"
                          ? "Live Now"
                          : match.status === "completed"
                          ? "Completed"
                          : "18:00 PST"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-secondary/70 border border-primary-foreground/5 rounded-primary corner-clip-sm p-3">
                <h3 className="text-base font-bold mb-3">Tournament Info</h3>
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="text-secondary-foreground">Format:</span>{" "}
                    Single Elimination
                  </p>
                  <p>
                    <span className="text-secondary-foreground">
                      Prize Pool:
                    </span>{" "}
                    $10,000
                  </p>
                  <p>
                    <span className="text-secondary-foreground">Teams:</span> 3
                  </p>
                  <p>
                    <span className="text-secondary-foreground">
                      Hosted by:
                    </span>{" "}
                    Optic Gaming
                  </p>
                </div>
              </div>

              <div className="bg-secondary/70 border border-primary-foreground/5 rounded-primary corner-clip-sm p-3">
                <h3 className="text-base font-bold mb-3">Top Performers {currentMatch?.round}</h3>
                <div className="space-y-2">
                  {sortedPlayers.slice(0, 3).map((player, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center text-sm cursor-pointer hover:bg-secondary/50 p-1 rounded-sm"
                      onClick={() => openSocialMedia(player.socialLink)}
                    >
                      <div className="flex items-center">
                        <span className="text-accent mr-2">#{index + 1}</span>
                        <div className="mr-1 h-4 w-4">
                          <SponsorImage
                            sponsor={player.sponsor}
                            className="h-4"
                          />
                        </div>
                        <span className="ml-1">@{player.handle}</span>
                      </div>
                      <span className="text-accent">
                        {player.kd.toFixed(2)} K/D
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-secondary/70 border border-primary-foreground/5 rounded-primary corner-clip-sm p-4">
              <h3 className="text-lg font-bold mb-4">
                Detailed Player Statistics For {currentMatch?.round}
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-secondary">
                      <th className="text-left py-2 px-2">Rank</th>
                      <th className="text-left py-2 px-2">Player</th>
                      <th className="text-left py-2 px-2">Team</th>
                      <th className="text-left py-2 px-2">Sponsor</th>
                      <th className="text-right py-2 px-2">K</th>
                      <th className="text-right py-2 px-2">D</th>
                      <th className="text-right py-2 px-2">A</th>
                      <th className="text-right py-2 px-2">K/D</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedPlayers.map((player, index) => (
                      <tr
                        key={player.id}
                        className="border-b border-secondary/30 hover:bg-secondary/30 cursor-pointer"
                        onClick={() => openSocialMedia(player.socialLink)}
                      >
                        <td className="py-2 px-2">{index + 1}</td>
                        <td className="py-2 px-2">
                          <div className="flex items-center">
                            {player.avatarUrl && (
                              <img
                                src={player.avatarUrl}
                                alt={player.handle}
                                className="w-6 h-6 rounded-primary corner-clip-sm object-cover mr-2"
                              />
                            )}
                            <span className="text-primary-foreground hover:underline">
                              @{player.handle}
                            </span>
                          </div>
                        </td>
                        <td className="py-2 px-2">{player.team}</td>
                        <td className="py-2 px-2">
                          <div className="flex items-center">
                            <SponsorImage
                              sponsor={player.sponsor}
                              className="h-4 mr-1"
                            />
                            <span>{player.sponsor}</span>
                          </div>
                        </td>
                        <td className="py-2 px-2 text-right">{player.kills}</td>
                        <td className="py-2 px-2 text-right">
                          {player.deaths}
                        </td>
                        <td className="py-2 px-2 text-right">
                          {player.assists}
                        </td>
                        <td className="py-2 px-2 text-right text-accent font-medium">
                          {player.kd.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </Constrict>
      </div>
    </main>
  );
}
