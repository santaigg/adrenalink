"use client";
import { Burger, Container, Group } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { CornerLocation } from "../cosmetic/Extrusion";
import { IconBrandDiscordFilled } from "@tabler/icons-react";
import Logo from "./logo";
import Extrusion from "../cosmetic/Extrusion";

const links = [
  { link: "/leaderboard", label: "Leaderboard" },
  // { link: "/about", label: "About" },
  // {
  //   link: "",
  //   label: "Contribute",
  //   links: [
  //     { link: "/faq", label: "FAQ" },
  //     { link: "/demo", label: "Book a demo" }, // DROPDOWN NAVBAR ITEM
  //     { link: "/forums", label: "Forums" },
  //   ],
  // },
];

export default function Navbar() {
  const [opened, { toggle }] = useDisclosure(false);

  const items = links.map((link) => {
    return (
      <a key={link.label} href={link.link} className="hover:text-primary-5" onClick={(event) => event.preventDefault()}>
        {link.label}
      </a>
    );
  });

  return (
    <header className="mb-8">
      <div className="p-4 bg-surface-8">
        <Container className="flex justify-between items-center">
          <Logo />
          <Group gap={25} visibleFrom="sm">
            {items}
            <a className="hover:text-primary-5" target="_blank" rel="noopener noreferrer" href="https://discord.gg/EqBWSAnPkq">
              <IconBrandDiscordFilled />
            </a>
          </Group>
          <Burger opened={opened} onClick={toggle} size="sm" hiddenFrom="sm" />
        </Container>
      </div>
      <Extrusion className="float-right min-w-[20%] border-surface-8" cornerLocation={CornerLocation.BottomLeft} />
    </header>
  );
}
