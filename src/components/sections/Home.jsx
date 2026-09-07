import { motion } from 'framer-motion'
import {
  FiDownload,
  FiArrowUpRight,
  FiCommand,
  FiFolder,
  FiCode,
  FiAward,
  FiImage,
} from 'react-icons/fi'
import { SiPhp, SiLaravel, SiReact, SiMysql, SiHtml5, SiCss, SiJavascript } from 'react-icons/si'
import { profile, socials } from '../../data/profile'
import { projects } from '../../data/projects'
import { techGroups } from '../../data/techstacks'
import { certifications } from '../../data/certifications'
import { useUI } from '../../context/UIContext'
import TypingText from '../ui/TypingText'
import Marquee from '../ui/Marquee'

const coreSkills = [
  { name: 'PHP', icon: SiPhp },
  { name: 'Laravel', icon: SiLaravel },
  { name: 'React', icon: SiReact },
  { name: 'MySQL', icon: SiMysql },
  { name: 'HTML5', icon: SiHtml5 },
  { name: 'CSS3', icon: SiCss },
  { name: 'JavaScript', icon: SiJavascript },
]

const stackCount = techGroups.reduce((total, group) => total + group.items.length, 0)

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay, ease: 'easeOut' },
  }),
}

export default function Home({ onNavigate }) {
  const { openCmd } = useUI()

  const stats = [
    { label: 'Projects Built', value: String(projects.length).padStart(2, '0') },
    { label: 'Tools & Techs', value: String(stackCount).padStart(2, '0') },
    { label: 'Certifications', value: String(certifications.length).padStart(2, '0') },
    { label: 'Academic Standing', value: 'Dean\'s List' },
  ]

  const quickJumpCards = [
    {
      id: 'projects',
      title: 'Featured Projects',
      desc: 'Explore web apps, hospital management systems, dashboards & e-commerce.',
      icon: FiFolder,
      count: `${projects.length} Projects`,
      color: 'var(--hue-projects)',
    },
    {
      id: 'techstacks',
      title: 'Skills & Tech Stacks',
      desc: 'Languages, frameworks, databases, developer tools & proficiency radar.',
      icon: FiCode,
      count: `${stackCount} Tools`,
      color: 'var(--hue-stack)',
    },
    {
      id: 'certification',
      title: 'Certifications & Honors',
      desc: 'Academic recognition, NCII credentials, and technical workshops.',
      icon: FiAward,
      count: `${certifications.length} Credentials`,
      color: 'var(--hue-cert)',
    },
    {
      id: 'gallery',
      title: 'Moments & Gallery',
      desc: 'Campus life, hackathons, team collaborations, and project milestones.',
      icon: FiImage,
      count: 'Memories',
      color: 'var(--hue-gallery)',
    },
  ]

  return (
    <div className="home-section">
      <motion.div
        className="home-hero"
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        custom={0}
      >
        {/* Status Badge */}
        <motion.div className="home-hero__badge-row" variants={fadeUp} custom={0.04}>
        </motion.div>

        {/* Hero Title & Subtitle */}
        <motion.div className="home-hero__header" variants={fadeUp} custom={0.08}>
          <h1 className="home-hero__title">
            {profile.name}
          </h1>
          <p className="home-hero__subtitle">
            I'm a web developer & software builder. Currently a 2nd year student at Mount Carmel College of Escalante City Inc.
          </p>
        </motion.div>

        {/* Hero Summary */}
        <motion.p className="home-hero__description" variants={fadeUp} custom={0.12}>
          {profile.tagline} Focused on building modern, functional web applications with <strong>PHP</strong>, <strong>Laravel</strong>, <strong>React</strong>, and <strong>MySQL</strong>.
        </motion.p>

        {/* Minimalist Lowercase Social Links inspired by reference */}
        <motion.div className="home-ref-links" variants={fadeUp} custom={0.15}>
          <a href={socials.github} target="_blank" rel="noreferrer" className="home-ref-link">
            github ↗
          </a>
          <a href={socials.linkedin} target="_blank" rel="noreferrer" className="home-ref-link">
            linkedin ↗
          </a>
          <a href={socials.messenger} target="_blank" rel="noreferrer" className="home-ref-link">
            messenger ↗
          </a>
          <a href={`mailto:${socials.email}`} className="home-ref-link">
            email ↗
          </a>
        </motion.div>

        {/* Call to Actions */}
        <motion.div className="home-hero__cta-group" variants={fadeUp} custom={0.18}>
          <button
            type="button"
            className="btn btn--outline btn--lg"
            onClick={() => onNavigate('projects')}
          >
            <FiFolder aria-hidden="true" />
            View Projects
          </button>
          <button
            type="button"
            className="btn btn--outline btn--lg"
            onClick={() => onNavigate('contact')}
          >
            <FiArrowUpRight aria-hidden="true" />
            Get in Touch
          </button>
          <button
            type="button"
            className="btn btn--outline btn--cmd-hint"
            onClick={openCmd}
            title="Quick section finder"
          >
            <FiCommand aria-hidden="true" />
            <span>⌘K</span>
          </button>
        </motion.div>

        {/* Clean Reference Stats Row */}
        <motion.div className="home-ref-stats" variants={fadeUp} custom={0.22}>
          <div className="home-ref-stat">
            <span className="home-ref-stat__num">{projects.length} ↗</span>
            <span className="home-ref-stat__label">PROJECTS</span>
          </div>
          <div className="home-ref-stat">
            <span className="home-ref-stat__num">2nd yr ↗</span>
            <span className="home-ref-stat__label">BS IS STUDENT</span>
          </div>
          <div className="home-ref-stat">
            <span className="home-ref-stat__num">Dean's ↗</span>
            <span className="home-ref-stat__label">LISTER</span>
          </div>
          <div className="home-ref-stat">
            <span className="home-ref-stat__num">{stackCount}+ ↗</span>
            <span className="home-ref-stat__label">TECH STACK</span>
          </div>
        </motion.div>

        {/* Live Marquee */}
        <motion.div className="home-hero__marquee" variants={fadeUp} custom={0.25}>
          <Marquee items={profile.currentlyBuilding} />
        </motion.div>

        {/* Core Stack Highlights */}
        <motion.div className="home-skills-row" variants={fadeUp} custom={0.28}>
          <span className="home-skills-row__label">Core Arsenal:</span>
          <div className="home-skills-row__chips">
            {coreSkills.map(({ name, icon: Icon }) => (
              <span className="chip chip--icon home-skill-chip" key={name}>
                <Icon aria-hidden="true" />
                {name}
              </span>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

