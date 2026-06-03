import typography from '@tailwindcss/typography'
import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary-color)',
        'primary-text': 'var(--primary-color-text)',
        surface: {
          0: 'var(--surface-0)',
          50: 'var(--surface-50)',
          100: 'var(--surface-100)',
          200: 'var(--surface-200)',
          300: 'var(--surface-300)',
          400: 'var(--surface-400)',
          500: 'var(--surface-500)',
          600: 'var(--surface-600)',
          700: 'var(--surface-700)',
          800: 'var(--surface-800)',
          900: 'var(--surface-900)',
        },
        ground: 'var(--surface-ground)',
        card: 'var(--surface-card)',
        'surface-border': 'var(--surface-border)',
        text: 'var(--text-color)',
        'text-secondary': 'var(--text-color-secondary)',
      },
    },
  },
  plugins: [typography],
} satisfies Config
