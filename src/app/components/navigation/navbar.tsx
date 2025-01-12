"use client";
import { Burger, Center, Container, Group, Menu } from "@mantine/core";
import { IconChevronDown } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import Logo from "./Logo";
import Extrusion from "../cosmetic/Extrusion";
import { CornerLocation } from "../cosmetic/Extrusion";
import { IconBrandDiscordFilled } from "@tabler/icons-react";

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
    const menuItems = link.links?.map((item) => <Menu.Item key={item.link}>{item.label}</Menu.Item>);

    if (menuItems) {
      return (
        <Menu key={link.label} trigger="hover" transitionProps={{ exitDuration: 0 }} withinPortal>
          <Menu.Target>
            <a href={link.link} onClick={(event) => event.preventDefault()}>
              <Center>
                <span className="">{link.label}</span>
                <IconChevronDown size={14} stroke={1.5} />
              </Center>
            </a>
          </Menu.Target>
          <Menu.Dropdown>{menuItems}</Menu.Dropdown>
        </Menu>
      );
    }

    return (
      <a key={link.label} href={link.link} className="hover:text-santai" onClick={(event) => event.preventDefault()}>
        {link.label}
      </a>
    );
  });

  return (
    <header>
      <div className="p-4 bg-surface-9">
        <Container className="flex justify-between items-center">
          <Logo />
          <Group gap={25} visibleFrom="sm">
            {items}
            <a className="hover:text-primary-9" target="_blank" rel="noopener noreferrer" href="https://discord.gg/EqBWSAnPkq">
              <IconBrandDiscordFilled />
            </a>
          </Group>
          <Burger opened={opened} onClick={toggle} size="sm" hiddenFrom="sm" />
        </Container>
      </div>
      <Extrusion className="float-right min-w-[25%] border-surface-9" cornerLocation={CornerLocation.BottomLeft} />
    </header>
  );
}
