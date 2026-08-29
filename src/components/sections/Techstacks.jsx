import { useMemo, useState } from 'react'
import { FiCode } from 'react-icons/fi'
import { techGroups, radarCategories } from '../../data/techstacks'
import { techIconMap, fallbackTechIcon } from '../../data/techIcons'
import Reveal from '../ui/Reveal'
import SkillsRadar from '../ui/SkillsRadar'

const allSkills = techGroups.flatMap((group) =>
  group.items.map((item) => ({ ...item, groupId: group.id, groupLabel: group.label }))
)

export default function Techstacks() {
  const [filter, setFilter] = useState('all')

  const visible = useMemo(
    () => (filter === 'all' ? allSkills : allSkills.filter((s) => s.groupId === filter)),
    [filter]
  )

  return (
    <>
      <Reveal as="div" className="radar-wrap">
        <SkillsRadar categories={radarCategories} />
      </Reveal>

      <div className="filter-tabs" role="tablist" aria-label="Filter tech stack by category">
        <button
          type="button"
          className={`filter-tab ${filter === 'all' ? 'is-active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        {techGroups.map((group) => (
          <button
            type="button"
            key={group.id}
            className={`filter-tab ${filter === group.id ? 'is-active' : ''}`}
            onClick={() => setFilter(group.id)}
          >
            {group.label}
          </button>
        ))}
      </div>

      <section aria-label="Technology stack" className="skill-grid">
        {visible.map((tech) => {
          const Icon = techIconMap[tech.icon] ?? fallbackTechIcon
          return (
            <Reveal as="div" className="skill-card" key={tech.name} delay={0.02}>
              <div className="skill-card__top">
                <span className="skill-card__name">
                  <Icon aria-hidden="true" />
                  {tech.name}
                </span>
                <span className="skill-card__pct">{tech.level}%</span>
              </div>
              <div className="skill-card__track">
                <div className="skill-card__fill" style={{ width: `${tech.level}%` }} />
              </div>
            </Reveal>
          )
        })}
        {visible.length === 0 && (
          <p className="skill-grid__empty">
            <FiCode aria-hidden="true" /> No skills in this category yet.
          </p>
        )}
      </section>
    </>
  )
}
