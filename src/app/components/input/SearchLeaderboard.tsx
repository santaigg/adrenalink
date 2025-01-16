import * as React from "react";
import { cn } from "@/app/utils/cn";
import Extrusion, { CornerLocation } from "../cosmetic/Extrusion";
import { useState } from "react";

interface SearchLeaderboardProps {}

const SearchLeaderboard = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(({ className, type, ...props }, ref) => {
  const [focus, setFocus] = useState(false);

  function toggleFocus() {
    setFocus(!focus);
  }

  return (
    <>
      <input
        type={type}
        onFocus={toggleFocus}
        onBlur={toggleFocus}
        placeholder="Search Players..."
        className={cn(
          "h-9 w-full bg-secondary rounded-t rounded-br px-3 py-1 border outline-none placeholder:text-muted-foreground border-secondary focus-visible:border-accent disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
      <Extrusion
        className={cn(
          "min-w-24 rounded-bl",
          focus ? "border-accent" : "border-secondary"
        )}
        cornerLocation={CornerLocation.BottomRight}
      />
    </>
  );
});
SearchLeaderboard.displayName = "SearchLeaderboard";

export { SearchLeaderboard };
