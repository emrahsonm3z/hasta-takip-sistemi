import { useMediaQuery } from '@/composables/useMediaQuery'
import { MEDIA } from '@/config/breakpoints'

import { ScrollSpyNav } from '../components/ScrollSpyNav'
import { ArchitectureSection } from '../components/sections/ArchitectureSection'
import { ClosingSection } from '../components/sections/ClosingSection'
import { DevopsSection } from '../components/sections/DevopsSection'
import { FeaturesSection } from '../components/sections/FeaturesSection'
import { OverviewSection } from '../components/sections/OverviewSection'
import { PreviewSection } from '../components/sections/PreviewSection'
import { QualitySection } from '../components/sections/QualitySection'
import { useScrollSpy } from '../composables/useScrollSpy'
import { SHOWCASE_SECTION_IDS } from '../constants/showcase-sections.constants'

export default function ShowcasePage() {
  const isDesktop = useMediaQuery(MEDIA.minLg)
  const { activeId, selectActive } = useScrollSpy(SHOWCASE_SECTION_IDS)

  const handleNavigate = (id: string) => {
    selectActive(id)

    const element = document.getElementById(id)
    if (!element) {
      return
    }

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    element.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      block: 'start',
    })
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl gap-12 px-6 lg:px-10">
      <div className="min-w-0 flex-1">
        <OverviewSection />
        <FeaturesSection />
        <PreviewSection />
        <ArchitectureSection />
        <QualitySection />
        <DevopsSection />
        <ClosingSection />
      </div>
      {isDesktop ? (
        <aside className="sticky top-24 h-fit w-56 shrink-0 self-start py-16">
          <ScrollSpyNav activeId={activeId} onNavigate={handleNavigate} />
        </aside>
      ) : null}
    </div>
  )
}
