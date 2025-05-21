import { error } from 'console';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1E88E5',
        secondary: '#43A047',
        accent: '#FDD835',
        neutral: '#263238',
        background: '#F5F5F5',
        error: '#D32F2F',
        dark: '#031C30',
        hoverItem: '#667A8A',
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
