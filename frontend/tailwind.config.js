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
        obsidian: {
          950: '#060A12',
          900: '#0A101D',
          850: '#0E172A',
          800: '#152238',
          700: '#1E304E'
        },
        primary: {
          DEFAULT: '#2563EB',
          hover: '#1D4ED8',
          light: '#EFF6FF',
          border: '#BFDBFE'
        },
        surface: {
          DEFAULT: '#F8FAFC',
          card: '#FFFFFF',
          border: '#E2E8F0',
          hover: '#F1F5F9',
          subtle: '#F8FAFC'
        },
        text: {
          main: '#0F172A',
          muted: '#64748B',
          light: '#94A3B8'
        },
        brand: {
          green: '#10B981',
          greenLight: '#ECFDF5',
          amber: '#F59E0B',
          amberLight: '#FFFBEB',
          red: '#EF4444',
          redLight: '#FEF2F2',
          purple: '#8B5CF6',
          purpleLight: '#F5F3FF',
          cyan: '#06B6D4',
          cyanLight: '#ECFEFF'
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(15, 23, 42, 0.04), 0 1px 2px -1px rgba(15, 23, 42, 0.02)',
        'card-hover': '0 8px 24px -4px rgba(15, 23, 42, 0.08), 0 4px 8px -2px rgba(15, 23, 42, 0.04)',
        header: '0 1px 3px 0 rgba(15, 23, 42, 0.05)',
        glow: '0 0 20px -2px rgba(37, 99, 235, 0.25)',
        'glow-cyan': '0 0 20px -2px rgba(6, 182, 212, 0.3)'
      },
      borderRadius: {
        card: '12px',
        bento: '16px'
      }
    },
  },
  plugins: [],
}
