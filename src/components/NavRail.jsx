import { useEffect, useState } from 'react'
import { FaLinkedin, FaFacebookMessenger, FaGithub, FaXTwitter } from 'react-icons/fa6'
import { HiOutlineMail } from 'react-icons/hi'
import { navItems } from '../data/nav'
import { socials } from '../data/profile'
import './NavRail.css'

function useClock() {
  const [time, setTime] = useState('')

  useEffect(() => {
    const update = () => {
      setTime(
        new Date().toLocaleTimeString('en-PH', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
          timeZone: 'Asia/Manila',
        })
      )
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [])

  return time
}

export default function NavRail({ activeSection, onNavigate, theme, onToggleTheme }) {
  const time = useClock()
  const activeIndex = Math.max(0, navItems.findIndex((item) => item.id === activeSection))

  return (
    <nav className="navrail" aria-label="Section navigation">
      <div className="navrail__toggle-row">
        <span className="navrail__toggle-label">Theme</span>
        <button
          type="button"
          className="navrail__switch"
          role="switch"
          aria-checked={theme === 'light'}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          onClick={onToggleTheme}
          data-theme={theme}
        />
      </div>

      <div className="navrail__list" style={{ '--active-index': activeIndex }}>
        {navItems.map(({ id, label, icon: Icon, color }, index) => {
          const isActive = activeSection === id
          return (
            <a
              key={id}
              href={`#${id}`}
              className={`navrail__item ${isActive ? 'is-active' : ''}`}
              style={{ '--item-color': color }}
              onClick={(e) => {
                e.preventDefault()
                onNavigate(id)
              }}
              aria-current={isActive ? 'page' : undefined}
            >
              <span className="navrail__idx">{String(index).padStart(2, '0')}</span>
              <span className="navrail__icon">
                <Icon aria-hidden="true" />
              </span>
              <span className="navrail__label">{label}</span>
              <span className="navrail__arrow" aria-hidden="true">
                &rarr;
              </span>
            </a>
          )
        })}
      </div>

      <div className="navrail__clock">
        <span>{time}</span>
        <span className="navrail__clock-badge">PH / UTC+8</span>
      </div>

      <div className="navrail__socials">
        <a
          className="navrail__social-btn"
          href={socials.linkedin}
          target="_blank"
          rel="noreferrer"
          aria-label="LinkedIn"
          data-tip="LinkedIn"
        >
          <FaLinkedin />
        </a>
        <a
          className="navrail__social-btn"
          href={socials.github}
          target="_blank"
          rel="noreferrer"
          aria-label="GitHub"
          data-tip="GitHub"
        >
          <FaGithub />
        </a>
        <a className="navrail__social-btn" href={`mailto:${socials.email}`} aria-label="Email" data-tip="Email">
          <HiOutlineMail />
        </a>
        <a
          className="navrail__social-btn"
          href={socials.messenger}
          target="_blank"
          rel="noreferrer"
          aria-label="Messenger"
          data-tip="Messenger"
        >
          <FaFacebookMessenger />
        </a>
        <a
          className="navrail__social-btn"
          href={socials.x}
          target="_blank"
          rel="noreferrer"
          aria-label="X / Twitter"
          data-tip="X / Twitter"
        >
          <FaXTwitter />
        </a>
      </div>
    </nav>
  )
}
