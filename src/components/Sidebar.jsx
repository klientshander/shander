import { motion } from 'framer-motion'
import { FiMapPin, FiCheckCircle, FiArrowUpRight, FiMail } from 'react-icons/fi'
import { FaLinkedin, FaFacebookMessenger, FaGithub } from 'react-icons/fa6'
import { profile, socials } from '../data/profile'
import { techGroups } from '../data/techstacks'
import { techIconMap, fallbackTechIcon } from '../data/techIcons'
import TypingText from './ui/TypingText'
import Sparkline from './ui/Sparkline'
import './Sidebar.css'

// Pick a handful of standout skills for the sidebar preview grid.
const topSkillNames = ['PHP', 'HTML', 'JavaScript', 'CSS', 'MySQL', 'Laravel']
const allTech = techGroups.flatMap((group) => group.items)
const topSkills = topSkillNames
  .map((name) => allTech.find((item) => item.name === name))
  .filter(Boolean)

export default function Sidebar({ onNavigate, theme }) {
  const initials = profile.name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()

  const avatarSrc = theme === 'dark' ? '/gallery/batman.jpg' : profile.avatar

  return (
    <aside className="sidebar">
      <div className="sidebar__avatar-wrap sidebar__avatar-wrap--batman">
        <span className="sidebar__avatar-channel sidebar__avatar-channel--default">CH.00</span>
        <span className="sidebar__avatar-channel sidebar__avatar-channel--bat">GOTHAM</span>
        <span className="sidebar__avatar-frame" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </span>

        <motion.div
          className="sidebar__avatar"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        >
          {avatarSrc ? (
            <motion.img
              key={avatarSrc}
              src={avatarSrc}
              alt={profile.name}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
          ) : (
            <span>{initials}</span>
          )}

          {/* Bat-signal overlay: hidden by default, glows in on hover */}
          <span className="sidebar__avatar-batsignal" aria-hidden="true" />
          <span className="sidebar__avatar-bat" aria-hidden="true">
            <svg viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
              {/* Generic bat silhouette: two swept wings + small body + ears */}
              <path d="
                M100 42
                C 92 20, 60 4, 20 10
                C 45 16, 62 26, 70 38
                C 50 32, 22 30, 0 40
                C 26 40, 52 48, 68 56
                C 56 56, 40 60, 30 66
                C 48 66, 64 62, 78 54
                C 84 62, 92 66, 100 68
                C 108 66, 116 62, 122 54
                C 136 62, 152 66, 170 66
                C 160 60, 144 56, 132 56
                C 148 48, 174 40, 200 40
                C 178 30, 150 32, 130 38
                C 138 26, 155 16, 180 10
                C 140 4, 108 20, 100 42
                Z
              "/>
              <ellipse cx="94" cy="46" rx="3.2" ry="4.4"/>
              <ellipse cx="106" cy="46" rx="3.2" ry="4.4"/>
              <path d="M91 34 L96 24 L99 36 Z"/>
              <path d="M109 34 L104 24 L101 36 Z"/>
            </svg>
          </span>
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

        <span className="sidebar__badge-pill">{profile.role}</span>
      </div>

      <div className="sidebar__availability">
        <span className="sidebar__availability-copy">
          <span className="sidebar__availability-dot" aria-hidden="true" />
          <span>
            <strong>{profile.availability.open ? 'Available for work' : 'Not currently available'}</strong>
            <small>{profile.availability.note}</small>
          </span>
        </span>
        <button type="button" className="sidebar__hire" onClick={() => onNavigate('contact')}>
          Hire Me <FiArrowUpRight aria-hidden="true" />
        </button>
      </div>

      <div className="sidebar__actions">
        <button type="button" className="sidebar__action" onClick={() => onNavigate('contact')}>
          <FiArrowUpRight aria-hidden="true" />
          Contact
        </button>
        <a className="sidebar__action" href={`mailto:${socials.email}`}>
          <FiMail aria-hidden="true" />
          Email
        </a>
      </div>

      <div className="sidebar__skills">
        <div className="sidebar__section-title">
          Top Skills
          <button type="button" onClick={() => onNavigate('techstacks')}>
            View all
          </button>
        </div>
        <div className="sidebar__skill-grid">
          {topSkills.map((skill) => {
            const Icon = techIconMap[skill.icon] ?? fallbackTechIcon
            return (
              <div className="sidebar__skill" key={skill.name}>
                <span className="sidebar__skill-icon">
                  <Icon aria-hidden="true" />
                </span>
                <b>{skill.name}</b>
              </div>
            )
          })}
        </div>
      </div>

      <div className="sidebar__divider" />

      <div className="sidebar__activity">
        <div className="sidebar__activity-label">
          Activity <span>This year</span>
        </div>
        <Sparkline />
      </div>

      <div className="sidebar__socials">
        <a
          className="sidebar__social"
          href={socials.github}
          target="_blank"
          rel="noreferrer"
          aria-label="GitHub"
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
        >
          <FaFacebookMessenger />
          <span>Messenger</span>
        </a>

        <a className="sidebar__social" href={`mailto:${socials.email}`} aria-label="Email">
          <FiMail />
          <span>Email</span>
        </a>
      </div>

      <div className="sidebar__status-pill">
        <span className="sidebar__status-pill-dot" />
        {profile.statusNote}
      </div>
    </aside>
  )
}