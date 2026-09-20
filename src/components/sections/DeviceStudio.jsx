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
  FiMonitor,
  FiSmartphone,
} from 'react-icons/fi'
import './DeviceStudio.css'

export default function DeviceStudio({
  items = [],
  onOpenCover,
  onOpenDemo,
}) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [deviceMode, setDeviceMode] = useState('desktop') // 'desktop' | 'mobile'
  const [isMuted, setIsMuted] = useState(true)
  const videoRef = useRef(null)
  const dockRef = useRef(null)

  const activeItem = items[activeIndex] || items[0]
  const N = items.length

  // Sync video audio muted state
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted
    }
  }, [isMuted, activeIndex, deviceMode])

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
    setActiveIndex((prev) => (prev + 1) % N)
  }

  const goToPrev = () => {
    setActiveIndex((prev) => (prev - 1 + N) % N)
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
    return <div className="device-studio-empty">No projects available.</div>
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

  const displayUrl =
    activeItem.liveUrl && activeItem.liveUrl !== '#'
      ? activeItem.liveUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')
      : `shander.dev / ${activeItem.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}`

  return (
    <div className="device-studio">
      {/* Main Studio Showcase Area */}
      <div className="device-studio__main">
        {/* Left Column: Device Mockup Stage */}
        <div className="device-studio__stage">
          <div className="device-studio__frame-container">
            <AnimatePresence mode="wait">
              {deviceMode === 'desktop' ? (
                /* Desktop Browser Frame */
                <motion.div
                  key={`desktop-${activeItem.id || activeIndex}`}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.28, ease: 'easeOut' }}
                  className="device-frame device-frame--desktop"
                >
                  <div className="desktop-chrome">
                    <div className="desktop-chrome__dots" aria-hidden="true">
                      <span className="desktop-chrome__dot desktop-chrome__dot--red" />
                      <span className="desktop-chrome__dot desktop-chrome__dot--yellow" />
                      <span className="desktop-chrome__dot desktop-chrome__dot--green" />
                    </div>
                    <div className="desktop-chrome__address">
                      <span className="desktop-chrome__url">{displayUrl}</span>
                    </div>
                    <div className="desktop-chrome__actions">
                      {mediaSrc && (
                        <button
                          type="button"
                          className="desktop-chrome__action-btn"
                          onClick={() => {
                            if (isVideo) {
                              onOpenDemo?.(activeItem)
                            } else {
                              onOpenCover?.(activeItem)
                            }
                          }}
                          title="Fullscreen"
                          aria-label="Expand image"
                        >
                          <FiMaximize2 />
                        </button>
                      )}
                    </div>
                  </div>

                  <div
                    className="desktop-screen"
                    onClick={() => {
                      if (isVideo) {
                        onOpenDemo?.(activeItem)
                      } else if (mediaSrc) {
                        onOpenCover?.(activeItem)
                      }
                    }}
                  >
                    {isVideo && mediaSrc ? (
                      <div className="device-media-wrap">
                        <video
                          ref={videoRef}
                          src={mediaSrc}
                          autoPlay
                          muted={isMuted}
                          loop
                          playsInline
                          className="device-media device-media--video"
                        />
                        <button
                          type="button"
                          className="device-volume-btn"
                          onClick={handleVolumeToggle}
                          aria-label={isMuted ? 'Unmute video audio' : 'Mute video audio'}
                          title={isMuted ? 'Unmute audio' : 'Mute audio'}
                        >
                          {isMuted ? <FiVolumeX aria-hidden="true" /> : <FiVolume2 aria-hidden="true" />}
                        </button>
                      </div>
                    ) : mediaSrc ? (
                      <div className="device-media-wrap">
                        <img
                          src={mediaSrc}
                          alt={activeItem.title}
                          className="device-media device-media--img"
                          loading="lazy"
                        />
                        <div className="device-media-overlay" aria-hidden="true">
                          <span className="device-zoom-pill">
                            <FiMaximize2 /> Zoom Image
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="device-media-fallback">Asset Preview</div>
                    )}
                  </div>
                </motion.div>
              ) : (
                /* Mobile Phone Frame */
                <motion.div
                  key={`mobile-${activeItem.id || activeIndex}`}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.28, ease: 'easeOut' }}
                  className="device-frame device-frame--mobile"
                >
                  <div className="phone-case">
                    {/* Top Island / Notch Bar */}
                    <div className="phone-top-bar" aria-hidden="true">
                      <span className="phone-time">9:41</span>
                      <div className="phone-island">
                        <span className="phone-camera" />
                      </div>
                      <div className="phone-signals">
                        <span className="phone-signal-bar" />
                        <span className="phone-battery" />
                      </div>
                    </div>

                    {/* Phone Screen Viewport */}
                    <div
                      className="phone-screen"
                      onClick={() => {
                        if (isVideo) {
                          onOpenDemo?.(activeItem)
                        } else if (mediaSrc) {
                          onOpenCover?.(activeItem)
                        }
                      }}
                    >
                      {isVideo && mediaSrc ? (
                        <div className="device-media-wrap">
                          <video
                            ref={videoRef}
                            src={mediaSrc}
                            autoPlay
                            muted={isMuted}
                            loop
                            playsInline
                            className="device-media device-media--phone-video"
                          />
                          <button
                            type="button"
                            className="device-volume-btn device-volume-btn--phone"
                            onClick={handleVolumeToggle}
                            aria-label={isMuted ? 'Unmute video audio' : 'Mute video audio'}
                            title={isMuted ? 'Unmute audio' : 'Mute audio'}
                          >
                            {isMuted ? <FiVolumeX aria-hidden="true" /> : <FiVolume2 aria-hidden="true" />}
                          </button>
                        </div>
                      ) : mediaSrc ? (
                        <div className="device-media-wrap">
                          <img
                            src={mediaSrc}
                            alt={activeItem.title}
                            className="device-media device-media--phone-img"
                            loading="lazy"
                          />
                          <div className="device-media-overlay" aria-hidden="true">
                            <span className="device-zoom-pill">
                              <FiMaximize2 /> Zoom
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="device-media-fallback">Asset Preview</div>
                      )}

                      {/* Home Indicator Line */}
                      <div className="phone-home-indicator" aria-hidden="true" />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Column: Studio Control & Info Pane */}
        <div className="device-studio__info">
          {/* Device Mode Switcher Tabs */}
          <div className="device-mode-switcher">
            <span className="device-switcher-label">PREVIEW DEVICE:</span>
            <div className="device-switcher-pills">
              <button
                type="button"
                className={`device-pill ${deviceMode === 'desktop' ? 'is-active' : ''}`}
                onClick={() => setDeviceMode('desktop')}
                aria-pressed={deviceMode === 'desktop'}
              >
                <FiMonitor aria-hidden="true" /> Desktop
              </button>
              <button
                type="button"
                className={`device-pill ${deviceMode === 'mobile' ? 'is-active' : ''}`}
                onClick={() => setDeviceMode('mobile')}
                aria-pressed={deviceMode === 'mobile'}
              >
                <FiSmartphone aria-hidden="true" /> Mobile
              </button>
            </div>
          </div>

          {/* Project Header Info */}
          <div className="studio-info__meta-row">
            <div className="studio-info__counter">
              <span className="studio-counter-num">
                {String(activeIndex + 1).padStart(2, '0')}
              </span>
              <span className="studio-counter-sep">/</span>
              <span className="studio-counter-total">
                {String(N).padStart(2, '0')}
              </span>
            </div>

            <div className="studio-badge-group">
              <span className="studio-badge studio-badge--cat">
                {activeItem.category || 'System'}
              </span>
              {activeItem.tags?.[0] && (
                <span className="studio-badge studio-badge--sub">
                  {activeItem.tags[0]}
                </span>
              )}
            </div>
          </div>

          <h2 className="studio-project-title">{activeItem.title}</h2>

          <p className="studio-project-desc">{activeItem.description}</p>

          {/* Tech Stack Chips */}
          {activeItem.tags?.length > 0 && (
            <div className="studio-tech-chips">
              {activeItem.tags.map((tag) => (
                <span key={tag} className="studio-chip">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Key Metrics */}
          {activeItem.metrics?.length > 0 && (
            <div className="studio-metrics-bar">
              {activeItem.metrics.map((m) => (
                <div key={m.label} className="studio-metric-item">
                  <span className="studio-metric-val">{m.value}</span>
                  <span className="studio-metric-lbl">{m.label}</span>
                </div>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="studio-action-row">
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
                <FiGithub aria-hidden="true" /> GitHub ↗
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
      </div>

      {/* Bottom Visual Filmstrip Dock (Thumbnails with Images) */}
      <div className="device-dock">
        <div className="device-dock__header">
          <span className="device-dock__label">PROJECT CATALOG</span>
          <div className="device-dock__nav-btns">
            <button
              type="button"
              className="device-dock__nav-btn"
              onClick={goToPrev}
              aria-label="Previous project"
              title="Previous project"
            >
              <FiChevronLeft aria-hidden="true" />
            </button>
            <button
              type="button"
              className="device-dock__nav-btn"
              onClick={goToNext}
              aria-label="Next project"
              title="Next project"
            >
              <FiChevronRight aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="device-dock__scroll-area" ref={dockRef}>
          <div className="device-dock__track">
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
                  className={`device-dock__card ${isActive ? 'is-active' : ''}`}
                  onClick={() => setActiveIndex(idx)}
                  aria-selected={isActive}
                >
                  <div className="device-dock__thumb-wrap">
                    {itemIsVideo && itemSrc ? (
                      <video src={itemSrc} muted playsInline className="device-dock__thumb-media" />
                    ) : itemSrc ? (
                      <img src={itemSrc} alt={item.title} className="device-dock__thumb-media" loading="lazy" />
                    ) : (
                      <div className="device-dock__thumb-fallback" />
                    )}
                    <div className="device-dock__thumb-tint" />
                    <span className="device-dock__thumb-num">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <div className="device-dock__info-wrap">
                    <span className="device-dock__item-title">{item.title}</span>
                    <span className="device-dock__item-cat">{item.category}</span>
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

