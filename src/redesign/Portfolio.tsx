import { useEffect, useRef, useState } from 'react'
import { createPortal, flushSync } from 'react-dom'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import {
  FiArrowUpRight,
  FiArrowRight,
  FiArrowLeft,
  FiDownload,
  FiGithub,
  FiLinkedin,
  FiMail,
  FiMapPin,
  FiMenu,
  FiMoon,
  FiSun,
  FiX,
  FiTwitter,
  FiMessageCircle,
  FiPlay,
  FiCode,
  FiFilm,
  FiLayout,
  FiChevronDown,
  FiChevronUp,
  FiVolume2,
  FiVolumeX,
  FiUsers,
  FiMessageSquare,
  FiSend,
  FiTrash2,
} from 'react-icons/fi'
import { profile, socials } from '../data/profile'
import { projects } from '../data/projects'
import { education } from '../data/education'
import { certifications } from '../data/certifications'
import { techGroups } from '../data/techstacks'
import { techIconMap, fallbackTechIcon } from '../data/techIcons'
import { gallery } from '../data/gallery'
import { freelanceIntro, freelanceOfferings } from '../data/freelance'
import { resourcesIntro, resourceCategories } from '../data/resources'
import { blogPosts } from '../data/blogs'
import {
  communityIntro,
  communityHubs,
  defaultVisitorAvatars,
  communityGuidelines,
} from '../data/community'
import { supabase } from '../utils/supabase'
import SidebarChess from '../components/chess/SidebarChess'
import BounceCards from '../components/ui/BounceCards'
import Stack from '../components/ui/Stack'
import StarBorder from '../components/ui/StarBorder'
import { useSoundEffects } from '../hooks/useSoundEffects'
import { playClickSound } from '../utils/sound'
import './portfolio.css'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-embed': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        project?: string
        src?: string
        config?: string
        restrict?: string
        alt?: string
      }
    }
  }
}

const HERO_MODEL_CONFIG = JSON.stringify({
  post: {
    bloom: { flare: 0, radius: 28, streak: 50, enabled: false, intensity: 16, threshold: 80 },
  },
  frame: {
    x: 0.2768,
    y: 0.17825,
    width: 0.4464,
    height: 0.6435,
    stageWidth: 1062,
    stageHeight: 584,
  },
  model: {
    url: '/models/happy_ghast_minecraft_fanart.glb',
    name: 'happy_ghast_minecraft_fanart.glb',
    scale: 0.49,
    locked: false,
    screen: null,
    rotation: { x: 0, y: 0, z: 0 },
    keepColour: true,
  },
  camera: { fov: 45, height: 9, distance: 100 },
  preset: {
    seed: 24301,
    type: 'tesserae',
    params: {
      sun: 41,
      boil: 25,
      tilt: 35,
      gloss: 75,
      grout: 70,
      relief: 45,
      sizeMix: 45,
      boilRate: 8,
      colorMix: 50,
      tileSize: 0,
      elevation: 45,
    },
  },
  version: 3,
  lighting: { fill: 100, rotation: 0, rotationX: 110, rotationZ: 0, brightness: 100 },
  material: { type: 'original', params: {} },
  animation: {
    enabled: true,
    entries: [
      {
        id: 'clip',
        loop: false,
        type: 'clip',
        params: { to: 75, from: 0, take: 'Ghast|Ghast Action', duration: 3.2 },
        enabled: true,
        trigger: 'appear',
        threshold: 0.2,
      },
      {
        id: 'float',
        loop: true,
        type: 'float',
        params: { tilt: 12, turn: 0, drift: 0, style: 'bob', height: 18, duration: 4 },
        enabled: true,
        trigger: 'appear',
        threshold: 0.1,
      },
      {
        id: 'mouseMove',
        loop: true,
        type: 'mouseMove',
        params: { nod: 28, turn: 42, shift: 12, smoothing: 35 },
        enabled: true,
        trigger: 'appear',
        threshold: 0.1,
      },
    ],
  },
  background: {
    fit: 'cover',
    kind: 'solid',
    angle: 180,
    color: '#000000',
    image: '',
    stops: ['#000000', '#000000'],
    images: [],
    enabled: false,
    opacities: [1, 1],
    positions: [0, 1],
  },
  environment: null,
  interactions: {
    zoom: false,
    hover: true,
    press: true,
    momentum: 50,
    snapBack: true,
    draggable: true,
    zoomRange: 50,
    maxRotation: 30,
    sensitivity: 50,
    cursorFollow: true,
  },
})

/* ---------------------------------------------------------------------------
   Content that is specific to the redesign. Everything else is pulled from
   src/data/*, so editing those files still updates the site.
--------------------------------------------------------------------------- */
const BIO =
  "I'm a dedicated 2nd-year BS Information Systems student who loves building things for the web. I enjoy turning rough ideas into functional, user-friendly projects while learning new technologies and improving my skills along the way."

// Static thumbnails for projects whose `cover` is a video (lighter to load).
const THUMB_OVERRIDES: Record<string, string | string[]> = {
  'proj-1': [
    '/gallery/background/personalhub/personalhub-dashboard-white.png',
    '/gallery/background/personalhub/personalhub-website.png',
    '/gallery/background/personalhub/personalhub-login-page.png',
    '/gallery/background/personalhub/personal-hub-dashboard.png',
    '/gallery/background/personalhub/personal-hub-register.png',
  ],
  'proj-3': '/gallery/background/Grahams.png',
  'proj-5': '/gallery/background/zenitsu.png',
  'proj-8': '/gallery/background/pixel-adventure-time.png',
  'proj-9': '/gallery/background/website.png',
  'proj-10': '/gallery/background/lj-libunao-website.png',
}

const SERVICE_ICONS = {
  'web-development': <FiCode />,
  'video-editing': <FiFilm />,
  'portfolio-design': <FiLayout />,
}

// Main page single-scroll navigation links
const MAIN_NAV = [
  { id: 'skills', label: 'Skills' },
  { id: 'contact', label: 'Collab' },
]

// Standalone sections accessible only when clicked from nav links
const STANDALONE_NAV = [
  { id: 'freelance', label: 'Freelancing' },
  { id: 'resources', label: 'Resources' },
  { id: 'shop', label: 'Shop' },
  { id: 'blog', label: 'Blog' },
  { id: 'community', label: 'Community' },
]

const SHOP_ITEMS = [
  {
    id: 'templates',
    title: 'Full-Stack Web Starter Kit',
    category: 'React + Laravel',
    badge: 'Production Ready',
    description:
      'Modular full-stack template featuring React + Vite frontend, clean Laravel REST API, MySQL migrations, and JWT authentication.',
    tags: ['React', 'Laravel', 'MySQL', 'Vite'],
    price: 'Free / Open Source',
  },
  {
    id: 'backend',
    title: 'PHP & MySQL System Boilerplate',
    category: 'Backend System',
    badge: 'CRUD Architecture',
    description:
      'Relational database schema, session management, CSRF protection, and responsive CRUD UI designed for student portals and small business systems.',
    tags: ['PHP', 'MySQL', 'Responsive UI', 'CRUD'],
    price: 'Inquire',
  },
  {
    id: 'ui-components',
    title: 'Minimal & Retro UI Component Kit',
    category: 'UI / Interaction',
    badge: 'Component Kit',
    description:
      'Handcrafted interactive components with marquee ribbons, tactile buttons, radar displays, and monospace VCR typography.',
    tags: ['CSS', 'VCR Mono', 'Tactile UI'],
    price: 'Inquire',
  },
  {
    id: 'clinic-blueprint',
    title: 'ClinicCare ERP Architecture Blueprint',
    category: 'Enterprise System',
    badge: 'Architecture',
    description:
      'Complete architecture blueprint for appointment queues, patient records, doctor scheduling, and billing flows based on ClinicCare.',
    tags: ['Laravel', 'React', 'Healthcare ERP'],
    price: 'Inquire',
  },
]

const allSkills = techGroups.flatMap((g) => g.items.map((i) => i.name))

const isVideo = (src = '') => /\.(mp4|webm|mov)$/i.test(src)
const isRealLink = (url) => url && url !== '#'

function useTheme() {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem('rd-theme')
      if (saved === 'dark' || saved === 'light') return saved
      return 'dark'
    } catch {
      return 'dark'
    }
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    try {
      localStorage.setItem('rd-theme', theme)
    } catch {}
  }, [theme])

  const toggleTheme = (e?: React.MouseEvent) => {
    const nextTheme: 'dark' | 'light' = theme === 'dark' ? 'light' : 'dark'
    playClickSound(0.22)

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (
      typeof document === 'undefined' ||
      !(document as any).startViewTransition ||
      prefersReducedMotion
    ) {
      document.documentElement.classList.add('theme-transitioning')
      setTimeout(() => {
        document.documentElement.classList.remove('theme-transitioning')
      }, 450)
      setTheme(nextTheme)
      document.documentElement.setAttribute('data-theme', nextTheme)
      try {
        localStorage.setItem('rd-theme', nextTheme)
      } catch {}
      return
    }

    let x = window.innerWidth / 2
    let y = window.innerHeight / 2

    if (e && typeof e.clientX === 'number' && typeof e.clientY === 'number' && (e.clientX !== 0 || e.clientY !== 0)) {
      x = e.clientX
      y = e.clientY
    } else if (e?.currentTarget && typeof (e.currentTarget as HTMLElement).getBoundingClientRect === 'function') {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
      x = rect.left + rect.width / 2
      y = rect.top + rect.height / 2
    }

    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    )

    const transition = (document as any).startViewTransition(() => {
      flushSync(() => {
        setTheme(nextTheme)
        document.documentElement.setAttribute('data-theme', nextTheme)
        try {
          localStorage.setItem('rd-theme', nextTheme)
        } catch {}
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
              duration: 520,
              easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
              pseudoElement: '::view-transition-new(root)',
            }
          )
        } catch {}
      })
      .catch(() => {})
  }

  return [theme, toggleTheme] as const
}

function useSmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.0,
      syncTouch: true,
      infinite: false,
      autoRaf: false,
    })

    let frameId = 0
    const animate = (time: number) => {
      lenis.raf(time)
      frameId = requestAnimationFrame(animate)
    }

    frameId = requestAnimationFrame(animate)
    ;(window as any).__lenis = lenis
    return () => {
      cancelAnimationFrame(frameId)
      lenis.destroy()
      delete (window as any).__lenis
    }
  }, [])
}

// Adds `is-in` to every [data-reveal] element as it scrolls into view.
function useReveal(trigger) {
  useEffect(() => {
    const markVisible = () => {
      const els = document.querySelectorAll('[data-reveal]')
      if (!els.length) return

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        els.forEach((el) => el.classList.add('is-in'))
        return
      }

      const io = new IntersectionObserver(
        (entries) =>
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add('is-in')
              io.unobserve(e.target)
            }
          }),
        { rootMargin: '0px 0px -5% 0px', threshold: 0.02 }
      )

      els.forEach((el) => {
        const rect = el.getBoundingClientRect()
        // If element is already in or near viewport, immediately reveal it
        if (rect.top <= window.innerHeight + 100 && rect.bottom >= -100) {
          el.classList.add('is-in')
        } else {
          io.observe(el)
        }
      })
      return io
    }

    const io1 = markVisible()
    const t = setTimeout(markVisible, 60)
    return () => {
      clearTimeout(t)
      if (io1) io1.disconnect()
    }
  }, [trigger])
}

function useActiveSection(ids, disabled = false) {
  const [active, setActive] = useState('')
  const idKey = ids.join(',')
  useEffect(() => {
    if (disabled) {
      setActive('')
      return
    }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-30% 0px -50% 0px' }
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [idKey, disabled])
  return active
}

function useScrollProgress() {
  const ref = useRef(null)
  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const max = document.documentElement.scrollHeight - window.innerHeight
      const p = max > 0 ? window.scrollY / max : 0
      if (ref.current) ref.current.style.transform = `scaleX(${p})`
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])
  return ref
}

// Local time in the Philippines, ticking every second.
function useManilaClock() {
  const fmt = () =>
    new Date().toLocaleTimeString('en-US', {
      timeZone: 'Asia/Manila',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })
  const [time, setTime] = useState(fmt)
  useEffect(() => {
    const id = setInterval(() => setTime(fmt()), 1000)
    return () => clearInterval(id)
  }, [])
  return time
}

/* ----------------------------- building blocks -------------------------- */
function SectionHead({ index, label, title, count, children }) {
  return (
    <header className="rd-section__head" data-reveal>
      <div className="rd-section__rule">
        <span className="rd-eyebrow">
          {index} / {label}
        </span>
        <span className="rd-section__line" aria-hidden="true" />
        {count != null && <span className="rd-eyebrow">[{String(count).padStart(2, '0')}]</span>}
      </div>
      <h2 className="rd-h2">{title}</h2>
      {children && <p className="rd-section__lead">{children}</p>}
    </header>
  )
}

function Lightbox({ item, onClose }) {
  useEffect(() => {
    if (!item) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [item, onClose])

  if (!item) return null
  return createPortal(
    <div className="rd-modal" role="dialog" aria-modal="true" aria-label={item.caption} onClick={onClose}>
      <figure onClick={(e) => e.stopPropagation()}>
        <button type="button" className="rd-icon-btn rd-modal__close" onClick={onClose} aria-label="Close">
          <FiX />
        </button>
        <img src={item.src} alt={item.caption} />
        <figcaption>{item.caption}</figcaption>
      </figure>
    </div>,
    document.body
  )
}

function ChessModal({ open, onClose }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null
  return createPortal(
    <div
      className="rd-modal"
      role="dialog"
      aria-modal="true"
      aria-label="Play Chess with Shander"
      onClick={onClose}
    >
      <div className="rd-chess-modal" onClick={(e) => e.stopPropagation()}>
        <div className="rd-chess-modal__top">
          <div className="rd-chess-modal__title-group">
            <span className="rd-eyebrow">
              <span className="rd-chess-live-dot" />
              CHESS // AI BOT
            </span>
            <h3 className="rd-chess-modal__heading">Play with Shander</h3>
          </div>
          <button
            type="button"
            className="rd-icon-btn rd-modal__close"
            onClick={onClose}
            aria-label="Close Chess"
          >
            <FiX />
          </button>
        </div>
        <div className="rd-chess-modal__body">
          <SidebarChess isModal={true} />
        </div>
      </div>
    </div>,
    document.body
  )
}

function Marquee({ items, reverse = false }) {
  const row = (
    <ul aria-hidden="true">
      {items.map((s) => (
        <li key={s}>
          {s} <span className="rd-marquee__sep">✦</span>
        </li>
      ))}
    </ul>
  )
  return (
    <div className={`rd-marquee ${reverse ? 'rd-marquee--reverse' : ''}`}>
      <div className="rd-marquee__track">
        {row}
        {row}
      </div>
    </div>
  )
}

function Nav({
  theme,
  onToggleTheme,
  soundEnabled,
  onToggleSound,
  activeMain,
  activeStandalone,
  onNavigateMain,
  onNavigateStandalone,
  onOpenChess,
}) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const progressRef = useScrollProgress()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    const onClickOutside = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('.rd-nav')) {
        setOpen(false)
      }
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('click', onClickOutside)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('click', onClickOutside)
    }
  }, [open])

  return (
    <nav className={`rd-nav ${scrolled ? 'is-scrolled' : ''} ${open ? 'is-open' : ''}`} aria-label="Main">
      <div className="rd-container rd-nav__inner">
        <a
          href="#top"
          className="rd-nav__brand"
          onClick={(e) => {
            e.preventDefault()
            setOpen(false)
            onNavigateMain('top')
          }}
        >
          Shander<span>.</span>
        </a>

        <div className="rd-nav__links" id="rd-nav-links">
          {MAIN_NAV.map((n) => (
            <a
              key={n.id}
              href={`#${n.id}`}
              className={!activeStandalone && activeMain === n.id ? 'is-active' : ''}
              onClick={(e) => {
                e.preventDefault()
                setOpen(false)
                onNavigateMain(n.id)
              }}
            >
              {n.label}
            </a>
          ))}

          <span className="rd-nav__sep" aria-hidden="true" />

          {STANDALONE_NAV.map((n) => (
            <button
              key={n.id}
              type="button"
              className={`rd-nav__standalone-btn ${activeStandalone === n.id ? 'is-active' : ''}`}
              onClick={() => {
                setOpen(false)
                onNavigateStandalone(n.id)
              }}
            >
              {n.label}
            </button>
          ))}
        </div>

        <div className="rd-nav__actions">
          <button
            type="button"
            className="rd-icon-btn rd-sound-toggle"
            onClick={onToggleSound}
            aria-label={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
            title={soundEnabled ? 'Sound FX active (click to mute)' : 'Sound FX muted (click to enable)'}
          >
            {soundEnabled ? <FiVolume2 /> : <FiVolumeX />}
          </button>
          <button
            type="button"
            className={`rd-liquid-toggle ${theme === 'dark' ? 'is-dark' : 'is-light'}`}
            onClick={(e) => onToggleTheme?.(e)}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            title={`Switch to ${theme === 'dark' ? 'White' : 'Black'} mode`}
          >
            <span className="rd-liquid-toggle__track">
              <span className="rd-liquid-toggle__thumb">
                <svg
                  className="rd-liquid-toggle__svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <mask id="moon-mask">
                    <rect x="0" y="0" width="100%" height="100%" fill="white" />
                    <circle className="rd-mask-circle" cx="12" cy="4" r="9" fill="black" />
                  </mask>
                  <circle
                    className="rd-sun-core"
                    cx="12"
                    cy="12"
                    r="9"
                    fill="currentColor"
                    mask="url(#moon-mask)"
                  />
                  <g className="rd-sun-beams" stroke="currentColor">
                    <line x1="12" y1="1" x2="12" y2="3" />
                    <line x1="12" y1="21" x2="12" y2="23" />
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                    <line x1="1" y1="12" x2="3" y2="12" />
                    <line x1="21" y1="12" x2="23" y2="12" />
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                  </g>
                </svg>
              </span>
              <span className="rd-liquid-toggle__text">
                {theme === 'dark' ? 'Dark' : 'Light'}
              </span>
            </span>
          </button>
          <StarBorder
            as="button"
            type="button"
            className="rd-btn-star rd-btn-star--small rd-nav__chess-btn"
            color={theme === 'light' ? '#18181b' : '#ffffff'}
            trailColor={theme === 'light' ? '#18181b' : '#ffffff'}
            duration={4}
            direction="clockwise"
            stars={1}
            trailLength={0.3}
            thickness={1}
            radius={999}
            glow={0.6}
            hover="lap"
            sparkle={false}
            clickPulse
            theme={theme}
            onClick={() => {
              playClickSound()
              setOpen(false)
              onOpenChess()
            }}
            aria-label="Play chess"
          >
            Play chess?
          </StarBorder>
          <button
            type="button"
            className="rd-icon-btn rd-nav__menu"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={open}
            aria-controls="rd-nav-links"
          >
            {open ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>
      <div className="rd-progress" ref={progressRef} aria-hidden="true" />
    </nav>
  )
}

/* -------------------------------- sections ------------------------------ */
function Hero({ theme }: { theme?: 'dark' | 'light' }) {
  const [ghastBg, setGhastBg] = useState<'black' | 'white'>(
    theme === 'light' ? 'white' : 'black'
  )

  useEffect(() => {
    if (theme) {
      setGhastBg(theme === 'light' ? 'white' : 'black')
    }
  }, [theme])

  useEffect(() => {
    const src = 'https://thrine.app/embed/v1.js'
    if (!document.querySelector(`script[src="${src}"]`)) {
      const script = document.createElement('script')
      script.type = 'module'
      script.src = src
      document.head.appendChild(script)
    }
  }, [])

  const stats = [
    { n: projects.length, label: 'Projects shipped' },
    { n: allSkills.length, label: 'Tools & languages' },
    { n: certifications.filter((c) => c.image).length, label: 'Awards & certs' },
  ]

  return (
    <section className="rd-hero-wrap" id="top">
      <div className="rd-hero__grid" aria-hidden="true" />
      <div className="rd-hero rd-container">
        <div className="rd-hero__text">
          {profile.availability?.open && (
            <span className="rd-pill" data-reveal>
              <span className="rd-pill__dot" />
              {profile.availability.note}
            </span>
          )}
          <h1 className="rd-h1" data-reveal>
            {profile.name}
            <span className="rd-h1__sub">
              Web developer &amp; IS student<span className="rd-caret" aria-hidden="true">_</span>
            </span>
          </h1>
          <p className="rd-hero__bio" data-reveal>
            {BIO}
          </p>
          <div className="rd-hero__cta" data-reveal>
            <StarBorder
              as="a"
              href="#work"
              className="rd-btn-star"
              color={theme === 'light' ? '#18181b' : '#ffffff'}
              trailColor={theme === 'light' ? '#18181b' : '#ffffff'}
              duration={4}
              direction="clockwise"
              stars={1}
              trailLength={0.3}
              thickness={1}
              radius={999}
              glow={0.6}
              hover="lap"
              sparkle={false}
              clickPulse
              theme={theme || 'dark'}
              onClick={() => playClickSound()}
            >
              View my work <FiArrowUpRight />
            </StarBorder>
            <a href={profile.resumeUrl} className="rd-btn rd-btn--ghost" download>
              <FiDownload /> Download resume
            </a>
          </div>
          <dl className="rd-stats" data-reveal>
            {stats.map((s) => (
              <div key={s.label}>
                <dt>{s.label}</dt>
                <dd>{String(s.n).padStart(2, '0')}</dd>
              </div>
            ))}
          </dl>
        </div>

        <figure className="rd-hero__photo" data-reveal>
          <div className="rd-hero__frame">
            <span className="rd-corner rd-corner--tl" aria-hidden="true" />
            <span className="rd-corner rd-corner--tr" aria-hidden="true" />
            <span className="rd-corner rd-corner--bl" aria-hidden="true" />
            <span className="rd-corner rd-corner--br" aria-hidden="true" />
            <model-embed
              src="/models/happy_ghast_minecraft_fanart.glb"
              config={HERO_MODEL_CONFIG}
              style={{
                display: 'block',
                width: '100%',
                aspectRatio: '474/376',
                background: ghastBg === 'white' ? '#ffffff' : '#000000',
                transition: 'background-color 0.85s cubic-bezier(0.16, 1, 0.3, 1)',
                transitionDelay: '0.08s',
              }}
            ></model-embed>
          </div>
          <figcaption>
            <span>
              <FiMapPin /> {profile.location.split(',')[0]}
            </span>
            <button
              type="button"
              className="rd-ghast-bg-toggle"
              onClick={() => {
                playClickSound()
                setGhastBg((b) => (b === 'black' ? 'white' : 'black'))
              }}
              aria-label={`Switch 3D background to ${ghastBg === 'black' ? 'white' : 'black'}`}
            >
              {ghastBg === 'black' ? <FiSun /> : <FiMoon />}
              <span>BG: {ghastBg === 'black' ? 'Black' : 'White'}</span>
            </button>
          </figcaption>
        </figure>
      </div>
    </section>
  )
}

function ProjectMedia({ project }: { project: any }) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const thumb = THUMB_OVERRIDES[project.id] || (!isVideo(project.cover) && project.cover)
  const isImageArray = Array.isArray(thumb)
  const [activeIdx, setActiveIdx] = useState(0)

  useEffect(() => {
    if (!isImageArray || (thumb as string[]).length <= 1) return
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % (thumb as string[]).length)
    }, 5000)
    return () => clearInterval(interval)
  }, [isImageArray, thumb])

  if (isImageArray) {
    const list = thumb as string[]
    return (
      <div className="rd-card__slideshow">
        {list.map((imgSrc, idx) => (
          <img
            key={imgSrc}
            src={imgSrc}
            alt={`${project.title} preview ${idx + 1}`}
            loading={idx === 0 ? 'eager' : 'lazy'}
            className={`rd-card__slideshow-img ${idx === activeIdx ? 'is-active' : ''}`}
          />
        ))}
        {list.length > 1 && (
          <div className="rd-card__slideshow-dots" aria-hidden="true">
            {list.map((_, idx) => (
              <span
                key={idx}
                className={`rd-card__slideshow-dot ${idx === activeIdx ? 'is-active' : ''}`}
              />
            ))}
          </div>
        )}
      </div>
    )
  }

  if (thumb && typeof thumb === 'string') return <img src={thumb} alt="" loading="lazy" />
  const video = isVideo(project.cover) ? project.cover : project.videoUrl
  if (!video) return <div className="rd-card__placeholder">{project.title[0]}</div>

  return (
    <div
      className="rd-card__video"
      onMouseEnter={() => videoRef.current?.play().catch(() => {})}
      onMouseLeave={() => videoRef.current?.pause()}
    >
      <video ref={videoRef} src={video} muted loop playsInline preload="metadata" />
      <span className="rd-card__play" aria-hidden="true">
        <FiPlay />
      </span>
    </div>
  )
}

function Work({
  theme,
  onSelectProject,
  targetProjectId,
}: {
  theme?: 'dark' | 'light'
  onSelectProject?: (project: any) => void
  targetProjectId?: string | null
}) {
  const categories = ['All', ...new Set(projects.map((p) => p.category))]
  const [filter, setFilter] = useState('All')
  const [showAll, setShowAll] = useState(() => {
    if (targetProjectId) {
      const idx = projects.findIndex((p) => p.id === targetProjectId)
      return idx >= 4
    }
    return false
  })

  useEffect(() => {
    if (targetProjectId) {
      const idx = projects.findIndex((p) => p.id === targetProjectId)
      if (idx >= 4) {
        setShowAll(true)
      }
    }
  }, [targetProjectId])

  const shown = filter === 'All' ? projects : projects.filter((p) => p.category === filter)
  const featuredProjects = shown.slice(0, 2)
  const listProjects = showAll ? shown.slice(2) : shown.slice(2, 4)

  const handleFilterChange = (c: string) => {
    setFilter(c)
    setShowAll(false)
  }

  return (
    <section className="rd-section rd-container" id="work">
      <SectionHead index="01" label="Selected work" title="Projects" count={projects.length}>
        A few things I've designed and built, from school systems to brand sites.
      </SectionHead>

      <div className="rd-filters" role="group" aria-label="Filter projects" data-reveal>
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            className={filter === c ? 'is-active' : ''}
            aria-pressed={filter === c}
            onClick={() => handleFilterChange(c)}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Featured Showcase Cards */}
      <div className="rd-project-list">
        {featuredProjects.map((p, i) => {
          return (
            <article className="rd-card is-in" key={p.id} id={`project-item-${p.id}`}>
              <div className="rd-card__media">
                <ProjectMedia project={p} />
                <span className="rd-card__num">{String(i + 1).padStart(2, '0')}</span>
                <button
                  type="button"
                  className="rd-card__overlay"
                  onClick={() => onSelectProject?.(p)}
                  aria-label={`View details of ${p.title}`}
                >
                  <span>
                    View project details <FiArrowUpRight />
                  </span>
                </button>
              </div>
              <div className="rd-card__body">
                <div className="rd-card__top">
                  <span className="rd-card__cat">{p.category}</span>
                  {p.progress < 100 && <span className="rd-card__status">In progress</span>}
                </div>
                <h3 className="rd-card__title">
                  <button
                    type="button"
                    className="rd-card__title-btn"
                    onClick={() => onSelectProject?.(p)}
                  >
                    {p.title} <FiArrowUpRight />
                  </button>
                </h3>
                <p className="rd-card__desc">{p.description}</p>
                <ul className="rd-tags">
                  {p.tags.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
                <div className="rd-card__links">
                  {isRealLink(p.liveUrl) && (
                    <a href={p.liveUrl} target="_blank" rel="noopener noreferrer">
                      Live site <FiArrowUpRight />
                    </a>
                  )}
                  <button
                    type="button"
                    className="rd-card__link-btn"
                    onClick={() => onSelectProject?.(p)}
                  >
                    View details <FiArrowRight />
                  </button>
                </div>
              </div>
            </article>
          )
        })}
      </div>

      {/* Minimalist Row List (Shown for projects after the top 2 cards) */}
      {listProjects.length > 0 && (
        <div className="rd-project-archive">
          <div className="rd-project-archive__list">
            {listProjects.map((p) => (
              <div
                key={p.id}
                id={`project-item-${p.id}`}
                className="rd-project-row"
                onClick={() => onSelectProject?.(p)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && onSelectProject?.(p)}
                aria-label={`View details of ${p.title}`}
              >
                <div className="rd-project-row__title">
                  <h4>{p.title}</h4>
                </div>
                <div className="rd-project-row__meta">
                  <span className="rd-project-row__cat">{p.category}</span>
                  <p className="rd-project-row__desc">{p.description}</p>
                </div>
                <div className="rd-project-row__arrow">
                  <FiArrowUpRight />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {shown.length > 4 && (
        <div className="rd-projects__more">
          <button
            type="button"
            className="rd-btn rd-btn--ghost"
            onClick={() => setShowAll((prev) => !prev)}
            aria-expanded={showAll}
          >
            {showAll ? (
              <>
                Show less <FiChevronUp />
              </>
            ) : (
              <>
                View more <FiChevronDown />
              </>
            )}
          </button>
        </div>
      )}
    </section>
  )
}

const ABOUT_STACK_IMAGES = [
  '/gallery/stack-about/371370707_953740433086095_3000394088154740303_n.jpg',
  '/gallery/stack-about/387501030_700967001927090_8869638376835267872_n.jpg',
  '/gallery/stack-about/448225129_751109937214666_3346676322944271018_n.jpg',
  '/gallery/stack-about/367949082_188282470815708_6616340306164672621_n.jpg',
]

function About({ onMore }: { onMore?: () => void }) {
  return (
    <section className="rd-section rd-container" id="about">
      <SectionHead index="02" label="About" title="A little about me" />
      <div className="rd-about">
        <div className="rd-about__text" data-reveal>
          <p>{BIO}</p>
          <p>
            I'm most comfortable with PHP, Laravel, React and MySQL, and I care about clean code,
            clear interfaces and shipping things that actually work. Outside of code I also do
            graphic design and video editing.
          </p>
          {onMore && (
            <div className="rd-about__cta">
              <button
                type="button"
                className="rd-btn rd-btn--ghost rd-btn--small"
                onClick={onMore}
              >
                More about me <FiArrowRight />
              </button>
            </div>
          )}
        </div>
        <div className="rd-about__stack-col" data-reveal>
          <div className="rd-about__stack-wrap" style={{ width: 230, height: 230 }}>
            <Stack
              layout="fan"
              sendToBackOnClick={true}
              cards={ABOUT_STACK_IMAGES.map((src, i) => (
                <img key={src} src={src} alt={`About photo ${i + 1}`} />
              ))}
              visible={4}
              spread={0.5}
              depth={0.5}
              radius={16}
              frame={0}
              frameColor="#ffffff"
              shadow
              tilt={30}
              threshold={90}
              speed={1}
              autoplay={false}
              autoplayDelay={3000}
              pauseOnHover={false}
              onChange={() => playClickSound()}
            />
          </div>
          <span className="rd-about__stack-hint">
            <span aria-hidden="true" /> Click, drag or fling cards
          </span>
        </div>
      </div>
    </section>
  )
}

function Skills({ theme }: { theme?: 'dark' | 'light' }) {
  const [showAllSkills, setShowAllSkills] = useState(false)
  const displayedGroups = showAllSkills ? techGroups : techGroups.slice(0, 3)

  useEffect(() => {
    const els = document.querySelectorAll('#skills [data-reveal]')
    els.forEach((el) => el.classList.add('is-in'))
  }, [showAllSkills])

  return (
    <section className="rd-section rd-container" id="skills">
      <SectionHead index="03" label="Skills" title="Tools I work with" count={allSkills.length} />
      <div className="rd-skills">
        {displayedGroups.map((g, i) => (
          <div className="rd-skills__group" key={g.id} data-reveal>
            <h3>
              <span>{String(i + 1).padStart(2, '0')}</span> {g.label}
            </h3>
            <ul className="rd-tags rd-tags--lg">
              {g.items.map((item) => {
                const IconComponent = techIconMap[item.icon] || fallbackTechIcon
                return (
                  <li key={item.name}>
                    <span className="rd-tag__icon" aria-hidden="true">
                      <IconComponent />
                    </span>
                    <span>{item.name}</span>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>

      <div className="rd-skills__more">
        <button
          type="button"
          className="rd-btn rd-btn--ghost"
          onClick={() => setShowAllSkills((prev) => !prev)}
          aria-expanded={showAllSkills}
        >
          {showAllSkills ? (
            <>
              Show less <FiChevronUp />
            </>
          ) : (
            <>
              View more <FiChevronDown />
            </>
          )}
        </button>
      </div>
    </section>
  )
}

function Education() {
  return (
    <section className="rd-section rd-container" id="education">
      <SectionHead index="04" label="Education" title="Where I've studied" />
      <ol className="rd-timeline">
        {education.map((e) => (
          <li key={e.id} className="rd-timeline__row" data-reveal>
            <span className="rd-timeline__period">{e.period}</span>
            <div>
              <h3>
                {e.url ? (
                  <a href={e.url} target="_blank" rel="noopener noreferrer">
                    {e.school} <FiArrowUpRight />
                  </a>
                ) : (
                  e.school
                )}
              </h3>
              <p className="rd-timeline__degree">{e.degree}</p>
              <p className="rd-timeline__desc">{e.description}</p>
            </div>
            {e.badge && <span className="rd-badge">{e.badge}</span>}
          </li>
        ))}
      </ol>
    </section>
  )
}

function Certifications({ onOpen }) {
  return (
    <section className="rd-section rd-container" id="certifications">
      <SectionHead index="05" label="Recognition" title="Certifications & awards" count={certifications.length} />
      <div className="rd-certs">
        {certifications.map((c) => (
          <button
            type="button"
            key={c.id}
            className="rd-cert"
            onClick={() => c.image && onOpen({ src: c.image, caption: `${c.title} — ${c.issuer}` })}
            disabled={!c.image}
            data-reveal
          >
            <div className="rd-cert__img">
              {c.image ? <img src={c.image} alt="" loading="lazy" /> : <span>Coming soon</span>}
            </div>
            <div className="rd-cert__body">
              <h3>{c.title}</h3>
              <p>
                {c.issuer} · {c.year}
              </p>
            </div>
          </button>
        ))}
      </div>
    </section>
  )
}

function Gallery({ onOpen }) {
  const photos = gallery.filter((g) => !g.featured)
  const [screenWidth, setScreenWidth] = useState(() => (typeof window !== 'undefined' ? window.innerWidth : 1200))

  useEffect(() => {
    const onResize = () => setScreenWidth(window.innerWidth)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const isSmall = screenWidth < 520
  const isMedium = screenWidth < 768

  const containerWidth = isSmall ? Math.min(340, screenWidth - 40) : isMedium ? 520 : 680
  const containerHeight = isSmall ? 270 : isMedium ? 320 : 380
  const cardSize = isSmall ? 140 : isMedium ? 175 : 205
  const spread = isSmall ? 36 : isMedium ? 56 : 78
  const pushDistance = isSmall ? 90 : isMedium ? 125 : 160

  const bounceImages = photos.map((p) => ({
    src: p.src,
    alt: p.caption,
  }))

  return (
    <section className="rd-section rd-container" id="gallery">
      <SectionHead index="06" label="Gallery" title="Off the screen" count={photos.length}>
        School, friends and the places in between.
      </SectionHead>
      <div className="rd-gallery-showcase" data-reveal>
        <div className="rd-gallery-showcase__bg" aria-hidden="true" />
        <div className="rd-gallery-showcase__stage">
          <BounceCards
            images={bounceImages}
            containerWidth={containerWidth}
            containerHeight={containerHeight}
            cardSize={cardSize}
            spread={spread}
            rotation={10}
            arc={0}
            pushDistance={pushDistance}
            hoverScale={1.08}
            bounciness={0.6}
            animationDelay={0.4}
            animationStagger={0.06}
            borderWidth={5}
            borderColor="#ffffff"
            radius={22}
            shadow
            enableHover
            onCardClick={(index) => {
              playClickSound()
              onOpen({ src: photos[index].src, caption: photos[index].caption })
            }}
          />
        </div>
        <div className="rd-gallery-showcase__footer">
          <div className="rd-gallery-showcase__hint">
            <span className="rd-gallery-showcase__dot" aria-hidden="true" />
            Hover cards to fan out • Click to expand
          </div>
          <div className="rd-gallery-showcase__chips">
            {photos.map((p) => (
              <button
                type="button"
                key={p.id}
                className="rd-gallery-chip"
                onClick={() => {
                  playClickSound()
                  onOpen({ src: p.src, caption: p.caption })
                }}
              >
                <span>{p.caption}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function Resume({ theme }: { theme?: 'dark' | 'light' }) {
  return (
    <section className="rd-section rd-container" id="resume">
      <div className="rd-resume" data-reveal>
        <div className="rd-resume__dots" aria-hidden="true" />
        <div>
          <span className="rd-eyebrow">07 / Résumé</span>
          <h2 className="rd-h2">Want the full picture?</h2>
          <p>Download my résumé for details on my projects, skills and education.</p>
        </div>
        <StarBorder
          as="a"
          href={profile.resumeUrl}
          className="rd-btn-star"
          color={theme === 'light' ? '#18181b' : '#ffffff'}
          trailColor={theme === 'light' ? '#18181b' : '#ffffff'}
          duration={4}
          direction="clockwise"
          stars={1}
          trailLength={0.3}
          thickness={1}
          radius={999}
          glow={0.6}
          hover="lap"
          sparkle={false}
          clickPulse
          theme={theme || 'dark'}
          download
          onClick={() => playClickSound()}
        >
          <FiDownload /> Download résumé
        </StarBorder>
      </div>
    </section>
  )
}

function Contact() {
  const time = useManilaClock()
  const links = [
    socials.github && { href: socials.github, label: 'GitHub', icon: <FiGithub /> },
    socials.linkedin && { href: socials.linkedin, label: 'LinkedIn', icon: <FiLinkedin /> },
    socials.x && { href: socials.x, label: 'X', icon: <FiTwitter /> },
    socials.messenger && { href: socials.messenger, label: 'Messenger', icon: <FiMessageCircle /> },
  ].filter(Boolean)

  return (
    <section className="rd-section rd-container rd-contact" id="contact">
      <div className="rd-section__rule" data-reveal>
        <span className="rd-eyebrow">08 / Contact</span>
        <span className="rd-section__line" aria-hidden="true" />
        <span className="rd-eyebrow">PH {time}</span>
      </div>
      <h2 className="rd-contact__title" data-reveal>
        Let's build something together.
      </h2>
      <p className="rd-section__lead" data-reveal>
        I'm open to internships, freelance work and collaborations. The fastest way to reach me is email.
      </p>
      <a href={`mailto:${socials.email}`} className="rd-contact__email" data-reveal>
        <FiMail /> {socials.email}
      </a>
      <ul className="rd-socials" data-reveal>
        {links.map((l) => (
          <li key={l.label}>
            <a href={l.href} target="_blank" rel="noopener noreferrer">
              {l.icon} {l.label}
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}

/* ---------------------- Project Details View Component ----------------------- */
function ProjectDetailsView({
  project,
  onBack,
  onOpenLightbox,
}: {
  project: any
  onBack: () => void
  onOpenLightbox?: (item: any) => void
}) {
  const [activeMediaIndex, setActiveMediaIndex] = useState(0)

  useEffect(() => {
    if (!project) return
    const el = document.getElementById(`project-${project.id}`)
    if (el) {
      el.querySelectorAll('[data-reveal]').forEach((r) => r.classList.add('is-in'))
    }
  }, [project])

  if (!project) {
    return (
      <section className="rd-section rd-container rd-standalone-section rd-project-details-page">
        <div className="rd-standalone__top">
          <button type="button" className="rd-btn rd-btn--ghost rd-btn--small" onClick={onBack}>
            <FiArrowLeft /> Back to Projects
          </button>
        </div>
        <div className="rd-project-details__card">
          <h2 className="rd-h2">Project Not Found</h2>
          <p className="rd-project-details__desc">The requested project details could not be found.</p>
        </div>
      </section>
    )
  }

  // Determine media assets for this project
  const mediaList: string[] = []
  if (Array.isArray(project.images) && project.images.length > 0) {
    mediaList.push(...project.images)
  } else if (THUMB_OVERRIDES[project.id]) {
    const ov = THUMB_OVERRIDES[project.id]
    if (Array.isArray(ov)) mediaList.push(...ov)
    else mediaList.push(ov)
  } else if (project.cover && !isVideo(project.cover)) {
    mediaList.push(project.cover)
  }

  const hasVideo = Boolean(project.videoUrl && isVideo(project.videoUrl))
  const hasMultipleMedia = hasVideo && mediaList.length > 0
  const [mediaTab, setMediaTab] = useState<'preview' | 'video'>(
    mediaList.length > 0 ? 'preview' : 'video'
  )
  const currentImage = mediaList[activeMediaIndex] || mediaList[0] || project.cover

  return (
    <section className="rd-section rd-container rd-standalone-section rd-project-details-page" id={`project-${project.id}`}>
      {/* Top Bar with Back Button & Breadcrumbs */}
      <div className="rd-standalone__top">
        <button type="button" className="rd-btn rd-btn--ghost rd-btn--small" onClick={onBack}>
          <FiArrowLeft /> Back to Projects
        </button>
        <span className="rd-eyebrow">
          STANDALONE VIEW / {project.category?.toUpperCase() || 'PROJECT'} // {project.appType || 'DETAILS'}
        </span>
      </div>

      {/* Hero Header */}
      <div className="rd-project-details__header" data-reveal>
        <div className="rd-project-details__badge-row">
          <span className="rd-card__cat">{project.category}</span>
          {project.featuredBadge && (
            <span className="rd-project-details__featured-pill">{project.featuredBadge}</span>
          )}
          {project.subBadge && (
            <span className="rd-project-details__sub-pill">{project.subBadge}</span>
          )}
          <span className="rd-project-details__status-pill">
            <span className="rd-project-details__live-dot" />
            {project.progress === 100 ? 'Completed' : `${project.progress}% In Progress`}
          </span>
        </div>

        <h1 className="rd-project-details__title">{project.title}</h1>
        {project.appTitle && project.appTitle !== project.title && (
          <p className="rd-project-details__subtitle">{project.appTitle}</p>
        )}

        {/* System Version & Deployment Notice Callout */}
        {project.versionNotice && (
          <div className="rd-project-details__notice-box">
            <div className="rd-project-details__notice-title">
              <span className="rd-pulse-dot" /> SYSTEM REDESIGN & DEPLOYMENT NOTICE
            </div>
            <p className="rd-project-details__notice-text">{project.versionNotice}</p>
          </div>
        )}
      </div>

      {/* Main Grid: Media Showcase & Information Column */}
      <div className="rd-project-details__grid">
        {/* Left Column: Media Player / Gallery Showcase */}
        <div className="rd-project-details__media-col" data-reveal>
          {hasMultipleMedia && (
            <div className="rd-project-details__media-tabs">
              <button
                type="button"
                className={`rd-project-details__tab-btn ${mediaTab === 'preview' ? 'is-active' : ''}`}
                onClick={() => setMediaTab('preview')}
              >
                <span>🖼️ New System Redesign (v2 Preview)</span>
              </button>
              <button
                type="button"
                className={`rd-project-details__tab-btn ${mediaTab === 'video' ? 'is-active' : ''}`}
                onClick={() => setMediaTab('video')}
              >
                <span>🎥 Previous Version (Legacy Demo)</span>
              </button>
            </div>
          )}

          <div className="rd-project-details__screen-wrap">
            {mediaTab === 'video' && hasVideo ? (
              <div className="rd-project-details__video-wrap">
                <video
                  src={project.videoUrl}
                  controls
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="rd-project-details__video"
                />
                <span className="rd-project-details__video-tag">Legacy Video Demo (Old Design)</span>
              </div>
            ) : currentImage ? (
              <img
                src={currentImage}
                alt={project.title}
                className="rd-project-details__main-img"
                onClick={() => onOpenLightbox && onOpenLightbox({ src: currentImage, caption: project.title })}
                title="Click to view full image in lightbox"
              />
            ) : (
              <div className="rd-card__placeholder">{project.title[0]}</div>
            )}
          </div>

          {/* Screenshot Thumbnails (when viewing screenshots) */}
          {mediaTab === 'preview' && mediaList.length > 1 && (
            <div className="rd-project-details__thumbs">
              {mediaList.map((src, idx) => (
                <button
                  key={src}
                  type="button"
                  className={`rd-project-details__thumb ${idx === activeMediaIndex ? 'is-active' : ''}`}
                  onClick={() => setActiveMediaIndex(idx)}
                  aria-label={`Show screenshot ${idx + 1}`}
                >
                  <img src={src} alt={`Thumbnail ${idx + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Metadata, Tech Stack & Quick Actions */}
        <div className="rd-project-details__info-col" data-reveal>
          {/* Action Launch Bar */}
          <div className="rd-project-details__actions">
            {isRealLink(project.liveUrl) && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rd-btn rd-btn--primary rd-project-details__launch-btn"
              >
                <span>Launch Live Project</span> <FiArrowUpRight />
              </a>
            )}
            {isRealLink(project.codeUrl) && (
              <a
                href={project.codeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rd-btn rd-btn--ghost"
              >
                <FiGithub /> <span>View Repository</span>
              </a>
            )}
          </div>

          {/* Description Section */}
          <div className="rd-project-details__card">
            <h3 className="rd-project-details__card-title">Overview</h3>
            <p className="rd-project-details__desc">{project.description}</p>
          </div>

          {/* Key Metrics / Specs */}
          {Array.isArray(project.metrics) && project.metrics.length > 0 && (
            <div className="rd-project-details__card">
              <h3 className="rd-project-details__card-title">Specifications & Architecture</h3>
              <div className="rd-project-details__metrics-grid">
                {project.metrics.map((m: any, idx: number) => (
                  <div key={idx} className="rd-project-details__metric-item">
                    <span className="rd-project-details__metric-label">{m.label}</span>
                    <span className="rd-project-details__metric-val">{m.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tech Stack & Tags */}
          {Array.isArray(project.tags) && project.tags.length > 0 && (
            <div className="rd-project-details__card">
              <h3 className="rd-project-details__card-title">Technologies & Tools</h3>
              <ul className="rd-tags rd-project-details__tags">
                {project.tags.map((t: string) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
          )}

          <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
            <button type="button" className="rd-btn rd-btn--ghost" onClick={onBack}>
              <FiArrowLeft /> Back to Projects
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------------------- Standalone View Components ----------------------- */
function AboutView({ onBack }: { onBack: () => void }) {
  return (
    <section className="rd-section rd-container rd-standalone-section rd-about-page" id="about-me">
      <div className="rd-standalone__top">
        <button type="button" className="rd-btn rd-btn--ghost rd-btn--small" onClick={onBack}>
          <FiArrowLeft /> Back to Portfolio
        </button>
        <span className="rd-eyebrow">STANDALONE VIEW / ABOUT ME</span>
      </div>

      <SectionHead
        index="02"
        label="Full Story"
        title="Who I am, what drives me & how I build"
      >
        A deeper look into my journey, engineering philosophy, and creative pursuits.
      </SectionHead>

      <div className="rd-about-page__hero">
        <div className="rd-about-page__story is-in">
          <div className="rd-about-page__lead">
            <p className="rd-about-page__highlight">
              Hello! I'm <strong>Klient Shander Santillan</strong>, a web developer and Information Systems student based in Negros Occidental, Philippines.
            </p>
            <p>
              My journey into programming didn't begin in a lecture hall—it started back in Senior High School (HUMSS strand at Escalante National High School). Driven by pure curiosity to see how web applications actually work under the hood, I taught myself PHP and MySQL late at night, building small dynamic utilities and interactive scripts.
            </p>
            <p>
              That self-directed experimentation solidified my passion for technology. Graduating with honors, I enrolled in the Bachelor of Science in Information Systems program at Mount Carmel College of Escalante City Inc. (MCCEI), where I was honored as a Dean's Lister in my first year.
            </p>
          </div>

          <div className="rd-about-page__chapter">
            <h3 className="rd-about-page__chapter-title">
              <span className="rd-badge-dot" /> How I Approach Engineering
            </h3>
            <p>
              I believe great software lives at the intersection of dependable architecture and intentional user experience. When writing code, I value:
            </p>
            <ul className="rd-about-page__points">
              <li>
                <strong>Purposeful Architecture:</strong> Whether designing relational schemas in MySQL or architecting Laravel MVC controllers, I keep code organized, modular, and maintainable.
              </li>
              <li>
                <strong>Frictionless Interfaces:</strong> Fast load times, responsive fluid layouts, smooth micro-interactions, and accessible keyboard navigation are non-negotiable.
              </li>
              <li>
                <strong>Practical Pragmatism:</strong> Technology is a tool to solve real human problems—from hospital queue workflows to e-commerce point-of-sale systems.
              </li>
            </ul>
          </div>

          <div className="rd-about-page__chapter">
            <h3 className="rd-about-page__chapter-title">
              <span className="rd-badge-dot" /> Multimedia & Creative Synergy
            </h3>
            <p>
              Software development is only half my creative toolkit. I regularly work with video editing and graphic design, crafting brand identities, mockups, and promotional videos. This visual sensibility directly translates to the web apps I build—giving them a polished aesthetic that balances technical utility with modern art direction.
            </p>
          </div>
        </div>

        {/* Profile & Visual Snapshot Sidebar */}
        <aside className="rd-about-page__side is-in">
          <div className="rd-about-page__card rd-about-profile-card">
            <div className="rd-about-profile-card__header">
              <div className="rd-about-profile-card__avatar">
                <img src="/gallery/shander.png" alt="Shander Santillan" />
                <span className="rd-status-indicator" title="Available for projects" />
              </div>
              <div>
                <h4 className="rd-about-profile-card__name">Klient Shander Santillan</h4>
                <p className="rd-about-profile-card__role">Web Developer & UI Designer</p>
                <span className="rd-about-profile-card__loc">
                  <FiMapPin /> Negros Occidental, PH
                </span>
              </div>
            </div>

            <div className="rd-about-profile-card__chips">
              <span className="rd-chip">Dean's Lister (1st Year)</span>
              <span className="rd-chip">BS Information Systems</span>
              <span className="rd-chip">PHP & Laravel</span>
              <span className="rd-chip">React & Tailwind</span>
              <span className="rd-chip">Video Editor</span>
            </div>

            <div className="rd-about-profile-card__meta">
              <div className="rd-about-meta-row">
                <span className="rd-label-micro">Institution</span>
                <strong>MCCEI</strong>
              </div>
              <div className="rd-about-meta-row">
                <span className="rd-label-micro">Degree</span>
                <strong>BS Information Systems</strong>
              </div>
              <div className="rd-about-meta-row">
                <span className="rd-label-micro">Status</span>
                <strong className="rd-text-accent">Open to Opportunities</strong>
              </div>
            </div>

            <a
              href={`mailto:${socials.email}?subject=Let's Connect`}
              className="rd-btn rd-btn--primary rd-btn--full"
            >
              <FiMail /> Get in Touch
            </a>
          </div>

          <div className="rd-about-page__card rd-about-interactive-stack">
            <h4 className="rd-eyebrow">PHOTO SNAPSHOTS</h4>
            <div className="rd-about-page__stack-container">
              <Stack
                layout="fan"
                sendToBackOnClick={true}
                cards={ABOUT_STACK_IMAGES.map((src, i) => (
                  <img key={src} src={src} alt={`About photo ${i + 1}`} />
                ))}
                visible={4}
                spread={0.5}
                depth={0.5}
                radius={16}
                frame={0}
                frameColor="#ffffff"
                shadow
                tilt={25}
                threshold={90}
                speed={1}
                autoplay={false}
                pauseOnHover={false}
                onChange={() => playClickSound()}
              />
            </div>
            <span className="rd-about__stack-hint">
              <span aria-hidden="true" /> Click, drag or fling cards
            </span>
          </div>
        </aside>
      </div>

      {/* Pillars Grid */}
      <div className="rd-about-pillars is-in">
        <div className="rd-about-pillars__head">
          <span className="rd-eyebrow">WHAT I STAND FOR</span>
          <h3 className="rd-heading-sub">Core Pillars & Working Style</h3>
        </div>
        <div className="rd-about-pillars-grid">
          <div className="rd-about-pillar-card">
            <div className="rd-about-pillar-card__index">01</div>
            <h4>Clean, Functional Code</h4>
            <p>
              I prioritize readable, self-documenting code over clever hacks. Maintainability and reliability come first in every project.
            </p>
          </div>
          <div className="rd-about-pillar-card">
            <div className="rd-about-pillar-card__index">02</div>
            <h4>Design Meets Logic</h4>
            <p>
              Bringing frontend finesse together with solid database schemas and robust backend controllers for a coherent experience.
            </p>
          </div>
          <div className="rd-about-pillar-card">
            <div className="rd-about-pillar-card__index">03</div>
            <h4>Continuous Upskilling</h4>
            <p>
              From learning Machine Learning to exploring 3D interactive web experiences, I actively seek out challenges that expand my technical boundaries.
            </p>
          </div>
          <div className="rd-about-pillar-card">
            <div className="rd-about-pillar-card__index">04</div>
            <h4>Communication & Reliability</h4>
            <p>
              Clear updates, transparent timelines, and collaborative problem-solving whether working on individual freelance or team environments.
            </p>
          </div>
        </div>
      </div>

      {/* Hobbies / Beyond the Screen */}
      <div className="rd-about-hobbies is-in">
        <div className="rd-about-pillars__head">
          <span className="rd-eyebrow">OFF THE CLOCK</span>
          <h3 className="rd-heading-sub">Beyond the Code</h3>
        </div>
        <div className="rd-about-hobbies-grid">
          <div className="rd-about-hobby-item">
            <span className="rd-about-hobby-icon">♟️</span>
            <div>
              <h4>Chess & Strategy</h4>
              <p>I enjoy playing chess to train pattern recognition, patient decision-making, and tactical thinking.</p>
            </div>
          </div>
          <div className="rd-about-hobby-item">
            <span className="rd-about-hobby-icon">🎬</span>
            <div>
              <h4>Video Editing & Storytelling</h4>
              <p>Cutting footage, timing audio, and color grading short cinematic clips and video content.</p>
            </div>
          </div>
          <div className="rd-about-hobby-item">
            <span className="rd-about-hobby-icon">🎨</span>
            <div>
              <h4>Graphic & UI Experimentation</h4>
              <p>Testing new typography pairings, 3D character renders, and minimal poster layouts.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA Banner */}
      <div className="rd-about-cta-banner is-in">
        <div className="rd-about-cta-banner__content">
          <span className="rd-eyebrow">NEXT STEPS</span>
          <h3>Let's build something remarkable together</h3>
          <p>Whether you need a web application, portfolio redesign, or technical collaboration, my inbox is always open.</p>
        </div>
        <div className="rd-about-cta-banner__actions">
          <a
            href={`mailto:${socials.email}?subject=Project Collaboration Inquiry`}
            className="rd-btn rd-btn--primary"
          >
            Start a Conversation <FiArrowRight />
          </a>
          <button type="button" className="rd-btn rd-btn--ghost" onClick={onBack}>
            <FiArrowLeft /> Return to Portfolio
          </button>
        </div>
      </div>
    </section>
  )
}

function FreelancingView({ onBack }) {
  return (
    <section className="rd-section rd-container rd-standalone-section" id="freelance">
      <div className="rd-standalone__top">
        <button type="button" className="rd-btn rd-btn--ghost rd-btn--small" onClick={onBack}>
          <FiArrowLeft /> Back to Portfolio
        </button>
        <span className="rd-eyebrow">STANDALONE VIEW / FREELANCING</span>
      </div>

      <SectionHead
        index="01"
        label="Freelance"
        title="Freelance Services & Inquiries"
        count={freelanceOfferings.length}
      >
        {freelanceIntro.subtitle}
      </SectionHead>

      <ol className="rd-services">
        {freelanceOfferings.map((s) => (
          <li key={s.id} className="rd-service is-in">
            <span className="rd-service__index">{s.index}</span>
            <span className="rd-service__icon" aria-hidden="true">
              {SERVICE_ICONS[s.id] ?? <FiCode />}
            </span>
            <div className="rd-service__body">
              <div className="rd-service__head-row">
                <h3>{s.title}</h3>
                {s.status && <span className="rd-card__status">{s.status}</span>}
              </div>
              <p>{s.description}</p>
              {s.projectTitle && (
                <p className="rd-service__ref">
                  <span>Recent:</span> {s.projectTitle}
                </p>
              )}
              {s.tags && (
                <ul className="rd-tags">
                  {s.tags.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              )}
            </div>
            <a
              className="rd-service__cta"
              href={`mailto:${socials.email}?subject=${encodeURIComponent(s.subject)}`}
              aria-label={s.actionLabel}
            >
              Inquire <FiArrowRight />
            </a>
          </li>
        ))}
      </ol>
    </section>
  )
}

function ResourcesView({ onBack }) {
  return (
    <section className="rd-section rd-container rd-standalone-section" id="resources">
      <div className="rd-standalone__top">
        <button type="button" className="rd-btn rd-btn--ghost rd-btn--small" onClick={onBack}>
          <FiArrowLeft /> Back to Portfolio
        </button>
        <span className="rd-eyebrow">STANDALONE VIEW / RESOURCES</span>
      </div>

      <SectionHead
        index="02"
        label="Resources"
        title="Developer Toolkit & Resources"
        count={resourceCategories.reduce((sum, c) => sum + c.items.length, 0)}
      >
        {resourcesIntro.subtitle}
      </SectionHead>

      <div className="rd-resources-list">
        {resourceCategories.map((category) => (
          <div key={category.id} className="rd-resources-cat is-in">
            <div className="rd-resources-cat__head">
              <span className="rd-eyebrow">{category.index} / {category.title}</span>
              <p>{category.description}</p>
            </div>
            <div className="rd-resources-grid">
              {category.items.map((item) => (
                <a
                  key={item.name}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rd-resource-card"
                >
                  <div className="rd-resource-card__top">
                    <h4>{item.name}</h4>
                    <FiArrowUpRight className="rd-resource-card__arrow" />
                  </div>
                  <p>{item.role}</p>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function ShopView({ onBack }) {
  return (
    <section className="rd-section rd-container rd-standalone-section" id="shop">
      <div className="rd-standalone__top">
        <button type="button" className="rd-btn rd-btn--ghost rd-btn--small" onClick={onBack}>
          <FiArrowLeft /> Back to Portfolio
        </button>
        <span className="rd-eyebrow">STANDALONE VIEW / SHOP</span>
      </div>

      <SectionHead
        index="03"
        label="Digital Shop"
        title="Templates & Developer Assets"
        count={SHOP_ITEMS.length}
      >
        Curated digital products, project starter kits, and developer resources.
      </SectionHead>

      <div className="rd-grid">
        {SHOP_ITEMS.map((item) => (
          <article key={item.id} className="rd-card is-in">
            <div className="rd-card__body">
              <div className="rd-card__top">
                <span className="rd-card__cat">{item.category}</span>
                <span className="rd-card__status">{item.badge}</span>
              </div>
              <h3 className="rd-card__title">{item.title}</h3>
              <p className="rd-card__desc">{item.description}</p>
              <ul className="rd-tags">
                {item.tags.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
              <div className="rd-card__links">
                <a
                  href={`mailto:${socials.email}?subject=${encodeURIComponent(`Inquiry for ${item.title}`)}`}
                >
                  Request Template <FiArrowUpRight />
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function BlogView({ onBack }) {
  return (
    <section className="rd-section rd-container rd-standalone-section" id="blog">
      <div className="rd-standalone__top">
        <button type="button" className="rd-btn rd-btn--ghost rd-btn--small" onClick={onBack}>
          <FiArrowLeft /> Back to Portfolio
        </button>
        <span className="rd-eyebrow">STANDALONE VIEW / BLOG</span>
      </div>

      <SectionHead
        index="04"
        label="Writings"
        title="Blog & Technical Notes"
        count={blogPosts.length}
      >
        Thoughts and reflections on software development, Information Systems, and UI design.
      </SectionHead>

      <div className="rd-blog-list">
        {blogPosts.map((post) => (
          <article key={post.id} className="rd-blog-card is-in">
            <div className="rd-blog-card__meta">
              <span className="rd-eyebrow">{post.date}</span>
              <span className="rd-card__status">{post.readTime}</span>
            </div>
            <h3 className="rd-blog-card__title">{post.title}</h3>
            <p className="rd-blog-card__excerpt">{post.excerpt}</p>
            <div className="rd-blog-card__body">
              {post.content.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
            <ul className="rd-tags">
              {post.tags.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  )
}

function CommunityView({ onBack }: { onBack: () => void }) {
  const [messages, setMessages] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('shander_community_messages')
      return saved ? JSON.parse(saved) : [
        {
          id: 'pinned-1',
          name: 'Shander Santillan',
          text: 'Welcome to the community board! Feel free to say hi, share feedback on my projects, or challenge me to a game of chess.',
          avatar: '/avatars/boy.svg',
          time: 'Pinned',
          isSelf: false,
          isPinned: true,
        },
      ]
    } catch {
      return []
    }
  })

  const [userName, setUserName] = useState(() => {
    try {
      return localStorage.getItem('shander_conv_hub_user') || 'Visitor'
    } catch {
      return 'Visitor'
    }
  })

  const [selectedAvatar, setSelectedAvatar] = useState(() => {
    try {
      return localStorage.getItem('shander_conv_hub_avatar') || '/avatars/boy.svg'
    } catch {
      return '/avatars/boy.svg'
    }
  })

  const [inputText, setInputText] = useState('')
  const [isSending, setIsSending] = useState(false)
  const chatScrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let channel: any = null

    const fetchMessages = async () => {
      if (supabase) {
        try {
          const { data, error } = await supabase
            .from('conversation_messages')
            .select('*')
            .order('created_at', { ascending: true })
            .limit(100)

          if (!error && Array.isArray(data) && data.length > 0) {
            const formatted = data.map((m: any) => ({
              id: m.id,
              name: m.name || 'Visitor',
              text: m.text,
              avatar: m.avatar || '/avatars/boy.svg',
              time: m.created_at
                ? new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : 'Just now',
              isSelf: m.name === userName,
            }))
            setMessages(formatted)
            return
          }
        } catch (err) {
          console.warn('Supabase fetch failed, falling back to local messages', err)
        }
      }
    }

    fetchMessages()

    if (supabase) {
      try {
        channel = supabase
          .channel('public:community_messages')
          .on(
            'postgres_changes',
            { event: 'INSERT', schema: 'public', table: 'conversation_messages' },
            (payload: any) => {
              const newMsg = {
                id: payload.new.id,
                name: payload.new.name || 'Visitor',
                text: payload.new.text,
                avatar: payload.new.avatar || '/avatars/boy.svg',
                time: new Date(payload.new.created_at || Date.now()).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                }),
                isSelf: payload.new.name === userName,
              }
              setMessages((prev) => {
                if (prev.some((m) => m.id === newMsg.id)) return prev
                return [...prev, newMsg]
              })
            }
          )
          .on(
            'postgres_changes',
            { event: 'DELETE', schema: 'public', table: 'conversation_messages' },
            (payload: any) => {
              if (payload.old?.id) {
                setMessages((prev) => prev.filter((m) => m.id !== payload.old.id))
              }
            }
          )
          .subscribe()
      } catch (err) {
        console.warn('Supabase subscribe failed', err)
      }
    }

    return () => {
      if (channel && supabase) {
        supabase.removeChannel(channel)
      }
    }
  }, [userName])

  useEffect(() => {
    try {
      localStorage.setItem('shander_community_messages', JSON.stringify(messages))
    } catch {}
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight
    }
  }, [messages])

  const handlePostMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputText.trim() || isSending) return

    playClickSound()
    setIsSending(true)

    const text = inputText.trim()
    const name = userName.trim() || 'Visitor'
    const avatar = selectedAvatar

    try {
      localStorage.setItem('shander_conv_hub_user', name)
      localStorage.setItem('shander_conv_hub_avatar', avatar)
    } catch {}

    const localId = `local-${Date.now()}`
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

    const newLocalMsg = {
      id: localId,
      name,
      text,
      avatar,
      time: timeStr,
      isSelf: true,
    }

    setMessages((prev) => [...prev, newLocalMsg])
    setInputText('')

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('conversation_messages')
          .insert([
            {
              name,
              location: 'Website visitor',
              text,
              avatar,
            },
          ])
          .select()

        if (!error && data?.[0]) {
          setMessages((prev) =>
            prev.map((m) => (m.id === localId ? { ...m, id: data[0].id } : m))
          )
        }
      } catch (err) {
        console.warn('Supabase insert failed', err)
      }
    }

    setIsSending(false)
  }

  const handleDeleteMessage = async (msgId: string | number) => {
    playClickSound()
    setMessages((prev) => prev.filter((m) => m.id !== msgId))

    if (supabase && typeof msgId === 'number') {
      try {
        await supabase.from('conversation_messages').delete().eq('id', msgId)
      } catch (err) {
        console.warn('Supabase delete failed', err)
      }
    }
  }

  return (
    <section className="rd-section rd-container rd-standalone-section" id="community">
      <div className="rd-standalone__top">
        <button type="button" className="rd-btn rd-btn--ghost rd-btn--small" onClick={onBack}>
          <FiArrowLeft /> Back to Portfolio
        </button>
        <span className="rd-eyebrow">STANDALONE VIEW / COMMUNITY</span>
      </div>

      <SectionHead
        index="05"
        label="Community"
        title="Community & Open Hubs"
        count={messages.length}
      >
        {communityIntro.description}
      </SectionHead>

      {/* Real-time Presence Ribbon */}
      <div className="rd-community-presence is-in">
        <div className="rd-community-presence__avatars">
          <div className="rd-presence-avatar-wrap">
            <img src="/avatars/boy.svg" alt="Active Dev 1" className="rd-presence-avatar" />
          </div>
          <div className="rd-presence-avatar-wrap rd-presence-avatar-wrap--overlap">
            <img src="/avatars/girl.svg" alt="Active Dev 2" className="rd-presence-avatar" />
          </div>
          <div className="rd-presence-avatar-wrap rd-presence-avatar-wrap--overlap">
            <img src="/avatars/boy-2.svg" alt="Active Dev 3" className="rd-presence-avatar" />
          </div>
          <div className="rd-presence-avatar-wrap rd-presence-avatar-wrap--overlap rd-presence-avatar--more">
            <span>+8</span>
          </div>
        </div>
        <div className="rd-community-presence__info">
          <div className="rd-community-presence__status">
            <span className="rd-pulse-dot" />
            <strong>Real-time Presence Active</strong>
          </div>
          <p>Developers, visitors & students connected across this digital workspace</p>
        </div>
      </div>

      <div className="rd-community-grid">
        {/* Left Column: Live Visitor Guestbook & Chat */}
        <div className="rd-community-chat is-in">
          <div className="rd-community-chat__header">
            <div className="rd-community-chat__title">
              <FiMessageSquare />
              <h3>Live Community Board</h3>
            </div>
            <span className="rd-card__status">{messages.length} notes</span>
          </div>

          <div className="rd-community-chat__messages" ref={chatScrollRef}>
            {messages.map((m) => (
              <div
                key={m.id}
                className={`rd-community-msg ${m.isSelf ? 'is-self' : ''} ${m.isPinned ? 'is-pinned' : ''}`}
              >
                <img src={m.avatar || '/avatars/boy.svg'} alt={m.name} className="rd-community-msg__avatar" />
                <div className="rd-community-msg__content">
                  <div className="rd-community-msg__top">
                    <span className="rd-community-msg__author">{m.name}</span>
                    {m.isPinned && <span className="rd-badge rd-badge--pinned">Pinned</span>}
                    <span className="rd-community-msg__time">{m.time}</span>
                    {m.isSelf && (
                      <button
                        type="button"
                        className="rd-community-msg__del"
                        onClick={() => handleDeleteMessage(m.id)}
                        title="Delete message"
                      >
                        <FiTrash2 />
                      </button>
                    )}
                  </div>
                  <p className="rd-community-msg__text">{m.text}</p>
                </div>
              </div>
            ))}
          </div>

          <form className="rd-community-form" onSubmit={handlePostMessage}>
            <div className="rd-community-form__profile">
              <div className="rd-community-avatars-picker">
                <span className="rd-label-micro">Avatar:</span>
                {defaultVisitorAvatars.map((av) => (
                  <button
                    key={av.id}
                    type="button"
                    className={`rd-avatar-btn ${selectedAvatar === av.src ? 'is-selected' : ''}`}
                    onClick={() => {
                      playClickSound()
                      setSelectedAvatar(av.src)
                    }}
                    title={av.label}
                  >
                    <img src={av.src} alt={av.label} />
                  </button>
                ))}
              </div>

              <div className="rd-community-form__name">
                <span className="rd-label-micro">Your Name:</span>
                <input
                  type="text"
                  maxLength={30}
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Your Name or Handle"
                  className="rd-input"
                />
              </div>
            </div>

            <div className="rd-community-form__input-wrap">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Say hello, share feedback, or leave a note..."
                className="rd-input rd-input--text"
                maxLength={300}
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isSending}
                className="rd-btn rd-btn--send"
              >
                <FiSend /> Send
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Community Circles & Guidelines */}
        <div className="rd-community-sidebar is-in">
          <div className="rd-community-hubs">
            <h3 className="rd-community-hubs__title">
              <FiUsers /> Channels & Developer Circles
            </h3>

            <div className="rd-community-hubs__list">
              {communityHubs.map((hub) => (
                <a
                  key={hub.id}
                  href={hub.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rd-community-hub-card"
                >
                  <div className="rd-community-hub-card__top">
                    <div>
                      <span className="rd-card__cat">{hub.platform}</span>
                      <h4 className="rd-community-hub-card__name">{hub.title}</h4>
                    </div>
                    <FiArrowUpRight className="rd-resource-card__arrow" />
                  </div>
                  <p>{hub.description}</p>
                  <div className="rd-community-hub-card__footer">
                    <span className="rd-card__status">{hub.badge}</span>
                    <span className="rd-hub-members">{hub.members}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>

          <div className="rd-community-guidelines">
            <h4>Community Guidelines</h4>
            <ul>
              {communityGuidelines.map((g, idx) => (
                <li key={idx}>{g}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------- page -------------------------------- */
export default function Portfolio() {
  const [theme, toggleTheme] = useTheme()
  useSmoothScroll()
  const { soundEnabled, toggleSound } = useSoundEffects()
  const [lightbox, setLightbox] = useState(null)
  const [chessOpen, setChessOpen] = useState(false)

  // Standalone section state: 'about-me' | 'freelance' | 'resources' | 'shop' | 'blog' | 'community' | `project-${id}` | null
  const [standalone, setStandalone] = useState(() => {
    const hash = window.location.hash.replace('#', '')
    if (['about-me', 'freelance', 'resources', 'shop', 'blog', 'community'].includes(hash) || hash.startsWith('project-')) {
      return hash
    }
    return null
  })

  const activeProjectId = standalone?.startsWith('project-')
    ? standalone.replace('project-', '')
    : null
  const activeProject = activeProjectId ? projects.find((p) => p.id === activeProjectId) : null
  const isOtherStandalone = Boolean(standalone && !standalone.startsWith('project-'))
  const wasDirectUrlLoad = useRef<boolean>(Boolean(standalone?.startsWith('project-')))

  const lastSelectedProjectRef = useRef<string | null>(null)

  useReveal(standalone)

  // Sync with browser back/forward buttons
  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash.replace('#', '')
      if (['about-me', 'freelance', 'resources', 'shop', 'blog', 'community'].includes(hash)) {
        setStandalone(hash)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else if (hash.startsWith('project-')) {
        setStandalone(hash)
      } else {
        setStandalone(null)
        if (wasDirectUrlLoad.current) {
          wasDirectUrlLoad.current = false
          setTimeout(() => {
            const el = document.getElementById('work')
            if (el) {
              const lenis = (window as any).__lenis
              if (lenis && typeof lenis.scrollTo === 'function') {
                lenis.scrollTo(el, { offset: -90, duration: 0.9 })
              } else {
                el.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }
            }
          }, 50)
        }
      }
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const handleNavigateStandalone = (id) => {
    setStandalone(id)
    window.history.pushState(null, '', `#${id}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSelectProject = (p: any) => {
    lastSelectedProjectRef.current = p.id
    setStandalone(`project-${p.id}`)
    window.history.pushState({ standalone: `project-${p.id}` }, '', `#project-${p.id}`)
  }

  const handleNavigateBackToProject = () => {
    const targetId = lastSelectedProjectRef.current || activeProjectId
    setStandalone(null)
    window.history.pushState(null, '', '#work')

    if (wasDirectUrlLoad.current) {
      wasDirectUrlLoad.current = false
      setTimeout(() => {
        const el = targetId ? document.getElementById(`project-item-${targetId}`) : document.getElementById('work')
        if (el) {
          const lenis = (window as any).__lenis
          if (lenis && typeof lenis.scrollTo === 'function') {
            lenis.scrollTo(el, { offset: -90, duration: 0.9 })
          } else {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
        }
      }, 50)
    } else if (targetId) {
      const el = document.getElementById(`project-item-${targetId}`)
      if (el) {
        el.classList.add('rd-project-row--highlight')
        setTimeout(() => el.classList.remove('rd-project-row--highlight'), 2000)
      }
    }
  }

  const handleNavigateMain = (id) => {
    setStandalone(null)
    window.history.pushState(null, '', `#${id}`)
    if (id === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    setTimeout(() => {
      const el = document.getElementById(id)
      if (el) {
        el.querySelectorAll('[data-reveal]').forEach((r) => r.classList.add('is-in'))
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 30)
  }

  return (
    <>
      <a href="#work" className="rd-skip">
        Skip to content
      </a>
      <Nav
        theme={theme}
        onToggleTheme={toggleTheme}
        soundEnabled={soundEnabled}
        onToggleSound={toggleSound}
        activeMain={useActiveSection(MAIN_NAV.map((n) => n.id), Boolean(standalone))}
        activeStandalone={standalone}
        onNavigateMain={handleNavigateMain}
        onNavigateStandalone={handleNavigateStandalone}
        onOpenChess={() => setChessOpen(true)}
      />
      <main>
        {standalone === 'about-me' && (
          <AboutView onBack={() => handleNavigateMain('about')} />
        )}
        {standalone === 'freelance' && (
          <FreelancingView onBack={() => handleNavigateMain('top')} />
        )}
        {standalone === 'resources' && (
          <ResourcesView onBack={() => handleNavigateMain('top')} />
        )}
        {standalone === 'shop' && (
          <ShopView onBack={() => handleNavigateMain('top')} />
        )}
        {standalone === 'blog' && (
          <BlogView onBack={() => handleNavigateMain('top')} />
        )}
        {standalone === 'community' && (
          <CommunityView onBack={() => handleNavigateMain('top')} />
        )}
        {activeProject && (
          <div
            className="rd-project-details-overlay"
            data-lenis-prevent
            role="region"
            aria-label="Project Details"
          >
            <ProjectDetailsView
              project={activeProject}
              onBack={handleNavigateBackToProject}
              onOpenLightbox={setLightbox}
            />
          </div>
        )}

        <div className={`rd-main-sections ${isOtherStandalone ? 'is-hidden-view' : ''}`}>
          <Hero theme={theme} />
          <Marquee items={allSkills} />
          <Work
            theme={theme}
            onSelectProject={handleSelectProject}
            targetProjectId={lastSelectedProjectRef.current || activeProjectId}
          />
          <About onMore={() => handleNavigateStandalone('about-me')} />
          <Skills theme={theme} />
          <Education />
          <Certifications onOpen={setLightbox} />
          <Gallery onOpen={setLightbox} />
          <Resume theme={theme} />
          <Contact />
        </div>
      </main>
      <Marquee items={['Open to work', 'Web development', 'Video editing', 'Graphic design', 'Say hello']} reverse />
      <footer className="rd-footer">
        <div className="rd-container rd-footer__inner">
          <span>© {new Date().getFullYear()} {profile.name}</span>
          <span className="rd-footer__mid">Built with React + Vite</span>
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault()
              handleNavigateMain('top')
            }}
          >
            Back to top ↑
          </a>
        </div>
      </footer>
      <Lightbox item={lightbox} onClose={() => setLightbox(null)} />
      <ChessModal open={chessOpen} onClose={() => setChessOpen(false)} />
    </>
  )
}
