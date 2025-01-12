import BackgroundImage from "./components/cosmetic/BackgroundImage";
import BackgroundImageData from "./assets/background-images/background-00.png";
import { Searchbox } from "./components/input/Searchbox";

export default function Home() {
  return (
    <>
      <BackgroundImage image={BackgroundImageData} />
      <main>
        <Searchbox />
      </main>
      <footer></footer>
    </>
  );
}
