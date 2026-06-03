export function pickLocalized(tr: string, en: string, language: string): string {
  const base = language.split('-')[0]
  return base === 'en' ? en || tr : tr || en
}
