"use client";

import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { Button } from "./Button";
import { useRouter } from "next/navigation";

import { cn } from "../../utils/cn";
import Extrusion, { CornerLocation } from "../cosmetic/Extrusion";

import { Loader2 } from "lucide-react";

const isSteam64Id = (input: string): boolean => {
  return /^765611\d{11}$/.test(input);
};

interface SearchResult {
  id: string;
  display_name: string;
}

const Searchbox = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(({ className, type, ...props }, ref) => {
  const [focus, setFocus] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>("");

  const [showDropdown, setShowDropdown] = useState<boolean>();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const searchPlayers = async (query: string) => {
    if (query.length < 3) {
      setShowDropdown(false);
      setSearchResults([]);
      return;
    }

    setLoading(true);

    try {
      if (isSteam64Id(query)) {
        // If it's a Steam64 ID, use the steam endpoint
        const response = await fetch(
          `https://wavescan-production.up.railway.app/api/v1/player/steam/${encodeURIComponent(
            query
          )}`
        );
        if (!response.ok) throw new Error("Failed to fetch player by Steam ID");
        const data = (await response.json()) as {
          success: boolean;
          player_id: string;
          error?: string;
        };

        if (!data.success) {
          // If the player is not found, return an empty array
          setSearchResults([]);
          return;
        }

        const fpd: SearchResult[] = [
          {
            id: data.player_id,
            display_name: data.player_id,
          },
        ];

        setSearchResults(fpd);
        setShowDropdown(fpd.length > 0);
      } else {
        // Otherwise, use the player search endpoint
        const response = await fetch(
          `https://wavescan-production.up.railway.app/api/v1/search/player/${encodeURIComponent(
            query
          )}`
        );
        if (!response.ok) throw new Error("Failed to fetch search results");
        const { data } = (await response.json()) as { data: any[] };

        // Map the data to match the SearchResult type
        const mappedResults: SearchResult[] = data.map((item) => ({
          id: item.id,
          display_name: item.display_name,
        }));

        // Update the state with the mapped results
        setSearchResults(mappedResults);
        setShowDropdown(mappedResults.length > 0);
      }
    } catch (error) {
      console.error("Error searching players:", error);
      setSearchResults([]);
      setShowDropdown(false);
    } finally {
      setLoading(false);
    }
  };

  const handleType = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    searchPlayers(e.target.value);
  };

  const handlePlayerSelect = (id: string, name: string) => {
    setSearchValue(name);
    setShowDropdown(false);
    router.push(`/p/${id}`);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function onSearchButtonClick() {
    setSearchValue(searchResults[0].display_name);
    router.push(`/p/${searchResults[0].id}`);
  }

  function toggleFocus() {
    setFocus(!focus);
  }

  return (
    <div className="relative">
      <div className="flex flex-row">
        <div className="flex-1">
          <input
            onChange={(e) => handleType(e)}
            type={type}
            onFocus={toggleFocus}
            onBlur={toggleFocus}
            className={cn(
              searchValue.length > 0
                ? "border-accent"
                : "border-secondary",
              "h-9 w-full bg-input rounded-primary rounded-br-none px-3 py-1 outline-none placeholder:text-input-foreground border focus-visible:border-accent disabled:cursor-not-allowed disabled:opacity-50",
              className
            )}
            ref={ref}
            {...props}
          />
          <Extrusion
            className={cn(
              "min-w-[20%] float-right rounded-br-primary",
              focus || searchValue.length > 0
                ? "border-accent"
                : "border-secondary"
            )}
            cornerLocation={CornerLocation.BottomLeft}
          />
        </div>
        <Button
          onClick={onSearchButtonClick}
          variant="loaded"
          className={cn(
            "size-11 justify-center items-center px-0 ml-2 rounded-primary",
            searchValue.length > 0 ? "flex" : "hidden"
          )}
        >
          {loading ? <Loader2 className="animate-spin" /> : "->"}
        </Button>
      </div>
      <div
        ref={dropdownRef}
        className={`w-full max-h-60 rounded-primary bg-input border border-accent absolute top-12 left-0 overflow-y-scroll scrollbar-hide ${
          showDropdown ? "" : "hidden"
        }`}
      >
        {Object.entries(searchResults).map(([key, result]) => {
          return (
            <div
              key={result.id}
              className="w-full py-3 px-4 hover:bg-muted/25 cursor-pointer"
              onClick={() => handlePlayerSelect(result.id, result.display_name)}
            >
              {result.display_name}
            </div>
          );
        })}
      </div>
    </div>
  );
});
Searchbox.displayName = "Searchbox";

export { Searchbox };
