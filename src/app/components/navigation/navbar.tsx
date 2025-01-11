"use client";
import { Burger, Center, Container, Group, Menu } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Logo from "./Logo";
import Extrusion from "../cosmetic/Extrusion";
import { CornerLocation } from "../cosmetic/Extrusion";

const links = [
  { link: "/about", label: "Features" },
  {
    link: "#1",
    label: "Learn",
    links: [
      { link: "/docs", label: "Documentation" },
      { link: "/resources", label: "Resources" },
      { link: "/community", label: "Community" },
      { link: "/blog", label: "Blog" },
    ],
  },
  { link: "/about", label: "About" },
  { link: "/pricing", label: "Pricing" },
  {
    link: "#2",
    label: "Support",
    links: [
      { link: "/faq", label: "FAQ" },
      { link: "/demo", label: "Book a demo" },
      { link: "/forums", label: "Forums" },
    ],
  },
];

export default function Navbar() {
  const [opened, { toggle }] = useDisclosure(false);

  const items = links.map((link) => {
    const menuItems = link.links?.map((item) => <Menu.Item key={item.link}>{item.label}</Menu.Item>);

    if (menuItems) {
      return (
        <Menu key={link.label} trigger="hover" transitionProps={{ exitDuration: 0 }} withinPortal>
          <Menu.Target>
            <a href={link.link} className="" onClick={(event) => event.preventDefault()}>
              <Center>
                <span className="">{link.label}</span>
                <svg width="24px" height="24px" strokeWidth="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000">
                  <path d="M6 9L12 15L18 9" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
              </Center>
            </a>
          </Menu.Target>
          <Menu.Dropdown>{menuItems}</Menu.Dropdown>
        </Menu>
      );
    }

    return (
      <a key={link.label} href={link.link} className="" onClick={(event) => event.preventDefault()}>
        {link.label}
      </a>
    );
  });

  return (
    <header className="p-4 bg-surface-dark">
      <Container>
        <div className="flex justify-between items-center">
          <Logo />
          <Group gap={5} visibleFrom="sm">
            {items}
          </Group>
          <Burger opened={opened} onClick={toggle} size="sm" hiddenFrom="sm" />
        </div>
        <Extrusion className="bg-surface-dark" cornerLocation={CornerLocation.BottomRight} />
      </Container>
    </header>
  );
}
