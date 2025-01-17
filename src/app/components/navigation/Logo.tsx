import { cn } from "@/app/utils/cn";
import Link from "next/link";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className="w-fit">
      <svg
        viewBox="0 0 297 62"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        xmlSpace="preserve"
        fillRule="evenodd"
        clipRule="evenodd"
        strokeLinejoin="round"
        strokeMiterlimit="2"
        className={cn("group/all w-32", className)}
      >
        <rect x="0" y="0" width="286.634" height="76.08" fillOpacity="0"></rect>
        <g>
          <path
            className="fill-primary-foreground group-hover/all:fill-accent"
            d="M45.6,48.48l-45.6,0l-0,-10.32l35.28,0l-0,-2.4l-25.44,0l-0,-17.768l5.272,-5.272l30.488,0l-0,10.32l-25.44,0l-0,2.4l25.44,0l-0,23.04Zm102.074,-25.44l-13.754,0l-0,15.12l12.628,0l0,10.32l-17.476,0l-5.472,-5.472l-0,-43.008l10.32,0l-0,12.72l13.754,0l0,10.32Zm27.84,25.44l0,-25.44l-15.12,0l0,15.12l12.96,0l0,10.32l-23.28,0l0,-30.3l5.46,-5.46l30.3,0l0,25.44l2.16,0l0,-25.44l10.32,0l0,30.288l-5.472,5.472l-17.328,0Zm25.08,-5.472l0,-10.32l10.32,0l0,4.848l-5.472,5.472l-4.848,0Zm-2.28,-43.008l0,10.32l-10.32,0l0,-10.32l10.32,0Zm-125.114,48.48l-0,-25.44l-15.12,0l-0,15.12l12.96,0l-0,10.32l-23.28,0l-0,-30.3l5.46,-5.46l30.3,0l-0,25.44l2.16,0l-0,-25.44l30.3,0l5.46,5.46l-0,43.02l-10.32,0l-0,-38.16l-15.12,0l-0,19.968l-5.472,5.472l-17.328,0Zm145.466,-35.76l30.288,0l0,10.32l-25.44,0l0,15.12l15.12,0l0,-2.4l-2.4,-0l0,-10.32l12.72,0l0,17.568l-5.472,5.472l-24.816,-0l-5.472,-0l0,-30.288l5.472,-5.472Zm38.16,0l40.128,0l0,10.32l-35.28,0l0,15.12l15.12,0l0,-2.4l-2.4,-0l0,-10.32l12.72,0l0,17.568l-5.472,5.472l-24.816,-0l-5.472,-0l0,-30.288l5.472,-5.472Z"
          ></path>
        </g>
      </svg>
    </Link>
  );
}
