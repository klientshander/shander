// Clean Static Background Grid — No Hover Illumination Effects
import {
  useMemo,
  useRef,
  useState,
  useLayoutEffect,
  useCallback,
} from 'react'

const PERSPECTIVE = 1000

export default function BackgroundBoxes({
  backgroundColor = 'transparent',
  boxSize = 40,
  borderWidth = 1,
  borderColor = 'rgba(255,255,255,0.06)',
  rotate = { x: 0, y: 0 },
  style,
}) {
  const containerRef = useRef(null)
  const [rows, setRows] = useState(35)
  const [cols, setCols] = useState(35)

  const swingX = rotate?.x ?? 0
  const swingY = rotate?.y ?? 0

  const calculateGrid = useCallback(() => {
    const container = containerRef.current
    if (!container) return
    const w = container.clientWidth || container.offsetWidth || window.innerWidth || 1
    const h = container.clientHeight || container.offsetHeight || window.innerHeight || 1
    setCols(Math.max(1, Math.ceil(w / boxSize)))
    setRows(Math.max(1, Math.ceil(h / boxSize)))
  }, [boxSize])

  useLayoutEffect(() => {
    calculateGrid()
    window.addEventListener('resize', calculateGrid)
    return () => window.removeEventListener('resize', calculateGrid)
  }, [calculateGrid])

  const gridWidth = cols * boxSize
  const gridHeight = rows * boxSize
  const border = borderWidth ? `${borderWidth}px solid ${borderColor}` : undefined

  const boxes = useMemo(() => {
    const rowsArray = new Array(rows).fill(1)
    const colsArray = new Array(cols).fill(1)
    return rowsArray.map((_, i) => (
      <div
        key={`row-${i}`}
        style={{
          display: 'flex',
          borderLeft: border,
          borderBottom: i === rows - 1 ? border : undefined,
        }}
      >
        {colsArray.map((_, j) => (
          <div
            key={`col-${j}`}
            style={{
              width: `${boxSize}px`,
              height: `${boxSize}px`,
              flexShrink: 0,
              boxSizing: 'border-box',
              borderRight: border,
              borderTop: border,
            }}
          />
        ))}
      </div>
    ))
  }, [rows, cols, boxSize, border])

  return (
    <div
      ref={containerRef}
      style={{
        ...style,
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        backgroundColor,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          perspective: `${PERSPECTIVE}px`,
          perspectiveOrigin: 'center center',
          transformStyle: 'preserve-3d',
        }}
      >
        <div
          style={{
            transform: `translate(-50%, -50%) rotateY(${swingX}deg) rotateX(${swingY}deg)`,
            position: 'absolute',
            left: '50%',
            top: '50%',
            display: 'flex',
            flexDirection: 'column',
            transformOrigin: 'center center',
            width: `${gridWidth}px`,
            height: `${gridHeight}px`,
            zIndex: 0,
          }}
        >
          {boxes}
        </div>
      </div>
    </div>
  )
}
