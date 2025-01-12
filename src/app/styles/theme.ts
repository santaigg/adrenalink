import { Mohave } from "next/font/google";
import { createTheme, MantineColorsTuple } from "@mantine/core";

const mantinePrimaryColor: MantineColorsTuple = ["#f9ffe2", "#f4ffcd", "#e8fe9c", "#dcfd67", "#d2fc3b", "#cbfb20", "#c8fb0d", "#afdf00", "#9bc700", "#83ab00"];
const mantineSurfaceColor: MantineColorsTuple = ["#f9ffe2", "#f4ffcd", "#e8fe9c", "#dcfd67", "#d2fc3b", "#cbfb20", "#c8fb0d", "#afdf00", "#9bc700", "#83ab00"];

export const santaiMantineTheme = createTheme({
  colors: { mantinePrimaryColor},
  primaryColor: "mantinePrimaryColor",
  autoContrast: true,
  fontFamily: "Mohave, serif",
  defaultRadius: "xs",
});

export const santaiFont = Mohave({
  variable: "--font-mohave",
  subsets: ["latin"],
});