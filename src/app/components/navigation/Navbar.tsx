"use client";
import { CornerLocation } from "../cosmetic/Extrusion";
import Logo from "./Logo";
import Extrusion from "../cosmetic/Extrusion";
import Link from "next/link";
import Constrict from "../layout/Constrict";
import ExternalLink from "./ExternalLink";
import projectData from "../../project-data.json";

export default function Navbar() {
  return (
    <header className="mb-primary">
      <div className="bg-primary text-primary-foreground">
        <Constrict className="flex flex-row justify-between p-4">
          <Logo />
          <div className="flex flex-row float-right gap-primary">
            <Link className="hidden sm:inline hover:text-accent" href={"/"}>
              Home
            </Link>
            <Link className="hover:text-accent" href={"/leaderboard"}>
              Leaderboard
            </Link>
            {projectData.links.social.length > 0 &&
              projectData.links.social.map((item) => (
                <ExternalLink
                  key={item.title}
                  href={item.link}
                  title={item.title}
                />
              ))}
          </div>
        </Constrict>
      </div>
      <Extrusion
        className="float-right min-w-[15%] border-primary"
        cornerLocation={CornerLocation.BottomLeft}
      />
    </header>
  );
}
