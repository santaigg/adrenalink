import { Mohave } from "next/font/google";
import { createTheme, MantineColorsTuple } from "@mantine/core";

const primaryColors: MantineColorsTuple = ["#f9ffe2", "#f4ffcd", "#e8fe9c", "#dcfd67", "#d2fc3b", "#cbfb20", "#c8fb0d", "#afdf00", "#9bc700", "#83ab00"];
const surfaceColors: MantineColorsTuple = ["#f7f8fa", "#d9dbe6", "#babed1", "#9ba1bd", "#6d759f", "#565d83", "#424764", "#2e3145", "#191b26", "#050508"];

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