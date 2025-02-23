import React from "react";
import Image, { ImageProps } from "next/image";
import { useState, useEffect } from "react";
import { cn } from "@/app/utils/cn";
interface SponsorImageProps extends Omit<ImageProps, "src" | "alt"> {
  sponsor: string;
}

const SponsorImage: React.FC<SponsorImageProps> = ({
  sponsor,
  className,
  ...props
}) => {
  const [sponsorImage, setSponsorImage] = useState<string | null>(null);

  useEffect(() => {
    const loadImage = async () => {
      const image = await import(
        `@/app/assets/images/sponsors-logos/${sponsor}.png`
      );
      setSponsorImage(image.default);
    };
    loadImage();
  }, [sponsor]);

  if (!sponsorImage) {
    return null;
  }

  return (
    <div className={cn("relative h-10 w-auto", className)}>
      <Image
        src={sponsorImage}
        alt={`${sponsor} Logo`}
        className="h-full w-auto object-contain"
        {...props}
      />
    </div>
  );
};

export { SponsorImage };
