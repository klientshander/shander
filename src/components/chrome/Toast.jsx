import { AnimatePresence, motion } from 'framer-motion'
import { useUI } from '../../context/UIContext'

export default function Toast() {
  const { toast } = useUI()

  return (
    <AnimatePresence>
      {toast.show && (
        <motion.div
          className="toast"
          initial={{ opacity: 0, y: 16, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: 16, x: '-50%' }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          role="status"
        >
          {toast.message}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
