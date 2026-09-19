import BackgroundBoxes from './BackgroundBoxes'

export default function BackgroundMesh({ theme = 'dark' }) {
  const isLight = theme === 'light'
  const borderColor = isLight ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.08)'

  return (
    <div className="bg-mesh" aria-hidden="true">
      <div
        style={{
          position: 'fixed',
          inset: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      >
        <BackgroundBoxes
          boxSize={40}
          borderWidth={1}
          borderColor={borderColor}
          backgroundColor="transparent"
          isLight={isLight}
        />
      </div>
      <span className="bg-mesh__grain" />
    </div>
  )
}

