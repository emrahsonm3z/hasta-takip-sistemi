import { useTranslation } from 'react-i18next'

import { SHOWCASE_SECTIONS } from '../constants/showcase-sections.constants'

interface ScrollSpyNavProps {
  activeId: string
  onNavigate: (id: string) => void
}

export function ScrollSpyNav({ activeId, onNavigate }: ScrollSpyNavProps) {
  const { t } = useTranslation()

  return (
    <nav aria-label={t('showcase.nav.label')}>
      <ul className="flex flex-col gap-1 border-l border-surface-border">
        {SHOWCASE_SECTIONS.map((section) => {
          const isActive = section.id === activeId

          return (
            <li key={section.id} className="-ml-px">
              <button
                type="button"
                onClick={() => onNavigate(section.id)}
                aria-current={isActive ? 'true' : undefined}
                className={`block w-full cursor-pointer border-l-2 py-1.5 pl-4 text-left text-sm transition-colors ${
                  isActive
                    ? 'border-primary font-semibold text-primary'
                    : 'border-transparent text-text-secondary hover:text-text'
                }`}
              >
                {t(section.titleKey)}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
