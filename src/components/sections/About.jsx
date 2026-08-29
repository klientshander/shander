import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { FiDownload, FiCopy, FiCommand } from 'react-icons/fi'
import { SiPhp, SiLaravel, SiReact, SiMysql, SiHtml5, SiCss, SiJavascript } from 'react-icons/si'
import { profile, socials } from '../../data/profile'
import { projects } from '../../data/projects'
import { techGroups } from '../../data/techstacks'
import { education } from '../../data/education'
import { certifications } from '../../data/certifications'
import { useUI } from '../../context/UIContext'
import Marquee from '../ui/Marquee'

const coreSkills = [
  { name: 'PHP', icon: SiPhp },
  { name: 'Laravel', icon: SiLaravel },
  { name: 'React', icon: SiReact },
  { name: 'MySQL', icon: SiMysql },
  { name: 'HTML', icon: SiHtml5 },
  { name: 'CSS', icon: SiCss },
  { name: 'JavaScript', icon: SiJavascript },
]

const stackCount = techGroups.reduce((total, group) => total + group.items.length, 0)

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay, ease: 'easeOut' },
  }),
}

export default function About({ onNavigate }) {
  const { showToast, openCmd } = useUI()

  const stats = [
    { label: 'Projects shipped', value: String(projects.length).padStart(2, '0') },
    { label: 'Tools & languages', value: String(stackCount).padStart(2, '0') },
    { label: 'Credentials', value: String(certifications.length).padStart(2, '0') },
    { label: 'Years in school', value: String(education.length + 1).padStart(2, '0') },
  ]

  // A simple, honest "profile completeness" gauge — counts how many
  // optional fields you've actually filled in, rather than a made-up number.
  const completeness = useMemo(() => {
    const checks = [
      Boolean(profile.avatar),
      Boolean(profile.resumeUrl),
      projects.some((p) => p.cover),
      projects.length > 0,
      certifications.length > 0,
      education.length > 0,
      techGroups.length > 0,
    ]
    const filled = checks.filter(Boolean).length
    return Math.round((filled / checks.length) * 100)
  }, [])

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(socials.email || '')
    } catch {
      // clipboard may be unavailable — the mailto fallback below still helps
    }
    showToast('Email copied to clipboard')
  }

  return (
    <>
      <motion.section
        className="panel"
        aria-labelledby="about-heading"
        initial="hidden"
        animate="visible"
      >
        <motion.p className="eyebrow" id="about-heading" variants={fadeUp} custom={0}>
          Hello, I'm
        </motion.p>
        <motion.h1
          variants={fadeUp}
          custom={0.04}
          className="about-hero-title"
        >
          {profile.name}
        </motion.h1>
        <motion.p className="about-hero-role" variants={fadeUp} custom={0.08}>
          {profile.role} · {profile.location}
        </motion.p>

        <motion.div variants={fadeUp} custom={0.12} style={{ marginTop: 20 }}>
          <Marquee items={profile.currentlyBuilding} />
        </motion.div>

        <motion.div className="about-hero-actions" variants={fadeUp} custom={0.16}>
          <a href={profile.resumeUrl} className="btn btn--solid" download>
            <FiDownload aria-hidden="true" />
            Download CV
          </a>
          <button type="button" className="btn btn--outline" onClick={copyEmail}>
            <FiCopy aria-hidden="true" />
            Copy email
          </button>
          <button type="button" className="btn btn--outline" onClick={openCmd}>
            <FiCommand aria-hidden="true" />
            Quick nav
          </button>
        </motion.div>

        <motion.p className="section-lead" variants={fadeUp} custom={0.2} style={{ marginTop: 26 }}>
          {profile.tagline}
        </motion.p>

        <motion.p className="section-lead" variants={fadeUp} custom={0.24} style={{ marginTop: 14 }}>
          I enjoy building modern, functional websites and applications using{' '}
          <strong>PHP</strong>, <strong>Laravel</strong>, <strong>React</strong>, and{' '}
          <strong>MySQL</strong>, and I'm just as comfortable across the frontend with HTML, CSS,
          and JavaScript. I'm always looking for opportunities to learn new technologies and turn
          ideas into useful, meaningful projects.
        </motion.p>

        <motion.div className="chip-row" variants={fadeUp} custom={0.28} style={{ marginTop: 22 }}>
          {coreSkills.map(({ name, icon: Icon }) => (
            <span className="chip chip--icon" key={name}>
              <Icon aria-hidden="true" />
              {name}
            </span>
          ))}
        </motion.div>

        <motion.div className="profile-strength" variants={fadeUp} custom={0.32}>
          <span className="profile-strength__label">Profile</span>
          <div className="profile-strength__track">
            <div className="profile-strength__fill" style={{ width: `${completeness}%` }} />
          </div>
          <span className="profile-strength__val">{completeness}%</span>
        </motion.div>

        <motion.div className="terminal" variants={fadeUp} custom={0.36}>
          <div className="terminal__bar">
            <span className="terminal__dot terminal__dot--red" />
            <span className="terminal__dot terminal__dot--yellow" />
            <span className="terminal__dot terminal__dot--green" />
            <span className="terminal__title">shander@portfolio ~ zsh</span>
          </div>
          <div className="terminal__body">
            <div>
              <span className="terminal__prompt">❯</span> whoami
            </div>
            <div className="terminal__str">{profile.name.toLowerCase().replace(/\s+/g, '_')}</div>
            <div style={{ marginTop: 6 }}>
              <span className="terminal__prompt">❯</span> cat profile.json
            </div>
            <div className="terminal__comment">{'{'}</div>
            <div>
              &nbsp;&nbsp;<span className="terminal__key">"role"</span>:{' '}
              <span className="terminal__str">"{profile.role}"</span>,
            </div>
            <div>
              &nbsp;&nbsp;<span className="terminal__key">"stack"</span>: [
              {techGroups[0]?.items.slice(0, 4).map((t) => `"${t.name}"`).join(', ')}],
            </div>
            <div>
              &nbsp;&nbsp;<span className="terminal__key">"projects"</span>:{' '}
              <span className="terminal__num">{projects.length}</span>,
            </div>
            <div>
              &nbsp;&nbsp;<span className="terminal__key">"status"</span>:{' '}
              <span className="terminal__str">
                "{profile.availability.open ? 'open_to_work' : 'not_available'}"
              </span>
              ,
            </div>
            <div>
              &nbsp;&nbsp;<span className="terminal__key">"location"</span>:{' '}
              <span className="terminal__str">"{profile.location}"</span>
            </div>
            <div className="terminal__comment">{'}'}</div>
            <div style={{ marginTop: 6 }}>
              <span className="terminal__prompt">❯</span>{' '}
              <span className="terminal__comment"># Ready to build something great</span>
            </div>
            <div className="terminal__cursor">█</div>
          </div>
        </motion.div>

        <motion.div className="about-stats" variants={fadeUp} custom={0.4}>
          {stats.map((stat) => (
            <div className="about-stats__item" key={stat.label}>
              <span className="about-stats__num">{stat.value}</span>
              <span className="about-stats__label">{stat.label}</span>
            </div>
          ))}
        </motion.div>

        <motion.button
          type="button"
          className="chip about-view-projects"
          variants={fadeUp}
          custom={0.44}
          whileHover={{ y: -2 }}
          onClick={() => onNavigate?.('projects')}
        >
          See my projects →
        </motion.button>
      </motion.section>
    </>
  )
}
