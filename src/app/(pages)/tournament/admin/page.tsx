"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Constrict from "@/app/components/layout/Constrict";
import BackgroundImage from "@/app/components/cosmetic/BackgroundImage";
import BackgroundImageData from "@/app/assets/images/background/background-spectators.png";
import OpticGamingLogo from "@/app/components/cosmetic/OpticGamingLogo";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { 
  fetchTournament, 
  TournamentData, 
  MatchStats,
  updateMatch as updateMatchApi,
  updateTournament as updateTournamentApi
} from "@/app/utils/fetch/fetchTournament";
import { isAdminAuthenticated, authenticateAdmin, logoutAdmin } from "@/app/utils/auth/adminAuth";
import { SponsorImage } from "@/app/components/cosmetic/SponsorImageFromString";
import Image from "next/image";

const API_BASE_URL = "https://wavescan-production.up.railway.app/api/v1/tournament";

// Add map options based on available map previews
const AVAILABLE_MAPS = ["Canal", "Commons", "Metro", "Mill", "Skyway"];

// Add this type definition for a new match template
const newMatchTemplate: MatchStats = {
  id: "",
  round: "New Match",
  status: "upcoming",
  map: "Canal", // Default map
  team1: {
    name: "Team 1",
    score: 0,
    players: [
      { id: "1", handle: "player1", name: "Player 1", sponsor: "tbd", kills: 0, deaths: 0, assists: 0, kd: 0 },
      { id: "2", handle: "player2", name: "Player 2", sponsor: "tbd", kills: 0, deaths: 0, assists: 0, kd: 0 },
      { id: "3", handle: "player3", name: "Player 3", sponsor: "tbd", kills: 0, deaths: 0, assists: 0, kd: 0 }
    ]
  },
  team2: {
    name: "Team 2",
    score: 0,
    players: [
      { id: "4", handle: "player1", name: "Player 1", sponsor: "tbd", kills: 0, deaths: 0, assists: 0, kd: 0 },
      { id: "5", handle: "player2", name: "Player 2", sponsor: "tbd", kills: 0, deaths: 0, assists: 0, kd: 0 },
      { id: "6", handle: "player3", name: "Player 3", sponsor: "tbd", kills: 0, deaths: 0, assists: 0, kd: 0 }
    ]
  }
};

export default function TournamentAdminPage() {
  const router = useRouter();
  const [tournamentData, setTournamentData] = useState<TournamentData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [authorized, setAuthorized] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [selectedMatch, setSelectedMatch] = useState<string>("");
  const [editedMatch, setEditedMatch] = useState<MatchStats | null>(null);
  const [isFieldFocused, setIsFieldFocused] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"matches" | "stream" | "players">("matches");
  const [mapImages, setMapImages] = useState<{ [key: string]: string }>({});
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [willAutoRefresh, setWillAutoRefresh] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingUpdates, setPendingUpdates] = useState<TournamentData | null>(null);
  const [pendingUpdateCount, setPendingUpdateCount] = useState<number>(0);
  const [editedFields, setEditedFields] = useState<Set<string>>(new Set());

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
      // Reset pending updates when loading new data
      setPendingUpdates(null);
      setPendingUpdateCount(0);

      // Only set the selected match if it's not a refresh or if the currently selected match doesn't exist anymore
      if (!isRefresh || !data.matches.find((match) => match.id === selectedMatch)) {
        if (data.matches.length > 0) {
          setSelectedMatch(data.matches[0].id);
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

  // Function to update tournament data
  const updateTournamentData = async (newData: TournamentData) => {
    try {
      const response = await fetch(`${API_BASE_URL}?id=optic-invitational&action=update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newData)
      });
      
      const result = await response.json();
      if (result.success === false) {
        throw new Error(result.error || 'Failed to update tournament data');
      }
      
      return result.data || result;
    } catch (error) {
      console.error('Error updating tournament data:', error);
      throw error;
    }
  };

  // Check for admin cookie on load
  useEffect(() => {
    const checkAuth = () => {
      const isAuth = isAdminAuthenticated();
      setAuthorized(isAuth);
    };

    checkAuth();
  }, []);

  // Load tournament data if authorized
  useEffect(() => {
    if (authorized) {
      loadTournamentData();
    }
  }, [authorized]);

  // Function to check for updates without overwriting the form
  const checkForUpdates = async () => {
    try {
      setWillAutoRefresh(true);
      
      const data = await fetchTournament("optic-invitational");
      
      // Validate the data structure
      if (!data || !Array.isArray(data.matches)) {
        throw new Error("Invalid tournament data format");
      }
      
      // If we're not editing, just update the data immediately
      if (!isFieldFocused && !editedMatch) {
        // Check if there are actual changes before updating
        if (tournamentData && JSON.stringify(data) !== JSON.stringify(tournamentData)) {
          console.log("Auto-applying updates since no fields are being edited");
          setTournamentData(data);
          setPendingUpdates(null);
          setPendingUpdateCount(0);
        }
        return;
      }
      
      // Otherwise, check if there are differences
      if (tournamentData) {
        // Compare the new data with current data
        const hasChanges = JSON.stringify(data) !== JSON.stringify(tournamentData);
        
        if (hasChanges) {
          // Count the actual number of differences
          let changeCount = 0;
          
          // Compare matches
          if (data.matches.length !== tournamentData.matches.length) {
            // If match count changed, count each added/removed match as a change
            changeCount += Math.abs(data.matches.length - tournamentData.matches.length);
          }
          
          // Compare each match
          const maxMatchLength = Math.max(data.matches.length, tournamentData.matches.length);
          for (let i = 0; i < maxMatchLength; i++) {
            const newMatch = data.matches[i];
            const oldMatch = tournamentData.matches[i];
            
            // Skip if we're currently editing this match
            if (editedMatch && oldMatch && oldMatch.id === editedMatch.id) {
              continue;
            }
            
            // If one exists and the other doesn't, we already counted it above
            if (!newMatch || !oldMatch) continue;
            
            // Compare match data
            if (JSON.stringify(newMatch) !== JSON.stringify(oldMatch)) {
              changeCount++;
            }
          }
          
          // Compare other tournament properties
          if (data.name !== tournamentData.name) changeCount++;
          if (data.streamUrl !== tournamentData.streamUrl) changeCount++;
          
          // Only update if there are actual changes
          if (changeCount > 0) {
            setPendingUpdates(data);
            setPendingUpdateCount(changeCount);
          }
        }
      }
    } catch (error) {
      console.error("Failed to check for updates:", error);
    } finally {
      setWillAutoRefresh(false);
    }
  };

  // Set up automatic update check every 5 seconds
  useEffect(() => {
    if (!authorized) return; // Only auto-refresh if authorized
    
    console.log("Setting up auto-refresh interval");
    
    const intervalId = setInterval(() => {
      checkForUpdates();
    }, 5000);
    
    // Cleanup interval on component unmount
    return () => {
      console.log("Cleaning up auto-refresh interval");
      clearInterval(intervalId);
      setWillAutoRefresh(false);
    };
  }, [authorized, tournamentData, isFieldFocused, editedMatch, pendingUpdateCount, pendingUpdates]);

  // Function to apply pending updates while preserving edited fields
  const applyPendingUpdates = () => {
    if (!pendingUpdates || !tournamentData) return;
    
    // Create a new tournament data object with updates
    const updatedData = { ...pendingUpdates };
    
    // If we're editing a match, preserve our edited match
    if (editedMatch) {
      // Find the match we're editing in the pending updates
      const matchIndex = updatedData.matches.findIndex(m => m.id === editedMatch.id);
      
      if (matchIndex !== -1) {
        // Replace it with our edited version
        updatedData.matches[matchIndex] = editedMatch;
      }
    }
    
    // Update the tournament data
    setTournamentData(updatedData);
    setPendingUpdates(null);
    setPendingUpdateCount(0);
  };

  // Handle manual refresh
  const handleRefresh = () => {
    if (isFieldFocused) {
      // Don't refresh if any field is focused
      return;
    }
    loadTournamentData(true);
  };

  // Handle login
  const handleLogin = async () => {
    try {
      const result = await authenticateAdmin(password);
      if (result) {
        setAuthorized(true);
      } else {
        alert("Invalid password");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Failed to authenticate");
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logoutAdmin();
      setAuthorized(false);
      setTournamentData(null);
      setSelectedMatch("");
      setEditedMatch(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Handle field focus
  const handleFieldFocus = () => {
    setIsFieldFocused(true);
  };

  // Handle field blur
  const handleFieldBlur = () => {
    // Use setTimeout to prevent flickering when moving between fields
    setTimeout(() => {
      // Check if any element with the 'form-field' class is focused
      const focusedElement = document.querySelector('.form-field:focus');
      if (!focusedElement) {
        setIsFieldFocused(false);
      }
    }, 100);
  };

  // Update match data
  const handleMatchUpdate = async (matchId: string) => {
    if (!tournamentData || !editedMatch) return;
    
    try {
      // Use pendingUpdates as the base if available, otherwise use current tournamentData
      const baseData = pendingUpdates || tournamentData;
      
      // Update the match in the tournament data
      const updatedMatches = baseData.matches.map(match => 
        match.id === matchId ? editedMatch : match
      );
      
      const updatedData = {
        ...baseData,
        matches: updatedMatches
      };
      
      // Send the entire updated tournament data to the backend
      const result = await updateTournamentData(updatedData);
      setTournamentData(result);
      setEditedMatch(null);
      setPendingUpdates(null);
      setPendingUpdateCount(0);
      alert("Match updated successfully!");
    } catch (error) {
      console.error("Failed to update match:", error);
      alert("Failed to update match");
    }
  };

  // Handle match selection for editing
  useEffect(() => {
    if (tournamentData && selectedMatch) {
      const match = tournamentData.matches.find(m => m.id === selectedMatch);
      if (match) {
        setEditedMatch(JSON.parse(JSON.stringify(match)));
      }
    }
  }, [selectedMatch, tournamentData]);

  // Handle stream settings update
  const handleStreamSettingsUpdate = async () => {
    if (!tournamentData) return;
    
    try {
      // Use pendingUpdates as the base if available, otherwise use current tournamentData
      const baseData = pendingUpdates || tournamentData;
      
      // Create updated data with current stream settings
      const updatedData = {
        ...baseData,
        name: tournamentData.name,
        streamUrl: tournamentData.streamUrl
      };
      
      // Send the updated tournament data to the backend
      const result = await updateTournamentData(updatedData);
      setTournamentData(result);
      setPendingUpdates(null);
      setPendingUpdateCount(0);
      alert("Stream settings updated successfully!");
    } catch (error) {
      console.error("Failed to update stream settings:", error);
      alert("Failed to update stream settings");
    }
  };

  // Add new match handler
  const handleAddMatch = () => {
    if (!tournamentData) return;
    
    // Create a new match with a unique ID
    const newMatch = {
      ...newMatchTemplate,
      id: `match_${Date.now()}` // Generate a unique ID
    };
    
    // Use pendingUpdates as the base if available, otherwise use current tournamentData
    const baseData = pendingUpdates || tournamentData;
    
    // Update tournament data with the new match
    const updatedData = {
      ...baseData,
      matches: [...baseData.matches, newMatch]
    };
    
    // Update the backend
    updateTournamentData(updatedData)
      .then((result) => {
        setTournamentData(result);
        setSelectedMatch(newMatch.id);
        setEditedMatch(newMatch);
        setPendingUpdates(null);
        setPendingUpdateCount(0);
        alert("New match added successfully!");
      })
      .catch((error) => {
        console.error("Failed to add new match:", error);
        alert("Failed to add new match");
      });
  };

  // Add effect to load all map images when component mounts
  useEffect(() => {
    const loadMapImages = async () => {
      const images: { [key: string]: string } = {};
      
      for (const mapName of AVAILABLE_MAPS) {
        try {
          // Use dynamic import with template literal
          const image = await import(
            `@/app/assets/images/map-previews/${mapName}_800x800.webp`
          ).catch(error => {
            console.error(`Failed to load map image for ${mapName}:`, error);
            return null;
          });
          
          if (image) {
            images[mapName] = image.default.src;
          }
        } catch (error) {
          console.error(`Failed to load map image for ${mapName}:`, error);
        }
      }
      
      setMapImages(images);
    };

    loadMapImages();
  }, []);

  // Function to add focus/blur handlers to all input fields
  const addFocusHandlersToInputs = () => {
    // Add focus/blur handlers to all input fields
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      if (!input.classList.contains('form-field')) {
        input.classList.add('form-field');
        input.addEventListener('focus', handleFieldFocus);
        input.addEventListener('blur', handleFieldBlur);
      }
    });
  };

  // Add focus/blur handlers to all input fields when the component mounts or editedMatch changes
  useEffect(() => {
    if (editedMatch) {
      // Use setTimeout to ensure the DOM has been updated
      setTimeout(addFocusHandlersToInputs, 100);
    }
  }, [editedMatch, activeTab]);

  // If not authorized, show login form
  if (!authorized) {
    return (
      <main className="h-full flex flex-col">
        <div className="relative -mt-4 w-full border-b border-secondary pb-8">
          <BackgroundImage image={BackgroundImageData} />
          
          <Constrict className="px-4 mt-16">
            <div className="max-w-md mx-auto bg-secondary/70 border border-primary-foreground/5 rounded-primary corner-clip-sm overflow-hidden">
              <div className="p-4 border-b border-secondary flex items-center">
                <OpticGamingLogo size="sm" />
                <h2 className="text-lg font-bold text-primary-foreground ml-2">Tournament Admin</h2>
              </div>
              
              <div className="p-4">
                <p className="text-sm text-secondary-foreground mb-4">
                  Please enter your admin password to access the tournament management panel.
                </p>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-secondary-foreground mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full p-2 bg-primary/10 border border-secondary rounded-primary corner-clip-sm text-primary-foreground"
                      placeholder="Enter admin password"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleLogin();
                        }
                      }}
                    />
                  </div>
                  
                  <div className="flex justify-between">
                    <button
                      onClick={() => router.push('/tournament')}
                      className="px-4 py-2 bg-secondary/50 text-secondary-foreground rounded-primary corner-clip-sm text-sm"
                    >
                      Back to Tournament
                    </button>
                    <button
                      onClick={handleLogin}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-primary corner-clip-sm text-sm"
                    >
                      Login
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Constrict>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="h-full flex flex-col items-center justify-center">
        <div className="text-xl">Loading tournament data...</div>
      </main>
    );
  }

  if (!tournamentData) {
    return (
      <main className="h-full flex flex-col items-center justify-center">
        <div className="text-xl">Failed to load tournament data</div>
        <button 
          className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-primary corner-clip-sm"
          onClick={() => router.push('/tournament')}
        >
          Return to Tournament
        </button>
      </main>
    );
  }

  return (
    <main className="h-full flex flex-col">
      <div className="relative -mt-4 w-full border-b border-secondary pb-8">
        <BackgroundImage image={BackgroundImageData} />
        
        <Constrict className="px-4 mt-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="bg-black/40 p-2 rounded-primary corner-clip-sm">
                <OpticGamingLogo size="md" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-primary-foreground">Tournament Admin Panel</h1>
                <p className="text-sm text-secondary-foreground">Manage tournament data and settings</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {pendingUpdateCount > 0 && (
                <button
                  onClick={applyPendingUpdates}
                  className="text-xs px-3 py-1 bg-accent/80 hover:bg-accent text-accent-foreground rounded-primary corner-clip-sm flex items-center space-x-1"
                >
                  <svg
                    className="w-3 h-3 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  <span>Apply {pendingUpdateCount} Update{pendingUpdateCount > 1 ? 's' : ''}</span>
                </button>
              )}
              <button
                onClick={handleRefresh}
                disabled={refreshing || isFieldFocused}
                className={`text-xs px-3 py-1 bg-secondary/80 hover:bg-secondary text-secondary-foreground rounded-primary corner-clip-sm flex items-center space-x-1 ${
                  refreshing || isFieldFocused ? "opacity-50 cursor-not-allowed" : ""
                }`}
                title={isFieldFocused ? "Auto-refresh paused while editing" : ""}
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
                    : isFieldFocused
                    ? "Paused"
                    : willAutoRefresh
                    ? "Auto-refreshing..."
                    : pendingUpdateCount > 0
                    ? `Updates Available (${pendingUpdateCount})`
                    : "Refresh"}
                </span>
              </button>
              <button
                onClick={() => router.push('/tournament')}
                className="text-xs px-3 py-1 bg-secondary/80 hover:bg-secondary text-secondary-foreground rounded-primary corner-clip-sm"
              >
                View Tournament
              </button>
              <button
                onClick={handleLogout}
                className="text-xs px-3 py-1 bg-accent/80 hover:bg-accent text-accent-foreground rounded-primary corner-clip-sm"
              >
                Logout
              </button>
            </div>
          </div>
          
          <div className="bg-secondary/70 border border-primary-foreground/5 rounded-primary corner-clip-sm overflow-hidden">
            <Tabs defaultValue="matches" onValueChange={(value) => setActiveTab(value as any)}>
              <TabsList className="w-full grid grid-cols-3 bg-secondary/50">
                <TabsTrigger 
                  value="matches"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  Matches
                </TabsTrigger>
                <TabsTrigger 
                  value="stream"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  Stream Settings
                </TabsTrigger>
                <TabsTrigger 
                  value="players"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  Player Stats
                </TabsTrigger>
              </TabsList>
              
              {/* Matches Tab */}
              <TabsContent value="matches" className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-1 bg-secondary/50 p-3 rounded-primary corner-clip-sm">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-base font-medium">Match Selection</h3>
                      <button
                        onClick={handleAddMatch}
                        className="text-xs px-2 py-1 bg-primary text-primary-foreground rounded-primary corner-clip-sm flex items-center space-x-1"
                      >
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                        <span>New Match</span>
                      </button>
                    </div>
                    <div className="space-y-2">
                      {tournamentData.matches.map((match) => (
                        <div 
                          key={match.id}
                          onClick={() => setSelectedMatch(match.id)}
                          className={`p-2 rounded-primary corner-clip-sm cursor-pointer ${
                            selectedMatch === match.id 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-secondary/30 hover:bg-secondary/50'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">{match.round}</span>
                            <span className={`text-xs px-1.5 py-0.5 rounded-sm ${
                              match.status === "live" 
                                ? "bg-accent/20 text-accent" 
                                : match.status === "completed" 
                                ? "bg-green-800/20 text-green-400" 
                                : "bg-secondary-foreground/10 text-secondary-foreground"
                            }`}>
                              {match.status.toUpperCase()}
                            </span>
                          </div>
                          <div className="text-xs mt-1">
                            {match.team1.name} vs {match.team2.name}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="md:col-span-3">
                    {editedMatch && (
                      <div className="bg-secondary/50 p-3 rounded-primary corner-clip-sm">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-base font-medium">Edit Match: {editedMatch.round}</h3>
                          <div className="flex items-center space-x-2">
                            {isFieldFocused && (
                              <div className="bg-accent/20 text-accent text-xs px-2 py-1 rounded-sm flex items-center">
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Auto-refresh paused while editing
                              </div>
                            )}
                            {pendingUpdateCount > 0 && (
                              <div className="bg-accent/20 text-accent text-xs px-2 py-1 rounded-sm flex items-center">
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                {pendingUpdateCount} update{pendingUpdateCount > 1 ? 's' : ''} available
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Match Status */}
                            <div>
                              <label className="block text-sm font-medium text-secondary-foreground mb-1">
                                Match Status
                              </label>
                              <select
                                value={editedMatch.status}
                                onChange={(e) => setEditedMatch({
                                  ...editedMatch,
                                  status: e.target.value as "upcoming" | "live" | "completed"
                                })}
                                className="w-full p-2 bg-primary/10 border border-secondary rounded-primary corner-clip-sm text-primary-foreground form-field"
                                onFocus={handleFieldFocus}
                                onBlur={handleFieldBlur}
                              >
                                <option value="upcoming">Upcoming</option>
                                <option value="live">Live</option>
                                <option value="completed">Completed</option>
                              </select>
                            </div>
                            
                            {/* Round Name */}
                            <div>
                              <label className="block text-sm font-medium text-secondary-foreground mb-1">
                                Round Name
                              </label>
                              <input
                                type="text"
                                value={editedMatch.round}
                                onChange={(e) => setEditedMatch({
                                  ...editedMatch,
                                  round: e.target.value
                                })}
                                className="w-full p-2 bg-primary/10 border border-secondary rounded-primary corner-clip-sm text-primary-foreground form-field"
                                onFocus={handleFieldFocus}
                                onBlur={handleFieldBlur}
                              />
                            </div>
                          </div>
                          
                          {/* Map Selection */}
                          <div className="mt-4">
                            <label className="block text-sm font-medium text-secondary-foreground mb-2">
                              Map Selection
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                              {AVAILABLE_MAPS.map((mapName) => (
                                <div
                                  key={mapName}
                                  onClick={() => setEditedMatch({
                                    ...editedMatch,
                                    map: mapName
                                  })}
                                  onFocus={handleFieldFocus}
                                  onBlur={handleFieldBlur}
                                  tabIndex={0}
                                  className={`relative aspect-square rounded-primary corner-clip-sm overflow-hidden cursor-pointer border-2 form-field ${
                                    editedMatch.map === mapName 
                                      ? 'border-accent' 
                                      : 'border-transparent hover:border-primary-foreground/20'
                                  }`}
                                >
                                  {mapImages[mapName] ? (
                                    <Image
                                      src={mapImages[mapName]}
                                      alt={mapName}
                                      fill
                                      className="object-cover"
                                    />
                                  ) : (
                                    <div className="absolute inset-0 bg-secondary/50 flex items-center justify-center">
                                      <span className="text-xs text-secondary-foreground">Loading...</span>
                                    </div>
                                  )}
                                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-1">
                                    <p className="text-xs text-center text-primary-foreground">{mapName}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Team 1 */}
                            <div className={`bg-secondary/30 p-3 rounded-primary corner-clip-sm ${
                              editedMatch.status === "completed" && editedMatch.team1.score > editedMatch.team2.score
                                ? "border-2 border-accent/50" 
                                : ""
                            }`}>
                              <h4 className="text-sm font-medium mb-2">Team 1</h4>
                              
                              <div className="space-y-3">
                                <div>
                                  <label className="block text-xs text-secondary-foreground mb-1">
                                    Team Name
                                  </label>
                                  <input
                                    type="text"
                                    value={editedMatch.team1.name}
                                    onChange={(e) => setEditedMatch({
                                      ...editedMatch,
                                      team1: {
                                        ...editedMatch.team1,
                                        name: e.target.value
                                      }
                                    })}
                                    className="w-full p-1.5 bg-primary/10 border border-secondary rounded-primary corner-clip-sm text-primary-foreground text-sm form-field"
                                    onFocus={handleFieldFocus}
                                    onBlur={handleFieldBlur}
                                  />
                                </div>
                                
                                <div>
                                  <label className="block text-xs text-secondary-foreground mb-1">
                                    Score
                                  </label>
                                  <input
                                    type="number"
                                    value={editedMatch.team1.score}
                                    onChange={(e) => setEditedMatch({
                                      ...editedMatch,
                                      team1: {
                                        ...editedMatch.team1,
                                        score: parseInt(e.target.value) || 0
                                      }
                                    })}
                                    className="w-full p-1.5 bg-primary/10 border border-secondary rounded-primary corner-clip-sm text-primary-foreground text-sm form-field"
                                    onFocus={handleFieldFocus}
                                    onBlur={handleFieldBlur}
                                  />
                                </div>
                              </div>
                            </div>
                            
                            {/* Team 2 */}
                            <div className={`bg-secondary/30 p-3 rounded-primary corner-clip-sm ${
                              editedMatch.status === "completed" && editedMatch.team2.score > editedMatch.team1.score
                                ? "border-2 border-accent/50" 
                                : ""
                            }`}>
                              <h4 className="text-sm font-medium mb-2">Team 2</h4>
                              
                              <div className="space-y-3">
                                <div>
                                  <label className="block text-xs text-secondary-foreground mb-1">
                                    Team Name
                                  </label>
                                  <input
                                    type="text"
                                    value={editedMatch.team2.name}
                                    onChange={(e) => setEditedMatch({
                                      ...editedMatch,
                                      team2: {
                                        ...editedMatch.team2,
                                        name: e.target.value
                                      }
                                    })}
                                    className="w-full p-1.5 bg-primary/10 border border-secondary rounded-primary corner-clip-sm text-primary-foreground text-sm form-field"
                                    onFocus={handleFieldFocus}
                                    onBlur={handleFieldBlur}
                                  />
                                </div>
                                
                                <div>
                                  <label className="block text-xs text-secondary-foreground mb-1">
                                    Score
                                  </label>
                                  <input
                                    type="number"
                                    value={editedMatch.team2.score}
                                    onChange={(e) => setEditedMatch({
                                      ...editedMatch,
                                      team2: {
                                        ...editedMatch.team2,
                                        score: parseInt(e.target.value) || 0
                                      }
                                    })}
                                    className="w-full p-1.5 bg-primary/10 border border-secondary rounded-primary corner-clip-sm text-primary-foreground text-sm form-field"
                                    onFocus={handleFieldFocus}
                                    onBlur={handleFieldBlur}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex justify-end space-x-2 mt-4">
                            <button
                              onClick={() => setEditedMatch(null)}
                              className="px-3 py-1.5 bg-secondary/50 text-secondary-foreground rounded-primary corner-clip-sm text-sm"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleMatchUpdate(editedMatch.id)}
                              className="px-3 py-1.5 bg-primary text-primary-foreground rounded-primary corner-clip-sm text-sm"
                            >
                              Save Changes
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
              
              {/* Stream Settings Tab */}
              <TabsContent value="stream" className="p-4">
                <div className="bg-secondary/50 p-3 rounded-primary corner-clip-sm">
                  <h3 className="text-base font-medium mb-3">Stream Settings</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-secondary-foreground mb-1">
                        Stream URL
                      </label>
                      <input
                        type="text"
                        value={tournamentData.streamUrl}
                        onChange={(e) => setTournamentData({
                          ...tournamentData,
                          streamUrl: e.target.value
                        })}
                        className="w-full p-2 bg-primary/10 border border-secondary rounded-primary corner-clip-sm text-primary-foreground form-field"
                        onFocus={handleFieldFocus}
                        onBlur={handleFieldBlur}
                        placeholder="https://www.youtube.com/embed/..."
                      />
                      <p className="text-xs text-secondary-foreground mt-1">
                        Enter the YouTube embed URL for the tournament stream.
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-secondary-foreground mb-1">
                        Tournament Name
                      </label>
                      <input
                        type="text"
                        value={tournamentData.name}
                        onChange={(e) => setTournamentData({
                          ...tournamentData,
                          name: e.target.value
                        })}
                        className="w-full p-2 bg-primary/10 border border-secondary rounded-primary corner-clip-sm text-primary-foreground"
                      />
                    </div>
                    
                    <div className="flex justify-end">
                      <button
                        onClick={handleStreamSettingsUpdate}
                        className="px-3 py-1.5 bg-primary text-primary-foreground rounded-primary corner-clip-sm text-sm"
                      >
                        Save Stream Settings
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 bg-secondary/50 p-3 rounded-primary corner-clip-sm">
                  <h3 className="text-base font-medium mb-3">Stream Preview</h3>
                  
                  <div className="aspect-video w-full max-w-2xl mx-auto">
                    <iframe 
                      src={tournamentData.streamUrl}
                      className="w-full h-full rounded-primary corner-clip-sm"
                      allowFullScreen
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    ></iframe>
                  </div>
                </div>
              </TabsContent>
              
              {/* Player Stats Tab */}
              <TabsContent value="players" className="p-4">
                <div className="bg-secondary/50 p-3 rounded-primary corner-clip-sm">
                  <h3 className="text-base font-medium mb-3">Player Statistics</h3>
                  
                  {editedMatch && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="text-sm font-medium">Editing Players for: {editedMatch.round}</h4>
                        <div className="flex space-x-2">
                          {isFieldFocused && (
                            <div className="bg-accent/20 text-accent text-xs px-2 py-1 rounded-sm flex items-center">
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Auto-refresh paused
                            </div>
                          )}
                          {pendingUpdateCount > 0 && (
                            <div className="bg-primary/20 text-primary-foreground text-xs px-2 py-1 rounded-sm flex items-center">
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                              </svg>
                              {pendingUpdateCount} update{pendingUpdateCount > 1 ? 's' : ''} available
                            </div>
                          )}
                          <select
                            value={selectedMatch}
                            onChange={(e) => setSelectedMatch(e.target.value)}
                            className="p-1.5 bg-primary/10 border border-secondary rounded-primary corner-clip-sm text-primary-foreground text-sm"
                          >
                            {tournamentData.matches.map((match) => (
                              <option key={match.id} value={match.id}>
                                {match.round}: {match.team1.name} vs {match.team2.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Team 1 Players */}
                        <div>
                          <h4 className="text-sm font-medium mb-2">{editedMatch.team1.name} Players</h4>
                          
                          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                            {editedMatch.team1.players.map((player, index) => (
                              <div key={player.id} className={`bg-secondary/30 p-2 rounded-primary corner-clip-sm ${
                                editedMatch.status === "completed" && editedMatch.team1.score > editedMatch.team2.score
                                  ? "border border-accent/50" 
                                  : ""
                              }`}>
                                <div className="flex justify-between items-center mb-2">
                                  <div className="flex items-center">
                                    <div className="relative w-8 h-8 mr-2">
                                      {player.avatarUrl ? (
                                        <Image 
                                          src={player.avatarUrl} 
                                          alt={player.handle}
                                          width={32}
                                          height={32}
                                          className="rounded-primary corner-clip-sm object-cover"
                                        />
                                      ) : (
                                        <div className="w-8 h-8 rounded-primary corner-clip-sm bg-primary/20 flex items-center justify-center">
                                          <span className="text-xs text-secondary-foreground">No IMG</span>
                                        </div>
                                      )}
                                    </div>
                                    <div>
                                      <span className="font-medium text-sm">@{player.handle}</span>
                                      {player.socialLink && (
                                        <a 
                                          href={player.socialLink}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="block text-xs text-accent hover:underline"
                                          onClick={(e) => e.stopPropagation()}
                                        >
                                          View Profile
                                        </a>
                                      )}
                                    </div>
                                  </div>
                                  {index === 0 && (
                                    <span className="text-xs bg-accent/20 text-accent px-1.5 py-0.5 rounded-sm">Captain</span>
                                  )}
                                </div>
                                
                                <div className="space-y-2">
                                  {/* Handle and Name */}
                                  <div className="grid grid-cols-2 gap-2">
                                    <div>
                                      <label className="block text-xs text-secondary-foreground mb-1">
                                        Handle
                                      </label>
                                      <input
                                        type="text"
                                        value={player.handle}
                                        onChange={(e) => {
                                          const updatedPlayers = [...editedMatch.team1.players];
                                          updatedPlayers[index] = {
                                            ...player,
                                            handle: e.target.value
                                          };
                                          setEditedMatch({
                                            ...editedMatch,
                                            team1: {
                                              ...editedMatch.team1,
                                              players: updatedPlayers
                                            }
                                          });
                                        }}
                                        className="w-full p-1 bg-primary/10 border border-secondary rounded-primary corner-clip-sm text-primary-foreground text-xs"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs text-secondary-foreground mb-1">
                                        Name
                                      </label>
                                      <input
                                        type="text"
                                        value={player.name}
                                        onChange={(e) => {
                                          const updatedPlayers = [...editedMatch.team1.players];
                                          updatedPlayers[index] = {
                                            ...player,
                                            name: e.target.value
                                          };
                                          setEditedMatch({
                                            ...editedMatch,
                                            team1: {
                                              ...editedMatch.team1,
                                              players: updatedPlayers
                                            }
                                          });
                                        }}
                                        className="w-full p-1 bg-primary/10 border border-secondary rounded-primary corner-clip-sm text-primary-foreground text-xs"
                                      />
                                    </div>
                                  </div>

                                  {/* Avatar URL and Social Link */}
                                  <div className="grid grid-cols-1 gap-2">
                                    <div>
                                      <label className="block text-xs text-secondary-foreground mb-1">
                                        Avatar URL
                                      </label>
                                      <input
                                        type="text"
                                        value={player.avatarUrl || ''}
                                        onChange={(e) => {
                                          const updatedPlayers = [...editedMatch.team1.players];
                                          updatedPlayers[index] = {
                                            ...player,
                                            avatarUrl: e.target.value
                                          };
                                          setEditedMatch({
                                            ...editedMatch,
                                            team1: {
                                              ...editedMatch.team1,
                                              players: updatedPlayers
                                            }
                                          });
                                        }}
                                        placeholder="https://example.com/avatar.jpg"
                                        className="w-full p-1 bg-primary/10 border border-secondary rounded-primary corner-clip-sm text-primary-foreground text-xs"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs text-secondary-foreground mb-1">
                                        Social Link
                                      </label>
                                      <input
                                        type="text"
                                        value={player.socialLink || ''}
                                        onChange={(e) => {
                                          const updatedPlayers = [...editedMatch.team1.players];
                                          updatedPlayers[index] = {
                                            ...player,
                                            socialLink: e.target.value
                                          };
                                          setEditedMatch({
                                            ...editedMatch,
                                            team1: {
                                              ...editedMatch.team1,
                                              players: updatedPlayers
                                            }
                                          });
                                        }}
                                        placeholder="https://twitter.com/username"
                                        className="w-full p-1 bg-primary/10 border border-secondary rounded-primary corner-clip-sm text-primary-foreground text-xs"
                                      />
                                    </div>
                                  </div>

                                  {/* Sponsor Selection */}
                                  <div>
                                    <label className="block text-xs text-secondary-foreground mb-1">
                                      Sponsor
                                    </label>
                                    <div className="flex items-center">
                                      <select
                                        value={player.sponsor}
                                        onChange={(e) => {
                                          const updatedPlayers = [...editedMatch.team1.players];
                                          updatedPlayers[index] = {
                                            ...player,
                                            sponsor: e.target.value
                                          };
                                          setEditedMatch({
                                            ...editedMatch,
                                            team1: {
                                              ...editedMatch.team1,
                                              players: updatedPlayers
                                            }
                                          });
                                        }}
                                        className="w-full p-1 bg-primary/10 border border-secondary rounded-primary corner-clip-sm text-primary-foreground text-xs"
                                      >
                                        <option value="Monark">Monark</option>
                                        <option value="Ryker">Ryker</option>
                                        <option value="Umbra">Umbra</option>
                                        <option value="Vector">Vector</option>
                                        <option value="Bloom">Bloom</option>
                                        <option value="Ghostlink">Ghostlink</option>
                                        <option value="Morrgen">Morrgen</option>
                                        <option value="Muu">Muu</option>
                                        <option value="Pinnacle">Pinnacle</option>
                                        <option value="tbd">tbd</option>
                                      </select>
                                      <div className="ml-2 h-6 w-6">
                                        <SponsorImage sponsor={player.sponsor} className="h-6" />
                                      </div>
                                    </div>
                                  </div>

                                  {/* Stats Grid */}
                                  <div className="grid grid-cols-3 gap-2">
                                    <div>
                                      <label className="block text-xs text-secondary-foreground mb-1">
                                        Kills
                                      </label>
                                      <input
                                        type="number"
                                        value={player.kills}
                                        onChange={(e) => {
                                          const updatedPlayers = [...editedMatch.team1.players];
                                          updatedPlayers[index] = {
                                            ...player,
                                            kills: parseInt(e.target.value) || 0,
                                            kd: player.deaths > 0 ? (parseInt(e.target.value) || 0) / player.deaths : 0
                                          };
                                          setEditedMatch({
                                            ...editedMatch,
                                            team1: {
                                              ...editedMatch.team1,
                                              players: updatedPlayers
                                            }
                                          });
                                        }}
                                        className="w-full p-1 bg-primary/10 border border-secondary rounded-primary corner-clip-sm text-primary-foreground text-xs"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs text-secondary-foreground mb-1">
                                        Deaths
                                      </label>
                                      <input
                                        type="number"
                                        value={player.deaths}
                                        onChange={(e) => {
                                          const deaths = parseInt(e.target.value) || 0;
                                          const updatedPlayers = [...editedMatch.team1.players];
                                          updatedPlayers[index] = {
                                            ...player,
                                            deaths,
                                            kd: deaths > 0 ? player.kills / deaths : player.kills
                                          };
                                          setEditedMatch({
                                            ...editedMatch,
                                            team1: {
                                              ...editedMatch.team1,
                                              players: updatedPlayers
                                            }
                                          });
                                        }}
                                        className="w-full p-1 bg-primary/10 border border-secondary rounded-primary corner-clip-sm text-primary-foreground text-xs"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs text-secondary-foreground mb-1">
                                        Assists
                                      </label>
                                      <input
                                        type="number"
                                        value={player.assists}
                                        onChange={(e) => {
                                          const updatedPlayers = [...editedMatch.team1.players];
                                          updatedPlayers[index] = {
                                            ...player,
                                            assists: parseInt(e.target.value) || 0
                                          };
                                          setEditedMatch({
                                            ...editedMatch,
                                            team1: {
                                              ...editedMatch.team1,
                                              players: updatedPlayers
                                            }
                                          });
                                        }}
                                        className="w-full p-1 bg-primary/10 border border-secondary rounded-primary corner-clip-sm text-primary-foreground text-xs"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                            {editedMatch.team1.players.length < 3 && (
                              <div className="text-center p-2 text-sm text-secondary-foreground">
                                Each team must have exactly 3 players (including captain).
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Team 2 Players */}
                        <div>
                          <h4 className="text-sm font-medium mb-2">{editedMatch.team2.name} Players</h4>
                          
                          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                            {editedMatch.team2.players.map((player, index) => (
                              <div key={player.id} className={`bg-secondary/30 p-2 rounded-primary corner-clip-sm ${
                                editedMatch.status === "completed" && editedMatch.team2.score > editedMatch.team1.score
                                  ? "border border-accent/50" 
                                  : ""
                              }`}>
                                <div className="flex justify-between items-center mb-2">
                                  <div className="flex items-center">
                                    <div className="relative w-8 h-8 mr-2">
                                      {player.avatarUrl ? (
                                        <Image 
                                          src={player.avatarUrl} 
                                          alt={player.handle}
                                          width={32}
                                          height={32}
                                          className="rounded-primary corner-clip-sm object-cover"
                                        />
                                      ) : (
                                        <div className="w-8 h-8 rounded-primary corner-clip-sm bg-primary/20 flex items-center justify-center">
                                          <span className="text-xs text-secondary-foreground">No IMG</span>
                                        </div>
                                      )}
                                    </div>
                                    <div>
                                      <span className="font-medium text-sm">@{player.handle}</span>
                                      {player.socialLink && (
                                        <a 
                                          href={player.socialLink}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="block text-xs text-accent hover:underline"
                                          onClick={(e) => e.stopPropagation()}
                                        >
                                          View Profile
                                        </a>
                                      )}
                                    </div>
                                  </div>
                                  {index === 0 && (
                                    <span className="text-xs bg-accent/20 text-accent px-1.5 py-0.5 rounded-sm">Captain</span>
                                  )}
                                </div>
                                
                                <div className="space-y-2">
                                  {/* Handle and Name */}
                                  <div className="grid grid-cols-2 gap-2">
                                    <div>
                                      <label className="block text-xs text-secondary-foreground mb-1">
                                        Handle
                                      </label>
                                      <input
                                        type="text"
                                        value={player.handle}
                                        onChange={(e) => {
                                          const updatedPlayers = [...editedMatch.team2.players];
                                          updatedPlayers[index] = {
                                            ...player,
                                            handle: e.target.value
                                          };
                                          setEditedMatch({
                                            ...editedMatch,
                                            team2: {
                                              ...editedMatch.team2,
                                              players: updatedPlayers
                                            }
                                          });
                                        }}
                                        className="w-full p-1 bg-primary/10 border border-secondary rounded-primary corner-clip-sm text-primary-foreground text-xs"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs text-secondary-foreground mb-1">
                                        Name
                                      </label>
                                      <input
                                        type="text"
                                        value={player.name}
                                        onChange={(e) => {
                                          const updatedPlayers = [...editedMatch.team2.players];
                                          updatedPlayers[index] = {
                                            ...player,
                                            name: e.target.value
                                          };
                                          setEditedMatch({
                                            ...editedMatch,
                                            team2: {
                                              ...editedMatch.team2,
                                              players: updatedPlayers
                                            }
                                          });
                                        }}
                                        className="w-full p-1 bg-primary/10 border border-secondary rounded-primary corner-clip-sm text-primary-foreground text-xs"
                                      />
                                    </div>
                                  </div>

                                  {/* Avatar URL and Social Link */}
                                  <div className="grid grid-cols-1 gap-2">
                                    <div>
                                      <label className="block text-xs text-secondary-foreground mb-1">
                                        Avatar URL
                                      </label>
                                      <input
                                        type="text"
                                        value={player.avatarUrl || ''}
                                        onChange={(e) => {
                                          const updatedPlayers = [...editedMatch.team2.players];
                                          updatedPlayers[index] = {
                                            ...player,
                                            avatarUrl: e.target.value
                                          };
                                          setEditedMatch({
                                            ...editedMatch,
                                            team2: {
                                              ...editedMatch.team2,
                                              players: updatedPlayers
                                            }
                                          });
                                        }}
                                        placeholder="https://example.com/avatar.jpg"
                                        className="w-full p-1 bg-primary/10 border border-secondary rounded-primary corner-clip-sm text-primary-foreground text-xs"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs text-secondary-foreground mb-1">
                                        Social Link
                                      </label>
                                      <input
                                        type="text"
                                        value={player.socialLink || ''}
                                        onChange={(e) => {
                                          const updatedPlayers = [...editedMatch.team2.players];
                                          updatedPlayers[index] = {
                                            ...player,
                                            socialLink: e.target.value
                                          };
                                          setEditedMatch({
                                            ...editedMatch,
                                            team2: {
                                              ...editedMatch.team2,
                                              players: updatedPlayers
                                            }
                                          });
                                        }}
                                        placeholder="https://twitter.com/username"
                                        className="w-full p-1 bg-primary/10 border border-secondary rounded-primary corner-clip-sm text-primary-foreground text-xs"
                                      />
                                    </div>
                                  </div>

                                  {/* Sponsor Selection */}
                                  <div>
                                    <label className="block text-xs text-secondary-foreground mb-1">
                                      Sponsor
                                    </label>
                                    <div className="flex items-center">
                                      <select
                                        value={player.sponsor}
                                        onChange={(e) => {
                                          const updatedPlayers = [...editedMatch.team2.players];
                                          updatedPlayers[index] = {
                                            ...player,
                                            sponsor: e.target.value
                                          };
                                          setEditedMatch({
                                            ...editedMatch,
                                            team2: {
                                              ...editedMatch.team2,
                                              players: updatedPlayers
                                            }
                                          });
                                        }}
                                        className="w-full p-1 bg-primary/10 border border-secondary rounded-primary corner-clip-sm text-primary-foreground text-xs"
                                      >
                                        <option value="Monark">Monark</option>
                                        <option value="Ryker">Ryker</option>
                                        <option value="Umbra">Umbra</option>
                                        <option value="Vector">Vector</option>
                                        <option value="Bloom">Bloom</option>
                                        <option value="Ghostlink">Ghostlink</option>
                                        <option value="Morrgen">Morrgen</option>
                                        <option value="Muu">Muu</option>
                                        <option value="Pinnacle">Pinnacle</option>
                                        <option value="tbd">tbd</option>
                                      </select>
                                      <div className="ml-2 h-6 w-6">
                                        <SponsorImage sponsor={player.sponsor} className="h-6" />
                                      </div>
                                    </div>
                                  </div>

                                  {/* Stats Grid */}
                                  <div className="grid grid-cols-3 gap-2">
                                    <div>
                                      <label className="block text-xs text-secondary-foreground mb-1">
                                        Kills
                                      </label>
                                      <input
                                        type="number"
                                        value={player.kills}
                                        onChange={(e) => {
                                          const updatedPlayers = [...editedMatch.team2.players];
                                          updatedPlayers[index] = {
                                            ...player,
                                            kills: parseInt(e.target.value) || 0,
                                            kd: player.deaths > 0 ? (parseInt(e.target.value) || 0) / player.deaths : 0
                                          };
                                          setEditedMatch({
                                            ...editedMatch,
                                            team2: {
                                              ...editedMatch.team2,
                                              players: updatedPlayers
                                            }
                                          });
                                        }}
                                        className="w-full p-1 bg-primary/10 border border-secondary rounded-primary corner-clip-sm text-primary-foreground text-xs"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs text-secondary-foreground mb-1">
                                        Deaths
                                      </label>
                                      <input
                                        type="number"
                                        value={player.deaths}
                                        onChange={(e) => {
                                          const deaths = parseInt(e.target.value) || 0;
                                          const updatedPlayers = [...editedMatch.team2.players];
                                          updatedPlayers[index] = {
                                            ...player,
                                            deaths,
                                            kd: deaths > 0 ? player.kills / deaths : player.kills
                                          };
                                          setEditedMatch({
                                            ...editedMatch,
                                            team2: {
                                              ...editedMatch.team2,
                                              players: updatedPlayers
                                            }
                                          });
                                        }}
                                        className="w-full p-1 bg-primary/10 border border-secondary rounded-primary corner-clip-sm text-primary-foreground text-xs"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs text-secondary-foreground mb-1">
                                        Assists
                                      </label>
                                      <input
                                        type="number"
                                        value={player.assists}
                                        onChange={(e) => {
                                          const updatedPlayers = [...editedMatch.team2.players];
                                          updatedPlayers[index] = {
                                            ...player,
                                            assists: parseInt(e.target.value) || 0
                                          };
                                          setEditedMatch({
                                            ...editedMatch,
                                            team2: {
                                              ...editedMatch.team2,
                                              players: updatedPlayers
                                            }
                                          });
                                        }}
                                        className="w-full p-1 bg-primary/10 border border-secondary rounded-primary corner-clip-sm text-primary-foreground text-xs"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                            {editedMatch.team2.players.length < 3 && (
                              <div className="text-center p-2 text-sm text-secondary-foreground">
                                Each team must have exactly 3 players (including captain).
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-end space-x-2 mt-4">
                        <button
                          onClick={() => setEditedMatch(null)}
                          className="px-3 py-1.5 bg-secondary/50 text-secondary-foreground rounded-primary corner-clip-sm text-sm"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleMatchUpdate(editedMatch.id)}
                          className="px-3 py-1.5 bg-primary text-primary-foreground rounded-primary corner-clip-sm text-sm"
                        >
                          Save Player Stats
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </Constrict>
      </div>
    </main>
  );
} 