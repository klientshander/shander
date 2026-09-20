import { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import Sidebar from './components/Sidebar'
import HeaderNav from './components/HeaderNav'
import BackgroundMesh from './components/ui/BackgroundMesh'
import ProgressBar from './components/chrome/ProgressBar'
import Toast from './components/chrome/Toast'
import BackToTop from './components/chrome/BackToTop'
import KeyboardHintStrip from './components/chrome/KeyboardHintStrip'
import CommandPalette from './components/chrome/CommandPalette'
import Lightbox from './components/chrome/Lightbox'
import CertModal from './components/chrome/CertModal'
import VideoModal from './components/chrome/VideoModal'
import ChessModal from './components/chrome/ChessModal'
import ConversationHubModal from './components/chrome/ConversationHubModal'
import CodeSnippetModal from './components/chrome/CodeSnippetModal'
import { UIProvider, useUI } from './context/UIContext'
import { useTheme } from './hooks/useTheme'
import { useSoundEffects } from './hooks/useSoundEffects'
import { navItems, mainScrollSections, standaloneSections } from './data/nav'

import Home from './components/sections/Home'
import Education from './components/sections/Education'
import Certification from './components/sections/Certification'
import Techstacks from './components/sections/Techstacks'
import Projects from './components/sections/Projects'
import ResumeCV from './components/sections/ResumeCV'
import Gallery from './components/sections/Gallery'
import Freelance from './components/sections/Freelance'
import Contact from './components/sections/Contact'
import Resources from './components/sections/Resources'
import Shop from './components/sections/Shop'
import { FiArrowLeft } from 'react-icons/fi'

import './styles/chrome.css'
import './styles/sections.css'

const sectionComponents = {
  home: Home,
  projects: Projects,
  techstacks: Techstacks,
  certification: Certification,
  education: Education,
  resources: Resources,
  cv: ResumeCV,
  gallery: Gallery,
  freelance: Freelance,
  contact: Contact,
  shop: Shop,
}

const allSectionIds = navItems.map((item) => item.id)

function AppShell() {
  const [activeSection, setActiveSection] = useState(() => {
    const fromHash = window.location.hash.replace('#', '')
    return allSectionIds.includes(fromHash) ? fromHash : 'home'
  })
  const [progress, setProgress] = useState(0)
  const { theme, toggleTheme } = useTheme()
  const { soundEnabled, toggleSound, soundProfile, cycleSoundProfile } = useSoundEffects()
  const { openCmd, openChessModal, openSnippetModal, closeAllOverlays } = useUI()
  const mainRef = useRef(null)
  const sectionRefs = useRef(new Map())
  const lenisRef = useRef(null)
  const progressRafRef = useRef(0)
  const pendingProgressRef = useRef(0)
  const displayedProgressRef = useRef(-1)
  const reduceMotionRef = useRef(
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )

  const isStandalone = standaloneSections.includes(activeSection)

  const registerSection = useCallback((id) => (node) => {
    if (node) sectionRefs.current.set(id, node)
    else sectionRefs.current.delete(id)
  }, [])

  // Smoothly scrolls the main content pane or switches to standalone view
  const handleNavigate = useCallback((id) => {
    if (!allSectionIds.includes(id)) return
    const isTargetStandalone = standaloneSections.includes(id)

    window.history.pushState(null, '', `#${id}`)
    setActiveSection(id)

    if (isTargetStandalone) {
      if (lenisRef.current) {
        lenisRef.current.scrollTo(0, { immediate: true })
      } else {
        mainRef.current?.scrollTo({ top: 0, behavior: 'instant' })
      }
    } else {
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
      } else {
        setTimeout(() => {
          const targetNode = sectionRefs.current.get(id)
          if (targetNode) {
            if (lenisRef.current) {
              lenisRef.current.scrollTo(targetNode, {
                offset: -20,
                duration: 1.25,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
              })
            } else {
              targetNode.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }
          }
        }, 80)
      }
    }
  }, [])

  // Initialize Lenis smooth momentum scrolling on the main content pane (Desktop)
  useEffect(() => {
    const isMobileOrTouch =
      typeof window !== 'undefined' &&
      (window.innerWidth <= 1080 || 'ontouchstart' in window)

    // On mobile / touch screens, use native browser momentum scroll and track window scroll
    if (isMobileOrTouch) {
      const handleWindowScroll = () => {
        const docEl = document.documentElement
        const scrollTop = window.scrollY || docEl.scrollTop || 0
        const maxScroll = docEl.scrollHeight - window.innerHeight
        const p = maxScroll > 0 ? Math.round((scrollTop / maxScroll) * 100) : 0
        setProgress(Math.min(100, Math.max(0, p)))
      }
      window.addEventListener('scroll', handleWindowScroll, { passive: true })
      return () => window.removeEventListener('scroll', handleWindowScroll)
    }

    const wrapper = mainRef.current
    if (!wrapper || reduceMotionRef.current) return

    const bodyContent = wrapper.querySelector('.main-panel__body') || wrapper
    const lenis = new Lenis({
      wrapper: wrapper,
      content: bodyContent,
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.5,
    })

    lenisRef.current = lenis

    const onScroll = ({ progress: scrollProgress }) => {
      pendingProgressRef.current = Math.round(Math.min(100, Math.max(0, scrollProgress * 100)))
      if (progressRafRef.current) return

      progressRafRef.current = requestAnimationFrame(() => {
        progressRafRef.current = 0
        const nextProgress = pendingProgressRef.current
        if (nextProgress === displayedProgressRef.current) return
        displayedProgressRef.current = nextProgress
        setProgress(nextProgress)
      })
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
      if (progressRafRef.current) cancelAnimationFrame(progressRafRef.current)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  // Land on the right section on first load (deep link / refresh with a hash).
  useEffect(() => {
    const fromHash = window.location.hash.replace('#', '')
    if (!allSectionIds.includes(fromHash)) return
    if (standaloneSections.includes(fromHash)) {
      setActiveSection(fromHash)
      return
    }
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
    if (isStandalone) return
    const isDesktop = typeof window !== 'undefined' && window.innerWidth > 1080
    const node = isDesktop ? mainRef.current : null
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-section')
            if (id && mainScrollSections.includes(id)) {
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
  }, [isStandalone])

  // Keyboard shortcuts: Alt+K / Alt+C opens Chess, Cmd/Ctrl+K opens Command Menu,
  // arrows move between sections, D toggles theme, M toggles sound.
  useEffect(() => {
    const onKeyDown = (e) => {
      const tag = e.target.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return

      if ((e.altKey && e.key.toLowerCase() === 'k') || (e.altKey && e.key.toLowerCase() === 'c')) {
        e.preventDefault()
        openChessModal()
        return
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        openCmd()
        return
      }
      if (e.altKey && e.key.toLowerCase() === 'j') {
        e.preventDefault()
        openSnippetModal()
        return
      }
      if (e.key === 'Escape') {
        if (isStandalone) {
          handleNavigate('home')
          return
        }
        closeAllOverlays()
        return
      }

      if (!isStandalone) {
        const idx = mainScrollSections.indexOf(activeSection)
        if (
          (e.key === 'ArrowRight' || e.key === 'ArrowDown') &&
          idx !== -1 &&
          idx < mainScrollSections.length - 1
        ) {
          e.preventDefault()
          handleNavigate(mainScrollSections[idx + 1])
        } else if ((e.key === 'ArrowLeft' || e.key === 'ArrowUp') && idx > 0) {
          e.preventDefault()
          handleNavigate(mainScrollSections[idx - 1])
        }
      }

      if (e.key.toLowerCase() === 'd') {
        toggleTheme()
      } else if (e.key.toLowerCase() === 'm') {
        toggleSound()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [activeSection, isStandalone, handleNavigate, openCmd, openChessModal, openSnippetModal, closeAllOverlays, toggleTheme, toggleSound])

  const scrollToTop = () => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { duration: 1.2 })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <>
      <BackgroundMesh theme={theme} />
      <ProgressBar progress={progress} />

      <div className="frame">
        <Sidebar
          activeSection={activeSection}
          onNavigate={handleNavigate}
          theme={theme}
          onToggleTheme={toggleTheme}
          soundEnabled={soundEnabled}
          onToggleSound={toggleSound}
          soundProfile={soundProfile}
          onCycleSoundProfile={cycleSoundProfile}
        />

        <main className="main-panel" ref={mainRef}>
          <HeaderNav
            activeSection={activeSection}
            onNavigate={handleNavigate}
            theme={theme}
            onToggleTheme={toggleTheme}
            soundEnabled={soundEnabled}
            onToggleSound={toggleSound}
          />
          <div className="main-panel__body">
            {isStandalone ? (
              <div className="standalone-view" key={activeSection}>
                <div className="standalone-header">
                  <button
                    type="button"
                    className="standalone-back-btn"
                    onClick={() => handleNavigate('home')}
                    title="Return to portfolio overview"
                  >
                    <FiArrowLeft aria-hidden="true" />
                    <span>Back to Portfolio</span>
                  </button>
                  <div className="standalone-header__tag">
                    <span
                      className="slide-header__dot"
                      style={{
                        backgroundColor:
                          navItems.find((n) => n.id === activeSection)?.color ?? 'var(--accent)',
                        color:
                          navItems.find((n) => n.id === activeSection)?.color ?? 'var(--accent)',
                      }}
                    />
                    <span>{navItems.find((n) => n.id === activeSection)?.label ?? activeSection}</span>
                  </div>
                </div>

                <div className="standalone-content">
                  {(() => {
                    const Component = sectionComponents[activeSection]
                    return Component ? <Component onNavigate={handleNavigate} /> : null
                  })()}
                </div>
              </div>
            ) : (
              mainScrollSections.map((id, index) => {
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
                    {id !== 'home' && id !== 'projects' && (
                      <div className="slide-header" aria-hidden="true">
                        <div className="slide-header__tag">
                          <span
                            className="slide-header__dot"
                            style={{
                              backgroundColor: navItem?.color ?? 'var(--accent)',
                              color: navItem?.color ?? 'var(--accent)',
                            }}
                          />
                          <span className="slide-header__channel">CH.0{index + 1}</span>
                          <span className="slide-header__divider">/</span>
                          <span className="slide-header__label">{navItem?.label ?? id}</span>
                        </div>
                        <div className="slide-header__counter">
                          <span>0{index + 1}</span>
                          <span className="slide-header__total"> / 0{mainScrollSections.length}</span>
                        </div>
                      </div>
                    )}

                    <motion.div
                      initial={reduceMotionRef.current ? false : { opacity: 0, y: 16 }}
                      whileInView={reduceMotionRef.current ? undefined : { opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.15 }}
                      transition={{ duration: 0.45, ease: 'easeOut' }}
                      className="page-section__content"
                    >
                      <SectionComponent onNavigate={handleNavigate} />
                    </motion.div>
                  </section>
                )
              })
            )}
          </div>
        </main>
      </div>

      <BackToTop visible={progress > 8} onClick={scrollToTop} />
      <KeyboardHintStrip />
      <Toast />
      <CommandPalette onNavigate={handleNavigate} />
      <Lightbox />
      <CertModal />
      <VideoModal />
      <ChessModal />
      <ConversationHubModal />
      <CodeSnippetModal />
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
