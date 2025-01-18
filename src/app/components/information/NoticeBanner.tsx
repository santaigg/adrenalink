import { cn } from "../../utils/cn";

export default function NoticeBanner({ className, noticeTitle, noticeBottomText }: { className?: string; noticeTitle: string; noticeBottomText?: string }) {
  return (
    <div className="py-8 border-b-2 border-dashed border-accent border-opacity-40">
      <p className="mb-2 text-accent text-xl font-semibold">{noticeTitle}</p>
      <div className={cn("w-full h-12 opacity-60 bg-[repeating-linear-gradient(45deg,#c6fb04_0px,#c6fb04_20px,transparent_20px,transparent_35px)]", className)}></div>
      <p className="mt-2 text-accent">{noticeBottomText}</p>
    </div>
  );
}
