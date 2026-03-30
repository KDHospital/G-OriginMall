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
            //상품상세
            "inverse-surface": "#303221",
            "error-container": "#ffdad6",
            "surface-container-lowest": "#ffffff",
            "on-primary-fixed": "#002201",
            "on-tertiary-container": "#b9ca86",
            "on-tertiary-fixed": "#161f00",
            "on-primary": "#ffffff",
            "surface-container-high": "#eaead1",
            "surface-container-low": "#f5f5dc",
            "surface-dim": "#dbdcc3",
            "primary-fixed": "#bcf0ae",
            "secondary-container": "#feb700",
            "on-tertiary": "#ffffff",
            "on-secondary-container": "#6b4b00",
            "surface": "#fbfbe2",
            "on-secondary-fixed-variant": "#5e4200",
            "surface-container-highest": "#e4e4cc",
            "secondary-fixed": "#ffdea8",
            "primary-fixed-dim": "#a1d494",
            "error": "#ba1a1a",
            "on-tertiary-fixed-variant": "#3e4c16",
            "tertiary-container": "#47551e",
            "surface-tint": "#3b6934",
            "on-surface": "#1b1d0e",
            "on-error-container": "#93000a",
            "outline": "#72796e",
            "tertiary-fixed-dim": "#bdce89",
            "on-primary-container": "#9dd090",
            "tertiary": "#313e08",
            "surface-bright": "#fbfbe2",
            "on-error": "#ffffff",
            "on-background": "#1b1d0e",
            "surface-container": "#efefd7",
            "inverse-on-surface": "#f2f2d9",
            "inverse-primary": "#a1d494",
            "tertiary-fixed": "#d9eaa3",
            "surface-variant": "#e4e4cc",
            "on-secondary-fixed": "#271900",
            "on-primary-fixed-variant": "#23501e",
            "on-secondary": "#ffffff",
            "outline-variant": "#c2c9bb",
            "on-surface-variant": "#42493e",
            "secondary-fixed-dim": "#ffba20",
            "background": "#fbfbe2",
            "primary-container": "#2d5a27",
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
