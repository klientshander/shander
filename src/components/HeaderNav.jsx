import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiCommand, FiSun, FiMoon, FiMenu, FiX, FiArrowUpRight } from 'react-icons/fi'
import { FaLinkedin, FaGithub, FaFacebookMessenger } from 'react-icons/fa6'
import { headerNavItems, navItems } from '../data/nav'
import { profile, socials } from '../data/profile'
import { useUI } from '../context/UIContext'
import './HeaderNav.css'

export default function HeaderNav({ activeSection, onNavigate, theme, onToggleTheme }) {
  const { openCmd } = useUI()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleNavClick = (id) => {
    onNavigate(id)
    setMobileMenuOpen(false)
  }

  const isLight = theme === 'light'

  return (
    <header className="headernav">
      <div className="headernav__container">
        {/* Brand / Logo */}
        <div className="headernav__brand" onClick={() => handleNavClick('home')}>
          <div className="headernav__logo">
            <img src="/favicon.svg" alt="logo" className="headernav__logo-img" />
          </div>
          <div className="headernav__brand-info">
            <span className="headernav__brand-name">{profile.name}</span>
            <span className="headernav__brand-status">
              <span className="headernav__status-dot" />
              <span>{profile.availability.open ? 'Available' : 'Busy'}</span>
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="headernav__nav" aria-label="Main navigation">
          {headerNavItems.map(({ id, label, icon: Icon, color }, index) => {
            const isActive = activeSection === id
            return (
              <a
                key={id}
                href={`#${id}`}
                className={`headernav__link ${isActive ? 'is-active' : ''}`}
                style={{ '--item-color': color }}
                onClick={(e) => {
                  e.preventDefault()
                  handleNavClick(id)
                }}
                aria-current={isActive ? 'page' : undefined}
              >
                <span className="headernav__link-idx">{String(index + 1).padStart(2, '0')}</span>
                <span className="headernav__link-icon">
                  <Icon aria-hidden="true" />
                </span>
                <span className="headernav__link-label">{label}</span>
                {isActive && (
                  <motion.span
                    layoutId="headernav-active-pill"
                    className="headernav__active-pill"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </a>
            )
          })}
        </nav>

        {/* Right Tools & Actions */}
        <div className="headernav__actions">
        
          {/* Custom Designed Theme Toggle Switch */}
          <button
            type="button"
            className={`theme-toggle ${isLight ? 'theme-toggle--light' : 'theme-toggle--dark'}`}
            onClick={onToggleTheme}
            aria-label={`Switch to ${isLight ? 'dark' : 'light'} mode`}
            title={`Switch to ${isLight ? 'dark' : 'light'} mode (Press D)`}
          >
            <div className="theme-toggle__track">
              {/* Background ambient symbols */}
              <span className="theme-toggle__ambient theme-toggle__ambient--sun" aria-hidden="true">
                <FiSun />
              </span>
              <span className="theme-toggle__ambient theme-toggle__ambient--moon" aria-hidden="true">
                <FiMoon />
              </span>

              {/* Sliding glowing knob */}
              <motion.div
                className="theme-toggle__thumb"
                layout
                transition={{ type: 'spring', stiffness: 450, damping: 28 }}
              >
                <motion.div
                  key={theme}
                  initial={{ rotate: -40, scale: 0.7, opacity: 0 }}
                  animate={{ rotate: 0, scale: 1, opacity: 1 }}
                  exit={{ rotate: 40, scale: 0.7, opacity: 0 }}
                  transition={{ duration: 0.22 }}
                  className="theme-toggle__thumb-icon"
                >
                  {isLight ? <FiSun /> : <FiMoon />}
                </motion.div>
              </motion.div>
            </div>
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            className="headernav__btn headernav__btn--menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="headernav__drawer"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="headernav__drawer-list">
              {navItems.map(({ id, label, icon: Icon, color }, index) => {
                const isActive = activeSection === id
                return (
                  <button
                    type="button"
                    key={id}
                    className={`headernav__drawer-item ${isActive ? 'is-active' : ''}`}
                    style={{ '--item-color': color }}
                    onClick={() => handleNavClick(id)}
                  >
                    <span className="headernav__drawer-idx">{String(index + 1).padStart(2, '0')}</span>
                    <span className="headernav__drawer-icon">
                      <Icon aria-hidden="true" />
                    </span>
                    <span className="headernav__drawer-label">{label}</span>
                    <span className="headernav__drawer-arrow">&rarr;</span>
                  </button>
                )
              })}
            </div>

            <div className="headernav__drawer-footer">
              <div className="headernav__drawer-socials">
                <a href={socials.github} target="_blank" rel="noreferrer" aria-label="GitHub">
                  <FaGithub />
                </a>
                <a href={socials.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
                  <FaLinkedin />
                </a>
                <a href={socials.messenger} target="_blank" rel="noreferrer" aria-label="Messenger">
                  <FaFacebookMessenger />
                </a>
              </div>
              <button
                type="button"
                className="headernav__drawer-contact-btn"
                onClick={() => handleNavClick('contact')}
              >
                Get in Touch <FiArrowUpRight />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
