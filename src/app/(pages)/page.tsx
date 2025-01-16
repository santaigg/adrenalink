import BackgroundImage from "../components/cosmetic/BackgroundImage";
import BackgroundImageData from "../assets/images/background/background-spectators.png";
import { Searchbox } from "../components/input/Searchbox";
import Constrict from "../components/layout/Constrict";
import Image from "next/image";
import SpectreLogoImage from "../assets/images/brand/spectre-logo.png";

export default function Home() {
  return (
    <main>
      <BackgroundImage image={BackgroundImageData} />
      <Constrict className="flex flex-row">
        <div className="flex-1 w-full p-secondary rounded-secondary text-primary-foreground">
          <div className="flex flex-row">
            <h1 className="mb-1 text-white">Player Search</h1>
            <Image src={SpectreLogoImage} alt="Spectre Divide wordmark." className="h-6 w-auto ml-auto mt-auto mb-2" />
          </div>
          <Searchbox placeholder="Search players by username or Steam64..." />
        </div>
        <div className="flex-1"></div>
      </Constrict>
    </main>
  );
}
