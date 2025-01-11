import Image from "next/image";
import Link from "next/link";
import type { StaticImageData } from "next/image";

export default function IconLink({ href, icon }: { href: string; icon: StaticImageData }) {
  return (
    <Link href={href}>
      <Image src={icon} alt="An icon." />
    </Link>
  );
}
