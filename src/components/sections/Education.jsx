import { HiOutlineAcademicCap } from 'react-icons/hi'
import { FiBookOpen, FiAward } from 'react-icons/fi'
import { education, academicProgress } from '../../data/education'
import Reveal from '../ui/Reveal'
import RingProgress from '../ui/RingProgress'

const eduIconMap = {
  college: HiOutlineAcademicCap,
  school: FiBookOpen,
}

export default function Education() {
  const percent = Math.round((academicProgress.currentYear / academicProgress.totalYears) * 100)
  const current = education[0]

  return (
    <>
      <Reveal as="div" className="edu-ring">
        <RingProgress percent={percent} label={academicProgress.label} />
        <div className="edu-ring__info">
          <span className="edu-ring__eyebrow">
            Year {academicProgress.currentYear} of {academicProgress.totalYears}
          </span>
          <h3 className="edu-ring__title">{current?.degree}</h3>
          <p className="edu-ring__sub">{current?.school}</p>
        </div>
      </Reveal>

      <section className="panel" aria-label="Education history">
        <div className="timeline">
          {education.map((item, index) => {
            const Icon = eduIconMap[item.icon] ?? FiBookOpen
            return (
              <Reveal as="div" className="timeline-item timeline-item--edu" key={item.id} delay={index * 0.1}>
                <span className="timeline-item__icon">
                  <Icon aria-hidden="true" />
                </span>
                <span className="timeline-item__period">{item.period}</span>
                <h3 className="timeline-item__title">{item.school}</h3>
                <p className="timeline-item__subtitle">{item.degree}</p>
                <p className="timeline-item__desc">{item.description}</p>
                {item.badge && (
                  <span className="timeline-item__badge">
                    <FiAward aria-hidden="true" />
                    {item.badge}
                  </span>
                )}
              </Reveal>
            )
          })}
        </div>
      </section>
    </>
  )
}
