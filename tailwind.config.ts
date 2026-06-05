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
        'app-ground': 'var(--app-ground)',
      },
      width: {
        sidebar: 'var(--app-sidebar-width)',
      },
      fontFamily: {
        sans: [
          'Inter',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '70ch',
            lineHeight: '1.75',
            '--tw-prose-body': 'var(--text-color)',
            '--tw-prose-headings': 'var(--text-color)',
            '--tw-prose-lead': 'var(--text-color-secondary)',
            '--tw-prose-links': 'var(--primary-color)',
            '--tw-prose-bold': 'var(--text-color)',
            '--tw-prose-counters': 'var(--text-color-secondary)',
            '--tw-prose-bullets': 'var(--primary-color)',
            '--tw-prose-hr': 'var(--surface-border)',
            '--tw-prose-quotes': 'var(--text-color)',
            '--tw-prose-quote-borders': 'var(--primary-color)',
            '--tw-prose-captions': 'var(--text-color-secondary)',
            '--tw-prose-kbd': 'var(--text-color)',
            '--tw-prose-code': 'var(--text-color)',
            '--tw-prose-pre-code': 'var(--text-color)',
            '--tw-prose-pre-bg': 'var(--surface-100)',
            '--tw-prose-th-borders': 'var(--surface-border)',
            '--tw-prose-td-borders': 'var(--surface-border)',
            h1: {
              fontWeight: '700',
              letterSpacing: '-0.025em',
            },
            h2: {
              fontWeight: '600',
              letterSpacing: '-0.02em',
              marginTop: '2.4em',
            },
            h3: {
              fontWeight: '600',
            },
            a: {
              fontWeight: '500',
              textDecorationColor: 'var(--surface-border)',
              textUnderlineOffset: '3px',
            },
            code: {
              backgroundColor: 'var(--surface-100)',
              borderRadius: '0.25rem',
              padding: '0.125rem 0.375rem',
              fontWeight: '500',
              fontSize: '0.875em',
            },
            'code::before': {
              content: 'none',
            },
            'code::after': {
              content: 'none',
            },
            pre: {
              border: '1px solid var(--surface-border)',
              borderRadius: '0.5rem',
              padding: '1rem 1.25rem',
            },
            'pre code': {
              backgroundColor: 'transparent',
              borderRadius: '0',
              padding: '0',
              fontWeight: '400',
            },
            blockquote: {
              fontStyle: 'normal',
              fontWeight: '400',
              color: 'var(--text-color-secondary)',
            },
            'blockquote p:first-of-type::before': {
              content: 'none',
            },
            'blockquote p:last-of-type::after': {
              content: 'none',
            },
            hr: {
              marginTop: '2.5em',
              marginBottom: '2.5em',
            },
          },
        },
      },
    },
  },
  plugins: [typography],
} satisfies Config
