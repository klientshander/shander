import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiPlay,
  FiExternalLink,
  FiGithub,
  FiZoomIn,
} from 'react-icons/fi'
import './Carousel.css'

export default function Carousel({
  items = [],
  baseWidth = 760,
  onOpenCover,
  onOpenDemo,
}) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)

  // Reset to first slide when filtered items change
  useEffect(() => {
    setCurrentIndex(0)
  }, [items])

  const nextSlide = () => {
    if (items.length <= 1) return
    setDirection(1)
    setCurrentIndex((prev) => (prev + 1) % items.length)
  }

  const prevSlide = () => {
    if (items.length <= 1) return
    setDirection(-1)
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length)
  }

  const goToSlide = (index) => {
    if (index === currentIndex) return
    setDirection(index > currentIndex ? 1 : -1)
    setCurrentIndex(index)
  }

  // Handle touch / drag swipe
  const handleDragEnd = (_, info) => {
    const swipeThreshold = 35
    if (info.offset.x < -swipeThreshold) {
      nextSlide()
    } else if (info.offset.x > swipeThreshold) {
      prevSlide()
    }
  }

  if (!items || items.length === 0) {
    return <div className="carousel-empty">No projects found in this category.</div>
  }

  const item = items[currentIndex] || items[0]

  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? '100%' : '-100%',
    }),
    center: {
      x: 0,
      transition: {
        x: { type: 'spring', stiffness: 280, damping: 30, mass: 0.8 },
      },
    },
    exit: (dir) => ({
      x: dir > 0 ? '-100%' : '100%',
      transition: {
        x: { type: 'spring', stiffness: 280, damping: 30, mass: 0.8 },
      },
    }),
  }

  return (
    <div className="carousel-deck-wrapper" style={{ maxWidth: `${baseWidth}px` }}>
      <div className="carousel-stage-box">
        {/* Card Stage with AnimatePresence */}
        <div className="carousel-card-viewport">
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.div
              key={item.id ?? currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
              className="carousel-deck-card"
            >
              {item.cover ? (
                <div
                  className="carousel-deck-cover"
                  onClick={() => onOpenCover?.(item)}
                  role="button"
                  tabIndex={0}
                  aria-label={`View ${item.title} image`}
                >
                  <img src={item.cover} alt={item.title} loading="lazy" />
                  <span className="carousel-deck-zoom" aria-hidden="true">
                    <FiZoomIn />
                  </span>
                </div>
              ) : item.videoUrl ? (
                <div
                  className="carousel-deck-cover carousel-deck-cover--video"
                  onClick={() => onOpenDemo?.(item)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Play ${item.title} video demo`}
                >
                  <video src={item.videoUrl} muted loop playsInline />
                  <div className="carousel-deck-play-badge">
                    <FiPlay aria-hidden="true" />
                    <span>Watch Demo</span>
                  </div>
                </div>
              ) : null}

              <div className="carousel-deck-header">
                <span className="carousel-deck-icon">{item.icon}</span>
                {item.category && (
                  <span className="carousel-deck-category">{item.category}</span>
                )}
              </div>

              <div className="carousel-deck-content">
                <h3 className="carousel-deck-title">{item.title}</h3>
                <p className="carousel-deck-description">{item.description}</p>

                {item.metrics?.length > 0 && (
                  <div className="carousel-deck-metrics">
                    {item.metrics.map((m) => (
                      <div key={m.label} className="carousel-deck-metric">
                        <span className="carousel-deck-metric-val">{m.value}</span>
                        <span className="carousel-deck-metric-label">{m.label}</span>
                      </div>
                    ))}
                  </div>
                )}

                {item.tags?.length > 0 && (
                  <div className="carousel-deck-tags">
                    {item.tags.map((tag) => (
                      <span key={tag} className="carousel-deck-tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="carousel-deck-actions">
                  {item.videoUrl && (
                    <button
                      type="button"
                      className="carousel-deck-btn carousel-deck-btn--demo"
                      onClick={() => onOpenDemo?.(item)}
                    >
                      <FiPlay aria-hidden="true" /> Watch Demo
                    </button>
                  )}
                  {item.liveUrl && item.liveUrl !== '#' && (
                    <a
                      className="carousel-deck-btn carousel-deck-btn--live"
                      href={item.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <FiExternalLink aria-hidden="true" /> Live Preview
                    </a>
                  )}
                  {item.codeUrl && item.codeUrl !== '#' && (
                    <a
                      className="carousel-deck-btn"
                      href={item.codeUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <FiGithub aria-hidden="true" /> Code
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Footer with Dots + Counter */}
      {items.length > 1 && (
        <div className="carousel-deck-footer">
          <div className="carousel-deck-dots">
            {items.map((_, index) => (
              <button
                type="button"
                key={index}
                className={`carousel-deck-dot ${currentIndex === index ? 'is-active' : ''}`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to project ${index + 1}`}
                aria-current={currentIndex === index}
              />
            ))}
          </div>

          <span className="carousel-deck-counter">
            <strong>{String(currentIndex + 1).padStart(2, '0')}</strong> / {String(items.length).padStart(2, '0')}
          </span>
        </div>
      )}
    </div>
  )
}