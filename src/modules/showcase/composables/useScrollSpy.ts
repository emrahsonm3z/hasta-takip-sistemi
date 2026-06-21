import { useEffect, useRef, useState } from 'react'

const ACTIVATION_OFFSET = 140
const BOTTOM_THRESHOLD = 80
const CLICK_LOCK_DURATION = 800

interface ScrollSpy {
  activeId: string
  selectActive: (id: string) => void
}

export function useScrollSpy(sectionIds: readonly string[]): ScrollSpy {
  const [activeId, setActiveId] = useState(sectionIds[0] ?? '')
  const lockRef = useRef(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => {
    const computeActive = () => {
      if (lockRef.current) {
        return
      }

      const reachedBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - BOTTOM_THRESHOLD

      if (reachedBottom) {
        const last = sectionIds[sectionIds.length - 1]
        if (last) {
          setActiveId(last)
        }
        return
      }

      let current = sectionIds[0] ?? ''
      for (const id of sectionIds) {
        const element = document.getElementById(id)
        if (element && element.getBoundingClientRect().top <= ACTIVATION_OFFSET) {
          current = id
        }
      }
      setActiveId(current)
    }

    let ticking = false
    const onScroll = () => {
      if (ticking) {
        return
      }
      ticking = true
      requestAnimationFrame(() => {
        computeActive()
        ticking = false
      })
    }

    computeActive()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', computeActive)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', computeActive)
    }
  }, [sectionIds])

  useEffect(() => () => clearTimeout(timeoutRef.current), [])

  const selectActive = (id: string) => {
    setActiveId(id)
    lockRef.current = true
    clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      lockRef.current = false
    }, CLICK_LOCK_DURATION)
  }

  return { activeId, selectActive }
}
