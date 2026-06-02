import test from 'node:test'

import { RuleTester } from 'eslint'

import rule from './no-explanatory-comments.js'

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 'latest', sourceType: 'module' },
})

test('no-explanatory-comments', () => {
  ruleTester.run('no-explanatory-comments', rule, {
    valid: [
      { code: 'const value = 1\n' },
      { code: '// eslint-disable-next-line no-console\nconsole.log(1)\n' },
      {
        code: '/* eslint-disable no-console */\nconsole.log(1)\n/* eslint-enable no-console */\n',
      },
      { code: 'const value = 1 // eslint-disable-line\n' },
      { code: '// @ts-expect-error intentional for the test\nconst value = 1\n' },
      { code: '// @ts-ignore\nconst value = 1\n' },
      { code: '// prettier-ignore\nconst matrix = [1, 0, 0]\n' },
      { code: '/* global globalThis */\nglobalThis.value = 1\n' },
      { code: '/* globals window, document */\nwindow.value = 1\n' },
      { code: '/// <reference types="node" />\nconst value = 1\n' },
      { code: 'import(/* @vite-ignore */ moduleName)\n' },
      { code: '#!/usr/bin/env node\nconst value = 1\n' },
      { code: '//\nconst value = 1\n' },
    ],
    invalid: [
      {
        code: '// This explains what the next line does\nconst value = 1\n',
        errors: [{ messageId: 'noExplanatoryComment' }],
      },
      {
        code: '/**\n * Adds two numbers together.\n * @param a first\n * @param b second\n */\nfunction add(a, b) {\n  return a + b\n}\n',
        errors: [{ messageId: 'noExplanatoryComment' }],
      },
    ],
  })
})
