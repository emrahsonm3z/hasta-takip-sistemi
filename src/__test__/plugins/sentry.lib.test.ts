import assert from 'node:assert/strict'
import test from 'node:test'

import { shouldDropErrorEvent } from '../../plugins/sentry.lib.ts'

test('drops both ResizeObserver loop noise variants', () => {
  assert.equal(
    shouldDropErrorEvent({ message: 'ResizeObserver loop limit exceeded' }),
    true,
  )
  assert.equal(
    shouldDropErrorEvent({
      exception: {
        values: [
          { value: 'ResizeObserver loop completed with undelivered notifications.' },
        ],
      },
    }),
    true,
  )
})

test('drops events whose frames come from a browser extension', () => {
  assert.equal(
    shouldDropErrorEvent({
      exception: {
        values: [
          {
            value: 'TypeError: x is not a function',
            stacktrace: {
              frames: [{ filename: 'chrome-extension://abcdef/content.js' }],
            },
          },
        ],
      },
    }),
    true,
  )
})

test('keeps an ordinary application error', () => {
  assert.equal(
    shouldDropErrorEvent({
      exception: {
        values: [
          {
            value: 'Patient form values are incomplete',
            stacktrace: { frames: [{ filename: 'https://app.example/assets/index.js' }] },
          },
        ],
      },
    }),
    false,
  )
})

test('tolerates an empty event', () => {
  assert.equal(shouldDropErrorEvent({}), false)
})
