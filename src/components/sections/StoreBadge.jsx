import { FiExternalLink, FiGithub, FiPlay, FiGlobe } from 'react-icons/fi'
import { FaApple, FaGooglePlay } from 'react-icons/fa'
import './StoreBadge.css'

export default function StoreBadge({
  type = 'live',
  href,
  onClick,
  subText,
  titleText,
  ariaLabel,
}) {
  let icon = <FiExternalLink />
  let defaultSub = 'LAUNCH'
  let defaultTitle = 'Live Demo ↗'

  if (type === 'appstore') {
    icon = <FaApple className="store-badge__svg-apple" />
    defaultSub = 'Download on the'
    defaultTitle = 'App Store'
  } else if (type === 'googleplay') {
    icon = <FaGooglePlay className="store-badge__svg-play" />
    defaultSub = 'GET IT ON'
    defaultTitle = 'Google Play'
  } else if (type === 'live') {
    icon = <FiGlobe className="store-badge__svg-web" />
    defaultSub = 'LAUNCH WEB'
    defaultTitle = 'Live Demo ↗'
  } else if (type === 'github') {
    icon = <FiGithub className="store-badge__svg-gh" />
    defaultSub = 'VIEW CODE'
    defaultTitle = 'GitHub ↗'
  } else if (type === 'video') {
    icon = <FiPlay className="store-badge__svg-video" />
    defaultSub = 'PREVIEW'
    defaultTitle = 'Demo Tour ↗'
  }

  const sub = subText || defaultSub
  const title = titleText || defaultTitle

  const content = (
    <>
      <span className="store-badge__icon" aria-hidden="true">
        {icon}
      </span>
      <div className="store-badge__lines">
        <span className="store-badge__sub">{sub}</span>
        <span className="store-badge__title">{title}</span>
      </div>
    </>
  )

  if (href && href !== '#') {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className={`store-badge store-badge--${type}`}
        aria-label={ariaLabel || `${title} (${sub})`}
      >
        {content}
      </a>
    )
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`store-badge store-badge--${type} ${!onClick ? 'store-badge--disabled' : ''}`}
      aria-label={ariaLabel || `${title} (${sub})`}
      disabled={!onClick}
    >
      {content}
    </button>
  )
}

