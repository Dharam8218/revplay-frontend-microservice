/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        spotify: '#1DB954',
        backgroundDark: '#121212',
        surfaceDark: '#181818',
        surfaceLight: '#282828'
      }
    },
  },
  plugins: [],
}
