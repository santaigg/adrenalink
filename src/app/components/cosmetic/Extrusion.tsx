import { cn } from "@/app/utils/cn";

export enum CornerLocation {
  TopLeft = "border-b-8 border-l-8 border-l-transparent",
  TopRight = "border-b-8 border-r-8 border-r-transparent",
  BottomLeft = "border-t-8 border-l-8 border-l-transparent",
  BottomRight = "border-t-8 border-r-8 border-r-transparent",
}

export default function Extrusion({ className, cornerLocation }: { className: string; cornerLocation: CornerLocation }) {
  return <div className={cn(className, "w-min", cornerLocation)}></div>;
}
