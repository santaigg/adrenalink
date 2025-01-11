"use client";
import { AppShell, Group } from "@mantine/core";
import { useHeadroom } from "@mantine/hooks";
import { CornerLocation } from "../cosmetic/Extrusion";
import Logo from "./Logo";
import Extrusion from "../cosmetic/Extrusion";

export default function Navbar() {
  const pinned = useHeadroom({ fixedAt: 120 });

  return (
    <AppShell header={{ height: 50, collapsed: !pinned, offset: false }}>
      <AppShell.Header>
        <Group className="h-full px-4 bg-surface-dark">
          <Logo />
        </Group>
        <Extrusion className="border-surface-dark min-w-40" cornerLocation={CornerLocation.BottomRight} />
      </AppShell.Header>
    </AppShell>
  );
}
