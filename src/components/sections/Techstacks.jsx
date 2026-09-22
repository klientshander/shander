import { useMemo, useState } from 'react'
import { FiCode, FiChevronDown, FiChevronUp } from 'react-icons/fi'
import { techGroups } from '../../data/techstacks'
import { techIconMap, fallbackTechIcon } from '../../data/techIcons'
import { playClickSound } from '../../utils/sound'
import Reveal from '../ui/Reveal'

const allSkills = techGroups.flatMap((group) =>
  group.items.map((item) => ({ ...item, groupId: group.id, groupLabel: group.label }))
)

const INITIAL_LIMIT = 10

export default function Techstacks() {
  const [filter, setFilter] = useState('all')
  const [showAll, setShowAll] = useState(false)

  const visible = useMemo(
    () => (filter === 'all' ? allSkills : allSkills.filter((s) => s.groupId === filter)),
    [filter]
  )

  const displayed = showAll ? visible : visible.slice(0, INITIAL_LIMIT)
  const hasMore = visible.length > INITIAL_LIMIT

  const handleFilter = (cat) => {
    playClickSound()
    setFilter(cat)
    setShowAll(false)
  }

  const handleToggleMore = () => {
    playClickSound()
    setShowAll((prev) => !prev)
  }

  return (
    <>
      <div className="filter-tabs" role="tablist" aria-label="Filter tech stack by category">
        <button
          type="button"
          className={`filter-tab ${filter === 'all' ? 'is-active' : ''}`}
          onClick={() => handleFilter('all')}
        >
          All
        </button>
        {techGroups.map((group) => (
          <button
            type="button"
            key={group.id}
            className={`filter-tab ${filter === group.id ? 'is-active' : ''}`}
            onClick={() => handleFilter(group.id)}
          >
            {group.label}
          </button>
        ))}
      </div>

      <section aria-label="Technology stack" className="skill-grid">
        {displayed.map((tech) => {
          const Icon = techIconMap[tech.icon] ?? fallbackTechIcon
          return (
            <Reveal as="div" className="skill-card" key={tech.name} delay={0.02}>
              <span className="skill-card__name">
                <Icon aria-hidden="true" />
                {tech.name}
              </span>
            </Reveal>
          )
        })}
        {visible.length === 0 && (
          <p className="skill-grid__empty">
            <FiCode aria-hidden="true" /> No skills in this category yet.
          </p>
        )}
      </section>

      {hasMore && (
        <div className="techstacks-more-wrap">
          <button
            type="button"
            className="techstacks-more-btn"
            onClick={handleToggleMore}
            aria-expanded={showAll}
          >
            <span>{showAll ? 'View less' : 'View more'}</span>
            {showAll ? <FiChevronUp aria-hidden="true" /> : <FiChevronDown aria-hidden="true" />}
          </button>
        </div>
      )}
    </>
  )
}
