import { Mohave } from "next/font/google";
import { createTheme, MantineColorsTuple } from "@mantine/core";

const primaryColors: MantineColorsTuple = ["#f9ffe2", "#f4ffcd", "#e8fe9c", "#dcfd67", "#d2fc3b", "#cbfb20", "#c8fb0d", "#afdf00", "#9bc700", "#83ab00"];
const surfaceColors: MantineColorsTuple = [
  "#fff5ff",
  "#dad0e1",
  "#b2c3d4",
  "#a1a8c7",
  "#7989b5",
  "#648499",
  "#4e5263",
  "#373531",
  "#212225",
  "#080809"
];

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