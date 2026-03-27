/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#f87171',
          DEFAULT: '#ef4444',
          dark: '#b91c1c',
        },
        secondary: {
          light: '#facc15',
          DEFAULT: '#eab308',
          dark: '#ca8a04',
        },
        dark: {
          light: '#374151',
          DEFAULT: '#1f2937',
          dark: '#111827',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
      }
    },
  },
  plugins: [],
}
