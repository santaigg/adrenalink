import { Mohave } from "next/font/google";
import { createTheme, MantineColorsTuple } from "@mantine/core";

const mantinePrimaryColors: MantineColorsTuple = ["#f9ffe2", "#f4ffcd", "#e8fe9c", "#dcfd67", "#d2fc3b", "#cbfb20", "#c8fb0d", "#afdf00", "#9bc700", "#83ab00"];
const mantineSurfaceColors: MantineColorsTuple = ["#f0f1f5", "#d1d4e0", "#b3b7cc", "#949ab8", "#757da3", "#5c638a", "#474d6b", "#33374d", "#1f212e", "#0a0b0f"];

export const santaiMantineTheme = createTheme({
  colors: {
    mantinePrimaryColors,
    dark: mantineSurfaceColors
  },
  primaryColor: "mantinePrimaryColors",
  autoContrast: true,
  fontSmoothing: true,
  fontFamily: "Mohave, serif",
  defaultRadius: "xs",
});

export const santaiFont = Mohave({
  variable: "--font-mohave",
  subsets: ["latin"],
});