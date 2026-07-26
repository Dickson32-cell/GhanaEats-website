/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        heading: ['"Space Grotesk"', '"Inter"', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#fff5ee',
          100: '#ffe8d6',
          200: '#ffc9a0',
          300: '#ffa166',
          400: '#ff7a35',
          500: '#ff5a1f',
          600: '#e8420d',
          700: '#c0330c',
          800: '#9a2c12',
          900: '#7c2713',
        },
        dark: {
          DEFAULT: '#1a1a1a',
          800: '#2d2d2d',
          700: '#404040',
          600: '#525252',
        },
        cream: {
          DEFAULT: '#fffbf7',
          100: '#fff5ee',
          200: '#fce8d8',
        },
        // Elegant accent colors from video
        peach: {
          50: '#fff5f2',
          100: '#ffe8e0',
          200: '#ffd4c7',
          300: '#ffb4a2',
          400: '#ff9d88',
          500: '#ffa894',
          600: '#ff8370',
        },
        accent: {
          pink: '#ff6b9d',
          peach: '#ffb4a2',
          salmon: '#ffa894',
        },
        bg: {
          light: '#f5f5f5',
          white: '#ffffff',
        },
      },
      boxShadow: {
        card: '0 4px 20px rgba(0,0,0,0.08)',
        'card-hover': '0 8px 30px rgba(0,0,0,0.12)',
        glow: '0 0 24px 0 rgba(255,90,31,0.15)',
        soft: '0 10px 40px rgba(0,0,0,0.1)',
        'soft-sm': '0 2px 10px rgba(0,0,0,0.06)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      animation: {
        'blob': 'blob 7s infinite',
        'bounce-slow': 'bounce 3s infinite',
        'bounce-subtle': 'bounce-subtle 0.5s ease-out',
      },
      keyframes: {
        blob: {
          '0%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
          '33%': {
            transform: 'translate(30px, -50px) scale(1.1)',
          },
          '66%': {
            transform: 'translate(-20px, 20px) scale(0.9)',
          },
          '100%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
        },
        'bounce-subtle': {
          '0%, 100%': {
            transform: 'translateY(0)',
          },
          '50%': {
            transform: 'translateY(-10px)',
          },
        },
      },
    },
  },
  plugins: [],
}
