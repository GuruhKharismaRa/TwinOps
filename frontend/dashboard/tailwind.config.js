/** @type {import('tailwindcss').Config} */

export default {

  darkMode: ["class"],

  content: [

    "./index.html",

    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {

    extend: {

      fontFamily: {

        heading: ["Inter", "sans-serif"],
      },

      colors: {

        border: "#e5e7eb",

        input: "#e5e7eb",

        ring: "#8a79ab",

        background: "#f7f4fc",

        foreground: "#111827",

        primary: {

          DEFAULT: "#8a79ab",
          foreground: "#ffffff",
        },

        secondary: {

          DEFAULT: "#ede9fe",
          foreground: "#111827",
        },

        muted: {

          DEFAULT: "#f3f4f6",
          foreground: "#6b7280",
        },

        accent: {

          DEFAULT: "#f5f3ff",
          foreground: "#111827",
        },

        card: {

          DEFAULT: "#ffffff",
          foreground: "#111827",
        },

        popover: {

          DEFAULT: "#ffffff",
          foreground: "#111827",
        },
      },

      borderRadius: {

        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },

      boxShadow: {

        glass:
          "0 8px 32px rgba(31,38,135,0.12)",
      },
    },
  },

  plugins: [],
}