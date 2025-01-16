import { cn } from "../../utils/cn";

export default function NoticeBanner({ className, notice }: { className?: string; notice: string }) {
  return (
    <div className="flex flex-row">
      <div className="min-w-4 bg-accent"></div>
      <p className="w-max mx-4 text-warning text-lg font-black">{notice}</p>
      <div className="mr-4 min-w-4 bg-accent"></div>
      <div className={cn("w-full p-2 bg-[repeating-linear-gradient(45deg,#c6fb04_0px,#c6fb04_20px,transparent_20px,transparent_40px)]", className)}></div>
      <div className="ml-4 min-w-4 bg-accent"></div>
    </div>
  );
}
