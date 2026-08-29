import { AnimatePresence, motion } from 'framer-motion'
import { FiX, FiPlay } from 'react-icons/fi'
import { useUI } from '../../context/UIContext'

function toEmbedUrl(url) {
  try {
    if (url.includes('youtube.com/watch')) {
      const id = new URL(url).searchParams.get('v')
      return `https://www.youtube.com/embed/${id}?autoplay=1`
    }
    if (url.includes('youtu.be/')) {
      const id = url.split('youtu.be/')[1]
      return `https://www.youtube.com/embed/${id}?autoplay=1`
    }
  } catch {
    // fall through to raw url
  }
  return url
}

export default function VideoModal() {
  const { videoModal, closeVideoModal } = useUI()
  const isDirectFile = /\.(mp4|webm|ogg)(\?.*)?$/i.test(videoModal.url || '')

  return (
    <AnimatePresence>
      {videoModal.open && (
        <motion.div
          className="overlay"
          role="dialog"
          aria-modal="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeVideoModal}
        >
          <motion.div
            className="overlay__box overlay__box--video"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="overlay__header">
              <span className="overlay__label">{videoModal.title}</span>
              <button type="button" className="overlay__close" onClick={closeVideoModal}>
                <FiX aria-hidden="true" /> Close
              </button>
            </div>
            <div className="overlay__video-body">
              {videoModal.url ? (
                isDirectFile ? (
                  // eslint-disable-next-line jsx-a11y/media-has-caption
                  <video src={videoModal.url} controls autoPlay playsInline />
                ) : (
                  <iframe
                    src={toEmbedUrl(videoModal.url)}
                    title={videoModal.title}
                    allow="autoplay; fullscreen"
                    allowFullScreen
                  />
                )
              ) : (
                <div className="overlay__placeholder">
                  <FiPlay aria-hidden="true" />
                  <span>Demo video — add a URL in src/data/projects.js</span>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
