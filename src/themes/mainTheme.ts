import { createTheme, type MantineColorsTuple } from "@mantine/core";

const greenAccent: MantineColorsTuple = ["#E7F9ED", "#C2F0D1", "#9BE6B4", "#73DB96", "#4AD078", "#2DC661", "#25A04F", "#1D7B3D", "#15562B", "#0C3119"];
const success: MantineColorsTuple = ["#E8F5E8", "#D3F0D3", "#B8E6B8", "#9CDB9C", "#7ED07E", "#5FC55F", "#4A9A4A", "#376E37", "#245524", "#123C12"];
const error: MantineColorsTuple = ["#FFE8E8", "#FFD1D1", "#FFB3B3", "#FF9494", "#FF7575", "#FF5555", "#E04444", "#B33333", "#802222", "#4D1111"];
const warning: MantineColorsTuple = ["#FFF8E1", "#FFECB3", "#FFE082", "#FFD54F", "#FFCA28", "#FFC107", "#FFB300", "#FF8F00", "#FF6F00", "#E65100"];
const info: MantineColorsTuple = ["#E3F2FD", "#BBDEFB", "#90CAF9", "#64B5F6", "#42A5F5", "#2196F3", "#1E88E5", "#1976D2", "#1565C0", "#0D47A1"];

export default createTheme({
  primaryColor: "greenAccent",
  colors: {
    greenAccent,
    success,
    error,
    warning,
    info,
  },
  primaryShade: { light: 5, dark: 7 },
  white: "#F8F9FA",
  black: "#141517",
  fontFamily: "Inter",
  defaultRadius: "xs",

  breakpoints: {
    xs: "30em",
    sm: "48em",
    md: "64em",
    lg: "74em",
    xl: "90em",
  },

  spacing: {
    xs: "0.5rem",
    sm: "0.75rem",
    md: "1rem",
    lg: "1.25rem",
    xl: "1.5rem",
  },

  fontSizes: {
    xs: "0.75rem",
    sm: "0.875rem",
    md: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
  },

  lineHeights: {
    xs: "1.4",
    sm: "1.45",
    md: "1.55",
    lg: "1.6",
    xl: "1.65",
  },

  components: {
    Button: {
      defaultProps: {
        color: "greenAccent",
      },
      styles: {
        root: {
          minHeight: "44px",
          fontSize: "1rem",
          "@media (max-width: 48em)": {
            minHeight: "48px",
            fontSize: "1.1rem",
            padding: "0.75rem 1.25rem",
          },
        },
      },
    },

    Container: {
      defaultProps: {
        size: "xl",
      },
      styles: {
        root: {
          paddingLeft: "1rem",
          paddingRight: "1rem",
          "@media (max-width: 48em)": {
            paddingLeft: "0.75rem",
            paddingRight: "0.75rem",
          },
        },
      },
    },

    Card: {
      styles: {
        root: {
          transition: "all 0.2s ease",
          "@media (max-width: 48em)": {
            borderRadius: "0.25rem",
          },
        },
      },
    },

    Modal: {
      styles: {
        content: {
          "@media (max-width: 48em)": {
            margin: "0.5rem",
            maxWidth: "calc(100vw - 1rem)",
          },
        },
      },
    },

    Text: {
      styles: {
        root: {
          lineHeight: 1.55,
          "@media (max-width: 48em)": {
            lineHeight: 1.6,
          },
        },
      },
    },

    Title: {
      styles: {
        root: {
          lineHeight: 1.3,
          "@media (max-width: 48em)": {
            lineHeight: 1.4,
          },
        },
      },
    },

    Grid: {
      styles: {
        root: {
          margin: 0,
        },
        col: {
          paddingLeft: "0.5rem",
          paddingRight: "0.5rem",
          "@media (max-width: 48em)": {
            paddingLeft: "0.25rem",
            paddingRight: "0.25rem",
          },
        },
      },
    },

    Stack: {
      defaultProps: {
        gap: "md",
      },
      styles: {
        root: {
          "@media (max-width: 48em)": {
            gap: "0.75rem",
          },
        },
      },
    },

    Group: {
      defaultProps: {
        gap: "md",
      },
      styles: {
        root: {
          "@media (max-width: 48em)": {
            gap: "0.75rem",
          },
        },
      },
    },

    Paper: {
      styles: {
        root: {
          transition: "all 0.2s ease",
          "@media (max-width: 48em)": {
            borderRadius: "0.25rem",
          },
        },
      },
    },
  },

  other: {
    defaultProps: {
      color: "greenAccent",
    },
    fontWeights: {
      normal: 400,
      bold: 700,
    },
    gameBreakpoints: {
      mobile: "48em",
      tablet: "64em",
      desktop: "90em",
    },
    touchTargetSize: {
      minimum: "44px",
      comfortable: "48px",
    },
    gameSpacing: {
      boardGap: {
        mobile: "0.25rem",
        tablet: "0.5rem",
        desktop: "0.75rem",
      },
      cardPadding: {
        mobile: "0.75rem",
        tablet: "1rem",
        desktop: "1.25rem",
      },
    },
    animations: {
      fast: "0.15s ease",
      normal: "0.2s ease",
      slow: "0.3s ease",
      bounce: "0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
    },
  },
});
