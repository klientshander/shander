import { useMemo, useState } from 'react'
import {
  FiFolder,
  FiLock,
  FiActivity,
  FiShoppingBag,
  FiUsers,
  FiVideo,
  FiPenTool,
  FiExternalLink,
  FiGithub,
  FiPlay,
  FiZoomIn,
  FiGrid,
  FiSliders,
} from 'react-icons/fi'
import { HiOutlineSparkles } from 'react-icons/hi'
import { projects, projectCategories } from '../../data/projects'
import { useUI } from '../../context/UIContext'
import Carousel from './Carousel'
import Reveal from '../ui/Reveal'

const projectIconMap = {
  lock: FiLock,
  activity: FiActivity,
  shopping: FiShoppingBag,
  brand: HiOutlineSparkles,
  video: FiVideo,
  design: FiPenTool,
  users: FiUsers,
}

export default function Projects() {
  const [filter, setFilter] = useState('all')
  const [viewMode, setViewMode] = useState('carousel') // 'carousel' | 'grid'
  const { openLightbox, openVideoModal } = useUI()

  const visible = useMemo(
    () => (filter === 'all' ? projects : projects.filter((p) => p.category === filter)),
    [filter]
  )

  const carouselItems = useMemo(() => {
    return visible.map((p, i) => {
      const Icon = projectIconMap[p.icon] ?? FiFolder
      return {
        id: p.id || i,
        title: p.title,
        description: p.description,
        category: p.category,
        tags: p.tags,
        cover: p.cover,
        liveUrl: p.liveUrl,
        codeUrl: p.codeUrl,
        videoUrl: p.videoUrl,
        metrics: p.metrics,
        progress: p.progress,
        icon: <Icon className="carousel-icon" />,
      }
    })
  }, [visible])

  return (
    <>
      <div className="projects-toolbar">
        <div className="filter-tabs" role="tablist" aria-label="Filter projects by category">
          <button
            type="button"
            className={`filter-tab ${filter === 'all' ? 'is-active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({projects.length})
          </button>
          {projectCategories.map((cat) => {
            const count = projects.filter((p) => p.category === cat).length
            return (
              <button
                type="button"
                key={cat}
                className={`filter-tab ${filter === cat ? 'is-active' : ''}`}
                onClick={() => setFilter(cat)}
              >
                {cat} ({count})
              </button>
            )
          })}
        </div>

        <div className="view-mode-toggle" role="group" aria-label="Switch project layout">
          <button
            type="button"
            className={`view-mode-btn ${viewMode === 'carousel' ? 'is-active' : ''}`}
            onClick={() => setViewMode('carousel')}
            title="Carousel / Slideshow View"
          >
            <FiSliders aria-hidden="true" />
            <span>Slideshow</span>
          </button>
          <button
            type="button"
            className={`view-mode-btn ${viewMode === 'grid' ? 'is-active' : ''}`}
            onClick={() => setViewMode('grid')}
            title="Grid View (See all projects)"
          >
            <FiGrid aria-hidden="true" />
            <span>Grid View</span>
          </button>
        </div>
      </div>

      {viewMode === 'carousel' ? (
        <div className="carousel-stage">
          <Carousel
            items={carouselItems}
            baseWidth={760}
            autoplay={false}
            autoplayDelay={3000}
            pauseOnHover={false}
            loop={false}
            round={false}
            onOpenCover={(p) => openLightbox(p.cover, p.title, p.title)}
            onOpenDemo={(p) => openVideoModal(`${p.title} Demo`, p.videoUrl)}
          />
        </div>
      ) : (
        <div className="projects-grid">
          {visible.map((p, index) => {
            const Icon = projectIconMap[p.icon] ?? FiFolder
            return (
              <Reveal
                as="article"
                key={p.id || index}
                delay={index * 0.06}
                className="project-grid-card"
              >
                {p.cover ? (
                  <div
                    className="project-grid-card__cover"
                    onClick={() => openLightbox(p.cover, p.title, p.title)}
                    role="button"
                    tabIndex={0}
                    aria-label={`View ${p.title} image`}
                  >
                    <img src={p.cover} alt={p.title} loading="lazy" />
                    <span className="project-grid-card__zoom">
                      <FiZoomIn aria-hidden="true" />
                    </span>
                  </div>
                ) : p.videoUrl ? (
                  <div
                    className="project-grid-card__cover project-grid-card__cover--video"
                    onClick={() => openVideoModal(`${p.title} Demo`, p.videoUrl)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Play ${p.title} video demo`}
                  >
                    <video src={p.videoUrl} muted playsInline />
                    <span className="project-grid-card__play-badge">
                      <FiPlay aria-hidden="true" />
                      <span>Watch Demo</span>
                    </span>
                  </div>
                ) : (
                  <div className="project-grid-card__cover project-grid-card__cover--placeholder">
                    <Icon aria-hidden="true" />
                  </div>
                )}

                <div className="project-grid-card__body">
                  <div className="project-grid-card__header">
                    <span className="project-grid-card__icon">
                      <Icon aria-hidden="true" />
                    </span>
                    <span className="project-grid-card__category">{p.category}</span>
                  </div>

                  <h3 className="project-grid-card__title">{p.title}</h3>
                  <p className="project-grid-card__desc">{p.description}</p>

                  {p.metrics?.length > 0 && (
                    <div className="project-grid-card__metrics">
                      {p.metrics.map((m) => (
                        <div key={m.label} className="project-grid-card__metric">
                          <span className="project-grid-card__metric-val">{m.value}</span>
                          <span className="project-grid-card__metric-label">{m.label}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {p.tags?.length > 0 && (
                    <div className="project-grid-card__tags">
                      {p.tags.map((tag) => (
                        <span key={tag} className="project-grid-card__tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="project-grid-card__actions">
                    {p.videoUrl && (
                      <button
                        type="button"
                        className="project-grid-card__btn project-grid-card__btn--demo"
                        onClick={() => openVideoModal(`${p.title} Demo`, p.videoUrl)}
                      >
                        <FiPlay aria-hidden="true" /> Demo
                      </button>
                    )}
                    {p.liveUrl && p.liveUrl !== '#' && (
                      <a
                        className="project-grid-card__btn"
                        href={p.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <FiExternalLink aria-hidden="true" /> Live
                      </a>
                    )}
                    {p.codeUrl && p.codeUrl !== '#' && (
                      <a
                        className="project-grid-card__btn"
                        href={p.codeUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <FiGithub aria-hidden="true" /> Code
                      </a>
                    )}
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>
      )}
    </>
  )
}