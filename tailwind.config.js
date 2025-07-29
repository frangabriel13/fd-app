/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.tsx", 
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#021344',
          600: '#1e40af',
          400: '#3b82f6',
          200: '#60a5fa',
          100: '#93c5fd',
        },
        secondary: {
          DEFAULT: '#f86f1a',
          600: '#f97316',
          400: '#fb923c',
          200: '#ea580c',
          100: '#ffedd5',
        },
      },
      fontFamily: {
        'mont-black': ['Montserrat-Black', 'sans-serif'],
        'mont-bold': ['Montserrat-Bold', 'sans-serif'],
        'mont-medium': ['Montserrat-Medium', 'sans-serif'],
        'mont-regular': ['Montserrat-Regular', 'sans-serif'],
        'mont-light': ['Montserrat-Light', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

