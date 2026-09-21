import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiShoppingBag,
  FiFileText,
  FiBookOpen,
  FiBriefcase,
  FiUsers,
  FiImage,
  FiGlobe,
  FiChevronDown,
  FiMessageSquare,
  FiSun,
  FiMoon,
  FiVolume2,
  FiVolumeX,
  FiMail,
} from 'react-icons/fi'
import {
  FaGithub,
  FaLinkedin,
  FaXTwitter,
  FaFacebookMessenger,
  FaBehance,
  FaCodepen,
} from 'react-icons/fa6'
import { LuMonitor } from 'react-icons/lu'
import { profile, socials } from '../data/profile'
import { useUI } from '../context/UIContext'
import { playClickSound, playHoverSound } from '../utils/sound'
import './Sidebar.css'

export default function Sidebar({
  activeSection = 'home',
  onNavigate,
  theme,
  onToggleTheme,
  soundEnabled,
  onToggleSound,
  soundProfile = 'tactile',
  onCycleSoundProfile,
}) {
  const { openChessModal, openCmd, openChatModal, openSnippetModal } = useUI()
  const [viewersCount, setViewersCount] = useState(2)
  const [platformsOpen, setPlatformsOpen] = useState(false)

  useEffect(() => {
    // Dynamic slight variance for live visitors
    const interval = setInterval(() => {
      setViewersCount((prev) =>
        Math.random() > 0.5 ? Math.min(4, Math.max(1, prev + (Math.random() > 0.5 ? 1 : -1))) : prev
      )
    }, 14000)
    return () => clearInterval(interval)
  }, [])

  // Primary navigation group
  const primaryNav = [
    { id: 'shop', label: 'Shop', icon: FiShoppingBag },
    { id: 'platform', label: 'Platform', icon: FiGlobe, isExpandable: true },
    { id: 'freelance', label: 'Freelance', icon: FiBriefcase },
    { id: 'resources', label: 'Resources', icon: FiBookOpen },
  ]

  const platformList = [
    { name: 'GitHub', url: socials.github || 'https://github.com/klientshander', icon: FaGithub },
    { name: 'LinkedIn', url: socials.linkedin || 'https://linkedin.com/in/klientshander-santillan-78a3653a4/', icon: FaLinkedin },
    { name: 'X / Twitter', url: socials.x || 'https://x.com/klientshan600', icon: FaXTwitter },
    { name: 'Messenger', url: socials.messenger || 'https://www.facebook.com/', icon: FaFacebookMessenger },
    { name: 'Behance', url: 'https://behance.net', icon: FaBehance },
    { name: 'CodePen', url: 'https://codepen.io', icon: FaCodepen },
  ]

  // Secondary navigation group (Services, Gallery & CV)
  const secondaryNav = [
    { id: 'contact', label: 'Collabs', icon: FiUsers },
    { id: 'gallery', label: 'Gallery', icon: FiImage },
    { id: 'cv', label: 'my CV', icon: FiFileText },
  ]

  return (
    <aside className="sidebar">
      {/* ===== Top Brand with User Logo ===== */}
      <div className="sidebar__brand">
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="sidebar__brand-btn"
          title="Back to top / Home"
        >
          <div className="sidebar__brand-logo" aria-hidden="true">
            <img src="/favicon.svg" alt="logo" className="sidebar__brand-logo-img" />
          </div>
          <div className="sidebar__brand-meta">
            <span className="sidebar__brand-name">{profile.name}</span>
            <span className="sidebar__brand-status">
              <span className="sidebar__brand-status-dot" />
              {profile.availability.open ? 'Available' : 'Busy'}
            </span>
          </div>
        </button>
      </div>

      {/* ===== Navigation Groups ===== */}
      <div className="sidebar__nav-container">
        {/* Main Group 1 */}
        <nav className="sidebar__nav-group" aria-label="Main Portfolio Navigation">
          {primaryNav.map((item) => {
            const Icon = item.icon

            if (item.isExpandable) {
              return (
                <div key={item.id} className="sidebar__platform-wrap">
                  <button
                    type="button"
                    className={`sidebar__nav-row sidebar__nav-item ${platformsOpen ? 'is-active' : ''}`}
                    onClick={() => {
                      playClickSound()
                      setPlatformsOpen(!platformsOpen)
                    }}
                    onMouseEnter={playHoverSound}
                    aria-expanded={platformsOpen}
                    title="View platforms & socials"
                  >
                    <AnimatePresence initial={false}>
                      {platformsOpen && (
                        <motion.span
                          className="sidebar__nav-arrow"
                          initial={{ width: 0, opacity: 0, marginRight: 0 }}
                          animate={{ width: 'auto', opacity: 1, marginRight: 8 }}
                          exit={{ width: 0, opacity: 0, marginRight: 0 }}
                          transition={{ duration: 0.18, ease: 'easeOut' }}
                          aria-hidden="true"
                        >
                          →
                        </motion.span>
                      )}
                    </AnimatePresence>
                    <Icon className="sidebar__nav-icon" aria-hidden="true" />
                    <span className="sidebar__nav-label">{item.label}</span>
                    <FiChevronDown
                      className={`sidebar__nav-chevron ${platformsOpen ? 'is-open' : ''}`}
                      aria-hidden="true"
                    />
                  </button>

                  <AnimatePresence>
                    {platformsOpen && (
                      <motion.div
                        className="sidebar__platform-sublist"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                      >
                        {platformList.map((platform) => {
                          const PIcon = platform.icon
                          return (
                            <a
                              key={platform.name}
                              href={platform.url}
                              target="_blank"
                              rel="noreferrer"
                              className="sidebar__platform-link"
                              title={`Visit my ${platform.name}`}
                              onClick={playClickSound}
                              onMouseEnter={playHoverSound}
                            >
                              <PIcon className="sidebar__platform-link-icon" aria-hidden="true" />
                              <span>{platform.name}</span>
                              <span className="sidebar__platform-link-arrow" aria-hidden="true">↗</span>
                            </a>
                          )
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            }

            const isTargetActive = activeSection === item.id
            return (
              <button
                key={item.id}
                type="button"
                className={`sidebar__nav-row sidebar__nav-item ${isTargetActive ? 'is-active' : ''}`}
                onClick={() => {
                  playClickSound()
                  onNavigate(item.id)
                }}
                onMouseEnter={playHoverSound}
              >
                <AnimatePresence initial={false}>
                  {isTargetActive && (
                    <motion.span
                      className="sidebar__nav-arrow"
                      initial={{ width: 0, opacity: 0, marginRight: 0 }}
                      animate={{ width: 'auto', opacity: 1, marginRight: 8 }}
                      exit={{ width: 0, opacity: 0, marginRight: 0 }}
                      transition={{ duration: 0.18, ease: 'easeOut' }}
                      aria-hidden="true"
                    >
                      →
                    </motion.span>
                  )}
                </AnimatePresence>
                <Icon className="sidebar__nav-icon" aria-hidden="true" />
                <span className="sidebar__nav-label">{item.label}</span>
              </button>
            )
          })}
        </nav>

        {/* Secondary Group 2 */}
        <nav className="sidebar__nav-group sidebar__nav-group--secondary" aria-label="Services and Collabs">
          {secondaryNav.map((item) => {
            const Icon = item.icon
            const isTargetActive = activeSection === item.id
            return (
              <button
                key={item.id}
                type="button"
                className={`sidebar__nav-row sidebar__nav-item ${isTargetActive ? 'is-active' : ''}`}
                onClick={() => {
                  playClickSound()
                  onNavigate(item.id)
                }}
                onMouseEnter={playHoverSound}
              >
                <AnimatePresence initial={false}>
                  {isTargetActive && (
                    <motion.span
                      className="sidebar__nav-arrow"
                      initial={{ width: 0, opacity: 0, marginRight: 0 }}
                      animate={{ width: 'auto', opacity: 1, marginRight: 8 }}
                      exit={{ width: 0, opacity: 0, marginRight: 0 }}
                      transition={{ duration: 0.18, ease: 'easeOut' }}
                      aria-hidden="true"
                    >
                      →
                    </motion.span>
                  )}
                </AnimatePresence>
                <Icon className="sidebar__nav-icon" aria-hidden="true" />
                <span className="sidebar__nav-label">{item.label}</span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* ===== Action Shortcuts ===== */}
      <div className="sidebar__shortcuts">
        <button
          type="button"
          className="sidebar__shortcut-row"
          onClick={openChessModal}
          title="Play chess with me (Alt + K)"
        >
          <span className="sidebar__shortcut-title">Play chess with me</span>
          <span className="sidebar__shortcut-kbd">
            <kbd>Alt</kbd>
            <span>+</span>
            <kbd>K</kbd>
          </span>
        </button>

        <button
          type="button"
          className="sidebar__shortcut-row"
          onClick={() => {
            playClickSound()
            openSnippetModal()
          }}
          onMouseEnter={playHoverSound}
          title="Code Snippet Guesser (Alt + J)"
        >
          <span className="sidebar__shortcut-title">Code Snippet</span>
          <span className="sidebar__shortcut-kbd">
            <kbd>Alt</kbd>
            <span>+</span>
            <kbd>J</kbd>
          </span>
        </button>
      </div>

      <div className="sidebar__divider" />

      {/* ===== Presence & Community Chat ===== */}
      <div className="sidebar__presence-section">
        <div className="sidebar__avatars-row">
          <div className="sidebar__avatar-wrap">
            <img
              src="/avatars/boy.svg"
              alt="Visitor Boy"
              className="sidebar__avatar"
            />
          </div>
          <div className="sidebar__avatar-wrap sidebar__avatar-wrap--overlap">
            <img
              src="/avatars/girl.svg"
              alt="Visitor Girl"
              className="sidebar__avatar"
            />
          </div>
        </div>

        <div className="sidebar__presence-label">
          <strong>{viewersCount}</strong> {viewersCount === 1 ? 'person' : 'people'} viewing now
        </div>

        <button
          type="button"
          onClick={openChatModal}
          className="sidebar__chat-row"
          title="Open Conversation Hub"
        >
          <FiMessageSquare className="sidebar__chat-icon" aria-hidden="true" />
          <span>Conversation Hub</span>
        </button>
      </div>

      <div className="sidebar__divider" />

      {/* ===== Controls & Footer Contact ===== */}
      <div className="sidebar__bottom">
        <div className="sidebar__controls-row">
          <div className="sidebar__theme-pill">
            <button
              type="button"
              className="sidebar__pill-btn"
              onClick={onToggleTheme}
              title="System Theme"
              aria-label="System theme"
            >
              <LuMonitor aria-hidden="true" />
            </button>
            <button
              type="button"
              className={`sidebar__pill-btn ${theme === 'light' ? 'is-active' : ''}`}
              onClick={onToggleTheme}
              title="Light theme"
              aria-label="Light theme"
            >
              <FiSun aria-hidden="true" />
            </button>
            <button
              type="button"
              className={`sidebar__pill-btn ${theme === 'dark' ? 'is-active' : ''}`}
              onClick={onToggleTheme}
              title="Dark theme"
              aria-label="Dark theme"
            >
              <FiMoon aria-hidden="true" />
            </button>
          </div>

          <div className="sidebar__sound-group">
            <button
              type="button"
              className={`sidebar__sound-btn ${soundEnabled ? 'is-active' : ''}`}
              onClick={onToggleSound}
              title={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
              aria-label="Toggle sound"
            >
              {soundEnabled ? <FiVolume2 aria-hidden="true" /> : <FiVolumeX aria-hidden="true" />}
            </button>

            {soundEnabled && onCycleSoundProfile && (
              <button
                type="button"
                className="sidebar__sound-mode-pill"
                onClick={onCycleSoundProfile}
                title={`Sound Effect: ${
                  soundProfile === 'tactile'
                    ? 'Tactile Switch'
                    : soundProfile === 'pop'
                    ? 'Haptic Pop'
                    : 'Minimal Thud'
                }. Click to switch sound effect!`}
                aria-label="Change sound effect"
              >
                <span className="sidebar__sound-mode-dot" />
                <span>
                  {soundProfile === 'tactile'
                    ? 'Tactile'
                    : soundProfile === 'pop'
                    ? 'Pop'
                    : 'Thud'}
                </span>
              </button>
            )}
          </div>
        </div>

        <div className="sidebar__contact">
          <p className="sidebar__contact-text">
            For work, collabs &amp; everything<br />
            else, reach me at
          </p>
          <a
            href={`mailto:${socials.email}`}
            className="sidebar__email-link"
            title={`Send Email to ${socials.email}`}
          >
            <FiMail className="sidebar__email-icon" aria-hidden="true" />
            <span>{socials.email}</span>
          </a>
        </div>
      </div>
    </aside>
  )
}
