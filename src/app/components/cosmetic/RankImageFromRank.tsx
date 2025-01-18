import React from "react";
import Image, { ImageProps } from "next/image";

import { cn } from "@/app/utils/cn";
interface RankImageProps extends Omit<ImageProps, "src" | "alt"> {
  rank: string;
}

const RankImage: React.FC<RankImageProps> = ({ rank, className, ...props }) => {
  const rankImage = require(`@/app/assets/images/ranks/solo_ranks/${rank}.png`);

  return (
    <div>
      <Image
        src={rankImage.default}
        alt={`${rank} rank`}
        className={cn('h-8 w-8 shrink-0 min-w-8 min-h-8', className)}
        {...props}
      />
    </div>
  );
};

export { RankImage };
