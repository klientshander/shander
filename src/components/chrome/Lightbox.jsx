import { AnimatePresence, motion } from 'framer-motion'
import { FiX } from 'react-icons/fi'
import { useUI } from '../../context/UIContext'

export default function Lightbox() {
  const { lightbox, closeLightbox } = useUI()

  return (
    <AnimatePresence>
      {lightbox.open && (
        <motion.div
          className="overlay"
          role="dialog"
          aria-modal="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeLightbox}
        >
          <motion.div
            className="overlay__box overlay__box--media"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="overlay__media">
              {lightbox.src && <img src={lightbox.src} alt={lightbox.alt} />}
            </div>
            <div className="overlay__footer">
              <span className="overlay__caption">{lightbox.caption || lightbox.alt}</span>
              <button type="button" className="overlay__close" onClick={closeLightbox}>
                <FiX aria-hidden="true" /> Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
