"use client";
import { CornerLocation } from "../cosmetic/Extrusion";
import Logo from "./Logo";
import Extrusion from "../cosmetic/Extrusion";

const links = [
  { link: "/leaderboard", label: "Leaderboard" },
  // { link: "/about", label: "About" },
  // {
  //   link: "",
  //   label: "Contribute",
  //   links: [
  //     { link: "/faq", label: "FAQ" },
  //     { link: "/demo", label: "Book a demo" }, // DROPDOWN NAVBAR ITEM
  //     { link: "/forums", label: "Forums" },
  //   ],
  // },
];

export default function Navbar() {
  const items = links.map((link) => {
    return (
      <a key={link.label} href={link.link} className="hover:text-primary-5">
        {link.label}
      </a>
    );
  });

  return (
    <header className="mb-8">
      <div className="p-4 bg-island text-island-foreground">
        <Logo />
      </div>
      <Extrusion className="float-right min-w-[20%] border-island" cornerLocation={CornerLocation.BottomLeft} />
    </header>
  );
}
