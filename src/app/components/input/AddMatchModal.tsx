"use client";

import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import Extrusion, { CornerLocation } from "../cosmetic/Extrusion";
import { Coins, Loader2 } from "lucide-react";
import { PlayerFullProfile } from "@/app/utils/types/wavescan.types";

const AddMatchModal = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const [focus, setFocus] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>("");
  const [addMatchError, setAddMatchError] = useState<string | null>(null);

  const handleType = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  function toggleFocus() {
    setFocus(!focus);
  }

  async function addMatch(matchId: string) {
    setLoading(true);
    setAddMatchError(null);

    try {
      const formattedMatchId = matchId.toLowerCase().trim().replace(/\s/g, "");

      const checkResponse = await fetch(
        `https://wavescan-production.up.railway.app/api/v1/match/${formattedMatchId}/check`
      );
      if (!checkResponse.ok) throw new Error("Invalid match ID");
      const checkResponseJson = await checkResponse.json();
      if (checkResponseJson.success === false || checkResponseJson.error) {
        throw new Error(checkResponseJson.error);
      }

      const addResponse = await fetch(
        `https://wavescan-production.up.railway.app/api/v1/match/${formattedMatchId}/add`
      );
      if (!addResponse.ok) throw new Error("Failed to add match");

      setOpen(false);
    } catch (error) {
      console.error("Error adding match:", error);
      setAddMatchError(
        error instanceof Error ? error.message : "Unknown error"
      );
    } finally {
      setLoading(false);
    }
  }

  function handleAddMatchButton() {
    const matchId = searchValue;
    if (matchId) {
      setLoading(true);
      addMatch(matchId);
    } else {
      console.log(matchId);
      setAddMatchError("Match ID cannot be empty.");
    }
  }

  return (
    <div
      className={`fixed top-0 left-0 w-screen h-screen bg-black/75 z-50 flex justify-center items-center transition-all ${
        open ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="flex flex-col w-[30rem]">
        <Extrusion
          className="border-secondary rounded-tl-primary min-w-[30%]"
          cornerLocation={CornerLocation.TopRight}
        />
        <div className="p-4 rounded-primary rounded-tl-none bg-primary border border-secondary flex flex-col space-y-2">
          <h3>Add Match</h3>
          <div>
            <input
              onChange={(e) => handleType(e)}
              type="text"
              onFocus={toggleFocus}
              onBlur={toggleFocus}
              placeholder="Enter Match ID"
              className={`
              h-9 w-full bg-primary rounded-primary rounded-br-none px-3 py-1 outline-none placeholder:text-input-foreground border focus-visible:border-accent disabled:cursor-not-allowed disabled:opacity-50
              ${searchValue.length > 0 ? "border-accent" : "border-secondary"}
            `}
            />
            <Extrusion
              className={`
              min-w-[20%] float-right rounded-br-primary ${
                focus || searchValue.length > 0
                  ? "border-accent"
                  : "border-secondary"
              }
            `}
              cornerLocation={CornerLocation.BottomLeft}
            />
          </div>

          {addMatchError && (
            <p className="text-red-500 text-sm">{addMatchError}</p>
          )}

          <div className="flex justify-end space-x-2">
            <div
              className="h-8 px-4 border border-accent cursor-pointer hover:bg-accent transition-all hover:text-accent-foreground rounded-primary text-accent flex items-center justify-center"
              onClick={() => setOpen(false)}
            >
              Cancel
            </div>
            <div
              className="h-8 px-4 bg-accent rounded-primary cursor-pointer text-accent-foreground flex items-center justify-center"
              onClick={() => handleAddMatchButton()}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-1 mb-0.5" size={16} />{" "}
                  <p>Adding...</p>
                </>
              ) : (
                <p>Add Match</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import { RefreshCcw } from "lucide-react";
interface dumpStatus {
  success: boolean;
  is_priority: boolean;
  queue_position: number | null;
  initially_dumped: boolean;
  in_progress: boolean;
  last_updated: number | null;
}

const RefreshMatchButton = ({
  playerFullProfile,
}: {
  playerFullProfile: PlayerFullProfile;
}) => {
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  async function isRefreshAllowed() {
    try {
      const response = await fetch(
        `https://wavescan-production.up.railway.app/api/v1/player/${playerFullProfile.id}/dump_status`
      );
      if (!response.ok) throw new Error("Failed to fetch dump status");
      const dumpStatus = (await response.json()) as dumpStatus;
      return dumpStatus.initially_dumped;
    } catch (error) {
      console.error("Error checking dump status:", error);
      return false;
    }
  }

  async function refreshMatches() {
    if (!(await isRefreshAllowed())) {
      console.log("Refresh not allowed: Player has not been initially dumped");
      return;
    }

    setIsRefreshing(true);

    try {
      const dumpStatusResponse = await fetch(
        `https://wavescan-production.up.railway.app/api/v1/player/${playerFullProfile.id}/dump_status`
      );
      if (!dumpStatusResponse.ok)
        throw new Error("Failed to fetch dump status");
      const dumpStatus = (await dumpStatusResponse.json()) as dumpStatus;

      const currentTime = new Date().getTime();
      const lastRefreshTime = localStorage.getItem(
        `lastRefresh_${playerFullProfile.id}`
      );
      const lastDumpTime = dumpStatus.initially_dumped
        ? dumpStatus.last_updated ??
          localStorage.getItem(`lastDump_${playerFullProfile.id}`)
          ? Number.parseInt(
              localStorage.getItem(`lastDump_${playerFullProfile.id}`) ?? "0"
            )
          : 0
        : null;

      const shouldDump = !lastDumpTime || currentTime - lastDumpTime > 900000;
      const shouldRefresh =
        !lastRefreshTime ||
        currentTime - Number.parseInt(lastRefreshTime) > 300000;

      if (shouldDump) {
        const dumpResponse = await fetch(
          `https://wavescan-production.up.railway.app/api/v1/player/${playerFullProfile.id}/dump`
        );
        if (!dumpResponse.ok) throw new Error("Failed to initiate dump");
        localStorage.setItem(
          `lastDump_${playerFullProfile.id}`,
          currentTime.toString()
        );
      } else if (shouldRefresh) {
        const response = await fetch(
          `https://wavescan-production.up.railway.app/api/v1/player/${playerFullProfile.id}/full_profile`
        );
        if (!response.ok) throw new Error("Failed to fetch matches");
        playerFullProfile = await response.json();
        const reactiveMatches = playerFullProfile.matches.map((match) => ({
          ...match,
          expanded: false,
          result:
            match.winner === -1
              ? "Draw"
              : match.winner === match.player_team?.team_index
              ? "Victory"
              : "Defeat",
        }));
        localStorage.setItem(
          `lastRefresh_${playerFullProfile.id}`,
          currentTime.toString()
        );
      } else {
        console.log("No refresh or dump needed at this time");
      }
    } catch (error) {
      console.error("Error refreshing matches:", error);
    } finally {
      setIsRefreshing(false);
    }
  }

  return (
    <div
      className="py-1.5 h-9 px-4 gap-x-1 flex items-center justify-center transition-all border border-secondary bg-primary rounded-primary cursor-pointer hover:bg-accent hover:border-accent hover:text-black"
      onClick={() => refreshMatches()}
    >
      <RefreshCcw className="size-5" />
      <p className="leading-none mt-0.5">Refresh Matches</p>
    </div>
  );
};

export { AddMatchModal, RefreshMatchButton };
