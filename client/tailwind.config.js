/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        darkBg: '#0a0a0a',
        darkSurface: '#111111',
        darkBorder: '#222222',
        lightBg: '#ffffff',
        lightSurface: '#f5f5f5',
        lightBorder: '#e5e5e5',
        accent: '#6d5dfc'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
