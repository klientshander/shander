import { useRef, useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { profile, socials } from '../../data/profile'
import { projects } from '../../data/projects'
import { techGroups } from '../../data/techstacks'
import { playHoverSound, playClickSound } from '../../utils/sound'

const stackCount = techGroups.reduce((total, group) => total + group.items.length, 0)

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay, ease: 'easeOut' },
  }),
}

export default function Home() {
  const avatarSrc = profile.avatar || '/gallery/shander.png'
  const videoRef = useRef(null)
  const [isVideoActive, setIsVideoActive] = useState(false)

  // Direct switch: Immediately show & play hero video on hover (no fade-in animation)
  const handleMouseEnter = useCallback(() => {
    setIsVideoActive(true)
    playHoverSound()

    if (videoRef.current) {
      videoRef.current.currentTime = 0
      const playPromise = videoRef.current.play()
      if (playPromise !== undefined) {
        playPromise.catch(() => {})
      }
    }
  }, [])

  // Direct switch: Immediately return to profile photo when cursor leaves
  const handleMouseLeave = useCallback(() => {
    setIsVideoActive(false)

    if (videoRef.current) {
      videoRef.current.pause()
    }
  }, [])

  // Mobile / Touch support: tap to toggle video playback
  const handleTouchToggle = useCallback(() => {
    playClickSound()
    if (!isVideoActive) {
      handleMouseEnter()
    } else {
      handleMouseLeave()
    }
  }, [isVideoActive, handleMouseEnter, handleMouseLeave])

  // Pause video on unmount
  useEffect(() => {
    return () => {
      if (videoRef.current) {
        videoRef.current.pause()
      }
    }
  }, [])

  return (
    <div className="home-section">
      <motion.div
        className="home-hero"
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        custom={0}
      >
        {/* Main 2-Column Hero: Left Portrait, Right Info */}
        <div className="home-hero__content">
          <motion.div
            className="home-hero__portrait-wrap"
            variants={fadeUp}
            custom={0.02}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleTouchToggle}
            role="button"
            tabIndex={0}
            aria-label="Toggle profile hero video"
          >
            <div className="home-hero__portrait-inner">
              <img
                src={avatarSrc}
                alt={profile.name}
                className={`home-hero__portrait ${isVideoActive ? 'is-hidden' : ''}`}
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />

              <video
                ref={videoRef}
                className={`home-hero__video ${isVideoActive ? 'is-active' : ''}`}
                muted
                loop
                playsInline
                preload="auto"
                aria-hidden="true"
              >
                <source src="/videos/hero.mp4" type="video/mp4" />
                <source src="/video/hero.mp4" type="video/mp4" />
              </video>
            </div>
          </motion.div>

          <motion.div className="home-hero__info" variants={fadeUp} custom={0.06}>
            <h1 className="home-hero__title">{profile.name}</h1>
            
            <p className="home-hero__bio">
              I'm a full-stack web developer. I build modern web &amp; mobile apps, and these days I'm focused on clean system architecture, interactive UIs, and full-stack solutions.
            </p>
            
            <p className="home-hero__sub-bio">
              Right now I'm building cool new stuff every day. Currently a 2nd year BS Information Systems student at Mount Carmel College of Escalante City Inc. I love turning rough ideas into fast, functional products people actually use.
            </p>

            {/* Minimalist Lowercase Monospace Social Links: github ↗  linkedin ↗  x ↗  messenger ↗  email ↗ */}
            <div className="home-hero__socials">
              <a href={socials.github} target="_blank" rel="noopener noreferrer" className="home-hero__social-link">
                github <span>↗</span>
              </a>
              <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" className="home-hero__social-link">
                linkedin <span>↗</span>
              </a>
              {socials.x && (
                <a href={socials.x} target="_blank" rel="noopener noreferrer" className="home-hero__social-link">
                  x <span>↗</span>
                </a>
              )}
              {socials.messenger && (
                <a href={socials.messenger} target="_blank" rel="noopener noreferrer" className="home-hero__social-link">
                  messenger <span>↗</span>
                </a>
              )}
              <a href={`mailto:${socials.email}`} className="home-hero__social-link">
                email <span>↗</span>
              </a>
            </div>
          </motion.div>
        </div>

        {/* 4-Column Clean Stats Bar matching Bryl Lim reference */}
        <motion.div className="home-ref-stats" variants={fadeUp} custom={0.14}>
          <div className="home-ref-stat">
            <div className="home-ref-stat__head">
              <span className="home-ref-stat__num">{String(projects.length).padStart(2, '0')}+</span>
              <svg className="home-ref-stat__arrow" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M5 11L11 5H6M11 5V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="home-ref-stat__label">projects</div>
          </div>

          <div className="home-ref-stat">
            <div className="home-ref-stat__head">
              <span className="home-ref-stat__num">2nd yr</span>
              <svg className="home-ref-stat__arrow" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M5 11L11 5H6M11 5V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="home-ref-stat__label">bs is student</div>
          </div>

          <div className="home-ref-stat">
            <div className="home-ref-stat__head">
              <span className="home-ref-stat__num">Dean's</span>
              <svg className="home-ref-stat__arrow" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M5 11L11 5H6M11 5V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="home-ref-stat__label">lister</div>
          </div>

          <div className="home-ref-stat">
            <div className="home-ref-stat__head">
              <span className="home-ref-stat__num">{stackCount}+</span>
              <svg className="home-ref-stat__arrow" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M5 11L11 5H6M11 5V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="home-ref-stat__label">tech stack</div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
