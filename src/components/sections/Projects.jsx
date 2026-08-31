import { useMemo, useState } from 'react'
import {
  FiFolder,
  FiLock,
  FiActivity,
  FiShoppingBag,
  FiUsers,
  FiVideo,
  FiPenTool,
} from 'react-icons/fi'
import { HiOutlineSparkles } from 'react-icons/hi'
import { projects, projectCategories } from '../../data/projects'
import { useUI } from '../../context/UIContext'
import Carousel from './Carousel'

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

      <div className="carousel-stage">
        <Carousel
          items={carouselItems}
          baseWidth={760}
          onOpenCover={(p) => openLightbox(p.cover, p.title, p.title)}
          onOpenDemo={(p) => openVideoModal(`${p.title} Demo`, p.videoUrl)}
        />
      </div>
    </>
  )
}