"use client";
import { IconArrowRight, IconSearch } from "@tabler/icons-react";
import { ActionIcon, FocusTrap, TextInput, TextInputProps, useMantineTheme } from "@mantine/core";
import Extrusion, { CornerLocation } from "../cosmetic/Extrusion";
import { useDisclosure } from "@mantine/hooks";
import { cn } from "@/app/utils/cn";

export function Searchbox({ props, className, focusTrap = false }: { props?: TextInputProps; className?: string; focusTrap: boolean }) {
  const theme = useMantineTheme();

  const [focused, { toggle }] = useDisclosure();

  return (
    <div className={className}>
      <Extrusion className={cn("min-w-24", focused ? "border-primary-5" : "border-surface-4")} cornerLocation={CornerLocation.TopRight} />
      <FocusTrap active={focusTrap}>
        <TextInput
          onFocus={toggle}
          onBlur={toggle}
          radius="0"
          size="md"
          placeholder="Search players by username or Steam64..."
          leftSection={<IconSearch size={18} stroke={1.5} />}
          rightSection={
            <ActionIcon size={30} radius="0" color={theme.primaryColor}>
              <IconArrowRight size={18} stroke={1.5} />
            </ActionIcon>
          }
          {...props}
        />
      </FocusTrap>
    </div>
  );
}
