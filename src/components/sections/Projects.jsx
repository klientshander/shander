import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiExternalLink,
  FiGithub,
  FiPlay,
  FiArrowRight,
  FiArrowLeft,
  FiMaximize2,
} from 'react-icons/fi'
import { projects, projectCategories } from '../../data/projects'
import { useUI } from '../../context/UIContext'
import TiltedDeckShowcase from './TiltedDeckShowcase'
import './Projects.css'

export default function Projects() {
  const [showAllGrid, setShowAllGrid] = useState(false)
  const [gridFilter, setGridFilter] = useState('all')
  const { openLightbox, openVideoModal } = useUI()

  const filteredProjects = useMemo(() => {
    if (gridFilter === 'all') return projects
    return projects.filter((p) => p.category === gridFilter)
  }, [gridFilter])

  return (
    <div className="projects-section-container">
      {/* Header Row: 02 — projects and View Toggle */}
      <div className="projects-header-row">
        <div className="projects-header-left">
          <span className="projects-header-num">02</span>
          <span className="projects-header-sep">—</span>
          <span className="projects-header-title">projects</span>
        </div>

        <button
          type="button"
          className="projects-header-all"
          onClick={() => setShowAllGrid((prev) => !prev)}
          aria-label={showAllGrid ? 'Return to showcase' : 'View all projects grid'}
        >
          {showAllGrid ? (
            <>
              <FiArrowLeft aria-hidden="true" /> SHOWCASE
            </>
          ) : (
            <>
              ALL PROJECTS <FiArrowRight aria-hidden="true" />
            </>
          )}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {!showAllGrid ? (
          /* 3D Tilted Real-Media Card Deck Showcase (Exact media_1789886634706.png match) */
          <motion.div
            key="tilted-deck-showcase"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="projects-showcase-stage"
          >
            <TiltedDeckShowcase
              items={projects}
              onOpenCover={(p) => openLightbox(p.cover, p.title, p.title)}
              onOpenDemo={(p) => openVideoModal(`${p.title} Demo`, p.videoUrl || p.cover)}
            />
          </motion.div>
        ) : (
          /* All Projects Visual Grid View */
          <motion.div
            key="grid-view"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="projects-grid-wrap"
          >
            {/* Filter Tabs */}
            <div className="projects-grid-filters" role="tablist" aria-label="Filter projects">
              <button
                type="button"
                className={`projects-grid-filter-btn ${gridFilter === 'all' ? 'is-active' : ''}`}
                onClick={() => setGridFilter('all')}
              >
                All ({projects.length})
              </button>
              {projectCategories.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  className={`projects-grid-filter-btn ${gridFilter === cat ? 'is-active' : ''}`}
                  onClick={() => setGridFilter(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Grid Cards with prominent visual assets */}
            <div className="projects-grid-cards">
              {filteredProjects.map((item, idx) => {
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

                return (
                  <div key={item.id || idx} className="projects-grid-card">
                    {mediaSrc && (
                      <div
                        className="projects-grid-card__cover"
                        onClick={() => {
                          if (isVideo) {
                            openVideoModal(`${item.title} Demo`, mediaSrc)
                          } else {
                            openLightbox(mediaSrc, item.title, item.title)
                          }
                        }}
                        role="button"
                        tabIndex={0}
                        aria-label={`Open media for ${item.title}`}
                      >
                        {isVideo ? (
                          <video src={mediaSrc} muted autoPlay loop playsInline />
                        ) : (
                          <img src={mediaSrc} alt={item.title} loading="lazy" />
                        )}
                        <span className="projects-grid-card__badge-num">
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                      </div>
                    )}

                    <div className="projects-grid-card__body">
                      <div className="projects-grid-card__header">
                        <span className="projects-grid-card__cat">{item.category}</span>
                        {item.tags?.[0] && (
                          <span className="projects-grid-card__tag">{item.tags[0]}</span>
                        )}
                      </div>

                      <h3 className="projects-grid-card__title">{item.title}</h3>

                      <p className="projects-grid-card__desc">{item.description}</p>

                      <div className="projects-grid-card__actions">
                        {item.liveUrl && item.liveUrl !== '#' && (
                          <a
                            href={item.liveUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="projects-grid-btn projects-grid-btn--primary"
                          >
                            <FiExternalLink aria-hidden="true" /> Live Demo ↗
                          </a>
                        )}
                        {item.codeUrl && item.codeUrl !== '#' && (
                          <a
                            href={item.codeUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="projects-grid-btn"
                          >
                            <FiGithub aria-hidden="true" /> Code ↗
                          </a>
                        )}
                        {item.videoUrl && (
                          <button
                            type="button"
                            onClick={() => openVideoModal(`${item.title} Demo`, item.videoUrl)}
                            className="projects-grid-btn"
                          >
                            <FiPlay aria-hidden="true" /> Video ↗
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}