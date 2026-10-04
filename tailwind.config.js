/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dream: {
          50: '#FDFCFD',
          100: '#FAF7FD',
          200: '#F3ECFA',
          300: '#E7DCF5',
          400: '#D5C2EC',
          500: '#B89DE0',
          600: '#9B78D1',
          700: '#7E57BD',
          800: '#5E3B9B',
          900: '#3D226A',
          950: '#1F103A',
        },
        lavender: {
          50: '#FBF9FE',
          100: '#F5F0FD',
          200: '#EBDFFB',
          300: '#DEC6F8',
          400: '#C8A3F2',
          500: '#AC7DE8',
          600: '#905CD9',
        },
        blush: {
          50: '#FFF9FB',
          100: '#FFF0F5',
          200: '#FFE0EC',
          300: '#FFC8DC',
          400: '#FFA0C2',
          500: '#F472B6',
        },
        cream: {
          50: '#FFFEFA',
          100: '#FFFDF5',
          200: '#FDF9EB',
          300: '#F9F2D8',
          400: '#EFE3BA',
        },
        softblue: {
          50: '#F5FAFD',
          100: '#EBF5FB',
          200: '#D8ECF7',
          300: '#BDE0F2',
          400: '#8BC9E8',
          500: '#56B0DC',
        },
        midnight: {
          800: '#1A1829',
          850: '#151322',
          900: '#100E1C',
          950: '#0B0914',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Cabinet Grotesk', 'Plus Jakarta Sans', 'Cinzel', 'sans-serif'],
        jp: ['Noto Sans JP', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(144, 92, 217, 0.08)',
        'glass-hover': '0 12px 40px 0 rgba(144, 92, 217, 0.16)',
        'glow-lavender': '0 0 25px -5px rgba(172, 125, 232, 0.35)',
        'glow-pink': '0 0 25px -5px rgba(244, 114, 182, 0.35)',
        'glow-cyan': '0 0 25px -5px rgba(86, 176, 220, 0.35)',
        'soft': '0 4px 20px -2px rgba(28, 25, 43, 0.05)',
        'soft-lg': '0 10px 30px -4px rgba(28, 25, 43, 0.08)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        }
      },
      animation: {
        float: 'float 5s ease-in-out infinite',
        pulseGlow: 'pulseGlow 3s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
