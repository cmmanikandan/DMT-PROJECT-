/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#05162A',
          950: '#020C18',
          900: '#05162A',
          850: '#09213D',
          800: '#0D2B4E',
          700: '#133E6E'
        },
        primary: {
          DEFAULT: '#1769E0',
          hover: '#1458be',
          light: '#E8F1FC',
          border: '#B9D5FA'
        },
        surface: {
          DEFAULT: '#F4F7FB',
          card: '#FFFFFF',
          border: '#DCE5EF',
          hover: '#F8FAFC'
        },
        text: {
          main: '#102A43',
          muted: '#6B7C93',
          light: '#9AA7B6'
        },
        brand: {
          green: '#10B981',
          greenLight: '#E6F9F2',
          amber: '#F59E0B',
          amberLight: '#FEF4E6',
          red: '#EF4444',
          redLight: '#FEECEC',
          purple: '#8B5CF6',
          purpleLight: '#F3E8FF'
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(16, 42, 67, 0.04), 0 1px 2px 0 rgba(16, 42, 67, 0.02)',
        'card-hover': '0 4px 6px -1px rgba(16, 42, 67, 0.06), 0 2px 4px -1px rgba(16, 42, 67, 0.03)',
        header: '0 1px 2px 0 rgba(16, 42, 67, 0.03)',
      },
      borderRadius: {
        card: '10px',
      }
    },
  },
  plugins: [],
}
