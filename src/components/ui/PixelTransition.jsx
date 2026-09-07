import { useEffect, useState } from 'react'
import './PixelTransition.css'

function PixelTransition({
  firstContent,
  secondContent,
  gridSize = 8,
  pixelColor = 'currentColor',
  animationStepDuration = 0.4,
  once = false,
  aspectRatio = '1 / 1',
  className = '',
  style = {},
}) {
  const [isActive, setIsActive] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const touchQuery = window.matchMedia('(pointer: coarse)')
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    const updateTouch = () => setIsTouchDevice(touchQuery.matches)
    const updateMotion = () => setPrefersReducedMotion(motionQuery.matches)

    updateTouch()
    updateMotion()

    touchQuery.addEventListener?.('change', updateTouch)
    motionQuery.addEventListener?.('change', updateMotion)

    return () => {
      touchQuery.removeEventListener?.('change', updateTouch)
      motionQuery.removeEventListener?.('change', updateMotion)
    }
  }, [])

  const pixels = []
  const totalPixels = gridSize * gridSize

  for (let row = 0; row < gridSize; row += 1) {
    for (let col = 0; col < gridSize; col += 1) {
      const index = row * gridSize + col
      const delay = (index / Math.max(1, totalPixels - 1)) * animationStepDuration

      pixels.push(
        <span
          key={`${row}-${col}`}
          className="pixelated-image-card__pixel"
          style={{
            backgroundColor: pixelColor,
            transitionDelay: `${delay}s`,
          }}
        />
      )
    }
  }

  const activate = () => setIsActive(true)
  const deactivate = () => {
    if (!once) setIsActive(false)
  }
  const toggle = () => setIsActive((current) => (once ? true : !current))

  return (
    <div
      className={`pixelated-image-card ${className} ${isActive ? 'is-active' : ''}`}
      style={{
        ...style,
        aspectRatio,
        gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
        gridTemplateRows: `repeat(${gridSize}, 1fr)`,
        '--pixel-animation-duration': `${animationStepDuration}s`,
      }}
      onMouseEnter={!isTouchDevice ? activate : undefined}
      onMouseLeave={!isTouchDevice ? deactivate : undefined}
      onFocus={!isTouchDevice ? activate : undefined}
      onBlur={!isTouchDevice ? deactivate : undefined}
      onClick={isTouchDevice ? toggle : undefined}
      tabIndex={0}
    >
      <div className="pixelated-image-card__layer pixelated-image-card__default" aria-hidden={isActive}>
        {firstContent}
      </div>
      <div className="pixelated-image-card__layer pixelated-image-card__active" aria-hidden={!isActive}>
        {secondContent}
      </div>
      <div
        className={`pixelated-image-card__pixels ${prefersReducedMotion ? 'is-reduced-motion' : ''}`}
        aria-hidden="true"
      >
        {pixels}
      </div>
    </div>
  )
}

export default PixelTransition
