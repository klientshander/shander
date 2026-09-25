import { FiAward, FiStar, FiFileText, FiClock, FiImage, FiArrowUpRight } from 'react-icons/fi'
import { certifications } from '../../data/certifications'
import { useUI } from '../../context/UIContext'
import { playClickSound } from '../../utils/sound'
import Reveal from '../ui/Reveal'

const iconMap = {
  award: FiAward,
  star: FiStar,
  document: FiFileText,
  progress: FiClock,
}

export default function Certification() {
  const { openCertModal } = useUI()

  const handleCertClick = (cert) => {
    if (!cert.image) return
    playClickSound()
    openCertModal(cert.title, `${cert.issuer} · ${cert.year}`, cert.image)
  }

  return (
    <section aria-label="Certifications" className="panel">
      <div className="cert-grid">
        {certifications.map((cert, index) => {
          const Icon = iconMap[cert.icon] ?? FiAward
          const hasImage = Boolean(cert.image)

          return (
            <Reveal
              as="div"
              key={cert.id}
              delay={index * 0.06}
              className={`cert-card ${hasImage ? 'is-clickable' : 'cert-card--pending'}`}
              onClick={() => handleCertClick(cert)}
              role={hasImage ? 'button' : undefined}
              tabIndex={hasImage ? 0 : undefined}
              onKeyDown={(e) => {
                if (hasImage && (e.key === 'Enter' || e.key === ' ')) {
                  e.preventDefault()
                  handleCertClick(cert)
                }
              }}
              title={hasImage ? `Click to view ${cert.title} picture` : `${cert.title} (In progress)`}
            >
              <div className="cert-card__header">
                <span className="cert-card__year">
                  <Icon aria-hidden="true" />
                  {cert.year}
                </span>
                <span className="cert-card__action">
                  {hasImage ? (
                    <>
                      <FiImage aria-hidden="true" />
                      <span>View picture</span>
                      <FiArrowUpRight className="cert-card__action-icon" aria-hidden="true" />
                    </>
                  ) : (
                    <span className="cert-card__pending-tag">In progress</span>
                  )}
                </span>
              </div>

              <div className="cert-card__body">
                <h3 className="cert-card__title">{cert.title}</h3>
                <p className="cert-card__issuer">{cert.issuer}</p>
              </div>
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}