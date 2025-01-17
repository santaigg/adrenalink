"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import Extrusion, { CornerLocation } from "../cosmetic/Extrusion";
import { useState } from "react";
import { Button } from "./Button";

const Searchbox = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(({ className, type, ...props }, ref) => {
  const [focus, setFocus] = useState(false);

  function toggleFocus() {
    setFocus(!focus);
  }

  return (
    <div>
      <div className="flex flex-row">
        <Extrusion className={cn("w-min ", focus ? "border-accent" : "border-input-foreground")} cornerLocation={CornerLocation.BottomLeft} />
        <div className="flex-1">
          <input
            type={type}
            onFocus={toggleFocus}
            onBlur={toggleFocus}
            className={cn(
              "h-9 w-full bg-input px-3 py-1 outline-none placeholder:text-input-foreground border border-input-foreground focus-visible:border-accent disabled:cursor-not-allowed disabled:opacity-50",
              className
            )}
            ref={ref}
            {...props}
          />
          <Extrusion className={cn("min-w-[20%] float-right", focus ? "border-accent" : "border-input-foreground")} cornerLocation={CornerLocation.BottomLeft} />
        </div>
        <Button variant="default" className="h-11 ml-2 bg-accent">
          {"->"}
        </Button>
      </div>
    </div>
  );
});
Searchbox.displayName = "Searchbox";

export { Searchbox };
