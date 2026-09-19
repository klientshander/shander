// Prism Grid — Monochrome & Ultra-Faded Whisper
import {
  useMemo,
  useRef,
  useState,
  useLayoutEffect,
  useEffect,
  useCallback,
} from 'react'
import { motion } from 'framer-motion'

const DEFAULT_DARK_COLORS = [
  '#ffffff',
  '#f8fafc',
  '#f1f5f9',
  '#e2e8f0',
  '#cbd5e1',
]

const DEFAULT_LIGHT_COLORS = [
  '#000000',
  '#0f172a',
  '#1e293b',
  '#334155',
  '#475569',
]

const PERSPECTIVE = 1000

function screenToPlane(sx, sy, yawDeg, pitchDeg, p = PERSPECTIVE) {
  const a = (yawDeg * Math.PI) / 180
  const b = (pitchDeg * Math.PI) / 180
  const ca = Math.cos(a)
  const sa = Math.sin(a)
  const cb = Math.cos(b)
  const sb = Math.sin(b)

  const a11 = p * ca - sx * sa * cb
  const a12 = sx * sb
  const a21 = p * sa * sb - sy * sa * cb
  const a22 = p * cb + sy * sb

  const det = a11 * a22 - a12 * a21
  if (!isFinite(det) || Math.abs(det) < 1e-6) return null

  const b1 = sx * p
  const b2 = sy * p
  return {
    x: (b1 * a22 - a12 * b2) / det,
    y: (a11 * b2 - b1 * a21) / det,
  }
}

export default function BackgroundBoxes({
  backgroundColor = 'transparent',
  boxSize = 40,
  borderWidth = 1,
  borderColor = 'rgba(255,255,255,0.06)',
  rotate = { x: 0, y: 0 },
  isLight = false,
  maxOpacity = 0.16, // Faded so user can barely see it
  outDuration = 0.95,
  style,
}) {
  const containerRef = useRef(null)
  const idleTimerRef = useRef(null)
  const [rows, setRows] = useState(35)
  const [cols, setCols] = useState(35)

  const swingX = rotate?.x ?? 0
  const swingY = rotate?.y ?? 0

  const colors = useMemo(() => {
    return isLight ? DEFAULT_LIGHT_COLORS : DEFAULT_DARK_COLORS
  }, [isLight])

  const getRandomColor = useCallback(() => {
    return colors[Math.floor(Math.random() * colors.length)]
  }, [colors])

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

  const [lit, setLit] = useState(null)
  const [fading, setFading] = useState([])
  const idRef = useRef(0)

  const leave = useCallback(() => {
    clearTimeout(idleTimerRef.current)
    setLit((current) => {
      if (current) setFading((f) => [...f, current])
      return null
    })
  }, [])

  const processPointerPos = useCallback(
    (clientX, clientY) => {
      const container = containerRef.current
      if (!container) return
      const rect = container.getBoundingClientRect()
      const sx = clientX - rect.left - rect.width / 2
      const sy = clientY - rect.top - rect.height / 2

      const point = screenToPlane(sx, sy, swingX, swingY)
      if (!point) return leave()

      const gx = point.x + gridWidth / 2
      const gy = point.y + gridHeight / 2
      const col = Math.floor(gx / boxSize)
      const row = Math.floor(gy / boxSize)
      if (col < 0 || col >= cols || row < 0 || row >= rows) return leave()

      // Reset idle timer: fade out active cell after cursor pauses
      clearTimeout(idleTimerRef.current)
      idleTimerRef.current = setTimeout(() => {
        setLit((current) => {
          if (current) {
            setFading((f) => [...f, current])
          }
          return null
        })
      }, 300)

      setLit((current) => {
        if (current && current.row === row && current.col === col) {
          return current
        }
        if (current) setFading((f) => [...f, current])
        return {
          id: ++idRef.current,
          row,
          col,
          color: getRandomColor(),
        }
      })
    },
    [swingX, swingY, gridWidth, gridHeight, boxSize, cols, rows, getRandomColor, leave]
  )

  const handlePointerMove = useCallback(
    (event) => {
      processPointerPos(event.clientX, event.clientY)
    },
    [processPointerPos]
  )

  // Listen to window-level pointer movements so background illuminates smoothly
  useEffect(() => {
    const handleWindowPointerMove = (e) => {
      processPointerPos(e.clientX, e.clientY)
    }
    const handleWindowPointerLeave = () => {
      leave()
    }
    window.addEventListener('pointermove', handleWindowPointerMove, { passive: true })
    window.addEventListener('blur', handleWindowPointerLeave)
    return () => {
      clearTimeout(idleTimerRef.current)
      window.removeEventListener('pointermove', handleWindowPointerMove)
      window.removeEventListener('blur', handleWindowPointerLeave)
    }
  }, [processPointerPos, leave])

  const handleCellFadeComplete = useCallback((cellId) => {
    setFading((prev) => prev.filter((c) => c.id !== cellId))
  }, [])

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

  const cellStyle = (cell) => ({
    position: 'absolute',
    left: cell.col * boxSize,
    top: cell.row * boxSize,
    width: boxSize,
    height: boxSize,
    backgroundColor: cell.color,
    pointerEvents: 'none',
  })

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={leave}
      style={{
        ...style,
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        backgroundColor,
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
          {fading.map((cell) => (
            <motion.div
              key={cell.id}
              initial={{ opacity: maxOpacity }}
              animate={{ opacity: 0 }}
              transition={{ duration: outDuration, ease: 'easeOut' }}
              onAnimationComplete={() => handleCellFadeComplete(cell.id)}
              style={cellStyle(cell)}
            />
          ))}
          {lit && (
            <motion.div
              key={lit.id}
              initial={{ opacity: maxOpacity }}
              animate={{ opacity: maxOpacity }}
              style={cellStyle(lit)}
            />
          )}
        </div>
      </div>
    </div>
  )
}
