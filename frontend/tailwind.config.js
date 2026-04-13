/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          400: '#FFD700',
          500: '#FFC107',
          600: '#FFA000',
        },
      },
      fontFamily: {
        marathi: ['Noto Sans Devanagari', 'sans-serif'],
        inter: ['Inter', 'sans-serif'], // ✅ add this
      },
    },
  },
  plugins: [],
}
