import assert from 'node:assert/strict'
import test from 'node:test'

import type { UIMatch } from 'react-router-dom'

import { getRouteHandle } from '../../lib/route.ts'

const matchWith = (handle: unknown): UIMatch =>
  ({ id: 'x', pathname: '/', params: {}, data: undefined, handle }) as unknown as UIMatch

test('getRouteHandle returns the handle when it carries a titleKey', () => {
  assert.equal(
    getRouteHandle(matchWith({ titleKey: 'patients.title' }))?.titleKey,
    'patients.title',
  )
})

test('getRouteHandle returns undefined for absent or shapeless handles', () => {
  assert.equal(getRouteHandle(matchWith(undefined)), undefined)
  assert.equal(getRouteHandle(matchWith({})), undefined)
  assert.equal(getRouteHandle(matchWith('nope')), undefined)
})
