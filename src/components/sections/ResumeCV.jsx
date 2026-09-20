import { FiDownload, FiMail, FiMapPin, FiPhone } from 'react-icons/fi'
import { cvData } from '../../data/cv'
import { profile } from '../../data/profile'
import Reveal from '../ui/Reveal'
import './ResumeCV.css'

export default function ResumeCV() {
  return (
    <div className="cv-section">
      <div className="cv-toolbar">
        <div className="cv-toolbar__info">
          <span className="cv-toolbar__tag">Curriculum Vitae</span>
          <span className="cv-toolbar__updated">Verified Candidate</span>
        </div>
        <a
          href={profile.resumeUrl}
          download
          className="cv-download-btn"
          title="Download original document"
        >
          <FiDownload aria-hidden="true" />
          <span>Download CV</span>
        </a>
      </div>

      <Reveal as="div" className="cv-sheet">
        {/* CV Header */}
        <header className="cv-header">
          <h1 className="cv-name">{cvData.name}</h1>
          <p className="cv-role">{cvData.title}</p>
          <div className="cv-contacts">
            <span className="cv-contact-item">
              <FiMapPin aria-hidden="true" />
              {cvData.contact.location}
            </span>
            <span className="cv-sep">•</span>
            <span className="cv-contact-item">
              <FiPhone aria-hidden="true" />
              {cvData.contact.phone}
            </span>
            <span className="cv-sep">•</span>
            <a href={`mailto:${cvData.contact.email}`} className="cv-contact-item cv-contact-link">
              <FiMail aria-hidden="true" />
              {cvData.contact.email}
            </a>
          </div>
        </header>

        <div className="cv-divider" />

        {/* Career Objective */}
        <section className="cv-block">
          <h2 className="cv-section-title">Career Objective</h2>
          <p className="cv-objective-text">{cvData.objective}</p>
        </section>

        <div className="cv-divider" />

        {/* Technical Skills */}
        <section className="cv-block">
          <h2 className="cv-section-title">Technical Skills</h2>
          <div className="cv-skills-grid">
            {cvData.technicalSkills.map((skillGroup) => (
              <div key={skillGroup.category} className="cv-skill-row">
                <span className="cv-skill-category">{skillGroup.category}:</span>
                <span className="cv-skill-items">{skillGroup.items.join(', ')}</span>
              </div>
            ))}
          </div>
        </section>

        <div className="cv-divider" />

        {/* Projects */}
        <section className="cv-block">
          <h2 className="cv-section-title">Projects & System Experience</h2>
          <div className="cv-projects-list">
            {cvData.projects.map((proj) => (
              <div key={proj.title} className="cv-project-card">
                <div className="cv-project-header">
                  <h3 className="cv-project-title">{proj.title}</h3>
                  <span className="cv-project-tech">{proj.tech}</span>
                </div>
                <ul className="cv-bullets">
                  {proj.bullets.map((bullet, i) => (
                    <li key={i}>{bullet}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <div className="cv-divider" />

        {/* Education */}
        <section className="cv-block">
          <h2 className="cv-section-title">Education</h2>
          {cvData.education.map((edu) => (
            <div key={edu.school} className="cv-edu-item">
              <div className="cv-edu-header">
                <h3 className="cv-edu-degree">{edu.degree}</h3>
                <span className="cv-edu-year">{edu.graduation}</span>
              </div>
              <p className="cv-edu-school">{edu.school}</p>
            </div>
          ))}
        </section>

        <div className="cv-divider" />

        {/* Strengths */}
        <section className="cv-block">
          <h2 className="cv-section-title">Strengths</h2>
          <ul className="cv-bullets">
            {cvData.strengths.map((str, i) => (
              <li key={i}>{str}</li>
            ))}
          </ul>
        </section>
      </Reveal>
    </div>
  )
}

