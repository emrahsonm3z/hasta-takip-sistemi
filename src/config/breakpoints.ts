export const BREAKPOINTS = { md: 768, lg: 1024 } as const

export const MEDIA = {
  belowMd: `(max-width: ${BREAKPOINTS.md - 1}px)`,
  minLg: `(min-width: ${BREAKPOINTS.lg}px)`,
} as const
