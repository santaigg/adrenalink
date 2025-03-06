import React from "react";
import Image, { ImageProps } from "next/image";
import { cn } from "@/app/utils/cn";

interface WeaponImageProps extends Omit<ImageProps, "src" | "alt"> {
  weapon: string;
}

const WeaponImage: React.FC<WeaponImageProps> = ({
  weapon,
  className,
  ...props
}) => {
  if (!weapon) {
    return null;
  }

  let imageSrc;
  try {
    imageSrc =
      require(`@/app/assets/images/weapons/color/${weapon}.png`).default;
  } catch (error) {
    return null;
  }

  return (
    <div className={cn("relative h-full w-full", className)}>
      <Image
        src={imageSrc}
        alt={`${weapon} Image`}
        className="h-full w-full abs"
        {...props}
      />
    </div>
  );
};

export { WeaponImage };
