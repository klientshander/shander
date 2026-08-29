import { FiAward, FiStar, FiFileText, FiClock, FiZoomIn } from 'react-icons/fi'
import { certifications } from '../../data/certifications'
import { useUI } from '../../context/UIContext'
import Reveal from '../ui/Reveal'

const iconMap = {
  award: FiAward,
  star: FiStar,
  document: FiFileText,
  progress: FiClock,
}

export default function Certification() {
  const { openCertModal } = useUI()

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
              delay={index * 0.07}
              className={`cert-card ${hasImage ? '' : 'cert-card--pending'}`}
              onClick={() => hasImage && openCertModal(cert.title, `${cert.issuer} · ${cert.year}`, cert.image)}
              role={hasImage ? 'button' : undefined}
              tabIndex={hasImage ? 0 : undefined}
              onKeyDown={(e) => {
                if (hasImage && (e.key === 'Enter' || e.key === ' ')) {
                  e.preventDefault()
                  openCertModal(cert.title, `${cert.issuer} · ${cert.year}`, cert.image)
                }
              }}
            >
              <div className="cert-card__thumb">
                {hasImage ? (
                  <>
                    <img src={cert.image} alt={cert.title} loading="lazy" />
                    <span className="cert-card__overlay">
                      <FiZoomIn aria-hidden="true" />
                      View certificate
                    </span>
                  </>
                ) : (
                  <span className="cert-card__placeholder">
                    <Icon aria-hidden="true" />
                    <span>In progress</span>
                  </span>
                )}
              </div>

              <div className="cert-card__body">
                <span className="cert-card__year">
                  <Icon aria-hidden="true" />
                  {cert.year}
                </span>
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