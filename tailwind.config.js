/** @type {import('tailwindcss').Config} */
export default {
  content: ["./**/*.{njk,md,html,js}"],
  theme: {
    colors: {
      macLight:  "#E0E0E0",   // light gray window chrome
      macMid:    "#C0C0C0",   // mid gray border
      macDark:   "#333333",   // text
      accent:    "#082840",   // link blue (matches your current vars)
      transparent: "transparent",
      current: "currentColor",
    },
    fontFamily: {
      sans: ['Chicago', 'sans-serif'],
      chicago: ['Chicago', 'sans-serif'],
    },
    extend: {},
  },
  plugins: [],
};