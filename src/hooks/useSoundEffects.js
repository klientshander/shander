import { useEffect, useRef, useState, useCallback } from 'react'
import {
  playHoverSound,
  playClickSound,
  getCurrentSoundProfile,
  cycleSoundProfile as cycleSoundUtil,
  SOUND_PROFILES,
} from '../utils/sound'

export function useSoundEffects() {
  const [soundEnabled, setSoundEnabled] = useState(() => {
    try {
      const saved = localStorage.getItem('shander_sound_enabled')
      return saved !== null ? JSON.parse(saved) : true
    } catch {
      return true
    }
  })

  const [soundProfile, setSoundProfileState] = useState(() => getCurrentSoundProfile())

  const lastElementRef = useRef(null)
  const lastTimeRef = useRef(0)

  useEffect(() => {
    try {
      localStorage.setItem('shander_sound_enabled', JSON.stringify(soundEnabled))
    } catch {}
  }, [soundEnabled])

  // Listen for external profile changes
  useEffect(() => {
    const handleProfileChange = (e) => {
      if (e.detail) {
        setSoundProfileState(e.detail)
      }
    }
    window.addEventListener('shander_sound_profile_changed', handleProfileChange)
    return () => window.removeEventListener('shander_sound_profile_changed', handleProfileChange)
  }, [])

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
      '.tilted-card',
      '.tilted-deck-dot',
      '.tilted-deck-arrow-btn',
      '.tilted-btn',
      '.tilted-card__vol-btn',
      '.tilted-card__media-box',
      '.sidebar__nav-row',
      '.sidebar__nav-item',
      '.sidebar__shortcut-row',
      '.sidebar__chat-row',
      '.sidebar__email-link',
      '.sidebar__platform-link',
      '.sidebar__brand-btn',
      '.sidebar__pill-btn',
      '.sidebar__sound-btn',
      '.sidebar__sound-mode-pill',
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
      '.tech-item',
      '.tech-pill',
      '.contact-card',
      '.projects-grid-card',
      '.tag',
      '.interactive',
    ].join(', ')

    const handleMouseOver = (e) => {
      const target = e.target
      if (!target || !(target instanceof Element)) return

      const interactive = target.closest(interactiveSelector)

      if (interactive && interactive !== lastElementRef.current) {
        const now = performance.now()
        // Responsive debounce (30ms) to ensure snappy response when moving between elements
        if (now - lastTimeRef.current > 30) {
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

      // If clicked element or ancestor is a card with custom slide sound, let component handle it
      if (target.closest('.tilted-card') && !target.closest('.tilted-btn, .tilted-card__vol-btn')) {
        return
      }

      const interactive = target.closest(
        'button, a, [role="button"], .filter-tab, .carousel-deck-dot, .tilted-btn, .tilted-card__vol-btn'
      )
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

  const toggleSound = useCallback(() => setSoundEnabled((prev) => !prev), [])

  const cycleSoundProfile = useCallback(() => {
    const next = cycleSoundUtil()
    setSoundProfileState(next.id)
    return next
  }, [])

  return {
    soundEnabled,
    toggleSound,
    soundProfile,
    cycleSoundProfile,
    soundProfiles: SOUND_PROFILES,
  }
}
