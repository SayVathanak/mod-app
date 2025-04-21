// tailwind.config.js
const { theme } = require("@chakra-ui/react");

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: theme.colors.blue,
        accent: theme.colors.purple,
      },
      fontFamily: {
        sans: theme.fonts.body.split(", "),
        heading: theme.fonts.heading.split(", "),
      },
    },
  },
  plugins: [],
};
