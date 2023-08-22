/** @type {import('tailwindcss').Config} */
uiConfig = require('config/tailwind.config')

module.exports = {
  ...uiConfig,
  theme: {
    ...uiConfig.theme,
    extend: {
      ...uiConfig.theme.extend,
      fontFamily: {
        sans: ['var(--font-lato)'],
        serif: ['var(--font-breeserif)'],
        mono: ['var(--font-lato)'],
      },
    },
  },
}
