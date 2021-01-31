// eslint-disable-next-line @typescript-eslint/no-var-requires
const colors = require('tailwindcss/colors');

module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    colors: {
      gray: colors.blueGray,
      blue: colors.blue,
      yellow: colors.yellow,
      red: colors.red,
      green: colors.green,
      pink: colors.pink,
      purple: colors.purple,
      white: colors.white,
      orange: colors.orange,
      black: colors.black
    },
    extend: {
      colors: {
        yellow: {
          "450": "#fed001"
        }
      },
    },
  },
  variants: {
    extend: {
      borderRadius: ['first', 'last'],
      opacity: ['disabled'],
      backgroundColor: [
        "disabled"
      ],
    },
  },
  plugins: [],
}
