import { normalizeTurkish } from './text.ts'

function filterableText(input: unknown): string {
  return typeof input === 'string' ||
    typeof input === 'number' ||
    typeof input === 'boolean'
    ? String(input)
    : ''
}

function hasNoFilter(filter: unknown): boolean {
  return filter === undefined || filter === null || filter === ''
}

function normalizedPair(value: unknown, filter: unknown): [string, string] | null {
  if (value === undefined || value === null) {
    return null
  }
  return [
    normalizeTurkish(filterableText(value)),
    normalizeTurkish(filterableText(filter)),
  ]
}

export function turkishStartsWith(value: unknown, filter: unknown): boolean {
  if (hasNoFilter(filter)) {
    return true
  }
  const pair = normalizedPair(value, filter)
  return pair !== null && pair[0].startsWith(pair[1])
}

export function turkishContains(value: unknown, filter: unknown): boolean {
  if (hasNoFilter(filter)) {
    return true
  }
  const pair = normalizedPair(value, filter)
  return pair !== null && pair[0].includes(pair[1])
}

export function turkishNotContains(value: unknown, filter: unknown): boolean {
  if (hasNoFilter(filter)) {
    return true
  }
  const pair = normalizedPair(value, filter)
  return pair !== null && !pair[0].includes(pair[1])
}

export function turkishEndsWith(value: unknown, filter: unknown): boolean {
  if (hasNoFilter(filter)) {
    return true
  }
  const pair = normalizedPair(value, filter)
  return pair !== null && pair[0].endsWith(pair[1])
}

export function turkishEquals(value: unknown, filter: unknown): boolean {
  if (hasNoFilter(filter)) {
    return true
  }
  const pair = normalizedPair(value, filter)
  return pair !== null && pair[0] === pair[1]
}

export function turkishNotEquals(value: unknown, filter: unknown): boolean {
  if (hasNoFilter(filter)) {
    return true
  }
  const pair = normalizedPair(value, filter)
  return pair === null || pair[0] !== pair[1]
}

export function arrayContainsAny(value: unknown, filter: unknown): boolean {
  if (!Array.isArray(filter) || filter.length === 0) {
    return true
  }
  if (!Array.isArray(value)) {
    return false
  }
  return value.some((entry) => filter.includes(entry))
}
