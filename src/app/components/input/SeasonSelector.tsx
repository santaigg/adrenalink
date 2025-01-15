"use client";
import * as React from "react";

import Extrusion, { CornerLocation } from "../cosmetic/Extrusion";
import { cn } from "@/app/utils/cn";

import { Check, ChevronsUpDown } from "lucide-react"

import { Button } from "@/app/components/shadcn/Button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/app/components/shadcn/Command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/components/shadcn/Popover"

const seasons = [
  {
    value: "season0",
    label: "Season 0",
  },
  {
    value: "season1",
    label: "Season 1: Flashpoint",
  },
]

export function SeasonSelector() {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? seasons.find((season) => season.value === value)?.label
            : "Select Season..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search Seasons..." className="h-9" />
          <CommandList>
            <CommandEmpty>No season found.</CommandEmpty>
            <CommandGroup>
              {seasons.map((season) => (
                <CommandItem
                  key={season.value}
                  value={season.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    setOpen(false)
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
  )
}
