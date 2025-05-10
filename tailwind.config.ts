import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        vintage:{
          default: "#FFFFFF",
          50:'#001E45'
        },
        primary: {
          500: "#624CF5",
          50: "#52FC18",
          100: "#181926",
          200: '#848BAC',
          DEFAULT: "#050614",
          foreground: "hsl(var(--primary-foreground))",
        },
        primary2: {
          DEFAULT:"#AD1AAF",
          50:"#E71CE8",
          100:"#05778D",
          200:"#10394D",
        },
        coral: {
          500: "#15BF59",
        },
        brown: {
          DEFAULT:"#C6AC8F",
          50:"#EFE7DD",
          100:"#65625D",
          200: '#C6AC8F',
          300:"#E9DED3",
          400: "#F3EFE8"
        },

        grey: {
          600: "#545454", // Subdued - color name in figma
          500: "#757575",
          400: "#AFAFAF", // Disabled - color name in figma
          50: "#F6F6F6", // White Grey - color name in figma
        },
        black: "#000000",
        white: "#FFFFFF",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        foreground: "hsl(var(--foreground))",
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        oxanium: ["var(--font-oxanium)"],
        averia: ["var(--font-averia)"],
        poppins : ["var(--font-poppins)"]
      },
      backgroundImage: {
        "hero-img": "url('/assets/images/hero.png')",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      // these keyframes will be used bt the shadCn Ui library for animations of components.
      keyframes: {
        aurora: {
          from: {
            backgroundPosition: "50% 50%, 50% 50%",
          },
          to: {
            backgroundPosition: "350% 50%, 350% 50%",
          },
        },
        scroll: {
          to: {
            transform: "translate(calc(-50% - 0.5rem))",
          },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
                aurora: "aurora 60s linear infinite",

        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
          scroll:
          "scroll var(--animation-duration, 40s) var(--animation-direction, forwards) linear infinite",
     
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config