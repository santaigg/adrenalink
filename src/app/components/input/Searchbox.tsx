"use client";
import { IconArrowRight, IconSearch } from "@tabler/icons-react";
import { ActionIcon, TextInput, TextInputProps, useMantineTheme } from "@mantine/core";
import Extrusion, { CornerLocation } from "../cosmetic/Extrusion";

export function Searchbox(props: TextInputProps) {
  const theme = useMantineTheme();

  return (
    <>
      <Extrusion className="min-w-24" cornerLocation={CornerLocation.TopRight} />
      <TextInput
        radius="0"
        size="md"
        placeholder="Username or Steam64..."
        rightSectionWidth={42}
        leftSection={<IconSearch size={18} stroke={1.5} />}
        rightSection={
          <ActionIcon size={30} radius="0" color={theme.primaryColor} variant="filled">
            <IconArrowRight size={18} stroke={1.5} />
          </ActionIcon>
        }
        {...props}
      />
    </>
  );
}
