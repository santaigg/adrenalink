import { cn } from "../../utils/cn";
import Logo from "../navigation/Logo";
export default function NoticeBanner({
  className,
  noticeTitle,
  noticeBottomText,
}: {
  className?: string;
  noticeTitle: string;
  noticeBottomText?: string;
}) {
  return (
    <div
      className={cn(
        "py-4 border-y-2 border-dashed border-accent border-opacity-40",
        className
      )}
    >
      <p className="mb-2 text-accent text-xl font-semibold">{noticeTitle}</p>
      <div
        className={cn(
          "w-full h-12 opacity-60 bg-[repeating-linear-gradient(45deg,#c6fb04_0px,#c6fb04_20px,transparent_20px,transparent_35px)]",
          className
        )}
      ></div>
      <p className="mt-2 text-accent">{noticeBottomText}</p>
    </div>
  );
}

// export default function NoticeBanner({
//   className,
//   noticeTitle,
//   noticeBottomText,
// }: {
//   className?: string;
//   noticeTitle: string;
//   noticeBottomText?: string;
// }) {
//   return (
//     <div className={cn("flex-col", className)}>
//       <div className="flex">
//         <div
//           className={cn(
//             "w-full h-12 opacity-40 bg-[repeating-linear-gradient(45deg,#c6fb04_0px,#c6fb04_20px,transparent_20px,transparent_35px)]",
//             className
//           )}
//         />
//         <div className="shrink-0 px-4 mx-4 border-x-2 border-accent border-opacity-40 flex items-center justify-center">
//           <p className="mb-2 text-accent text-xl font-semibold">
//             {noticeTitle}
//           </p>
//         </div>
//         <div
//           className={cn(
//             "w-full h-12 opacity-40 bg-[repeating-linear-gradient(-45deg,#c6fb04_0px,#c6fb04_20px,transparent_20px,transparent_35px)]",
//             className
//           )}
//         />
//       </div>
//       <p className="mt-2 text-  ">{noticeBottomText}</p>
//     </div>
//   );
// }
