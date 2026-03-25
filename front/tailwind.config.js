/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
        colors: {
            "primary": "#4c7c32", // Fresh Gimpo Green
            "secondary": "#f4b41a", // Harvest Gold
            "accent": "#2d3a25", // Forest Green/Brown
            "background-light": "#fcfbf7",
            
            },
            fontFamily: {
            sans: ['Noto Sans KR', 'sans-serif'],
            },
            borderRadius: {
            "DEFAULT": "0.25rem",
            "lg": "0.5rem",
            "xl": "0.75rem",
            "full": "9999px"
            },
    },
  },
  plugins: [],
}
