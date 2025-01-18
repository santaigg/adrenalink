"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import Extrusion, { CornerLocation } from "../cosmetic/Extrusion";
import { useState } from "react";
import { Button } from "./Button";
import { useDebounce } from "use-debounce";

const Searchbox = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(({ className, type, ...props }, ref) => {
  const [focus, setFocus] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState<{ id: string; name: string }[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  function isSteam64Id(input: string): boolean {
    // Steam64 IDs are 17 digits long and start with "765611"
    return /^765611\d{11}$/.test(input);
  }

  function onSearchButtonClick() {
    console.log(searchValue);
  }

  function toggleFocus() {
    setFocus(!focus);
  }

  const searchPlayers = useDebounce(async (query: string) => {
    console.log("Searching for", query);
    if (query.length < 3) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    setIsLoading(true);
    try {
      let response;
      if (isSteam64Id(query)) {
        // If it's a Steam64 ID, use the steam endpoint
        response = await fetch(`https://wavescan-production.up.railway.app/api/v1/player/steam/${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error("Failed to fetch player by Steam ID");
        const playerData = (await response.json()) as { success: boolean; player_id: string; error?: string };

        if (!playerData.success) {
          // If the player is not found, return an empty array
          setSearchResults([]);
          return;
        }

        // Assuming the API returns a single player object
        setSearchResults([{ id: playerData.player_id, name: playerData.player_id }]);
      } else {
        // Otherwise, use the player search endpoint
        response = await fetch(`https://wavescan-production.up.railway.app/api/v1/search/player/${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error("Failed to fetch search results");
        const { data } = (await response.json()) as { data: Array<{ id: string; display_name: string }> };
        setSearchResults(data?.map((result) => ({ id: result.id, name: result.display_name })) ?? []);
      }
      setShowDropdown(searchResults.length > 0);
    } catch (error) {
      console.error("Error searching players:", error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  }, 300);

  return (
    <div>
      <div className="flex flex-row">
        <div className="flex-1">
          <input
            onChange={(e) => setSearchValue(e.target.value)}
            type={type}
            onFocus={toggleFocus}
            onBlur={toggleFocus}
            className={cn(
              searchValue.length > 0 ? "border-accent" : "border-input-foreground",
              "h-9 w-full bg-input px-3 py-1 outline-none placeholder:text-input-foreground border focus-visible:border-accent disabled:cursor-not-allowed disabled:opacity-50",
              className
            )}
            ref={ref}
            {...props}
          />
          <Extrusion
            className={cn("min-w-[20%] float-right", focus || searchValue.length > 0 ? "border-accent" : "border-input-foreground")}
            cornerLocation={CornerLocation.BottomLeft}
          />
        </div>
        <Button onClick={onSearchButtonClick} variant="loaded" className={cn("h-11 ml-2", searchValue.length > 0 ? "block" : "hidden")}>
          {"->"}
        </Button>
      </div>
    </div>
  );
});
Searchbox.displayName = "Searchbox";

export { Searchbox };
