/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
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
          DEFAULT: '#0f0f14',
          800: '#1a1a24',
          700: '#242432',
          600: '#2e2e40',
        },
        cream: {
          DEFAULT: '#fffbf7',
          100: '#fff5ee',
          200: '#fce8d8',
        },
      },
      boxShadow: {
        card: '0 2px 16px 0 rgba(15,15,20,0.08)',
        'card-hover': '0 8px 32px 0 rgba(15,15,20,0.14)',
        glow: '0 0 24px 0 rgba(255,90,31,0.25)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
}
