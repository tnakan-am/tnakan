/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        forest: '#1B3A2A',
        'forest-mid': '#2C5F45',
        brass: '#B08D57',
        'brass-light': '#E9C88B',
        cream: '#F5F0E6',
        ink: '#23261F',
        muted: '#8A8578',
        'muted-2': '#5C5A50',
        card: '#FFFFFF',
        'card-border': '#EAE3D3',
        line: '#DDD5C4',
        'nav-link': '#CBD8CD',
        'nav-muted': '#9DB3A1',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Hanken Grotesk"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '14px',
        tile: '12px',
      },
      boxShadow: {
        card: '0 10px 30px -18px rgba(27, 58, 42, 0.3)',
        hero: '0 30px 60px -25px rgba(27, 58, 42, 0.6)',
      },
    },
  },
  plugins: [],
};
