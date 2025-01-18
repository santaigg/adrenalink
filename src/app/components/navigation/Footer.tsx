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
        <Constrict className="flex flex-col sm:flex-row justify-between">
          <div className="flex flex-col flex-1 items-center sm:items-start">
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
            <p className="sm:w-1/2 text-center sm:text-left text-xs text-muted-foreground">{projectData.affiliateNotice}</p>
          </div>
          <div className="flex flex-col items-center sm:items-end justify-between text-primary-foreground mt-2 pl-4 sm:pr-4 sm:border-r border-primary-foreground">
            {projectData.links.social.length > 0 && projectData.links.social.map((item) => <ExternalLink key={null} href={item.link} title={item.title} />)}
            {projectData.links.contribution.length > 0 && projectData.links.contribution.map((item) => <ExternalLink key={null} href={item.link} title={item.title} />)}
          </div>
        </Constrict>
      </div>
    </footer>
  );
}
