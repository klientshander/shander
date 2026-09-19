import { useEffect, useRef, useState } from 'react'
import { playHoverSound, playClickSound } from '../utils/sound'

export function useSoundEffects() {
  const [soundEnabled, setSoundEnabled] = useState(() => {
    try {
      const saved = localStorage.getItem('shander_sound_enabled')
      return saved !== null ? JSON.parse(saved) : true
    } catch {
      return true
    }
  })

  const lastElementRef = useRef(null)
  const lastTimeRef = useRef(0)

  useEffect(() => {
    try {
      localStorage.setItem('shander_sound_enabled', JSON.stringify(soundEnabled))
    } catch {}
  }, [soundEnabled])

  useEffect(() => {
    if (!soundEnabled) return

    // Interactive element selectors
    const interactiveSelector = [
      'button',
      'a',
      '[role="button"]',
      'input',
      'textarea',
      'select',
      '.filter-tab',
      '.carousel-deck-dot',
      '.carousel-deck-btn',
      '.sidebar__nav-item',
      '.sidebar__social-btn',
      '.headernav__link',
      '.headernav__btn',
      '.headernav__drawer-item',
      '.theme-toggle',
      '.sound-toggle',
      '.timeline-item',
      '.gallery-card',
      '.cert-card',
      '.tech-card',
      '.contact-card',
      '.tag',
      '.interactive',
    ].join(', ')

    const handleMouseOver = (e) => {
      const target = e.target
      if (!target || !(target instanceof Element)) return

      const interactive = target.closest(interactiveSelector)

      if (interactive && interactive !== lastElementRef.current) {
        const now = performance.now()
        // Debounce slightly (35ms) to prevent audio clutter on fast diagonal cursor swipes
        if (now - lastTimeRef.current > 35) {
          lastElementRef.current = interactive
          lastTimeRef.current = now
          playHoverSound()
        }
      } else if (!interactive) {
        lastElementRef.current = null
      }
    }

    const handleClick = (e) => {
      const target = e.target
      if (!target || !(target instanceof Element)) return

      const interactive = target.closest('button, a, [role="button"], .filter-tab, .carousel-deck-dot')
      if (interactive) {
        playClickSound()
      }
    }

    document.addEventListener('mouseover', handleMouseOver, { passive: true })
    document.addEventListener('click', handleClick, { passive: true })

    return () => {
      document.removeEventListener('mouseover', handleMouseOver)
      document.removeEventListener('click', handleClick)
    }
  }, [soundEnabled])

  const toggleSound = () => setSoundEnabled((prev) => !prev)

  return { soundEnabled, toggleSound }
}

