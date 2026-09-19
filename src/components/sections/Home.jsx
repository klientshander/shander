import { motion } from 'framer-motion'
import { profile, socials } from '../../data/profile'
import { projects } from '../../data/projects'
import { techGroups } from '../../data/techstacks'

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
  return (
    <div className="home-section">
      <motion.div
        className="home-hero"
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        custom={0}
      >
        {/* Main Title & Bio Paragraphs */}
        <motion.div className="home-hero__header" variants={fadeUp} custom={0.04}>
          <h1 className="home-hero__title">
            {profile.name}
          </h1>
          <p className="home-hero__subtitle">
            I'm a full-stack web developer. I build modern web & mobile apps, and these days I'm focused on clean system architecture, interactive UIs, and full-stack solutions.
          </p>
          <p className="home-hero__description">
            Right now I'm building cool new stuff every day. Currently a 2nd year BS Information Systems student at Mount Carmel College of Escalante City Inc. I love turning rough ideas into fast, functional products people actually use.
          </p>
        </motion.div>

        {/* Minimalist Lowercase Monospace Social Links */}
        <motion.div className="home-ref-links" variants={fadeUp} custom={0.1}>
          <a href={socials.github} target="_blank" rel="noreferrer" className="home-ref-link">
            github <span>↗</span>
          </a>
          <a href={socials.linkedin} target="_blank" rel="noreferrer" className="home-ref-link">
            linkedin <span>↗</span>
          </a>
          {socials.x && (
            <a href={socials.x} target="_blank" rel="noreferrer" className="home-ref-link">
              x <span>↗</span>
            </a>
          )}
          <a href={socials.messenger} target="_blank" rel="noreferrer" className="home-ref-link">
            messenger <span>↗</span>
          </a>
          <a href={`mailto:${socials.email}`} className="home-ref-link">
            email <span>↗</span>
          </a>
        </motion.div>

        {/* 4-Column Clean Stats Bar with Divider Borders */}
        <motion.div className="home-ref-stats" variants={fadeUp} custom={0.16}>
          <div className="home-ref-stat">
            <span className="home-ref-stat__num">
              {String(projects.length).padStart(2, '0')}+ <span className="home-ref-stat__arrow">↗</span>
            </span>
            <span className="home-ref-stat__label">PROJECTS</span>
          </div>
          <div className="home-ref-stat">
            <span className="home-ref-stat__num">
              2nd yr <span className="home-ref-stat__arrow">↗</span>
            </span>
            <span className="home-ref-stat__label">BS IS STUDENT</span>
          </div>
          <div className="home-ref-stat">
            <span className="home-ref-stat__num">
              Dean's <span className="home-ref-stat__arrow">↗</span>
            </span>
            <span className="home-ref-stat__label">LISTER</span>
          </div>
          <div className="home-ref-stat">
            <span className="home-ref-stat__num">
              {stackCount}+ <span className="home-ref-stat__arrow">↗</span>
            </span>
            <span className="home-ref-stat__label">TECH STACK</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
