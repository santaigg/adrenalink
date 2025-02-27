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
      try {
        // Ensure the first letter is capitalized for the file name
        const formattedSponsor = sponsor === 'tbd' ? 'tbd' : 
          sponsor.charAt(0).toUpperCase() + sponsor.slice(1);
        
        const image = await import(
          `@/app/assets/images/sponsors-logos/${formattedSponsor}.png`
        );
        setSponsorImage(image.default);
      } catch (error) {
        console.error(`Failed to load sponsor image for ${sponsor}:`, error);
        setSponsorImage(null);
      }
    };
    loadImage();
  }, [sponsor]);

  if (!sponsorImage) {
    // Return a placeholder or nothing when image can't be loaded
    return <div className={cn("h-10 w-auto bg-secondary/20 rounded-sm", className)} />;
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
