import js from '@eslint/js'
import prettier from 'eslint-config-prettier'
import i18next from 'eslint-plugin-i18next'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import globals from 'globals'
import tseslint from 'typescript-eslint'

import noExplanatoryComments from './tools/eslint/no-explanatory-comments.js'

const UI_TEXT_ATTRIBUTES = [
  'placeholder',
  'title',
  'label',
  'header',
  'alt',
  'aria-label',
  'tooltip',
  'emptyMessage',
]

export default tseslint.config(
  { ignores: ['dist', 'node_modules', '.husky/_'] },

  js.configs.recommended,

  {
    plugins: {
      local: { rules: { 'no-explanatory-comments': noExplanatoryComments } },
    },
    rules: {
      'local/no-explanatory-comments': 'error',
    },
  },

  {
    plugins: { 'simple-import-sort': simpleImportSort },
    rules: {
      'simple-import-sort/imports': [
        'error',
        {
          groups: [['^\\u0000'], ['^node:'], ['^react', '^@?\\w'], ['^@/'], ['^\\.']],
        },
      ],
      'simple-import-sort/exports': 'error',
    },
  },

  {
    files: ['src/**/*.{ts,tsx}'],
    extends: [
      ...tseslint.configs.recommendedTypeChecked,
      jsxA11y.flatConfigs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
      globals: { ...globals.browser },
    },
    plugins: { i18next },
    rules: {
      'i18next/no-literal-string': [
        'error',
        {
          mode: 'jsx-only',
          'jsx-attributes': { include: UI_TEXT_ATTRIBUTES, exclude: [] },
          callees: { exclude: ['t', 'i18n.t', 'clsx', 'cn'] },
        },
      ],
    },
  },

  {
    files: [
      'src/**/*.{test,spec}.{ts,tsx}',
      'src/**/*.constants.{ts,tsx}',
      'src/**/constants/**',
    ],
    rules: {
      'i18next/no-literal-string': 'off',
    },
  },

  {
    files: ['**/*.{js,cjs,mjs}'],
    languageOptions: {
      sourceType: 'module',
      globals: { ...globals.node },
    },
  },

  {
    files: ['vite.config.ts'],
    extends: [tseslint.configs.recommended],
    languageOptions: {
      sourceType: 'module',
      globals: { ...globals.node },
    },
  },

  prettier,
)
