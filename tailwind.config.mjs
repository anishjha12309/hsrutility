/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#0b0c1a',
          900: '#12132a',
          800: '#1a1b35',
          700: '#22244a',
          600: '#2a2d5a',
        },
        gold: {
          200: '#f0e6c0',
          300: '#e4cc84',
          400: '#d4b96a',
          500: '#c9a84c',
          600: '#b8963e',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};
