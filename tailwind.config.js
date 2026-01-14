/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./index.tsx",
    "./App.tsx",
    "./types.ts",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./services/**/*.{js,ts,jsx,tsx}",
    "./utils/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: '#f4f1ea',
        'card-white': '#fffdf5',
        'retro-orange': '#e76f51',
        'retro-green': '#2a9d8f',
        'retro-yellow': '#e9c46a',
        'retro-dark': '#264653',
        'retro-brown': '#5c4d3c',
      },
      fontFamily: {
        sans: ['Nunito', 'sans-serif'],
        serif: ['Noto Serif TC', 'serif'],
      },
    },
  },
  plugins: [],
}
