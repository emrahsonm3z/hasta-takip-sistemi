import dayjs from 'dayjs'

export function formatDate(value: string | null | undefined, pattern = 'L'): string {
  if (!value) {
    return ''
  }
  const parsed = dayjs(value)
  return parsed.isValid() ? parsed.format(pattern) : ''
}
