/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "Verdana", "Arial", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        // Custom brand colors (extends Tailwind's default palette)
        black: "#04092c",
        "light-grey": "#f6f6fb",
        "border-grey": "#d3d3dc",
        blue: "#1c94a5",
        pink: "#ce3197",
        "light-pink": "#fbe5f3",
        orange: "#f97316",
        green: "#10b981",
        // ShadCN colors
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "gradient-shift": "gradientShift 15s ease infinite",
        "wave-slow": "wave 20s ease-in-out infinite",
        "wave-slower": "wave 25s ease-in-out infinite reverse",
        "spectrum-bass": "spectrumBass 3.375s ease-in-out infinite",
        "spectrum-mids": "spectrumMids 2.85s ease-in-out infinite",
        "spectrum-highs": "spectrumHighs 2.4s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": {
            opacity: "0",
            transform: "translateY(-5px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        gradientShift: {
          "0%, 100%": {
            backgroundPosition: "0% 50%",
          },
          "50%": {
            backgroundPosition: "100% 50%",
          },
        },
        wave: {
          "0%, 100%": {
            transform: "translateX(0) translateY(0)",
          },
          "25%": {
            transform: "translateX(-2%) translateY(-1%)",
          },
          "50%": {
            transform: "translateX(0) translateY(-2%)",
          },
          "75%": {
            transform: "translateX(2%) translateY(-1%)",
          },
        },
        // Bass frequencies: Slower, bigger movements, more sustained
        spectrumBass: {
          "0%": {
            height: "8%",
          },
          "20%": {
            height: "23.4%",
          },
          "40%": {
            height: "28.6%",
          },
          "60%": {
            height: "20.8%",
          },
          "80%": {
            height: "15.6%",
          },
          "100%": {
            height: "8%",
          },
        },
        // Mid frequencies: Medium movements, balanced
        spectrumMids: {
          "0%": {
            height: "8%",
          },
          "25%": {
            height: "18.2%",
          },
          "50%": {
            height: "23.4%",
          },
          "75%": {
            height: "15.6%",
          },
          "100%": {
            height: "8%",
          },
        },
        // High frequencies: Faster, shorter, more erratic
        spectrumHighs: {
          "0%": {
            height: "8%",
          },
          "15%": {
            height: "13%",
          },
          "30%": {
            height: "10.4%",
          },
          "45%": {
            height: "16.9%",
          },
          "60%": {
            height: "11.7%",
          },
          "75%": {
            height: "14.3%",
          },
          "90%": {
            height: "9.1%",
          },
          "100%": {
            height: "8%",
          },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
};
