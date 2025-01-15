import BackgroundImage from "../components/cosmetic/BackgroundImage";
import BackgroundImageData from "../assets/background-images/background-spectators.png";
import { Searchbox } from "../components/input/Searchbox";
import { Container, SimpleGrid } from "@mantine/core";

const PRIMARY_COL_HEIGHT = "300px";

export default function Home() {
  const SECONDARY_COL_HEIGHT = `calc(${PRIMARY_COL_HEIGHT} / 2 - var(--mantine-spacing-md) / 2)`;

  return (
    <main>
      <BackgroundImage image={BackgroundImageData} />

      <Container my="md">
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
          <div>
            <h1>Player Search</h1>
            <p>Search Spectre Divide players to view their stats and match history.</p>
            <Searchbox focusTrap className="my-4" />
          </div>
          <div className="bg-surface-0 w-full aspect-square"></div>
          <div className="bg-surface-1 w-full aspect-square"></div>
          <div className="bg-surface-2 w-full aspect-square"></div>
          <div className="bg-red-500 w-full aspect-square"></div>
          <div className="bg-muted w-full aspect-square"></div>
        </SimpleGrid>
      </Container>
    </main>
  );
}
