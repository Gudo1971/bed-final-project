// ==============================================
// = CHAKRA THEME                                =
// ==============================================

import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  fonts: {
    heading: "Inter, system-ui, sans-serif",
    body: "Inter, system-ui, sans-serif",
  },

  colors: {
    brand: {
      50: "#e6f7f5",
      100: "#c0ebe6",
      200: "#99ded6",
      300: "#73d2c7",
      400: "#4cc6b7",
      500: "#33ad9e",
      600: "#25857a",
      700: "#185d56",
      800: "#0a3432",
      900: "#001c1a",
    },
  },

  styles: {
    global: (props) => ({
      body: {
        bg: props.colorMode === "light" ? "gray.50" : "gray.800",
        color: props.colorMode === "light" ? "gray.800" : "gray.100",
      },
    }),
  },

  components: {
    Button: {
      baseStyle: {
        borderRadius: "md",
        fontWeight: "medium",
      },
      sizes: {
        md: {
          px: 5,
          py: 3,
        },
      },
      variants: {
        solid: {
          bg: "brand.500",
          color: "white",
          _hover: { bg: "brand.600" },
        },
      },
    },

    Input: {
      baseStyle: {
        field: {
          borderRadius: "md",
        },
      },
      defaultProps: {
        focusBorderColor: "brand.500",
      },
    },

    FormLabel: {
      baseStyle: {
        fontWeight: "medium",
        color: "gray.700",
      },
    },
  },
});

export default theme;
