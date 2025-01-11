import Image from "next/image";
import type { StaticImageData } from "next/image";

export default function BackgroundImage({ image }: { image: StaticImageData }) {
  return (
    <Image
      src={image}
      alt="Background Image."
      className="absolute top-0 -z-50 size-full object-cover opacity-60 blur-lg mix-blend-color-dodge saturate-0 brightness-75 pointer-events-none"
    />
  );
}
