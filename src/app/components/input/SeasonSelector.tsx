"use client";
import * as React from "react";
import { useEffect } from "react";
import { cn } from "@/app/utils/cn";
import { Dispatch, SetStateAction } from "react";
import { Check, ChevronsUpDown, Truck } from "lucide-react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/app/components/information/Command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/components/information/Popover";

interface Season {
  value: string;
  label: string;
}

interface SeasonSelectorProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  loading?: boolean;
  defaultValue: string;
  showBeta?: boolean;
  setSeason: Dispatch<SetStateAction<string>>;
}

const SeasonSelector = React.forwardRef<HTMLInputElement, SeasonSelectorProps>(
  ({ loading, defaultValue, showBeta = false, setSeason }, ref) => {
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState("");
    const [seasons, setSeasons] = React.useState<Season[]>([
      { value: "beta", label: "Beta" },
      { value: "season0", label: "Season 0" },
      { value: "season1", label: "Season 1: Flashpoint" },
    ]);

    const addSeason = (newSeason: Season) => {
      setSeasons((prevSeasons) => [...prevSeasons, newSeason]);
    };

    const removeSeason = (valueToRemove: string) => {
      setSeasons((prevSeasons) =>
        prevSeasons.filter((season) => season.value !== valueToRemove)
      );
    };

    useEffect(() => {
      if (defaultValue != null) {
        setValue(defaultValue);
      }
    }, [defaultValue]);

    useEffect(() => {
      if (showBeta === false) {
        removeSeason("beta");
      }
    }, [showBeta]);

    return (
      <div ref={ref}>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger
            asChild
            className={`${loading ? "pointer-events-none" : ""}`}
          >
            <div
              role="combobox"
              aria-expanded={open}
              className="w-52 px-4 py-2 inline-flex items-center gap-2 border whitespace-nowrap cursor-pointer justify-between bg-secondary h-9 rounded-primary border-secondary hover:bg-secondary hover:border-accent text-base text-primary-foreground hover:text-accent font-normal [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
            >
              {value
                ? seasons.find((season) => season.value === value)?.label
                : "Select Season..."}
              <ChevronsUpDown className="opacity-50" />
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-52 p-0 border-muted-foreground rounded-primary">
            <Command className="bg-secondary border-secondary rounded-primary">
              {/* <CommandInput placeholder="Search Seasons..." className="h-9 !border-muted-foreground" /> */}
              <CommandList>
                <CommandEmpty>No season found.</CommandEmpty>
                <CommandGroup>
                  {seasons.map((season) => (
                    <CommandItem
                      key={season.value}
                      value={season.value}
                      onSelect={(currentValue) => {
                        setValue(currentValue);
                        setSeason(currentValue);
                        setOpen(false);
                      }}
                      className={`!rounded-primary ${
                        value === season.value
                          ? "!bg-accent !text-accent-foreground"
                          : ""
                      }`}
                    >
                      {season.label}
                      <Check
                        className={cn(
                          "ml-auto",
                          value === season.value ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        {showBeta}
      </div>
    );
  }
);
SeasonSelector.displayName = "SeasonSelector";

export { SeasonSelector };
