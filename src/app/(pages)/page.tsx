import BackgroundImage from "../components/cosmetic/BackgroundImage";
import BackgroundImageData from "../assets/background-images/background-spectators.png";
import { Searchbox } from "../components/input/Searchbox";

export default function Home() {
  return (
    <main>
      <BackgroundImage image={BackgroundImageData} />
      <div>
        <h1>Player Search</h1>
        <p>Search Spectre Divide players to view their stats and match history.</p>
        <Searchbox />
      </div>
    </main>
  );
}
