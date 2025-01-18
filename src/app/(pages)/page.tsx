import BackgroundImage from "../components/cosmetic/BackgroundImage";
import BackgroundImageData from "../assets/images/background/background-spectators.png";
import { Searchbox } from "../components/input/Searchbox";
import Constrict from "../components/layout/Constrict";
import Image from "next/image";
import SpectreLogoImage from "../assets/images/brand/spectre-logo.png";
import NoticeBanner from "../components/information/NoticeBanner";

export default function Home() {
  return (
    <main className="h-full">
      <BackgroundImage image={BackgroundImageData} />
      <Constrict className="my-8 px-4">
        <NoticeBanner className="text-center" noticeTitle="Santai.GG / Flashpoint" noticeBottomText="Brand new website, polished experience." />
      </Constrict>
      <Constrict className="h-full px-4 flex flex-row gap-8">
        <div className="flex-1 flex flex-col gap-8 text-primary-foreground">
          <div>
            <div className="flex flex-row">
              <h2 className="mb-1 text-primary-foreground">Player Search</h2>
              <Image src={SpectreLogoImage} alt="Spectre Divide wordmark." className="h-6 w-auto ml-auto mt-auto mb-2 brightness-75" />
            </div>
            <Searchbox placeholder="Username or Steam64..." />
          </div>
          <div className="h-full p-4 bg-primary">Real time logs.</div>
        </div>
        <div className="flex-1 h-full p-4 bg-primary">Global stats here.</div>
      </Constrict>
    </main>
  );
}
