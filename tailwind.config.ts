import type { Config } from 'tailwindcss';

export default {
  theme: {
    extend: {
      colors: {
        bg: {
          primary: 'rgb(var(--color-bg-primary-rgb) / <alpha-value>)',
        },
        text: {
          primary: 'rgb(var(--color-text-primary-rgb) / <alpha-value>)',
        },
        accent: {
          primary: 'rgb(var(--color-accent-rgb) / <alpha-value>)',
        },
        grid: {
          lines: 'var(--color-grid-lines)',
        },
      },
    },
  },
} satisfies Config;
