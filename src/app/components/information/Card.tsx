import * as React from "react";

import { cn } from "@/app/utils/cn";

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-primary border-secondary border bg-primary text-primary-foreground py-4 px-6 overflow-hidden",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

export { Card };
