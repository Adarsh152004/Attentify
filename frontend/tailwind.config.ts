import type { Config } from "tailwindcss";

const config: Config = {
    content: [
      "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
      "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
      "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
      extend: {
        colors: {
          background: "var(--background)",
          foreground: "var(--foreground)",
          border: "var(--border)",
          input: "var(--input)",
          ring: "var(--ring)",
          primary: {
            DEFAULT: "var(--primary)",
            foreground: "var(--primary-foreground)",
          },
          secondary: {
            DEFAULT: "var(--secondary)",
            foreground: "var(--secondary-foreground)",
          },
          destructive: {
            DEFAULT: "var(--destructive)",
            foreground: "var(--destructive-foreground)",
          },
          muted: {
            DEFAULT: "var(--muted)",
            foreground: "var(--muted-foreground)",
          },
          accent: {
            DEFAULT: "var(--accent)",
            foreground: "var(--accent-foreground)",
          },
          popover: {
            DEFAULT: "var(--popover)",
            foreground: "var(--popover-foreground)",
          },
          card: {
            DEFAULT: "var(--card)",
            foreground: "var(--card-foreground)",
          },
        },
        borderRadius: {
          lg: "var(--radius)",
          md: "calc(var(--radius) - 2px)",
          sm: "calc(var(--radius) - 4px)",
        },
        backdropBlur: {
          glass: "25px",
          "glass-heavy": "45px",
        },
        boxShadow: {
            "glass-soft": "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
            "glass-border": "inset 0 0 0 1px rgba(255, 255, 255, 0.1)",
        },
        animation: {
            "blob": "blob 7s infinite",
        },
        keyframes: {
            blob: {
                "0%": {
                    transform: "translate(0px, 0px) scale(1)",
                },
                "33%": {
                    transform: "translate(30px, -50px) scale(1.1)",
                },
                "66%": {
                    transform: "translate(-20px, 20px) scale(0.9)",
                },
                "100%": {
                    transform: "translate(0px, 0px) scale(1)",
                },
            },
        },
      },
    },
    plugins: [],
  };
  export default config;

