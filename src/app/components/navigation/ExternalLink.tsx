import { cn } from "@/app/utils/cn";
import Link from "next/link";

export default function ExternalLink({ href, title }: { href: string; title: string }) {
  return (
    <Link className={cn("group/externalLink inline-flex flex-row hover:text-accent")} rel="noreferrer nofollow" target="_blank" href={href}>
      <p>{title}</p>
      <svg
        className="size-2 mt-1 stroke-muted-foreground group-hover/externalLink:stroke-accent"
        width="24px"
        height="24px"
        viewBox="0 0 24 24"
        strokeWidth="3"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M6.00005 19L19 5.99996M19 5.99996V18.48M19 5.99996H6.52005" strokeLinecap="square" strokeLinejoin="bevel"></path>
      </svg>
    </Link>
  );
}
