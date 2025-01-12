import { Mohave } from "next/font/google";
import { createTheme, MantineColorsTuple } from "@mantine/core";

const primaryColors: MantineColorsTuple = ["#f9ffe2", "#f4ffcd", "#e8fe9c", "#dcfd67", "#d2fc3b", "#cbfb20", "#c8fb0d", "#afdf00", "#9bc700", "#83ab00"];
const surfaceColors: MantineColorsTuple = ["#fefdff", "#f5f5f6", "#cfcfd0", "#a9a9aa", "#8c91aa", "#6d7184", "#4e515e", "#3e435e", "#252838", "#0c0d12"];

export const mantineTheme = createTheme({
  colors: {
    primaryColors,
    surfaceColors,
    dark: surfaceColors
  },
  primaryColor: "primaryColors",
  autoContrast: true,
  fontSmoothing: true,
  fontFamily: "Mohave, serif",
  defaultRadius: "xs",
});

export const santaiFont = Mohave({
  variable: "--font-mohave",
  subsets: ["latin"],
});