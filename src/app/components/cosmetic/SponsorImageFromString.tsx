import React from "react";
import Image, { ImageProps } from "next/image";
import { cn } from "@/app/utils/cn";
interface SponsorImageProps extends Omit<ImageProps, "src" | "alt"> {
  sponsor: string;
}

const SponsorImage: React.FC<SponsorImageProps> = ({
  sponsor,
  className,
  ...props
}) => {
  const sponsorImage = require(`@/app/assets/images/sponsors-logos/${sponsor}.png`);

  return (
    <div className={cn("relative h-10 w-auto", className)}>
      <Image
        src={sponsorImage.default}
        alt={`${sponsor} Logo`}
        className="h-full w-auto object-contain"
      />
    </div>
  );
};

export { SponsorImage };
