// theme/index.ts
import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  
colors: {
    brand: {
      50: "#e6f5e6",
      100: "#c2e0c2",
      200: "#9dd09d",
      300: "#79bf79",
      400: "#54af54",
      500: "#2f9e2f", // Primary green
      600: "#1e841e",
      700: "#0e6a0e",
      800: "#005000",
      900: "#003700",
    },
    dark: {
      50: "#f2f2f2",
      100: "#d9d9d9",
      200: "#bfbfbf",
      300: "#a6a6a6",
      400: "#8c8c8c",
      500: "#737373",
      600: "#595959",
      700: "#404040",
      800: "#262626", // Primary dark
      900: "#0d0d0d", // Darkest
    },
    gold: {
      50: "#fffaf0",
      100: "#feebc8",
      200: "#fbd38d",
      300: "#f6ad55",
      400: "#ed8936",
      500: "#dd6b20", // Primary gold
      600: "#c05621",
      700: "#9c4221",
      800: "#7b341e",
      900: "#652b19",
    },
  },
  fonts: {
    heading: "'Montserrat', sans-serif",
    body: "'Open Sans', sans-serif",
  },
  styles: {
    global: {
      body: {
        bg: "dark.900",
        color: "white",
      },
    },
  },
  components: {
    Button: {
      variants: {
        solid: {
          bg: "brand.500",
          color: "white",
          _hover: {
            bg: "brand.600",
          },
        },
        outline: {
          borderColor: "brand.500",
          color: "brand.500",
          _hover: {
            bg: "rgba(47, 158, 47, 0.1)",
          },
        },
      },
    },
    Link: {
      baseStyle: {
        color: "brand.500",
        _hover: {
          textDecoration: "none",
          color: "brand.400",
        },
      },
    },
  },
});

export default theme;