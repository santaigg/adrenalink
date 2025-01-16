import { cn } from "@/app/utils/cn";

export default function Constrict({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("max-w-screen-constrict mx-auto", className)}>{children}</div>;
}
