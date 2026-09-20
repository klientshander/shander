import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import {
  FiArrowLeft,
  FiArrowRight,
} from 'react-icons/fi'
import StoreBadge from './StoreBadge'
import './FannedDeck.css'

// Custom SVG App Icons matching bryllim.com screenshots
function AppLogo({ icon, bg, color }) {
  if (icon === 'kabi') {
    // Bull silhouette on black squircle
    return (
      <div className="fanned-card__squircle-icon" style={{ background: '#000000', color: '#ffffff' }}>
        <svg viewBox="0 0 48 48" width="34" height="34" fill="none">
          <path
            d="M12 9 C10 15, 13 19, 16 21 C14 26, 17 32, 24 38 C31 32, 34 26, 32 21 C35 19, 38 15, 36 9 C32 14, 28 15, 26 16 C25 13, 23 13, 22 16 C20 15, 16 14, 12 9 Z"
            fill="#ffffff"
          />
          <circle cx="19" cy="22" r="1.8" fill="#000000" />
          <circle cx="29" cy="22" r="1.8" fill="#000000" />
        </svg>
      </div>
    )
  }

  if (icon === 'tarsi') {
    // Tarsier cute round eyes on sage green
    return (
      <div className="fanned-card__squircle-icon" style={{ background: '#799f7c', color: '#ffffff' }}>
        <svg viewBox="0 0 52 52" width="38" height="38">
          <circle cx="18" cy="26" r="9" fill="#ffffff" />
          <circle cx="18" cy="26" r="4.5" fill="#355238" />
          <circle cx="16" cy="24" r="1.8" fill="#ffffff" />
          <circle cx="34" cy="26" r="9" fill="#ffffff" />
          <circle cx="34" cy="26" r="4.5" fill="#355238" />
          <circle cx="32" cy="24" r="1.8" fill="#ffffff" />
        </svg>
      </div>
    )
  }

  if (icon === 'mayi') {
    // Cute white bird with round eyes on sky blue
    return (
      <div className="fanned-card__squircle-icon" style={{ background: '#54b9e4', color: '#ffffff' }}>
        <svg viewBox="0 0 52 52" width="38" height="38">
          <path
            d="M26 11 C24 9, 22 13, 24 15 C16 17, 11 24, 11 32 C11 39, 17 45, 26 45 C35 45, 41 39, 41 32 C41 24, 36 17, 28 15 C30 13, 28 9, 26 11 Z"
            fill="#ffffff"
          />
          <circle cx="20" cy="30" r="3.2" fill="#388eb5" />
          <circle cx="32" cy="30" r="3.2" fill="#388eb5" />
          <ellipse cx="26" cy="33" rx="2.5" ry="1.8" fill="#f59e0b" />
        </svg>
      </div>
    )
  }

  if (icon === 'vault') {
    return (
      <div className="fanned-card__squircle-icon" style={{ background: '#18181b', color: '#ffffff' }}>
        <svg viewBox="0 0 48 48" width="30" height="30" fill="none">
          <rect x="10" y="20" width="28" height="22" rx="5" fill="#ffffff" />
          <path d="M16 20 V14 A8 8 0 0 1 32 14 V20" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
          <circle cx="24" cy="30" r="2.8" fill="#18181b" />
          <path d="M24 33 V36" stroke="#18181b" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </div>
    )
  }

  if (icon === 'grahams') {
    return (
      <div className="fanned-card__squircle-icon" style={{ background: '#f59e0b', color: '#ffffff' }}>
        <svg viewBox="0 0 48 48" width="28" height="28" fill="#ffffff">
          <rect x="9" y="11" width="30" height="26" rx="5" fill="#ffffff" />
          <circle cx="16" cy="18" r="1.8" fill="#d97706" />
          <circle cx="24" cy="18" r="1.8" fill="#d97706" />
          <circle cx="32" cy="18" r="1.8" fill="#d97706" />
          <circle cx="16" cy="24" r="1.8" fill="#d97706" />
          <circle cx="24" cy="24" r="1.8" fill="#d97706" />
          <circle cx="32" cy="24" r="1.8" fill="#d97706" />
          <circle cx="16" cy="30" r="1.8" fill="#d97706" />
          <circle cx="24" cy="30" r="1.8" fill="#d97706" />
          <circle cx="32" cy="30" r="1.8" fill="#d97706" />
        </svg>
      </div>
    )
  }

  if (icon === 'clinic') {
    return (
      <div className="fanned-card__squircle-icon" style={{ background: '#10b981', color: '#ffffff' }}>
        <svg viewBox="0 0 48 48" width="30" height="30" fill="none" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 24 H17 L21 14 L27 34 L31 24 H40" />
        </svg>
      </div>
    )
  }

  if (icon === 'spiderman') {
    return (
      <div className="fanned-card__squircle-icon" style={{ background: '#dc2626', color: '#ffffff' }}>
        <svg viewBox="0 0 48 48" width="30" height="30" fill="#ffffff">
          <path d="M24 10 C21 10, 19 13, 19 17 C19 20, 20 23, 22 25 L16 18 L13 19 L19 28 L14 31 L15 33 L21 29 L16 38 L18 39 L23 31 L23 38 L25 38 L25 31 L30 39 L32 38 L27 29 L33 33 L34 31 L29 28 L35 19 L32 18 L26 25 C28 23, 29 20, 29 17 C29 13, 27 10, 24 10 Z" />
        </svg>
      </div>
    )
  }

  // Fallback squircle
  return (
    <div className="fanned-card__squircle-icon" style={{ background: bg || '#18181b', color: color || '#ffffff' }}>
      <svg viewBox="0 0 48 48" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <rect x="10" y="10" width="28" height="28" rx="6" />
        <path d="M18 24 H30" />
      </svg>
    </div>
  )
}

export default function FannedDeck({
  items = [],
  onOpenCover,
  onOpenDemo,
}) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const stageRef = useRef(null)

  if (!items || items.length === 0) {
    return <div className="fanned-empty">No projects found.</div>
  }

  const N = items.length

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % N)
  }

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + N) % N)
  }

  const goToIndex = (index) => {
    setCurrentIndex(index)
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!stageRef.current) return
      const rect = stageRef.current.getBoundingClientRect()
      const inView = rect.top < window.innerHeight && rect.bottom > 0
      if (!inView) return

      if (e.key === 'ArrowRight') {
        goToNext()
      } else if (e.key === 'ArrowLeft') {
        goToPrev()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [N])

  // Compute indices for 3 fanned cards: left (prev), center (active), right (next)
  const prevIndex = (currentIndex - 1 + N) % N
  const nextIndex = (currentIndex + 1) % N

  const handleDragEnd = (_, info) => {
    setIsDragging(false)
    const threshold = 40
    if (info.offset.x < -threshold) {
      goToNext()
    } else if (info.offset.x > threshold) {
      goToPrev()
    }
  }

  const renderCard = (item, position) => {
    const isCenter = position === 'center'
    const isLeft = position === 'left'
    const isRight = position === 'right'

    const rawBadge = item.featuredBadge || '❪ #1 FEATURED APP ❫'
    const badgeClean = rawBadge.replace(/[❪❫()❮❯]/g, '').trim()

    return (
      <motion.div
        key={`${item.id}-${position}`}
        className={`fanned-card fanned-card--${position} ${isCenter ? 'fanned-card--active' : ''}`}
        onClick={() => {
          if (isDragging) return
          if (isLeft) goToPrev()
          if (isRight) goToNext()
        }}
        drag={isCenter ? 'x' : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.25}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
        initial={false}
        animate={
          isCenter
            ? 'center'
            : isLeft
            ? 'left'
            : 'right'
        }
        variants={{
          left: {
            x: 'var(--fanned-left-x, -170px)',
            y: 'var(--fanned-wing-y, 28px)',
            rotate: 'var(--fanned-left-rot, -13deg)',
            scale: 0.92,
            zIndex: 2,
            opacity: 0.9,
            transition: { type: 'spring', stiffness: 260, damping: 26 },
          },
          center: {
            x: '0px',
            y: '0px',
            rotate: '0deg',
            scale: 1,
            zIndex: 10,
            opacity: 1,
            transition: { type: 'spring', stiffness: 260, damping: 26 },
          },
          right: {
            x: 'var(--fanned-right-x, 170px)',
            y: 'var(--fanned-wing-y, 28px)',
            rotate: 'var(--fanned-right-rot, 13deg)',
            scale: 0.92,
            zIndex: 2,
            opacity: 0.9,
            transition: { type: 'spring', stiffness: 260, damping: 26 },
          },
        }}
        whileHover={
          !isCenter
            ? {
                scale: 0.95,
                y: 'var(--fanned-wing-hover-y, 16px)',
                opacity: 0.98,
                transition: { duration: 0.2 },
              }
            : undefined
        }
      >
        {/* Top Badges Row */}
        <div className="fanned-card__top">
          <div className="fanned-card__badge-row">
            <span className="fanned-card__pill-dark">
              <span className="fanned-card__bracket">❪</span>
              <span className="fanned-card__pill-label">{badgeClean}</span>
              <span className="fanned-card__bracket">❫</span>
            </span>

            <span className="fanned-card__pill-outline">
              {item.appType || item.category || 'APP'}
            </span>
          </div>

          {item.subBadge && (
            <div className="fanned-card__sub-badge">
              {item.subBadge}
            </div>
          )}
        </div>

        {/* App Title & Squircle Icon Row */}
        <div className="fanned-card__app-row">
          <AppLogo
            icon={item.icon}
            bg={item.appIcon?.bg}
            color={item.appIcon?.color}
          />

          <div className="fanned-card__title-col">
            <h3 className="fanned-card__title">
              {item.appTitle || item.title}
            </h3>
          </div>
        </div>

        {/* Description (2 lines of clean text) */}
        <p className="fanned-card__description">
          {item.description}
        </p>

        {/* Dual Store Action Badges (App Store & Google Play side-by-side) */}
        <div className="fanned-card__actions">
          <StoreBadge
            type="appstore"
            href={item.liveUrl && item.liveUrl !== '#' ? item.liveUrl : undefined}
            onClick={!item.liveUrl || item.liveUrl === '#' ? () => onOpenDemo?.(item) : undefined}
            subText="Download on the"
            titleText="App Store"
          />

          <StoreBadge
            type="googleplay"
            href={item.codeUrl && item.codeUrl !== '#' ? item.codeUrl : undefined}
            onClick={!item.codeUrl || item.codeUrl === '#' ? () => onOpenDemo?.(item) : undefined}
            subText="GET IT ON"
            titleText="Google Play"
          />
        </div>
      </motion.div>
    )
  }

  return (
    <div className="fanned-deck-wrapper" ref={stageRef}>
      {/* 3D Fanned Stage */}
      <div className="fanned-deck-stage">
        {/* Left Card (previous) */}
        {renderCard(items[prevIndex], 'left')}

        {/* Center Card (active) */}
        {renderCard(items[currentIndex], 'center')}

        {/* Right Card (next) */}
        {renderCard(items[nextIndex], 'right')}
      </div>

      {/* Subtle Navigation Controls */}
      <div className="fanned-deck-nav">
        <button
          type="button"
          className="fanned-deck-nav-btn"
          onClick={goToPrev}
          aria-label="Previous project"
          title="Previous project"
        >
          <FiArrowLeft aria-hidden="true" />
        </button>

        <div className="fanned-deck-dots" role="tablist" aria-label="Projects">
          {items.map((it, idx) => (
            <button
              type="button"
              key={it.id || idx}
              role="tab"
              aria-selected={idx === currentIndex}
              className={`fanned-deck-dot ${idx === currentIndex ? 'is-active' : ''}`}
              onClick={() => goToIndex(idx)}
              aria-label={`Project ${idx + 1}: ${it.title}`}
            />
          ))}
        </div>

        <button
          type="button"
          className="fanned-deck-nav-btn"
          onClick={goToNext}
          aria-label="Next project"
          title="Next project"
        >
          <FiArrowRight aria-hidden="true" />
        </button>

        <span className="fanned-deck-counter">
          <strong>{String(currentIndex + 1).padStart(2, '0')}</strong> / {String(N).padStart(2, '0')}
        </span>
      </div>
    </div>
  )
}
