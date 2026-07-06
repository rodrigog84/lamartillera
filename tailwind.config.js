/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          purple: {
            50:  '#f3f0ff',
            100: '#e9e3ff',
            200: '#d4caff',
            300: '#b49dff',
            400: '#9066ff',
            500: '#6B21A8',
            600: '#5b1891',
            700: '#4a1277',
            800: '#3b0e60',
            900: '#2d0a4a',
          },
          blue: {
            50:  '#eff8ff',
            100: '#dbeffe',
            200: '#bfe3fe',
            300: '#94cffd',
            400: '#60b3fa',
            500: '#2563EB',
            600: '#1d52c6',
            700: '#1643a1',
            800: '#183782',
            900: '#172f6b',
          },
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #2563EB 0%, #6B21A8 100%)',
      },
    },
  },
  plugins: [],
}
