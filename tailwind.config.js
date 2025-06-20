/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'stromberg-teal': '#00B4A6',
        'stromberg-dark-teal': '#008B7F',
        'stromberg-red': '#E53E3E',
        'stromberg-dark-red': '#C53030',
      },
      backgroundImage: {
        'stromberg-bg': "url('/background.png')",
      },
      animation: {
        'spin-wheel': 'spin 3s cubic-bezier(0.23, 1, 0.32, 1) forwards',
      },
    },
  },
  plugins: [],
}