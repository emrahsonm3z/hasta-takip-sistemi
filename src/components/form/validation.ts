import type { TranslationKey } from '@/types/i18n.types'

type Translate = (key: TranslationKey, values?: Record<string, unknown>) => string

interface SerializedValidation {
  key: TranslationKey
  values?: Record<string, unknown>
}

function parseSerialized(raw: string): SerializedValidation | null {
  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    return null
  }
  if (
    parsed !== null &&
    typeof parsed === 'object' &&
    'key' in parsed &&
    typeof (parsed as Record<string, unknown>).key === 'string'
  ) {
    return parsed as SerializedValidation
  }
  return null
}

export function resolveValidationMessage(raw: string, t: Translate): string {
  const serialized = parseSerialized(raw)
  return serialized ? t(serialized.key, serialized.values) : raw
}
