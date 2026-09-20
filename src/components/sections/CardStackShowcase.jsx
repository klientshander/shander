import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion'
import {
  FiExternalLink,
  FiGithub,
  FiPlay,
  FiVolume2,
  FiVolumeX,
  FiMaximize2,
  FiChevronLeft,
  FiChevronRight,
  FiRefreshCw,
} from 'react-icons/fi'
import './CardStackShowcase.css'

// Offsets and rotations for underlying cards in the stack
const STACK_CONFIG = [
  { scale: 1, y: 0, rotate: 0, zIndex: 10, opacity: 1 },
  { scale: 0.95, y: 14, rotate: 2.5, zIndex: 9, opacity: 0.92 },
  { scale: 0.90, y: 28, rotate: -2.5, zIndex: 8, opacity: 0.78 },
  { scale: 0.85, y: 42, rotate: 1.5, zIndex: 7, opacity: 0.55 },
]

function StackCard({
  item,
  index,
  total,
  stackPosition, // 0 = top active, 1 = 2nd, 2 = 3rd, 3 = 4th
  isTop,
  onSwipe,
  onOpenCover,
  onOpenDemo,
  isMuted,
  onVolumeToggle,
}) {
  const videoRef = useRef(null)
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-250, 250], [-18, 18])
  const opacity = useTransform(x, [-280, -160, 0, 160, 280], [0, 0.85, 1, 0.85, 0])

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted
    }
  }, [isMuted, isTop])

  const config = STACK_CONFIG[Math.min(stackPosition, STACK_CONFIG.length - 1)]

  const isVideo =
    (item.cover &&
      (item.cover.endsWith('.mp4') ||
        item.cover.endsWith('.webm') ||
        item.cover.includes('/video/'))) ||
    (!item.cover && item.videoUrl)

  const mediaSrc = isVideo
    ? (item.cover?.includes('.mp4') ||
       item.cover?.includes('.webm') ||
       item.cover?.includes('/video/')
        ? item.cover
        : item.videoUrl)
    : item.cover

  const handleDragEnd = (_, info) => {
    const threshold = 85
    const velocityThreshold = 350
    if (info.offset.x > threshold || info.velocity.x > velocityThreshold) {
      onSwipe('right')
    } else if (info.offset.x < -threshold || info.velocity.x < -velocityThreshold) {
      onSwipe('left')
    }
  }

  return (
    <motion.div
      className={`stack-card ${isTop ? 'stack-card--top' : 'stack-card--under'}`}
      style={{
        zIndex: config.zIndex,
        ...(isTop ? { x, rotate, opacity } : {}),
      }}
      animate={{
        scale: config.scale,
        y: config.y,
        rotate: isTop ? 0 : config.rotate,
        opacity: config.opacity,
        transition: { type: 'spring', stiffness: 320, damping: 28 },
      }}
      drag={isTop ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.65}
      onDragEnd={isTop ? handleDragEnd : undefined}
    >
      {/* Media Viewport */}
      <div
        className="stack-card__media-box"
        onClick={() => {
          if (!isTop) return
          if (isVideo) {
            onOpenDemo?.(item)
          } else if (mediaSrc) {
            onOpenCover?.(item)
          }
        }}
      >
        {isVideo && mediaSrc ? (
          <div className="stack-card__video-wrap">
            <video
              ref={videoRef}
              src={mediaSrc}
              autoPlay
              muted={isMuted}
              loop
              playsInline
              className="stack-card__media"
            />
            {isTop && (
              <button
                type="button"
                className="stack-card__vol-btn"
                onClick={onVolumeToggle}
                aria-label={isMuted ? 'Unmute video audio' : 'Mute video audio'}
                title={isMuted ? 'Unmute audio' : 'Mute audio'}
              >
                {isMuted ? <FiVolumeX aria-hidden="true" /> : <FiVolume2 aria-hidden="true" />}
              </button>
            )}
          </div>
        ) : mediaSrc ? (
          <div className="stack-card__img-wrap">
            <img src={mediaSrc} alt={item.title} className="stack-card__media" loading="lazy" />
            {isTop && (
              <div className="stack-card__zoom-overlay" aria-hidden="true">
                <span className="stack-card__zoom-pill">
                  <FiMaximize2 /> Zoom
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="stack-card__fallback">Preview</div>
        )}

        <span className="stack-card__index-tag">
          {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </span>
      </div>

      {/* Card Content (Normal, Thin Typography) */}
      <div className="stack-card__body">
        <div className="stack-card__meta">
          <span className="stack-card__cat-pill">{item.category}</span>
          {item.tags?.[0] && <span className="stack-card__sub-pill">{item.tags[0]}</span>}
        </div>

        <h3 className="stack-card__title">{item.title}</h3>

        <p className="stack-card__desc">{item.description}</p>

        {/* Tech Chips */}
        {item.tags?.length > 0 && (
          <div className="stack-card__tags">
            {item.tags.map((tag) => (
              <span key={tag} className="stack-card__chip">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="stack-card__actions">
          {item.liveUrl && item.liveUrl !== '#' && (
            <a
              href={item.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="stack-btn stack-btn--primary"
            >
              <FiExternalLink aria-hidden="true" /> Live Demo ↗
            </a>
          )}
          {item.codeUrl && item.codeUrl !== '#' && (
            <a
              href={item.codeUrl}
              target="_blank"
              rel="noreferrer"
              className="stack-btn"
            >
              <FiGithub aria-hidden="true" /> GitHub ↗
            </a>
          )}
          {item.videoUrl && (
            <button
              type="button"
              onClick={() => onOpenDemo?.(item)}
              className="stack-btn stack-btn--demo"
            >
              <FiPlay aria-hidden="true" /> Video ↗
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default function CardStackShowcase({
  items = [],
  onOpenCover,
  onOpenDemo,
}) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isMuted, setIsMuted] = useState(true)

  const N = items.length

  const nextCard = () => {
    setCurrentIndex((prev) => (prev + 1) % N)
  }

  const prevCard = () => {
    setCurrentIndex((prev) => (prev - 1 + N) % N)
  }

  const handleVolumeToggle = (e) => {
    e.stopPropagation()
    setIsMuted((prev) => !prev)
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        nextCard()
      } else if (e.key === 'ArrowLeft') {
        prevCard()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [N])

  if (!items || items.length === 0) {
    return <div className="stack-empty">No projects found.</div>
  }

  // Render 4 visible cards: top card + 3 cards beneath
  const visibleCardIndices = [0, 1, 2, 3].map((offset) => (currentIndex + offset) % N)

  return (
    <div className="stack-showcase-wrapper">
      {/* 3D Stack Stage */}
      <div className="stack-stage">
        <AnimatePresence initial={false}>
          {visibleCardIndices
            .slice()
            .reverse()
            .map((itemIdx) => {
              const item = items[itemIdx]
              const stackPos = (itemIdx - currentIndex + N) % N
              const isTop = stackPos === 0

              return (
                <StackCard
                  key={item.id || itemIdx}
                  item={item}
                  index={itemIdx}
                  total={N}
                  stackPosition={stackPos}
                  isTop={isTop}
                  onSwipe={() => nextCard()}
                  onOpenCover={onOpenCover}
                  onOpenDemo={onOpenDemo}
                  isMuted={isMuted}
                  onVolumeToggle={handleVolumeToggle}
                />
              )
            })}
        </AnimatePresence>
      </div>

      {/* Stack Controls Bar */}
      <div className="stack-controls">
        <button
          type="button"
          className="stack-control-btn"
          onClick={prevCard}
          aria-label="Previous project"
          title="Previous project"
        >
          <FiChevronLeft aria-hidden="true" /> Prev
        </button>

        <button
          type="button"
          className="stack-control-btn stack-control-btn--shuffle"
          onClick={nextCard}
          aria-label="Shuffle / Next card"
          title="Shuffle to next project"
        >
          <FiRefreshCw aria-hidden="true" /> Shuffle Deck
        </button>

        <button
          type="button"
          className="stack-control-btn"
          onClick={nextCard}
          aria-label="Next project"
          title="Next project"
        >
          Next <FiChevronRight aria-hidden="true" />
        </button>
      </div>

      {/* Swipe Hint & Dots */}
      <div className="stack-footer-row">
        <span className="stack-swipe-hint">💡 Tip: Drag or swipe the card horizontally to shuffle</span>

        <div className="stack-dots" role="tablist" aria-label="Projects">
          {items.map((it, idx) => (
            <button
              type="button"
              key={it.id || idx}
              role="tab"
              aria-selected={idx === currentIndex}
              className={`stack-dot ${idx === currentIndex ? 'is-active' : ''}`}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Jump to ${it.title}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

