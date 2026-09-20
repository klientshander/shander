import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  FiGithub,
  FiPlay,
  FiVolume2,
  FiVolumeX,
  FiMaximize2,
  FiChevronLeft,
  FiChevronRight,
} from 'react-icons/fi'
import {
  playCardSlideSound,
  playClickSound,
  playCardInspectSound,
} from '../../utils/sound'
import './TiltedDeckShowcase.css'

export default function TiltedDeckShowcase({
  items = [],
  onOpenCover,
  onOpenDemo,
}) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isMuted, setIsMuted] = useState(true)
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 680
    }
    return false
  })
  const videoRef = useRef(null)
  const stageRef = useRef(null)

  const N = items.length

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 680)
    }
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const goToNext = () => {
    playCardSlideSound()
    setCurrentIndex((prev) => (prev + 1) % N)
  }

  const goToPrev = () => {
    playCardSlideSound()
    setCurrentIndex((prev) => (prev - 1 + N) % N)
  }

  const goToIndex = (idx) => {
    if (idx !== currentIndex) {
      playCardSlideSound()
      setCurrentIndex(idx)
    }
  }

  const handleVolumeToggle = (e) => {
    e?.stopPropagation()
    playClickSound()
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

  // Keyboard navigation matching [ A / D ] Slide & [ M ] sound
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target && ['input', 'textarea'].includes(e.target.tagName?.toLowerCase())) return
      
      if (e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight') {
        goToNext()
      } else if (e.key === 'a' || e.key === 'A' || e.key === 'ArrowLeft') {
        goToPrev()
      } else if (e.key === 'm' || e.key === 'M') {
        handleVolumeToggle()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [N])

  // Sync video audio muted
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted
    }
  }, [isMuted, currentIndex])

  if (!items || items.length === 0) {
    return <div className="tilted-deck-empty">No projects available.</div>
  }

  return (
    <div className="tilted-deck-wrapper" ref={stageRef}>
      {/* 3D Tilted Cards Stage */}
      <div className="tilted-deck-stage">
        {items.map((item, idx) => {
          let diff = (idx - currentIndex) % N
          if (diff > Math.floor(N / 2)) diff -= N
          if (diff < -Math.floor(N / 2)) diff += N

          const isFront = diff === 0
          const isRight = diff === 1
          const isLeft = diff === -1

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

          // Smooth 3D animation coordinates based on relative slot
          let animTarget
          let zIndexVal = 1
          if (isFront) {
            zIndexVal = 10
            animTarget = {
              x: isMobile ? 0 : -40,
              y: 0,
              rotate: isMobile ? -3 : -8,
              scale: 1,
              opacity: 1,
              pointerEvents: 'auto',
              visibility: 'visible',
            }
          } else if (isRight) {
            zIndexVal = 5
            animTarget = {
              x: isMobile ? 45 : 75,
              y: isMobile ? 16 : 22,
              rotate: isMobile ? 4 : 6,
              scale: isMobile ? 0.94 : 0.95,
              opacity: isMobile ? 0.75 : 0.88,
              pointerEvents: 'auto',
              visibility: 'visible',
            }
          } else if (isLeft) {
            zIndexVal = 3
            animTarget = {
              x: isMobile ? -45 : -160,
              y: isMobile ? 20 : 30,
              rotate: isMobile ? -6 : -14,
              scale: isMobile ? 0.9 : 0.9,
              opacity: isMobile ? 0.5 : 0.45,
              pointerEvents: 'auto',
              visibility: 'visible',
            }
          } else if (diff === 2) {
            zIndexVal = 1
            animTarget = {
              x: isMobile ? 110 : 190,
              y: isMobile ? 30 : 45,
              rotate: isMobile ? 8 : 14,
              scale: 0.85,
              opacity: 0,
              pointerEvents: 'none',
              visibility: 'visible',
            }
          } else if (diff === -2) {
            zIndexVal = 1
            animTarget = {
              x: isMobile ? -110 : -270,
              y: isMobile ? 35 : 50,
              rotate: isMobile ? -12 : -22,
              scale: 0.8,
              opacity: 0,
              pointerEvents: 'none',
              visibility: 'visible',
            }
          } else {
            zIndexVal = 0
            animTarget = {
              x: diff > 0 ? (isMobile ? 180 : 250) : (isMobile ? -180 : -350),
              y: 60,
              rotate: diff > 0 ? 16 : -24,
              scale: 0.75,
              opacity: 0,
              pointerEvents: 'none',
              visibility: 'hidden',
            }
          }

          return (
            <motion.div
              key={item.id || idx}
              className={`tilted-card ${isFront ? 'tilted-card--front' : isRight ? 'tilted-card--back' : isLeft ? 'tilted-card--left' : ''}`}
              style={{ zIndex: zIndexVal }}
              initial={false}
              animate={animTarget}
              transition={{
                type: 'spring',
                stiffness: 260,
                damping: 24,
                mass: 0.85,
              }}
              whileHover={
                isRight
                  ? {
                      y: isMobile ? 10 : 12,
                      scale: isMobile ? 0.96 : 0.98,
                      opacity: 0.98,
                      transition: { duration: 0.18 },
                    }
                  : isLeft
                  ? {
                      y: isMobile ? 14 : 20,
                      scale: isMobile ? 0.92 : 0.93,
                      opacity: 0.7,
                      transition: { duration: 0.18 },
                    }
                  : undefined
              }
              onClick={() => {
                if (isRight) goToNext()
                if (isLeft) goToPrev()
              }}
              drag={isFront ? 'x' : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.35}
              onDragEnd={(_, info) => {
                if (info.offset.x < -60 || info.velocity.x < -300) {
                  goToNext()
                } else if (info.offset.x > 60 || info.velocity.x > 300) {
                  goToPrev()
                }
              }}
            >
              {/* Top Media Viewport with Frosted Glass Index Tag */}
              <div
                className="tilted-card__media-box"
                onClick={() => {
                  if (!isFront) return
                  playCardInspectSound()
                  if (isVideo) {
                    onOpenDemo?.(item)
                  } else if (mediaSrc) {
                    onOpenCover?.(item)
                  }
                }}
              >
                {isVideo && mediaSrc ? (
                  <div className="tilted-card__video-wrap">
                    <video
                      ref={isFront ? videoRef : null}
                      src={mediaSrc}
                      autoPlay={isFront}
                      muted={isFront ? isMuted : true}
                      loop
                      playsInline
                      preload="auto"
                      className="tilted-card__media"
                    />
                    {isFront && (
                      <button
                        type="button"
                        className="tilted-card__vol-btn"
                        onClick={handleVolumeToggle}
                        aria-label={isMuted ? 'Unmute video audio' : 'Mute video audio'}
                        title={isMuted ? 'Unmute audio' : 'Mute audio'}
                      >
                        {isMuted ? <FiVolumeX aria-hidden="true" /> : <FiVolume2 aria-hidden="true" />}
                      </button>
                    )}
                  </div>
                ) : mediaSrc ? (
                  <div className="tilted-card__img-wrap">
                    <img src={mediaSrc} alt={item.title} className="tilted-card__media" loading="lazy" />
                    {isFront && (
                      <div className="tilted-card__zoom-overlay" aria-hidden="true">
                        <span className="tilted-card__zoom-pill">
                          <FiMaximize2 /> Zoom Image
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="tilted-card__fallback">Preview</div>
                )}

                {/* Frosted Index Tag e.g. 02 / 07 */}
                <span className="tilted-card__index-pill">
                  {String(idx + 1).padStart(2, '0')} / {String(N).padStart(2, '0')}
                </span>
              </div>

              {/* Bottom Card Body */}
              <div className="tilted-card__body">
                {/* Top Category & Tag row */}
                <div className="tilted-card__header-row">
                  <span className="tilted-card__badge-cat">
                    {item.category?.toUpperCase() || 'BRAND'}
                  </span>
                  {item.tags?.[0] && (
                    <span className="tilted-card__badge-sub">{item.tags[0]}</span>
                  )}
                </div>

                {/* Project Title */}
                <h3 className="tilted-card__title">{item.title}</h3>

                {/* 2-line Description */}
                <p className="tilted-card__desc">{item.description}</p>

                {/* Tech Stack Chips */}
                {item.tags?.length > 0 && (
                  <div className="tilted-card__chips">
                    {item.tags.map((tag) => (
                      <span key={tag} className="tilted-card__chip">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Action Buttons: White Live Demo, Dark GitHub, Dark Video */}
                <div className="tilted-card__actions">
                  {item.liveUrl && item.liveUrl !== '#' ? (
                    <a
                      href={item.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="tilted-btn tilted-btn--white"
                    >
                      Live Demo ↗
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onOpenCover?.(item)}
                      className="tilted-btn tilted-btn--white"
                    >
                      Live Demo ↗
                    </button>
                  )}

                  {item.codeUrl && item.codeUrl !== '#' && (
                    <a
                      href={item.codeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="tilted-btn tilted-btn--dark"
                    >
                      <FiGithub aria-hidden="true" /> GitHub ↗
                    </a>
                  )}

                  {item.videoUrl && (
                    <button
                      type="button"
                      onClick={() => onOpenDemo?.(item)}
                      className="tilted-btn tilted-btn--dark"
                    >
                      <FiPlay aria-hidden="true" /> Video ↗
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Navigation Controls */}
      <div className="tilted-deck-nav-row">
        <button
          type="button"
          className="tilted-deck-arrow-btn"
          onClick={goToPrev}
          aria-label="Previous project"
          title="Previous project (A)"
        >
          <FiChevronLeft aria-hidden="true" />
        </button>

        <div className="tilted-deck-dots" role="tablist" aria-label="Projects">
          {items.map((it, idx) => (
            <button
              type="button"
              key={it.id || idx}
              role="tab"
              aria-selected={idx === currentIndex}
              className={`tilted-deck-dot ${idx === currentIndex ? 'is-active' : ''}`}
              onClick={() => goToIndex(idx)}
              aria-label={`Go to ${it.title}`}
            />
          ))}
        </div>

        <button
          type="button"
          className="tilted-deck-arrow-btn"
          onClick={goToNext}
          aria-label="Next project"
          title="Next project (D)"
        >
          <FiChevronRight aria-hidden="true" />
        </button>
      </div>

      {/* Keyboard Shortcuts Hint Bar */}
      <div className="tilted-deck-shortcuts-bar">
        <span className="tilted-shortcut-badge">
          <kbd className="tilted-kbd">A</kbd> / <kbd className="tilted-kbd">D</kbd> Slide
        </span>
        <span className="tilted-shortcut-sep">•</span>
        <span className="tilted-shortcut-badge">
          <kbd className="tilted-kbd">⌘K</kbd> quick nav
        </span>
        <span className="tilted-shortcut-sep">•</span>
        <span className="tilted-shortcut-badge">
          <kbd className="tilted-kbd">M</kbd> sound
        </span>
      </div>
    </div>
  )
}
