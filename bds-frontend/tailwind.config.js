/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#0A0A0F',
          800: '#0F0F18',
          700: '#12121A',
          600: '#1A1A28',
          500: '#22223A',
          400: '#2A2A3A',
        },
        gold: {
          DEFAULT: '#C9A84C',
          light:   '#E8C97A',
          dark:    '#9A7A2E',
          muted:   '#6B5520',
        },
        cream: {
          DEFAULT: '#F0EDE8',
          muted:   '#C8C4BC',
        },
        surface: '#8B8B9A',
      },
      fontFamily: {
        sans:    ['Inter', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #C9A84C 0%, #E8C97A 50%, #C9A84C 100%)',
        'dark-gradient': 'linear-gradient(180deg, #0A0A0F 0%, #12121A 100%)',
      },
      boxShadow: {
        'gold':    '0 0 30px rgba(201, 168, 76, 0.15)',
        'gold-sm': '0 0 15px rgba(201, 168, 76, 0.1)',
      },
      animation: {
        'shimmer': 'shimmer 2s infinite',
        'float':   'float 3s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%':   { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-6px)' },
        },
      },
    },
  },
  plugins: [],
}