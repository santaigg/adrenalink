import React from "react";
import Image from "next/image";

interface SponsorImageProps {
  sponsor: string;
}

const SponsorImage: React.FC<SponsorImageProps> = ({ sponsor }) => {
  const sponsorImage = require(`@/app/assets/images/sponsors-logos/${sponsor}.png`);
  
  return (
    <div className="relative h-10 w-auto">
      <Image
        src={sponsorImage.default}
        alt={`${sponsor} Logo`}
        className="h-full w-auto object-contain"
      />
    </div>
  );
};

export { SponsorImage };
