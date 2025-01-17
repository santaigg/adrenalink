"use client";

import Logo from "./Logo";
import Extrusion from "../cosmetic/Extrusion";
import { CornerLocation } from "../cosmetic/Extrusion";
import Constrict from "../layout/Constrict";

export default function Footer() {
  return (
    <footer>
      <Extrusion className="min-w-[20%] border-primary" cornerLocation={CornerLocation.TopRight} />
      <div className="p-8 bg-primary">
        <Constrict className="flex flex-row justify-between">
          <div className="flex flex-col flex-1">
            <Logo />
            <p className="my-2 text-sm">Made by &nbsp; LIMIT, &nbsp; Haft, &nbsp; Antiparty, &nbsp; gomiooo.</p>
            <p className="w-1/2 text-xs text-muted-foreground">
              Santai.GG is not affiliated with Mountaintop Studios and all associated properties “Spectre Divide” are trademarks or registered trademarks of Mountaintop Studios.
            </p>
          </div>
          <div className="flex flex-col justify-between text-primary-foreground pl-4 border-l border-primary-foreground">
            <a className="hover:text-accent" href="https://discord.gg/santaigg">
              Join the Discord
            </a>
            <a className="hover:text-accent" href="https://github.com/santaigg">
              Contribute on GitHub
            </a>
            <a className="hover:text-accent" href="https://wavescan-production.up.railway.app/api/v1/swagger">
              Wavescan API Docs
            </a>
          </div>
        </Constrict>
      </div>
    </footer>
  );
}
