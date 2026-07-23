/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        base: "#FCFBF8",
        ink: "#20241F",
        inkmuted: "#5B6058",
        gold: "#8B6A1E",
        goldsoft: "#C9A15A",
        green: "#2F6E60",
        greendark: "#204A41",
        growth: "#6BAA57",
        sky: "#73C6E6",
        alert: "#D9534F",
        line: "#E7E2D6"
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-manrope)", "sans-serif"],
        mono: ["var(--font-plexmono)", "monospace"]
      },
      borderRadius: {
        card: "18px"
      },
      boxShadow: {
        card: "0 1px 2px rgba(32,36,31,0.04), 0 8px 24px -12px rgba(32,36,31,0.12)",
        lift: "0 20px 40px -18px rgba(32,36,31,0.28)"
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition: "400px 0" }
        },
        rise: {
          "0%": { opacity: 0, transform: "translateY(14px)" },
          "100%": { opacity: 1, transform: "translateY(0)" }
        }
      },
      animation: {
        shimmer: "shimmer 1.6s linear infinite",
        rise: "rise 0.5s cubic-bezier(.2,.7,.3,1) both"
      }
    }
  },
  plugins: []
};
