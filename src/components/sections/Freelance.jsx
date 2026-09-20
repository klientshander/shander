import { motion } from 'framer-motion'
import { FiArrowUpRight, FiMail, FiMessageSquare } from 'react-icons/fi'
import { freelanceIntro, freelanceOfferings } from '../../data/freelance'
import { socials } from '../../data/profile'
import { useUI } from '../../context/UIContext'
import { playClickSound, playHoverSound } from '../../utils/sound'
import './Freelance.css'

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (custom = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: custom * 0.08, ease: 'easeOut' },
  }),
}

export default function Freelance() {
  const { openChatModal } = useUI()

  const handleInquire = (item) => {
    playClickSound()
    const subject = encodeURIComponent(item.subject || `Freelance Inquiry: ${item.title}`)
    const body = encodeURIComponent(
      `Hi Shander,\n\nI am interested in your freelance service: "${item.title}".\n\nProject details:\n\nLooking forward to hearing from you!`
    )
    window.location.href = `mailto:${socials.email || 'klientshander@gmail.com'}?subject=${subject}&body=${body}`
  }

  const handleEmailDirect = () => {
    playClickSound()
    const subject = encodeURIComponent('Freelance Project Inquiry')
    const body = encodeURIComponent(
      'Hi Shander,\n\nI would like to discuss a freelance project with you.\n\nProject scope:\nTimeline:\nBudget:\n\nBest regards,'
    )
    window.location.href = `mailto:${socials.email || 'klientshander@gmail.com'}?subject=${subject}&body=${body}`
  }

  return (
    <div className="freelance-page">
      {/* Top Header */}
      <motion.header
        className="freelance-header"
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        custom={0}
      >
        <h1 className="freelance-title">{freelanceIntro.title}</h1>
        <p className="freelance-subtitle">{freelanceIntro.subtitle}</p>
      </motion.header>

      {/* Offerings List */}
      <div className="freelance-offerings">
        {freelanceOfferings.map((item, idx) => (
          <motion.article
            key={item.id}
            className="freelance-card"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={idx + 1}
          >
            <div className="freelance-card__header">
              <div className="freelance-card__title-row">
                <span className="freelance-card__idx">{item.number}.</span>
                <h2 className="freelance-card__title">{item.title}</h2>
              </div>

              {item.status && (
                <div className="freelance-card__badge">
                  <span className="freelance-card__status-dot" />
                  <span>{item.status}</span>
                </div>
              )}
            </div>

            <div className="freelance-card__content">
              {item.projectTitle && (
                <h3 className="freelance-card__project-name">{item.projectTitle}</h3>
              )}

              <p className="freelance-card__desc">{item.description}</p>

              {item.tags && item.tags.length > 0 && (
                <div className="freelance-card__tags">
                  {item.tags.map((tag) => (
                    <span key={tag} className="freelance-card__tag">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="freelance-card__footer">
              <button
                type="button"
                className="freelance-card__action"
                onClick={() => handleInquire(item)}
                onMouseEnter={playHoverSound}
              >
                <span>{item.actionLabel}</span>
                <FiArrowUpRight className="freelance-card__arrow" />
              </button>
            </div>
          </motion.article>
        ))}
      </div>

      {/* Direct Collaboration Footer */}
      <motion.div
        className="freelance-contact-box"
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        custom={4}
      >
        <div className="freelance-contact-box__info">
          <span className="freelance-contact-box__eyebrow">READY TO COLLABORATE?</span>
          <h3 className="freelance-contact-box__title">Have a project or idea in mind?</h3>
          <p className="freelance-contact-box__text">
            Available for web development, video editing, and student portfolio builds. Send an email to discuss timelines and details.
          </p>
        </div>

        <div className="freelance-contact-box__actions">
          <button
            type="button"
            className="freelance-contact-btn freelance-contact-btn--primary"
            onClick={handleEmailDirect}
            onMouseEnter={playHoverSound}
          >
            <FiMail />
            <span>Send an Email</span>
          </button>
          {openChatModal && (
            <button
              type="button"
              className="freelance-contact-btn freelance-contact-btn--secondary"
              onClick={() => {
                playClickSound()
                openChatModal()
              }}
              onMouseEnter={playHoverSound}
            >
              <FiMessageSquare />
              <span>Conversation Hub</span>
            </button>
          )}
        </div>
      </motion.div>
    </div>
  )
}
