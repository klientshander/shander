import { motion } from 'framer-motion'
import {
  FiMapPin,
  FiCheckCircle,
  FiArrowUpRight,
  FiMail,
  FiDownload,
  FiHome,
  FiFolder,
  FiAward,
  FiCode,
  FiBookOpen,
  FiImage,
} from 'react-icons/fi'
import { FaLinkedin, FaFacebookMessenger, FaGithub } from 'react-icons/fa6'
import { profile, socials } from '../data/profile'
import { navItems } from '../data/nav'
import { useUI } from '../context/UIContext'
import TypingText from './ui/TypingText'
import Sparkline from './ui/Sparkline'
import PixelTransition from './ui/PixelTransition'
import SidebarChess from './chess/SidebarChess'
import './Sidebar.css'

export default function Sidebar({ activeSection = 'home', onNavigate, theme }) {
  const { openChessModal } = useUI()
  const initials = profile.name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()

  const avatarSrc = profile.avatar || '/gallery/shander.png'

  return (
    <aside className="sidebar">
      {/* ===== Profile Identity & Avatar ===== */}
      <div className="sidebar__identity-card">
        <div className="sidebar__avatar-wrap">
          <span className="sidebar__avatar-channel">CH.00</span>
          <span className="sidebar__avatar-frame" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </span>

          <motion.div
            className="sidebar__avatar"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <PixelTransition
              className="sidebar__avatar-transition"
              firstContent={
                avatarSrc ? (
                  <img
                    key={avatarSrc}
                    src={avatarSrc}
                    alt={profile.name}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                ) : (
                  <span>{initials}</span>
                )
              }
              secondContent={
                <div className="sidebar__avatar-hover">
                  <span>meow</span>
                </div>
              }
              gridSize={8}
              pixelColor="#ffffff"
              once={false}
              animationStepDuration={0.4}
              aspectRatio="1 / 1"
            />
          </motion.div>
          <span className="sidebar__status-dot" title="Available for work" />
        </div>

        <div className="sidebar__identity">
          <h1 className="sidebar__name">
            {profile.name}
            {profile.verified && (
              <FiCheckCircle className="sidebar__verified" aria-label="Verified profile" />
            )}
          </h1>

          <p className="sidebar__typing">
            <TypingText words={profile.typingRoles} />
          </p>

          <p className="sidebar__location">
            <FiMapPin aria-hidden="true" />
            {profile.location}
          </p>

          <div className="sidebar__identity-badges">
            <span className="sidebar__badge-pill">{profile.role}</span>
          </div>
        </div>
      </div>

      {/* ===== Quick Actions ===== */}
      <div className="sidebar__actions">
        <a
          href={profile.resumeUrl}
          className="sidebar__action sidebar__action--resume"
          download
          aria-label="Download CV"
        >
          <FiDownload aria-hidden="true" />
          <span>Download CV</span>
        </a>
        <button
          type="button"
          className="sidebar__action sidebar__action--contact"
          onClick={() => onNavigate('contact')}
          aria-label="Get in touch"
        >
          <span>Hire Me</span>
          <FiArrowUpRight aria-hidden="true" />
        </button>
      </div>

      

      {/* ===== Mini Chess Game ===== */}
      <SidebarChess onExpand={openChessModal} />

      <div className="sidebar__divider" />

      {/* ===== Activity Sparkline ===== */}
      <div className="sidebar__activity">
        <div className="sidebar__activity-label">
          <span>Activity</span>
          <span>Recent Work</span>
        </div>
        <Sparkline />
      </div>

      {/* ===== Social Links ===== */}
      <div className="sidebar__socials">
        <a
          className="sidebar__social"
          href={socials.github}
          target="_blank"
          rel="noreferrer"
          aria-label="GitHub"
          title="GitHub"
        >
          <FaGithub />
          <span>GitHub</span>
        </a>

        <a
          className="sidebar__social"
          href={socials.linkedin}
          target="_blank"
          rel="noreferrer"
          aria-label="LinkedIn"
          title="LinkedIn"
        >
          <FaLinkedin />
          <span>LinkedIn</span>
        </a>

        <a
          className="sidebar__social"
          href={socials.messenger}
          target="_blank"
          rel="noreferrer"
          aria-label="Messenger"
          title="Messenger"
        >
          <FaFacebookMessenger />
          <span>Messenger</span>
        </a>

        <a
          className="sidebar__social"
          href={`mailto:${socials.email}`}
          aria-label="Email"
          title="Email"
        >
          <FiMail />
          <span>Email</span>
        </a>
      </div>

      {/* ===== Status Pill Footer ===== */}
      <div className="sidebar__status-pill">
        <span className="sidebar__status-pill-dot" />
        <span>{profile.statusNote}</span>
      </div>
    </aside>
  )
}
