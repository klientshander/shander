import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiPlay,
  FiExternalLink,
  FiGithub,
  FiChevronLeft,
  FiChevronRight,
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
      x: dir > 0 ? 60 : -60,
      opacity: 0,
      scale: 0.98,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: 'spring', stiffness: 340, damping: 32 },
        opacity: { duration: 0.2 },
        scale: { duration: 0.2 },
      },
    },
    exit: (dir) => ({
      x: dir > 0 ? -60 : 60,
      opacity: 0,
      scale: 0.98,
      transition: {
        x: { type: 'spring', stiffness: 340, damping: 32 },
        opacity: { duration: 0.18 },
        scale: { duration: 0.18 },
      },
    }),
  }

  return (
    <div className="carousel-deck-wrapper" style={{ maxWidth: `${baseWidth}px` }}>
      <div className="carousel-stage-box">
        {/* Desktop Side Arrow (Left) */}
        {items.length > 1 && (
          <button
            type="button"
            className="carousel-side-arrow carousel-side-arrow--prev desktop-only"
            onClick={prevSlide}
            aria-label="Previous project"
          >
            <FiChevronLeft aria-hidden="true" />
          </button>
        )}

        {/* Card Stage with AnimatePresence */}
        <div className="carousel-card-viewport">
          <AnimatePresence initial={false} custom={direction} mode="wait">
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

        {/* Desktop Side Arrow (Right) */}
        {items.length > 1 && (
          <button
            type="button"
            className="carousel-side-arrow carousel-side-arrow--next desktop-only"
            onClick={nextSlide}
            aria-label="Next project"
          >
            <FiChevronRight aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Navigation Footer with Mobile Bottom Arrows + Dots + Counter */}
      {items.length > 1 && (
        <div className="carousel-deck-footer">
          {/* Mobile Prev Arrow */}
          <button
            type="button"
            className="carousel-footer-arrow carousel-footer-arrow--prev mobile-only"
            onClick={prevSlide}
            aria-label="Previous project"
          >
            <FiChevronLeft aria-hidden="true" />
            <span>Prev</span>
          </button>

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

          {/* Mobile Next Arrow */}
          <button
            type="button"
            className="carousel-footer-arrow carousel-footer-arrow--next mobile-only"
            onClick={nextSlide}
            aria-label="Next project"
          >
            <span>Next</span>
            <FiChevronRight aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  )
}