const ALLOWED_DIRECTIVE_PATTERNS = [
  /^eslint-(disable|enable)/,
  /^@ts-/,
  /^prettier-ignore\b/,
  /^globals?\b/,
  /^\/+\s*<reference\b/,
  /^@vite-ignore\b/,
]

function isAllowed(comment) {
  if (comment.type === 'Shebang' || comment.type === 'Hashbang') return true

  const text = comment.value.trim()
  if (text === '') return true

  return ALLOWED_DIRECTIVE_PATTERNS.some((pattern) => pattern.test(text))
}

const rule = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Disallow explanatory comments and JSDoc; intent belongs in names, structure, and docs.',
    },
    schema: [],
    messages: {
      noExplanatoryComment:
        'Remove this explanatory comment or JSDoc. Encode intent in names, structure, and docs (CLAUDE.md §7). Only allowlisted directives may remain.',
    },
  },
  create(context) {
    const sourceCode = context.sourceCode ?? context.getSourceCode()

    return {
      Program() {
        for (const comment of sourceCode.getAllComments()) {
          if (isAllowed(comment)) continue
          context.report({ node: comment, messageId: 'noExplanatoryComment' })
        }
      },
    }
  },
}

export default rule
