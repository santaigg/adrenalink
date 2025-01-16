import { cn } from "../../utils/cn";

export default function NoticeBanner({ className, notice }: { className?: string; notice: string }) {
  return (
    <div className={cn("w-full p-2 border-2 border-dashed border-warning", className)}>
      <p className="text-warning text-lg">{notice}</p>
    </div>
  );
}
