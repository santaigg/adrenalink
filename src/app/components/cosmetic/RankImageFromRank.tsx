import React from "react";
import Image, { ImageProps } from "next/image";
import { useState, useEffect } from "react";

import { cn } from "@/app/utils/cn";
interface RankImageProps extends Omit<ImageProps, "src" | "alt"> {
  rank: string;
}

const RankImage: React.FC<RankImageProps> = ({ rank, className, ...props }) => {
  const [rankImage, setRankImage] = useState<string | null>(null);

  useEffect(() => {
    const loadImage = async () => {
      const image = await import(`@/app/assets/images/ranks/solo_ranks/${rank}.png`);
      setRankImage(image.default);
    };
    loadImage();
  }, [rank]);

  if (!rankImage) {
    return null; // Or a loading spinner
  }
  
  return (
    <div>
      <Image
        src={rankImage}
        alt={`${rank} rank`}
        className={cn('h-8 w-8 shrink-0 min-w-8 min-h-8', className)}
        {...props}
      />
    </div>
  );
};

export { RankImage };
