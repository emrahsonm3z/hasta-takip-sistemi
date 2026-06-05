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
            maxWidth: 'none',
            fontSize: '0.9375rem',
            lineHeight: '1.7',
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
            '--tw-prose-pre-code': 'rgb(201 209 217)',
            '--tw-prose-pre-bg': 'rgb(13 17 23)',
            '--tw-prose-th-borders': 'var(--surface-border)',
            '--tw-prose-td-borders': 'var(--surface-border)',
            p: {
              marginBottom: '1rem',
            },
            strong: {
              fontWeight: '600',
            },
            h1: {
              fontSize: '1.75rem',
              fontWeight: '700',
              letterSpacing: '-0.025em',
              borderBottom: '2px solid var(--surface-border)',
              paddingBottom: '0.5rem',
            },
            h2: {
              fontSize: '1.25rem',
              fontWeight: '600',
              letterSpacing: '-0.02em',
              borderBottom: '1px solid var(--surface-200)',
              paddingBottom: '0.375rem',
              marginTop: '2rem',
              marginBottom: '0.75rem',
            },
            h3: {
              fontSize: '1.0625rem',
              fontWeight: '600',
            },
            h4: {
              fontSize: '0.9375rem',
              fontWeight: '600',
            },
            hr: {
              borderColor: 'var(--surface-border)',
              marginTop: '1.75rem',
              marginBottom: '1.75rem',
            },
            a: {
              fontWeight: '500',
              textDecoration: 'none',
            },
            'a:hover': {
              textDecoration: 'underline',
            },
            ul: {
              listStyleType: 'disc',
              paddingLeft: '1.5rem',
            },
            ol: {
              listStyleType: 'decimal',
              paddingLeft: '1.5rem',
            },
            li: {
              marginBottom: '0.3rem',
              lineHeight: '1.65',
            },
            code: {
              backgroundColor: 'var(--surface-100)',
              border: '1px solid var(--surface-border)',
              borderRadius: '4px',
              padding: '0.1em 0.4em',
              fontWeight: '500',
              fontSize: '0.85em',
              fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
            },
            'code::before': {
              content: 'none',
            },
            'code::after': {
              content: 'none',
            },
            pre: {
              borderRadius: '8px',
              margin: '0 0 1.25rem',
              padding: '0',
              overflowX: 'auto',
            },
            'pre code': {
              display: 'block',
              backgroundColor: 'transparent',
              border: '0',
              borderRadius: '0',
              padding: '1rem 1.25rem',
              fontWeight: '400',
              fontSize: '0.8125rem',
              lineHeight: '1.6',
              whiteSpace: 'pre',
              fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
            },
            table: {
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '0.875rem',
            },
            'thead th': {
              backgroundColor: 'var(--surface-100)',
              border: '1px solid var(--surface-border)',
              fontWeight: '600',
              textAlign: 'left',
              whiteSpace: 'nowrap',
              padding: '0.55rem 0.875rem',
            },
            'tbody td': {
              border: '1px solid var(--surface-border)',
              padding: '0.55rem 0.875rem',
              verticalAlign: 'top',
            },
            'tbody tr:nth-child(even)': {
              backgroundColor: 'var(--surface-50)',
            },
            'tbody tr:hover': {
              backgroundColor: 'var(--surface-100)',
            },
            blockquote: {
              fontStyle: 'normal',
              fontWeight: '500',
              color: 'var(--text-color)',
              backgroundColor: 'var(--surface-50)',
              borderLeft: '4px solid var(--primary-color)',
              borderRadius: '0 8px 8px 0',
              padding: '0.75rem 1rem',
              marginBottom: '1.25rem',
            },
            'blockquote p:first-of-type::before': {
              content: 'none',
            },
            'blockquote p:last-of-type::after': {
              content: 'none',
            },
            'blockquote p:last-of-type': {
              marginBottom: '0',
            },
          },
        },
      },
    },
  },
  plugins: [typography],
} satisfies Config
