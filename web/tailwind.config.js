/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(214.3 31.8% 91.4%)",
        input: "hsl(214.3 31.8% 91.4%)",
        ring: "hsl(215 20.2% 65.1%)",
        background: "#ffffff",
        foreground: "#0f172a",
        primary: {
          DEFAULT: "#0f172a",
          foreground: "#ffffff"
        },
        secondary: {
          DEFAULT: "#f1f5f9",
          foreground: "#0f172a"
        },
        destructive: {
          DEFAULT: "#ef4444",
          foreground: "#ffffff"
        },
        muted: {
          DEFAULT: "#f1f5f9",
          foreground: "#64748b"
        },
        card: {
          DEFAULT: "#ffffff",
          foreground: "#0f172a"
        }
      },
      borderRadius: {
        lg: "0.5rem",
        md: "0.375rem",
        sm: "0.25rem"
      }
    }
  },
  plugins: []
}
