import { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import Sidebar from './components/Sidebar'
import NavRail from './components/NavRail'
import BackgroundMesh from './components/ui/BackgroundMesh'
import ProgressBar from './components/chrome/ProgressBar'
import Toast from './components/chrome/Toast'
import BackToTop from './components/chrome/BackToTop'
import KeyboardHintStrip from './components/chrome/KeyboardHintStrip'
import CommandPalette from './components/chrome/CommandPalette'
import Lightbox from './components/chrome/Lightbox'
import CertModal from './components/chrome/CertModal'
import VideoModal from './components/chrome/VideoModal'
import { UIProvider, useUI } from './context/UIContext'
import { useTheme } from './hooks/useTheme'
import { navItems } from './data/nav'

import About from './components/sections/About'
import Education from './components/sections/Education'
import Certification from './components/sections/Certification'
import Techstacks from './components/sections/Techstacks'
import Projects from './components/sections/Projects'
import Gallery from './components/sections/Gallery'
import Contact from './components/sections/Contact'

import './styles/chrome.css'
import './styles/sections.css'

const sectionComponents = {
  about: About,
  education: Education,
  certification: Certification,
  techstacks: Techstacks,
  projects: Projects,
  gallery: Gallery,
  contact: Contact,
}

const sectionOrder = navItems.map((item) => item.id)

function AppShell() {
  const [activeSection, setActiveSection] = useState(() => {
    const fromHash = window.location.hash.replace('#', '')
    return sectionOrder.includes(fromHash) ? fromHash : 'about'
  })
  const [progress, setProgress] = useState(0)
  const { theme, toggleTheme } = useTheme()
  const { openCmd, closeAllOverlays } = useUI()
  const mainRef = useRef(null)
  const sectionRefs = useRef(new Map())
  const lenisRef = useRef(null)
  const reduceMotionRef = useRef(
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )

  const registerSection = useCallback((id) => (node) => {
    if (node) sectionRefs.current.set(id, node)
    else sectionRefs.current.delete(id)
  }, [])

  // Smoothly scrolls the main content pane to the target section with Lenis momentum
  const handleNavigate = useCallback((id) => {
    if (!sectionOrder.includes(id)) return
    const node = sectionRefs.current.get(id)
    if (node) {
      if (lenisRef.current) {
        lenisRef.current.scrollTo(node, {
          offset: -20,
          duration: 1.25,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        })
      } else {
        node.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
    window.history.pushState(null, '', `#${id}`)
    setActiveSection(id)
  }, [])

  // Initialize Lenis smooth momentum scrolling on the main content pane
  useEffect(() => {
    const wrapper = mainRef.current
    if (!wrapper || reduceMotionRef.current) return

    const lenis = new Lenis({
      wrapper: wrapper,
      content: wrapper.firstElementChild || wrapper,
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.5,
    })

    lenisRef.current = lenis

    const onScroll = ({ progress }) => {
      setProgress(Math.min(100, Math.max(0, progress * 100)))
    }
    lenis.on('scroll', onScroll)

    let rafId
    function raf(time) {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
    }
  }, [])

  // Land on the right section on first load (deep link / refresh with a hash).
  useEffect(() => {
    const fromHash = window.location.hash.replace('#', '')
    if (!sectionOrder.includes(fromHash)) return
    const node = sectionRefs.current.get(fromHash)
    if (node) {
      setTimeout(() => {
        if (lenisRef.current) {
          lenisRef.current.scrollTo(node, { immediate: true })
        } else {
          node.scrollIntoView({ behavior: 'instant', block: 'start' })
        }
      }, 50)
    }
  }, [])

  // Highlights the nav item for whichever section is currently in the
  // viewport as the person scrolls through the one-page layout.
  useEffect(() => {
    const node = mainRef.current
    if (!node) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-section')
            if (id) {
              setActiveSection(id)
              window.history.replaceState(null, '', `#${id}`)
            }
          }
        })
      },
      { root: node, rootMargin: '-20% 0px -60% 0px', threshold: 0 }
    )
    sectionRefs.current.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  // Keyboard shortcuts: arrows to move between sections, D to toggle theme,
  // Cmd/Ctrl+K for quick nav, Esc closes any open overlay.
  useEffect(() => {
    const onKeyDown = (e) => {
      const tag = e.target.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        openCmd()
        return
      }
      if (e.key === 'Escape') {
        closeAllOverlays()
        return
      }
      const idx = sectionOrder.indexOf(activeSection)
      if (
        (e.key === 'ArrowRight' || e.key === 'ArrowDown') &&
        idx < sectionOrder.length - 1
      ) {
        e.preventDefault()
        handleNavigate(sectionOrder[idx + 1])
      } else if ((e.key === 'ArrowLeft' || e.key === 'ArrowUp') && idx > 0) {
        e.preventDefault()
        handleNavigate(sectionOrder[idx - 1])
      } else if (e.key.toLowerCase() === 'd') {
        toggleTheme()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [activeSection, handleNavigate, openCmd, closeAllOverlays, toggleTheme])

  const scrollToTop = () => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { duration: 1.2 })
    } else {
      mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <>
      <BackgroundMesh />
      <ProgressBar progress={progress} />

      <div className="frame">
        <Sidebar onNavigate={handleNavigate} theme={theme} />

        <main className="main-panel" ref={mainRef}>
          <div className="main-panel__body">
            {sectionOrder.map((id, index) => {
              const SectionComponent = sectionComponents[id]
              const navItem = navItems.find((item) => item.id === id)
              return (
                <section
                  key={id}
                  id={id}
                  data-section={id}
                  ref={registerSection(id)}
                  className="page-section"
                  aria-label={navItem?.label ?? id}
                >
                  <div className="slide-header" aria-hidden="true">
                    <div className="slide-header__tag">
                      <span
                        className="slide-header__dot"
                        style={{
                          backgroundColor: navItem?.color ?? 'var(--accent)',
                          color: navItem?.color ?? 'var(--accent)',
                        }}
                      />
                      <span className="slide-header__channel">CH.0{index}</span>
                      <span className="slide-header__divider">/</span>
                      <span className="slide-header__label">{navItem?.label ?? id}</span>
                    </div>
                    <div className="slide-header__counter">
                      <span>0{index + 1}</span>
                      <span className="slide-header__total"> / 0{sectionOrder.length}</span>
                    </div>
                  </div>

                  <motion.div
                    initial={reduceMotionRef.current ? false : { opacity: 0, y: 16 }}
                    whileInView={reduceMotionRef.current ? undefined : { opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{ duration: 0.45, ease: 'easeOut' }}
                    style={{ width: '100%' }}
                  >
                    <SectionComponent onNavigate={handleNavigate} />
                  </motion.div>
                </section>
              )
            })}
          </div>
        </main>

        <NavRail
          activeSection={activeSection}
          onNavigate={handleNavigate}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      </div>

      <BackToTop visible={progress > 8} onClick={scrollToTop} />
      <KeyboardHintStrip />
      <Toast />
      <CommandPalette onNavigate={handleNavigate} />
      <Lightbox />
      <CertModal />
      <VideoModal />
    </>
  )
}

export default function App() {
  return (
    <UIProvider>
      <AppShell />
    </UIProvider>
  )
}
