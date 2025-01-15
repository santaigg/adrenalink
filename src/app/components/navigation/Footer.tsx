"use client";

import { IconBrandInstagram, IconBrandTwitter, IconBrandYoutube } from "@tabler/icons-react";
import { ActionIcon, Container, Group, Text } from "@mantine/core";
import Logo from "./Logo";
import Extrusion from "../cosmetic/Extrusion";
import { CornerLocation } from "../cosmetic/Extrusion";

const data = [
  {
    title: "",
    links: [
      { label: "Join the Discord", link: "https://discord.gg/santaigg" },
      { label: "Contribute to Santai.GG", link: "https://github.com/santaigg/santai" },
      { label: "Wavescan API Docs", link: "https://wavescan-production.up.railway.app/api/v1/swagger" },
    ],
  },
];

export default function Footer() {
  const groups = data.map((group) => {
    const links = group.links.map((link, index) => (
      <p key={index} className="hover:text-primary-5" onClick={(event) => event.preventDefault()}>
        {link.label}
      </p>
    ));

    return (
      <div className="" key={group.title}>
        <Text className="">{group.title}</Text>
        {links}
      </div>
    );
  });

  return (
    <footer>
      <Extrusion className="min-w-[20%] border-surface-8" cornerLocation={CornerLocation.TopRight} />
      <div className="flex-col p-8 bg-surface-8">
        <Container className="flex flex-row justify-between">
          <div>
            <Logo />
            <Text size="xs" c="dimmed" className="">
              The #1 Spectre Divide tracker.
            </Text>
            <Container className="flex-col mt-8">
              <Group gap={0} className="" wrap="nowrap">
                <ActionIcon size="lg" color="gray" variant="subtle">
                  <IconBrandTwitter size={18} stroke={1.5} />
                </ActionIcon>
                <ActionIcon size="lg" color="gray" variant="subtle">
                  <IconBrandYoutube size={18} stroke={1.5} />
                </ActionIcon>
                <ActionIcon size="lg" color="gray" variant="subtle">
                  <IconBrandInstagram size={18} stroke={1.5} />
                </ActionIcon>
              </Group>
              <Text c="dimmed" size="sm">
                © 2020 mantine.dev. All rights reserved. {/* may need to change this line */}
              </Text>
            </Container>
          </div>
          <div className="flex flex-col ml-auto">{groups}</div>
        </Container>
      </div>
    </footer>
  );
}
