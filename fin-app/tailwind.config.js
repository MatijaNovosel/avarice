// eslint-disable-next-line @typescript-eslint/no-var-requires
const colors = require('tailwindcss/colors');

module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    colors: {
      gray: colors.warmGray,
      blue: colors.blueGray
    },
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
