import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiExternalLink,
  FiGithub,
  FiPlay,
  FiVolume2,
  FiVolumeX,
  FiMaximize2,
  FiChevronLeft,
  FiChevronRight,
} from 'react-icons/fi'
import './StudioShowcase.css'

export default function StudioShowcase({
  items = [],
  onOpenCover,
  onOpenDemo,
}) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isMuted, setIsMuted] = useState(true)
  const [slideDirection, setSlideDirection] = useState(1)
  const videoRef = useRef(null)
  const dockRef = useRef(null)

  const activeItem = items[activeIndex] || items[0]
  const N = items.length

  // Synchronize muted state
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted
    }
  }, [isMuted, activeIndex])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') {
        goToNext()
      } else if (e.key === 'ArrowLeft') {
        goToPrev()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeIndex, N])

  const goToNext = () => {
    setSlideDirection(1)
    setActiveIndex((prev) => (prev + 1) % N)
  }

  const goToPrev = () => {
    setSlideDirection(-1)
    setActiveIndex((prev) => (prev - 1 + N) % N)
  }

  const selectIndex = (idx) => {
    if (idx === activeIndex) return
    setSlideDirection(idx > activeIndex ? 1 : -1)
    setActiveIndex(idx)
  }

  const handleVolumeToggle = (e) => {
    e.stopPropagation()
    setIsMuted((prev) => {
      const next = !prev
      if (videoRef.current) {
        videoRef.current.muted = next
        if (!next && videoRef.current.paused) {
          videoRef.current.play().catch(() => {})
        }
      }
      return next
    })
  }

  if (!items || items.length === 0) {
    return <div className="studio-empty">No projects available.</div>
  }

  const isVideo =
    (activeItem.cover &&
      (activeItem.cover.endsWith('.mp4') ||
        activeItem.cover.endsWith('.webm') ||
        activeItem.cover.includes('/video/'))) ||
    (!activeItem.cover && activeItem.videoUrl)

  const mediaSrc = isVideo
    ? (activeItem.cover?.includes('.mp4') ||
       activeItem.cover?.includes('.webm') ||
       activeItem.cover?.includes('/video/')
        ? activeItem.cover
        : activeItem.videoUrl)
    : activeItem.cover

  // Extract display domain / url
  const displayUrl =
    activeItem.liveUrl && activeItem.liveUrl !== '#'
      ? activeItem.liveUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')
      : `shander.dev / projects / ${activeItem.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}`

  return (
    <div className="studio-showcase">
      {/* Hero Canvas Stage */}
      <div className="studio-stage">
        <AnimatePresence mode="wait" custom={slideDirection}>
          <motion.div
            key={activeItem.id || activeIndex}
            custom={slideDirection}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="studio-canvas-layout"
          >
            {/* Visual Media Window Mockup */}
            <div className="studio-window">
              {/* Window Header Bar */}
              <div className="studio-window__header">
                <div className="studio-window__dots" aria-hidden="true">
                  <span className="studio-window__dot studio-window__dot--red" />
                  <span className="studio-window__dot studio-window__dot--yellow" />
                  <span className="studio-window__dot studio-window__dot--green" />
                </div>
                <div className="studio-window__address">
                  <span className="studio-window__url">{displayUrl}</span>
                </div>
                <div className="studio-window__actions">
                  {mediaSrc && (
                    <button
                      type="button"
                      className="studio-window__action-btn"
                      onClick={() => {
                        if (isVideo) {
                          onOpenDemo?.(activeItem)
                        } else {
                          onOpenCover?.(activeItem)
                        }
                      }}
                      title="Expand to Fullscreen"
                      aria-label="Expand image to fullscreen"
                    >
                      <FiMaximize2 />
                    </button>
                  )}
                </div>
              </div>

              {/* Window Visual Body */}
              <div
                className="studio-window__body"
                onClick={() => {
                  if (isVideo) {
                    onOpenDemo?.(activeItem)
                  } else if (mediaSrc) {
                    onOpenCover?.(activeItem)
                  }
                }}
              >
                {isVideo && mediaSrc ? (
                  <div className="studio-window__video-wrap">
                    <video
                      ref={videoRef}
                      src={mediaSrc}
                      autoPlay
                      muted={isMuted}
                      loop
                      playsInline
                      className="studio-window__media"
                    />
                    <button
                      type="button"
                      className="studio-volume-btn"
                      onClick={handleVolumeToggle}
                      aria-label={isMuted ? 'Unmute video audio' : 'Mute video audio'}
                      title={isMuted ? 'Unmute audio' : 'Mute audio'}
                    >
                      {isMuted ? <FiVolumeX aria-hidden="true" /> : <FiVolume2 aria-hidden="true" />}
                    </button>
                  </div>
                ) : mediaSrc ? (
                  <div className="studio-window__img-wrap">
                    <img
                      src={mediaSrc}
                      alt={activeItem.title}
                      className="studio-window__media"
                      loading="lazy"
                    />
                    <div className="studio-window__overlay" aria-hidden="true">
                      <span className="studio-window__zoom-badge">
                        <FiMaximize2 /> View Image
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="studio-window__placeholder">
                    <span>Visual asset loading...</span>
                  </div>
                )}
              </div>
            </div>

            {/* Accompanying Studio Information Pane */}
            <div className="studio-info">
              <div className="studio-info__top">
                <div className="studio-info__index-wrap">
                  <span className="studio-info__index">
                    {String(activeIndex + 1).padStart(2, '0')}
                  </span>
                  <span className="studio-info__index-total">
                    / {String(N).padStart(2, '0')}
                  </span>
                </div>

                <div className="studio-info__badge-group">
                  <span className="studio-badge studio-badge--category">
                    {activeItem.category || 'System'}
                  </span>
                  {activeItem.tags?.[0] && (
                    <span className="studio-badge studio-badge--tag">
                      {activeItem.tags[0]}
                    </span>
                  )}
                </div>
              </div>

              <h2 className="studio-info__title">{activeItem.title}</h2>

              <p className="studio-info__desc">{activeItem.description}</p>

              {/* Tech Stack Pills */}
              {activeItem.tags?.length > 0 && (
                <div className="studio-info__tags">
                  {activeItem.tags.map((tag) => (
                    <span key={tag} className="studio-tag-chip">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Key Metrics */}
              {activeItem.metrics?.length > 0 && (
                <div className="studio-info__metrics">
                  {activeItem.metrics.map((m) => (
                    <div key={m.label} className="studio-metric">
                      <span className="studio-metric__val">{m.value}</span>
                      <span className="studio-metric__label">{m.label}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Sleek Action Buttons */}
              <div className="studio-info__actions">
                {activeItem.liveUrl && activeItem.liveUrl !== '#' && (
                  <a
                    href={activeItem.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="studio-btn studio-btn--primary"
                  >
                    <FiExternalLink aria-hidden="true" /> Live Demo ↗
                  </a>
                )}

                {activeItem.codeUrl && activeItem.codeUrl !== '#' && (
                  <a
                    href={activeItem.codeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="studio-btn"
                  >
                    <FiGithub aria-hidden="true" /> GitHub Repo ↗
                  </a>
                )}

                {activeItem.videoUrl && (
                  <button
                    type="button"
                    onClick={() => onOpenDemo?.(activeItem)}
                    className="studio-btn studio-btn--demo"
                  >
                    <FiPlay aria-hidden="true" /> Video Tour ↗
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Visual Filmstrip Dock (Thumbnails with Images) */}
      <div className="studio-dock-section">
        <div className="studio-dock-header">
          <span className="studio-dock-title">BROWSE ALL PROJECTS</span>
          <div className="studio-dock-arrows">
            <button
              type="button"
              className="studio-dock-arrow-btn"
              onClick={goToPrev}
              aria-label="Previous project"
              title="Previous project"
            >
              <FiChevronLeft aria-hidden="true" />
            </button>
            <button
              type="button"
              className="studio-dock-arrow-btn"
              onClick={goToNext}
              aria-label="Next project"
              title="Next project"
            >
              <FiChevronRight aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="studio-dock-container" ref={dockRef}>
          <div className="studio-dock-track">
            {items.map((item, idx) => {
              const isActive = idx === activeIndex
              const itemIsVideo =
                (item.cover &&
                  (item.cover.endsWith('.mp4') ||
                    item.cover.endsWith('.webm') ||
                    item.cover.includes('/video/'))) ||
                (!item.cover && item.videoUrl)
              const itemSrc = itemIsVideo
                ? (item.cover?.includes('.mp4') ||
                   item.cover?.includes('.webm') ||
                   item.cover?.includes('/video/')
                    ? item.cover
                    : item.videoUrl)
                : item.cover

              return (
                <button
                  type="button"
                  key={item.id || idx}
                  className={`studio-dock-card ${isActive ? 'is-active' : ''}`}
                  onClick={() => selectIndex(idx)}
                  aria-selected={isActive}
                >
                  <div className="studio-dock-card__thumb">
                    {itemIsVideo && itemSrc ? (
                      <video src={itemSrc} muted playsInline className="studio-dock-card__media" />
                    ) : itemSrc ? (
                      <img src={itemSrc} alt={item.title} className="studio-dock-card__media" loading="lazy" />
                    ) : (
                      <div className="studio-dock-card__fallback" />
                    )}
                    <div className="studio-dock-card__tint" />
                    <span className="studio-dock-card__num">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <div className="studio-dock-card__info">
                    <span className="studio-dock-card__title">{item.title}</span>
                    <span className="studio-dock-card__cat">{item.category}</span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

