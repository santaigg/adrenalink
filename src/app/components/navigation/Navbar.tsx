"use client";
import * as React from "react";
import Link from "next/link";
import Logo from "./Logo";
import { Searchbox } from "../input/Searchbox";
import Constrict from "../layout/Constrict";
import ExternalLink from "./ExternalLink";
import Extrusion, { CornerLocation } from "../cosmetic/Extrusion";
import projectData from "../../project-data.json";

export default function Navbar() {
  return (
    <header className="mb-primary z-50">
      <div className="bg-primary text-primary-foreground">
        <Constrict className="flex items-center flex-row justify-between p-4">
          <div className="flex items-center gap-primary">
            <Logo />
            {/* <Searchbox placeholder="Search"/> */}
          </div>
          <div className="flex flex-row float-right gap-primary">
            <Link className="hidden sm:inline hover:text-accent" href={"/"}>
              Home
            </Link>
            <Link className="hover:text-accent" href={"/leaderboard"}>
              Leaderboard
            </Link>
            {projectData.links.social.length > 0 &&
              projectData.links.social.map((item) => (
                <React.Fragment key={item.title}>
                  <ExternalLink href={item.link} title={item.title} />
                </React.Fragment>
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
