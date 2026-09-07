import Threads from './Threads'

export default function BackgroundMesh({ theme = 'dark' }) {
  const isLight = theme === 'light'
  const threadsColor = isLight ? [0.15, 0.15, 0.15] : [1, 1, 1]

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
          opacity: isLight ? 0.35 : 0.5,
        }}
      >
        <Threads
          amplitude={1}
          distance={0}
          enableMouseInteraction={true}
          color={threadsColor}
        />
      </div>
      <span className="bg-mesh__grid" />
      <span className="bg-mesh__grain" />
    </div>
  )
}

