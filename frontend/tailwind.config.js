export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0A0F1E",
        panel: "rgba(255,255,255,0.05)",
        line: "rgba(255,255,255,0.10)",
        blue: "#00D4FF",
        cyan: "#00FFB2",
      },
      boxShadow: {
        glow: "0 0 40px rgba(0, 212, 255, 0.22)",
      },
      animation: {
        pulseSoft: "pulseSoft 2.4s ease-in-out infinite",
      },
      keyframes: {
        pulseSoft: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: ".72", transform: "scale(.985)" },
        },
      },
    },
  },
  plugins: [],
};
