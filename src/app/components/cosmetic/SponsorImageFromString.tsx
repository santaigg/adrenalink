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
  const parsedSponsor = sponsor[0].toUpperCase() + sponsor.slice(1);

  useEffect(() => {
    const loadImage = async () => {
      const image = await import(
        `@/app/assets/images/sponsors-logos/${parsedSponsor}.png`
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

type SponsorKey =
  | "pinnacle"
  | "morrgen"
  | "bloom"
  | "ryker"
  | "vector"
  | "ghostlink"
  | "muu"
  | "umbra"
  | "monark";

interface AbilityImageProps extends Omit<ImageProps, "src" | "alt"> {
  sponsor: SponsorKey;
  ability: "q" | "e" | "c";
}

const imageMap: Record<SponsorKey, Record<"q" | "e" | "c", string>> = {
  pinnacle: {
    q: require("@/app/assets/images/sponsor-abilities/pinnacle/Splinter Grenade.png")
      .default,
    e: require("@/app/assets/images/sponsor-abilities/pinnacle/Adrena-Link.png")
      .default,
    c: require("@/app/assets/images/sponsor-abilities/pinnacle/Flash Grenade.png")
      .default,
  },
  morrgen: {
    q: require("@/app/assets/images/sponsor-abilities/morrgen/Smoke Shift.png")
      .default,
    e: require("@/app/assets/images/sponsor-abilities/morrgen/Meltdown.png")
      .default,
    c: require("@/app/assets/images/sponsor-abilities/morrgen/Hidden Grasp.png")
      .default,
  },
  bloom: {
    q: require("@/app/assets/images/sponsor-abilities/bloom/Hex Barrier.png")
      .default,
    e: require("@/app/assets/images/sponsor-abilities/bloom/Twin Mend.png")
      .default,
    c: require("@/app/assets/images/sponsor-abilities/bloom/Swarm Grenade.png")
      .default,
  },
  ryker: {
    q: require("@/app/assets/images/sponsor-abilities/ryker/Wave Scan.png")
      .default,
    e: require("@/app/assets/images/sponsor-abilities/ryker/Hull Mine.png")
      .default,
    c: require("@/app/assets/images/sponsor-abilities/ryker/Arc Sentry.png")
      .default,
  },
  vector: {
    q: require("@/app/assets/images/sponsor-abilities/vector/Dual Amp.png")
      .default,
    e: require("@/app/assets/images/sponsor-abilities/vector/Vector Wall.png")
      .default,
    c: require("@/app/assets/images/sponsor-abilities/vector/Nano Sphere.png")
      .default,
  },
  ghostlink: {
    q: require("@/app/assets/images/sponsor-abilities/ghostlink/Partition.png")
      .default,
    e: require("@/app/assets/images/sponsor-abilities/ghostlink/Dupe.png")
      .default,
    c: require("@/app/assets/images/sponsor-abilities/ghostlink/Dead Zone.png")
      .default,
  },
  muu: {
    q: require("@/app/assets/images/sponsor-abilities/muu/Patches.png").default,
    e: require("@/app/assets/images/sponsor-abilities/muu/Dazzler.png").default,
    c: require("@/app/assets/images/sponsor-abilities/muu/Hyper Dome.png")
      .default,
  },
  umbra: {
    q: require("@/app/assets/images/sponsor-abilities/umbra/Recon Wing.png")
      .default,
    e: require("@/app/assets/images/sponsor-abilities/umbra/Pulsefinder.png")
      .default,
    c: require("@/app/assets/images/sponsor-abilities/umbra/Glare Burst.png")
      .default,
  },
  // monark: {
  //   q: require("@/app/assets/images/sponsor-abilities/monark/Sovereign Shell.png")
  //     .default,
  //   e: require("@/app/assets/images/sponsor-abilities/monark/Crosswall.png")
  //     .default,
  //   c: require("@/app/assets/images/sponsor-abilities/monark/Siphon.png")
  //     .default,
  // },
};

const AbilityImage: React.FC<AbilityImageProps> = ({
  sponsor,
  ability,
  className,
  ...props
}) => {
  const sponsorImage = imageMap[sponsor]?.[ability] || null;

  return (
    <div className={cn("relative h-10 w-auto", className)}>
      {sponsorImage ? (
        <Image
          src={sponsorImage}
          alt={`${sponsor} - ${ability}`}
          className="h-full w-auto object-contain"
          {...props}
        />
      ) : (
        <p>Image not found</p>
      )}
    </div>
  );
};

export { SponsorImage, AbilityImage };
