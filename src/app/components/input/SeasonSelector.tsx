"use client";
import { Select, SelectProps, useMantineTheme } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Extrusion, { CornerLocation } from "../cosmetic/Extrusion";
import { cn } from "@/app/utils/cn";

export function SeasonSelector(props: SelectProps) {
  const theme = useMantineTheme();
  const [focused, { toggle }] = useDisclosure();

  return (
    <div>
      <Select
        size="md"
        placeholder="Select Season"
        data={["Season 0", "Season 1"]}
        onFocus={toggle}
        onBlur={toggle}
        allowDeselect={false}
        styles={{
          input: { borderBottomLeftRadius: "0px" },
        }}
        {...props}
      />{" "}
      <Extrusion
        className={cn(
          "min-w-12",
          focused ? "border-primary-5" : "border-surface-4"
        )}
        cornerLocation={CornerLocation.BottomRight}
      />
    </div>
  );
}
