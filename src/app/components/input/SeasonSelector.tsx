"use client";
import * as React from "react";

import Extrusion, { CornerLocation } from "../cosmetic/Extrusion";
import { cn } from "@/app/utils/cn";

import { Check, ChevronsUpDown } from "lucide-react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/app/components/information/Command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/components/information/Popover";

const seasons = [
  {
    value: "season0",
    label: "Season 0",
  },
  {
    value: "season1",
    label: "Season 1: Flashpoint",
  },
];

const SeasonSelector = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(({ className, type, ...props }, ref) => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          role="combobox"
          aria-expanded={open}
          className="w-52 px-4 py-2 inline-flex items-center gap-2 border whitespace-nowrap cursor-pointer justify-between bg-secondary h-9 rounded border-secondary hover:bg-secondary hover:border-accent text-base text-primary-foreground hover:text-accent font-normal [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
        >
          {value
            ? seasons.find((season) => season.value === value)?.label
            : "Select Season..."}
          <ChevronsUpDown className="opacity-50" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-52 p-0 border-muted-foreground">
        <Command className="bg-secondary border-secondary">
          {/* <CommandInput placeholder="Search Seasons..." className="h-9 !border-muted-foreground" /> */}
          <CommandList>
            <CommandEmpty>No season found.</CommandEmpty>
            <CommandGroup>
              {seasons.map((season) => (
                <CommandItem
                  key={season.value}
                  value={season.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
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
  );
});
SeasonSelector.displayName = "SeasonSelector";

export { SeasonSelector };
