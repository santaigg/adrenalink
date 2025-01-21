import * as React from "react";
import { cn } from "@/app/utils/cn";
import Extrusion, { CornerLocation } from "../cosmetic/Extrusion";
import { useState, Dispatch, SetStateAction } from "react";

interface SearchLeaderboardProps extends React.ComponentProps<"input"> {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
}

const SearchLeaderboard = React.forwardRef<
  HTMLInputElement,
  SearchLeaderboardProps
>(({ className, type, value, setValue, ...props }, ref) => {
  const [focus, setFocus] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  function toggleFocus() {
    setFocus(!focus);
  }

  return (
    <>
      <input
        type={type}
        onFocus={toggleFocus}
        onBlur={toggleFocus}
        value={value}
        onChange={handleChange}
        placeholder="Search Players..."
        className={cn(
          "h-9 w-full bg-secondary rounded-primary rounded-bl-none px-3 py-1 border outline-none placeholder:text-muted-foreground border-secondary focus-visible:border-accent disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
      <Extrusion
        className={cn(
          "min-w-24 rounded-bl-primary",
          focus ? "border-accent" : "border-secondary"
        )}
        cornerLocation={CornerLocation.BottomRight}
      />
    </>
  );
});
SearchLeaderboard.displayName = "SearchLeaderboard";

export { SearchLeaderboard };
