import { cn } from "../../utils/cn";

export default function NoticeBanner({ className, notice }: { className?: string; notice: string }) {
  return (
    <div>
      <div className="flex flex-row">
        <div className="mr-4 min-w-2 bg-accent opacity-55"></div>
        <div className={cn("w-full opacity-65 bg-[repeating-linear-gradient(45deg,#c6fb04_0px,#c6fb04_20px,transparent_20px,transparent_35px)]", className)}></div>
        <div className="ml-4 min-w-2 bg-accent opacity-70"></div>
        <p className="w-max min-w-max mx-4 text-accent text-lg font-semibold">{notice}</p>
        <div className="mr-4 min-w-2 bg-accent opacity-70"></div>
        <div className={cn("w-full opacity-65 bg-[repeating-linear-gradient(45deg,#c6fb04_0px,#c6fb04_20px,transparent_20px,transparent_35px)]", className)}></div>
        <div className="ml-4 min-w-2 bg-accent opacity-55"></div>
      </div>
    </div>
  );
}
