import { cn } from "../../utils/cn";

export default function NoticeBanner({ className, notice }: { className?: string; notice: string }) {
  return (
    <div>
      <p className="mb-2 text-accent text-xl font-semibold">{notice}</p>
      <div className={cn("w-full h-12 opacity-50 bg-[repeating-linear-gradient(45deg,#c6fb04_0px,#c6fb04_20px,transparent_20px,transparent_35px)]", className)}></div>
      {/* <div className="flex flex-row min-h-20">
        <div className="mr-4 min-w-2 bg-accent opacity-55"></div>
        <div className={cn("w-full opacity-65 bg-[repeating-linear-gradient(45deg,#c6fb04_0px,#c6fb04_20px,transparent_20px,transparent_35px)]", className)}></div>
        <div className="ml-4 min-w-2 bg-accent opacity-70"></div>
        <div className="flex">
          <p className="w-max min-w-max my-auto mx-4 text-accent text-xl font-semibold">{notice}</p>
        </div>
        <div className="mr-4 min-w-2 bg-accent opacity-70"></div>
        <div className={cn("w-full opacity-65 bg-[repeating-linear-gradient(45deg,#c6fb04_0px,#c6fb04_20px,transparent_20px,transparent_35px)]", className)}></div>
        <div className="ml-4 min-w-2 bg-accent opacity-55"></div>
      </div> */}
    </div>
  );
}
