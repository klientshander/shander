import { AnimatePresence, motion } from 'framer-motion'
import { FiX } from 'react-icons/fi'
import { useUI } from '../../context/UIContext'
import SidebarChess from '../chess/SidebarChess'

export default function ChessModal() {
  const { chessModal, closeChessModal } = useUI()

  return (
    <AnimatePresence>
      {chessModal.open && (
        <motion.div
          className="overlay"
          role="dialog"
          aria-modal="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeChessModal}
        >
          <motion.div
            className="overlay__box overlay__box--chess"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '520px', width: '92%' }}
          >
            <div className="overlay__header">
              <span className="overlay__label">♟️ Do you wanna play with Shander?</span>
              <button type="button" className="overlay__close" onClick={closeChessModal}>
                <FiX aria-hidden="true" /> Close
              </button>
            </div>
            <div style={{ padding: '16px' }}>
              <SidebarChess isModal={true} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

