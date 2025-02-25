import Extrusion, { CornerLocation } from "@/app/components/cosmetic/Extrusion";

export default function HomeStatTable({
  title,
  buttonHidden,
  children,
}: {
  title: string;
  buttonHidden: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-start justify-start w-full">
      <Extrusion
        className="border-secondary min-w-[30%] rounded-tl"
        cornerLocation={CornerLocation.TopRight}
      />
      <div className="w-full rounded border border-secondary rounded-tl-none flex flex-col">
        <div className="p-4">
          <h3>{title}</h3>
        </div>
        <div className="w-full bg-secondary/50 border-y border-secondary px-4 h-10 flex items-center justify-start">
          <div className="w-5/12 shrink-0 flex items-center justify-start">
            <p>{title.slice(0, -1)}</p>
          </div>
          <div className="w-full flex items-center justify-center">
            <p>Win %</p>
          </div>
          <div className="w-full flex items-center justify-center">
            <p>Pick %</p>
          </div>
          <div className="w-full flex items-center justify-center">
            <p>K/D</p>
          </div>
        </div>
        {children}
        {!buttonHidden && (
          <div className="w-full bg-secondary/50 h-10 flex items-center justify-center cursor-pointer hover:bg-secondary transition-all">
            View {title}
          </div>
        )}
      </div>
    </div>
  );
}
