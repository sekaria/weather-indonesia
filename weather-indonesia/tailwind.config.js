/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'off-green': '#EBFAF2',
        'chateau-green': '#33C44A',
        'tara-apple': '#D5F3DC'
      }
    },
    fontFamily: {
      Montserrat: ['Montserrat, sans-serif']
    },
    container: {
      padding: '2rem',
      center: true
    }
  },
  plugins: []
}
