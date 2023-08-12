/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "../../apps/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [""],
        serif: [""],
        heading: [""],
        body: [""],
      },
      colors: {},
      // Screens
      screens: {
        xsm: "375px",
        // => @media (min-width: 375px) { ... }

        sm: "640px",
        // => @media (min-width: 640px) { ... }

        md: "768px",
        // => @media (min-width: 768px) { ... }

        lg: "1024px",
        // => @media (min-width: 1024px) { ... }

        xl: "1280px",
        // => @media (min-width: 1280px) { ... }
        "2xl": "1536px",
        // => @media (min-width: 1440px) { ... }
      },
    },
  },
  variants: {
    width: ["responsive", "hover", "focus"],
  },
  plugins: [],
};
