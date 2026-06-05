export const docsKeys = {
  all: () => ['docs'] as const,
  content: (slug: string, language: string) =>
    ['docs', 'content', slug, language] as const,
}
