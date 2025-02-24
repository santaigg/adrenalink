import { cn } from "../../utils/cn";
import Logo from "../navigation/Logo";
import Constrict from "@/app/components/layout/Constrict";

export default function NoticeBanner({
  className,
  noticeTitle,
  noticeBottomText,
  ver = 1,
}: {
  className?: string;
  noticeTitle: string;
  noticeBottomText?: string;
  ver?: number;
}) {
  if (ver == 1) {
    return (
      <Constrict className="my-8 px-4">
        <div
          className={cn(
            "py-4 border-y-2 border-dashed border-accent border-opacity-40",
            className
          )}
        >
          <p className="mb-2 text-accent text-xl font-semibold">
            {noticeTitle}
          </p>
          <div
            className={cn(
              "w-full h-12 opacity-60 bg-[repeating-linear-gradient(45deg,#c6fb04_0px,#c6fb04_20px,transparent_20px,transparent_35px)]",
              className
            )}
          ></div>
          <p className="mt-2 text-accent">{noticeBottomText}</p>
        </div>
      </Constrict>
    );
  } else {
    return (
      <Constrict className="my-8 px-0 max-w-none">
        <div className={cn("flex-col", className)}>
          <div className="flex h-14">
            <div
              className={cn(
                "w-full h-full opacity-40 bg-[repeating-linear-gradient(45deg,#c6fb04_0px,#c6fb04_20px,transparent_20px,transparent_35px)]",
                className
              )}
            />
            <div className="shrink-0 px-4 mx-4 border-x-2 border-accent border-opacity-40 flex flex-col items-center justify-center">
              <p className="text-accent text-3xl font-semibold">
                {noticeTitle}
              </p>
              <p className="mt-2 text-accent">{noticeBottomText}</p>
            </div>
            <div
              className={cn(
                "w-full h-full opacity-40 bg-[repeating-linear-gradient(-45deg,#c6fb04_0px,#c6fb04_20px,transparent_20px,transparent_35px)]",
                className
              )}
            />
          </div>
        </div>
      </Constrict>
    );
  }
}
