/** @type {import('postcss').Config} */
export default {
  plugins: {
    '@tailwindcss/postcss': {}, // This is correct for Tailwind v4
    autoprefixer: {},
  },
}