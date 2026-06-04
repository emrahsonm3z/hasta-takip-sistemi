const BRAND_NAME = 'Hasta Takip'

export function AppLogo() {
  return (
    <span className="flex items-center gap-3">
      <svg viewBox="0 0 32 32" className="h-10 w-10 shrink-0" aria-hidden="true">
        <rect width="32" height="32" rx="8" className="fill-primary" />
        <path
          d="M5 16.5h4.2l2-4.8 3.2 8.6 2.8-6.4 1.7 2.6H27"
          className="fill-none stroke-primary-text"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="text-[1.4rem] font-bold tracking-tight text-text">
        {BRAND_NAME}
      </span>
    </span>
  )
}
