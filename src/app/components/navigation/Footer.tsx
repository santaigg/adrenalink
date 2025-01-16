"use client";

import Logo from "./Logo";
import Extrusion from "../cosmetic/Extrusion";
import { CornerLocation } from "../cosmetic/Extrusion";

const data = [
  {
    title: "",
    links: [
      { label: "Join the Discord", link: "https://discord.gg/santaigg" },
      { label: "Contribute to Santai.GG", link: "https://github.com/santaigg/santai" },
      { label: "Wavescan API Docs", link: "https://wavescan-production.up.railway.app/api/v1/swagger" },
    ],
  },
];

export default function Footer() {
  return (
    <footer>
      <Extrusion className="min-w-[20%] border-primary" cornerLocation={CornerLocation.TopRight} />
      <div className="flex-col p-8 bg-white"></div>
    </footer>
  );
}
