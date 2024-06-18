import animate from 'tailwindcss-animate';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['src/**/*.{js,jsx}'],
  theme: {
    extend: {
      borderColor: ({ theme }) => ({
        ...theme('colors'),
        DEFAULT: theme('colors.zinc.600', 'currentColor'),
      }),
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        ring: 'var(--ring)',
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        popover: {
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)',
        },
      },
    },
  },
  plugins: [animate],
  darkMode: 'class',
};
