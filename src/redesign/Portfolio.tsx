import { useEffect, useRef, useState } from 'react'
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
import BackgroundMesh from '../components/ui/BackgroundMesh'
import SidebarChess from '../components/chess/SidebarChess'
import PaperCrumple from '../components/ui/PaperCrumple'
import BounceCards from '../components/ui/BounceCards'
import { useSoundEffects } from '../hooks/useSoundEffects'
import { playClickSound } from '../utils/sound'
import './portfolio.css'

/* ---------------------------------------------------------------------------
   Content that is specific to the redesign. Everything else is pulled from
   src/data/*, so editing those files still updates the site.
--------------------------------------------------------------------------- */
const BIO =
  "I'm a dedicated 2nd-year BS Information Systems student who loves building things for the web. I enjoy turning rough ideas into functional, user-friendly projects while learning new technologies and improving my skills along the way."

// Static thumbnails for projects whose `cover` is a video (lighter to load).
const THUMB_OVERRIDES = {
  'proj-1': '/gallery/background/personalhub.png',
  'proj-3': '/gallery/background/Grahams.png',
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
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('rd-theme')
      if (saved) return saved
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

  const toggleTheme = (e) => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark'
    playClickSound(0.22)

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (typeof document === 'undefined' || !document.startViewTransition || prefersReducedMotion) {
      document.documentElement.classList.add('theme-transitioning')
      setTimeout(() => {
        document.documentElement.classList.remove('theme-transitioning')
      }, 450)
      setTheme(nextTheme)
      return
    }

    let x = window.innerWidth / 2
    let y = window.innerHeight / 2

    if (e) {
      if (typeof e.clientX === 'number' && typeof e.clientY === 'number' && (e.clientX !== 0 || e.clientY !== 0)) {
        x = e.clientX
        y = e.clientY
      } else if (e.currentTarget && typeof e.currentTarget.getBoundingClientRect === 'function') {
        const rect = e.currentTarget.getBoundingClientRect()
        x = rect.left + rect.width / 2
        y = rect.top + rect.height / 2
      }
    }

    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    )

    const transition = document.startViewTransition(() => {
      setTheme(nextTheme)
      document.documentElement.setAttribute('data-theme', nextTheme)
      try {
        localStorage.setItem('rd-theme', nextTheme)
      } catch {}
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
              easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
              pseudoElement: '::view-transition-new(root)',
            }
          )
        } catch {}
      })
      .catch(() => {})
  }

  return [theme, toggleTheme]
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
  return (
    <div className="rd-modal" role="dialog" aria-modal="true" aria-label={item.caption} onClick={onClose}>
      <figure onClick={(e) => e.stopPropagation()}>
        <button type="button" className="rd-icon-btn rd-modal__close" onClick={onClose} aria-label="Close">
          <FiX />
        </button>
        <img src={item.src} alt={item.caption} />
        <figcaption>{item.caption}</figcaption>
      </figure>
    </div>
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
  return (
    <div
      className="rd-modal"
      role="dialog"
      aria-modal="true"
      aria-label="Play Chess with Shander"
      onClick={onClose}
    >
      <div className="rd-chess-modal" onClick={(e) => e.stopPropagation()}>
        <div className="rd-chess-modal__top">
          <div>
            <span className="rd-eyebrow">CHESS // AI BOT</span>
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
    </div>
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
            className={`rd-theme-toggle ${theme === 'dark' ? 'is-dark' : 'is-light'}`}
            onClick={onToggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            title={`Switch to ${theme === 'dark' ? 'White' : 'Black'} mode`}
          >
            <span className="rd-theme-toggle__icon" aria-hidden="true">
              {theme === 'dark' ? <FiSun /> : <FiMoon />}
            </span>
            <span className="rd-theme-toggle__label">
              {theme === 'dark' ? 'Dark' : 'Light'}
            </span>
          </button>
          <button
            type="button"
            className="rd-btn rd-btn--small rd-nav__chess-btn"
            onClick={() => {
              setOpen(false)
              onOpenChess()
            }}
            aria-label="Play chess"
          >
            Play chess?
          </button>
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
function Hero() {
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
            <a href="#work" className="rd-btn">
              View my work <FiArrowUpRight />
            </a>
            <a href={profile.resumeUrl} className="rd-btn rd-btn--ghost" download>
              <FiDownload /> Download résumé
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
            <PaperCrumple
              src={profile.avatar}
              alt={`Portrait of ${profile.name}`}
              width={340}
              height={425}
              sceneHeight="100%"
              releaseBehavior="restore"
              crumpleAmount={0.85}
              crumpleDuration={0.55}
              releaseDuration={0.4}
              foldCount={6}
              foldSharpness={0.6}
              wrinkleDepth={0.65}
              creaseStrength={0.18}
              paperColor="#f4f0e8"
              paperTexture={0.08}
              draggable
              returnToOrigin
              imageFit="cover"
              fitPadding={0}
              roughness={0.92}
              lightIntensity={1.8}
              lightAngle={-35}
              shadow
              shadowOpacity={0.16}
              dragRotation={10}
              dragRadius={180}
              rotation={0}
              seed={7}
              detail={64}
              disabled={false}
            />
          </div>
          <figcaption>
            <span>
              <FiMapPin /> {profile.location.split(',')[0]}
            </span>
            <span>Hold to crumple</span>
          </figcaption>
        </figure>
      </div>
    </section>
  )
}

function ProjectMedia({ project }) {
  const videoRef = useRef(null)
  const thumb = THUMB_OVERRIDES[project.id] || (!isVideo(project.cover) && project.cover)
  const video = !thumb && (isVideo(project.cover) ? project.cover : project.videoUrl)

  if (thumb) return <img src={thumb} alt="" loading="lazy" />
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

function Work() {
  const categories = ['All', ...new Set(projects.map((p) => p.category))]
  const [filter, setFilter] = useState('All')
  const [showAll, setShowAll] = useState(false)
  const shown = filter === 'All' ? projects : projects.filter((p) => p.category === filter)
  const displayed = showAll ? shown : shown.slice(0, 2)

  const handleFilterChange = (c) => {
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

      <div className="rd-grid">
        {displayed.map((p, i) => {
          const href = isRealLink(p.liveUrl) ? p.liveUrl : isRealLink(p.codeUrl) ? p.codeUrl : null
          return (
            <article className="rd-card is-in" key={p.id}>
              <div className="rd-card__media">
                <ProjectMedia project={p} />
                <span className="rd-card__num">{String(i + 1).padStart(2, '0')}</span>
                {href && (
                  <a
                    className="rd-card__overlay"
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    tabIndex={-1}
                    aria-hidden="true"
                  >
                    <span>
                      Open project <FiArrowUpRight />
                    </span>
                  </a>
                )}
              </div>
              <div className="rd-card__body">
                <div className="rd-card__top">
                  <span className="rd-card__cat">{p.category}</span>
                  {p.progress < 100 && <span className="rd-card__status">In progress</span>}
                </div>
                <h3 className="rd-card__title">
                  {href ? (
                    <a href={href} target="_blank" rel="noopener noreferrer">
                      {p.title} <FiArrowUpRight />
                    </a>
                  ) : (
                    p.title
                  )}
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
                  {isRealLink(p.codeUrl) && (
                    <a href={p.codeUrl} target="_blank" rel="noopener noreferrer">
                      Source <FiGithub />
                    </a>
                  )}
                </div>
              </div>
            </article>
          )
        })}
      </div>

      {shown.length > 2 && (
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

function About() {
  const facts = [
    { k: 'Based in', v: profile.location },
    { k: 'Studying', v: 'BS Information Systems, 2nd year' },
    { k: 'Building', v: profile.currentlyBuilding?.[0]?.replace(/^Currently building:\s*/i, '') },
    { k: 'Learning', v: profile.currentlyBuilding?.[1]?.replace(/^Learning:\s*/i, '') },
    { k: 'Editor', v: profile.currentlyBuilding?.[3]?.replace(/^Tool:\s*/i, '') },
  ].filter((f) => f.v)

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
        </div>
        <dl className="rd-facts" data-reveal>
          {facts.map((f) => (
            <div key={f.k}>
              <dt>{f.k}</dt>
              <dd>{f.v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

function Skills() {
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

function Resume() {
  return (
    <section className="rd-section rd-container" id="resume">
      <div className="rd-resume" data-reveal>
        <div className="rd-resume__dots" aria-hidden="true" />
        <div>
          <span className="rd-eyebrow">07 / Résumé</span>
          <h2 className="rd-h2">Want the full picture?</h2>
          <p>Download my résumé for details on my projects, skills and education.</p>
        </div>
        <a href={profile.resumeUrl} className="rd-btn" download>
          <FiDownload /> Download résumé
        </a>
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

/* ---------------------- Standalone View Components ----------------------- */
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
  const { soundEnabled, toggleSound } = useSoundEffects()
  const [lightbox, setLightbox] = useState(null)
  const [chessOpen, setChessOpen] = useState(false)

  // Standalone section state: 'freelance' | 'resources' | 'shop' | 'blog' | 'community' | null
  const [standalone, setStandalone] = useState(() => {
    const hash = window.location.hash.replace('#', '')
    return ['freelance', 'resources', 'shop', 'blog', 'community'].includes(hash) ? hash : null
  })

  useReveal(standalone)

  // Sync with browser back/forward buttons
  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash.replace('#', '')
      if (['freelance', 'resources', 'shop', 'blog', 'community'].includes(hash)) {
        setStandalone(hash)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        setStandalone(null)
        if (hash) {
          setTimeout(() => {
            const el = document.getElementById(hash)
            if (el) {
              el.querySelectorAll('[data-reveal]').forEach((r) => r.classList.add('is-in'))
              el.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }
          }, 30)
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
      <BackgroundMesh theme={theme} />
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

        <div className={`rd-main-sections ${standalone ? 'is-hidden-view' : ''}`}>
          <Hero />
          <Marquee items={allSkills} />
          <Work />
          <About />
          <Skills />
          <Education />
          <Certifications onOpen={setLightbox} />
          <Gallery onOpen={setLightbox} />
          <Resume />
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
