import { motion } from 'framer-motion'
import { FiArrowUpRight, FiExternalLink } from 'react-icons/fi'
import { resourcesIntro, resourceCategories } from '../../data/resources'
import { playClickSound } from '../../utils/sound'
import './Resources.css'

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (custom = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: custom * 0.08, ease: 'easeOut' },
  }),
}

export default function Resources() {
  return (
    <div className="resources-page">
      {/* Top Header */}
      <motion.header
        className="resources-header"
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        custom={0}
      >
        <h1 className="resources-title">{resourcesIntro.title}</h1>
        <p className="resources-subtitle">{resourcesIntro.subtitle}</p>
      </motion.header>

      {/* Categorized Resource Sections */}
      <div className="resources-sections">
        {resourceCategories.map((category, catIdx) => (
          <motion.section
            key={category.id}
            className="resources-category"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={catIdx + 1}
          >
            <div className="resources-category__head">
              <span className="resources-category__idx">{category.index} —</span>
              <h2 className="resources-category__title">{category.title}</h2>
            </div>

            <div className="resources-grid">
              {category.items.map((item) => (
                <a
                  key={item.name}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="resource-card group"
                  onClick={playClickSound}
                  title={`Open ${item.name} in a new tab`}
                >
                  <div className="resource-card__content">
                    <div className="resource-card__top">
                      <span className="resource-card__name">{item.name}</span>
                      <svg
                        className="resource-card__arrow"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M7 17L17 7M9 7h8v8"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <p className="resource-card__role">{item.role}</p>
                  </div>
                </a>
              ))}
            </div>
          </motion.section>
        ))}
      </div>
    </div>
  )
}

