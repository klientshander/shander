import { AnimatePresence, motion } from 'framer-motion'
import { FiX, FiAward } from 'react-icons/fi'
import { useUI } from '../../context/UIContext'

export default function CertModal() {
  const { certModal, closeCertModal } = useUI()

  return (
    <AnimatePresence>
      {certModal.open && (
        <motion.div
          className="overlay"
          role="dialog"
          aria-modal="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeCertModal}
        >
          <motion.div
            className="overlay__box"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="overlay__header">
              <span className="overlay__label">Certificate</span>
              <button type="button" className="overlay__close" onClick={closeCertModal}>
                <FiX aria-hidden="true" /> Close
              </button>
            </div>
            <div className="overlay__cert-body">
              {certModal.img ? (
                <img src={certModal.img} alt={certModal.title} />
              ) : (
                <div className="overlay__placeholder">
                  <FiAward aria-hidden="true" />
                  <span>Certificate image</span>
                  <span className="overlay__placeholder-hint">
                    Add this cert's image path in src/data/certifications.js
                  </span>
                </div>
              )}
            </div>
            <div className="overlay__footer">
              <span className="overlay__caption">
                {certModal.title}
                {certModal.org ? ` — ${certModal.org}` : ''}
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
