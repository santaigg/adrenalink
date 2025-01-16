"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import Extrusion, { CornerLocation } from "../cosmetic/Extrusion";
import { useState } from "react";

const Searchbox = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(({ className, type, ...props }, ref) => {
  const [focus, setFocus] = useState(false);

  function toggleFocus() {
    setFocus(!focus);
  }

  return (
    <div>
      <div>
        <input
          type={type}
          onFocus={toggleFocus}
          onBlur={toggleFocus}
          className={cn(
            "h-9 w-full bg-input px-3 py-1 outline-none placeholder:text-muted-foreground border border-input focus-visible:border-accent disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
      <Extrusion className={cn("min-w-[20%] float-right", focus ? "border-accent" : "border-input")} cornerLocation={CornerLocation.BottomLeft} />
    </div>
  );
});
Searchbox.displayName = "Searchbox";

export { Searchbox };
