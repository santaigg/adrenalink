import BackgroundImage from "./components/cosmetic/BackgroundImage";
import BackgroundImageData from "./assets/background-images/background-00.png";

export default function Home() {
  return (
    <>
      <main>
        <BackgroundImage image={BackgroundImageData} />
      </main>
      <footer></footer>
    </>
  );
}
