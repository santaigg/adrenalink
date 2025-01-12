"use client";
import Image from "next/image";
import BackgroundImage from "./components/cosmetic/BackgroundImage";
import BackgroundImageData from "./assets/background-images/background-spectators.png";
import { Searchbox } from "./components/input/Searchbox";
import { Container, Grid, SimpleGrid, Skeleton } from "@mantine/core";
import SearchboxCardBackgroundImage from "./assets/card-images/card-newgirl.png";

const PRIMARY_COL_HEIGHT = "300px";

export default function Home() {
  const SECONDARY_COL_HEIGHT = `calc(${PRIMARY_COL_HEIGHT} / 2 - var(--mantine-spacing-md) / 2)`;

  return (
    <main>
      <BackgroundImage image={BackgroundImageData} />

      <Container my="md">
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
          <Searchbox />
        </SimpleGrid>
      </Container>
    </main>
  );
}
