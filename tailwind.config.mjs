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
        // Tertiary text tier (captions, footer links, small print).
        // Replaces slate-500/600, which fail WCAG AA on this dark palette
        // (3.57:1 on the glass card, 3.82:1 on navy-900 — both under the 4.5:1 floor).
        // This is the dimmest slate that still clears 4.5:1 on every surface we use:
        // navy-900 5.18:1 · navy-800 4.77:1 · glass card 4.84:1.
        muted: '#7a8aa0',
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
