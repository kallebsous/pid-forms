/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'pid-red': '#FF0000',
        'pid-blue': '#0000FF',
      },
    },
  },
  plugins: [],
};
