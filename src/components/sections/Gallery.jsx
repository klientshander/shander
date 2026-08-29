import { useState } from 'react'
import { FiMonitor, FiCoffee, FiUser, FiUsers, FiMap, FiHeart, FiImage, FiZoomIn } from 'react-icons/fi'
import { gallery } from '../../data/gallery'
import { useUI } from '../../context/UIContext'
import Reveal from '../ui/Reveal'

const galleryIconMap = {
  monitor: FiMonitor,
  coffee: FiCoffee,
  user: FiUser,
  users: FiUsers,
  map: FiMap,
  heart: FiHeart,
}

function GalleryFigure({ item, index, onOpen }) {
  const [imgError, setImgError] = useState(false)
  const Icon = galleryIconMap[item.icon] ?? FiImage
  const showImage = item.src && !imgError

  return (
    <Reveal
      as="figure"
      delay={index * 0.05}
      className={`gallery-figure ${item.featured ? 'gallery-figure--featured' : ''}`}
    >
      <button
        type="button"
        className="gallery-figure__trigger"
        onClick={() => showImage && onOpen(item)}
        aria-label={showImage ? `View ${item.caption} larger` : item.caption}
      >
        {showImage ? (
          <img
            src={item.src}
            alt={item.caption}
            className="gallery-figure__media"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="gallery-figure__media gallery-figure__media--placeholder">
            <Icon aria-hidden="true" />
          </div>
        )}
        <span className="gallery-figure__scrim" aria-hidden="true" />
        <span className="gallery-figure__zoom">
          <FiZoomIn aria-hidden="true" />
        </span>
      </button>
      <figcaption className="gallery-figure__caption">{item.caption}</figcaption>
    </Reveal>
  )
}

export default function Gallery() {
  const { openLightbox } = useUI()

  return (
    <section aria-label="Gallery" className="gallery-grid">
      {gallery.map((item, index) => (
        <GalleryFigure
          key={item.id}
          item={item}
          index={index}
          onOpen={(g) => openLightbox(g.src, g.caption, g.caption)}
        />
      ))}
    </section>
  )
}