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
          saffron: {
            DEFAULT: '#FF9933',
            dark: '#E07B12',
            light: '#FFB870',
          },
          green: {
            DEFAULT: '#138808',
            dark: '#0E6805',
            light: '#1DC00D',
          },
          ashoka: '#000080',
          dark: {
            base: '#0B0F19',
            card: '#161D30',
            border: '#23304E',
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glass-hover': '0 8px 32px 0 rgba(255, 153, 51, 0.15)',
      }
    },
  },
  plugins: [],
}
