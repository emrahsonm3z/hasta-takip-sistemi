import type { ReactNode } from 'react'

interface SectionShellProps {
  id: string
  children: ReactNode
}

export function SectionShell({ id, children }: SectionShellProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="scroll-mt-24 border-b border-surface-border py-16 last:border-b-0"
    >
      {children}
    </section>
  )
}

interface SectionLeadProps {
  titleId: string
  title: string
  lead: string
}

export function SectionLead({ titleId, title, lead }: SectionLeadProps) {
  return (
    <div className="mb-8 flex flex-col gap-3">
      <h2
        id={titleId}
        className="text-2xl font-bold tracking-tight text-text sm:text-3xl"
      >
        {title}
      </h2>
      <p className="max-w-2xl text-base text-text-secondary">{lead}</p>
    </div>
  )
}

interface UnderHoodProps {
  children: ReactNode
}

export function UnderHood({ children }: UnderHoodProps) {
  return (
    <p className="mt-6 flex items-start gap-3 rounded-lg border-l-2 border-primary bg-surface-50 px-4 py-3 text-sm text-text-secondary">
      <i className="pi pi-cog mt-0.5 shrink-0 text-primary" aria-hidden="true" />
      <span>{children}</span>
    </p>
  )
}

interface PillProps {
  icon?: string
  children: ReactNode
}

export function Pill({ icon, children }: PillProps) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-surface-border bg-card px-3 py-1.5 text-sm font-medium text-text">
      {icon ? <i className={`${icon} text-primary`} aria-hidden="true" /> : null}
      {children}
    </span>
  )
}
