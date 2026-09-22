import { useEffect, useState } from 'react'
import { flushSync } from 'react-dom'

const STORAGE_KEY = 'portfolio-theme'

function getInitialTheme() {
  if (typeof window === 'undefined') return 'dark'
  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (stored === 'light' || stored === 'dark') return stored
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches
  return prefersLight ? 'light' : 'dark'
}

export function useTheme() {
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    window.localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  const toggleTheme = (event, targetTheme) => {
    let nextTheme = theme === 'dark' ? 'light' : 'dark'

    if (targetTheme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
      nextTheme = systemTheme !== theme ? systemTheme : (theme === 'dark' ? 'light' : 'dark')
    } else if (targetTheme === 'light' || targetTheme === 'dark') {
      nextTheme = targetTheme
    }

    if (nextTheme === theme) return

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // If View Transition API is not supported or user prefers reduced motion, fallback gracefully
    if (typeof document === 'undefined' || !document.startViewTransition || prefersReducedMotion) {
      if (!prefersReducedMotion) {
        document.documentElement.classList.add('theme-transitioning')
        window.setTimeout(() => {
          document.documentElement.classList.remove('theme-transitioning')
        }, 450)
      }
      setTheme(nextTheme)
      return
    }

    // Determine circular expansion center point
    let x = window.innerWidth / 2
    let y = window.innerHeight / 2

    if (event) {
      if (typeof event.clientX === 'number' && typeof event.clientY === 'number' && (event.clientX !== 0 || event.clientY !== 0)) {
        x = event.clientX
        y = event.clientY
      } else if (event.currentTarget && typeof event.currentTarget.getBoundingClientRect === 'function') {
        const rect = event.currentTarget.getBoundingClientRect()
        x = rect.left + rect.width / 2
        y = rect.top + rect.height / 2
      }
    }

    // Calculate maximum distance to furthest corner of the viewport
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    )

    const transition = document.startViewTransition(() => {
      flushSync(() => {
        setTheme(nextTheme)
        document.documentElement.setAttribute('data-theme', nextTheme)
        window.localStorage.setItem(STORAGE_KEY, nextTheme)
      })
    })

    transition.ready
      .then(() => {
        try {
          const clipPath = [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`,
          ]
          document.documentElement.animate(
            {
              clipPath,
            },
            {
              duration: 480,
              easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
              pseudoElement: '::view-transition-new(root)',
            }
          )
        } catch {
          // Graceful fallback if pseudoElement animate is not supported
        }
      })
      .catch(() => {})
  }

  return { theme, toggleTheme }
}
