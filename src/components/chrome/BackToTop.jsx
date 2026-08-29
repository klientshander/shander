import { FiArrowUp } from 'react-icons/fi'

export default function BackToTop({ visible, onClick }) {
  return (
    <button
      type="button"
      className={`back-to-top ${visible ? 'back-to-top--visible' : ''}`}
      onClick={onClick}
      aria-label="Back to top"
    >
      <FiArrowUp aria-hidden="true" />
    </button>
  )
}
