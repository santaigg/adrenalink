import { cn } from "@/app/utils/cn";
import Image from "next/image";
import type { StaticImageData } from "next/image";

export default function BackgroundImage({ image, className }: { image: StaticImageData; className?: string }) {
  return (
    <Image
      src={image}
      alt="Background Image."
      className={cn("absolute top-0 -z-50 size-full object-cover blur-md mix-blend-color-dodge saturate-[10%] brightness-90 pointer-events-none", className)}
    />
  );
}
