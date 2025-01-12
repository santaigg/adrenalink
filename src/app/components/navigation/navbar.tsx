"use client";
import { Burger, Center, Container, Group, Menu } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Logo from "./Logo";
import Extrusion from "../cosmetic/Extrusion";
import { CornerLocation } from "../cosmetic/Extrusion";

const links = [
  { link: "/about", label: "Leaderboard" },
  { link: "/about", label: "About" },
  // {
  //   link: "",
  //   label: "Contribute",
  //   links: [
  //     { link: "/faq", label: "FAQ" },
  //     { link: "/demo", label: "Book a demo" },       // DROPDOWN NAVBAR ITEM
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
                <svg width="24px" height="24px" strokeWidth="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000">
                  <path d="M6 9L12 15L18 9" stroke="#c9c9c9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
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
      <div className="p-4 bg-surface-dark">
        <Container className="flex justify-between items-center">
          <Logo />
          <Group gap={20} visibleFrom="sm">
            {items}
          </Group>
          <Burger opened={opened} onClick={toggle} size="sm" hiddenFrom="sm" />
        </Container>
      </div>
      <Extrusion className="float-right min-w-[50%] border-surface-dark" cornerLocation={CornerLocation.BottomLeft} />
    </header>
  );
}
