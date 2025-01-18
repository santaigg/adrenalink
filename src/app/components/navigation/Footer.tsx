"use client";

import Logo from "./Logo";
import Extrusion from "../cosmetic/Extrusion";
import { CornerLocation } from "../cosmetic/Extrusion";
import Constrict from "../layout/Constrict";
import ExternalLink from "./ExternalLink";
import projectData from "../../project-data.json";

export default function Footer() {
  return (
    <footer>
      <Extrusion className="min-w-[20%] border-primary" cornerLocation={CornerLocation.TopRight} />
      <div className="p-8 bg-primary">
        <Constrict className="flex flex-row justify-between">
          <div className="flex flex-col flex-1">
            <Logo />
            <p className="my-2 text-sm">
              Made by
              {projectData.developers.length > 0 &&
                projectData.developers.map((developer) => (
                  <>
                    &nbsp;&nbsp; <ExternalLink href={developer.socialLink} title={developer.name} />
                  </>
                ))}
            </p>
            <p className="w-1/2 text-xs text-muted-foreground">
              Santai.GG is not affiliated with Mountaintop Studios and all associated properties “Spectre Divide” are trademarks or registered trademarks of Mountaintop Studios.
            </p>
          </div>
          <div className="flex flex-col items-end justify-between text-primary-foreground pr-4 border-r border-primary-foreground">
            {projectData.links.social.length > 0 && projectData.links.social.map((item) => <ExternalLink href={item.link} title={item.title} />)}
            {projectData.links.contribution.length > 0 && projectData.links.contribution.map((item) => <ExternalLink href={item.link} title={item.title} />)}
          </div>
        </Constrict>
      </div>
    </footer>
  );
}
