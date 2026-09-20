import { motion } from 'framer-motion'
import { FiShoppingBag, FiMail, FiMessageSquare } from 'react-icons/fi'
import { socials } from '../../data/profile'
import { useUI } from '../../context/UIContext'
import { playClickSound, playHoverSound } from '../../utils/sound'
import './Shop.css'

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (custom = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: custom * 0.08, ease: 'easeOut' },
  }),
}

const upcomingCategories = [
  {
    name: 'Web Starter Templates',
    desc: 'Production-ready starter kits built with React, Tailwind CSS, and Vite.',
  },
  {
    name: 'Backend Boilerplates',
    desc: 'Clean Laravel & PHP architecture setups with authentication and database schema.',
  },
  {
    name: 'UI Components & Kits',
    desc: 'Polished interactive components, micro-interactions, and design systems.',
  },
]

export default function Shop() {
  const { openChatModal } = useUI()

  const handleInquire = () => {
    playClickSound()
    const subject = encodeURIComponent('Shop & Template Inquiry')
    const body = encodeURIComponent(
      `Hi Shander,\n\nI visited your shop section and would like to ask about upcoming templates / custom assets.\n\nLooking forward to hearing from you!`
    )
    window.location.href = `mailto:${socials.email || 'klientshander@gmail.com'}?subject=${subject}&body=${body}`
  }

  return (
    <div className="shop-page">
      {/* Top Header */}
      <motion.header
        className="shop-header"
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        custom={0}
      >
        <h1 className="shop-title">shop</h1>
        <p className="shop-subtitle">
          Curated digital products, project templates, and developer resources.
        </p>
      </motion.header>

      {/* Main Content Area */}
      <div className="shop-content">
        <motion.article
          className="shop-card"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={1}
        >
          <div className="shop-card__header">
            <h2 className="shop-card__headline">Coming Soon</h2>
            <div className="shop-card__badge">
              <span className="shop-card__badge-dot" />
              <span>In Development</span>
            </div>
          </div>

          <p className="shop-card__desc">
            I am currently preparing a collection of high-quality web templates, full-stack boilerplates,
            and developer tools. Everything will be thoroughly documented, performant, and ready to deploy.
          </p>

          <div className="shop-categories-preview">
            {upcomingCategories.map((cat) => (
              <div key={cat.name} className="shop-preview-item">
                <span className="shop-preview-item__name">{cat.name}</span>
                <span className="shop-preview-item__desc">{cat.desc}</span>
              </div>
            ))}
          </div>

          <div className="shop-cta-row">
            <button
              type="button"
              className="shop-cta-btn"
              onClick={handleInquire}
              onMouseEnter={playHoverSound}
            >
              <FiMail aria-hidden="true" />
              <span>Notify Me / Inquire</span>
            </button>
            <button
              type="button"
              className="shop-cta-btn shop-cta-btn--secondary"
              onClick={() => {
                playClickSound()
                openChatModal?.()
              }}
              onMouseEnter={playHoverSound}
            >
              <FiMessageSquare aria-hidden="true" />
              <span>Send Message</span>
            </button>
          </div>
        </motion.article>
      </div>
    </div>
  )
}

