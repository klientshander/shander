import { useEffect, useRef } from 'react'

/**
 * Canvas-drawn radar/spider chart. `categories` is [{label, value(0-1)}].
 * Watches the document's data-theme attribute directly (rather than taking
 * a theme prop) so it redraws correctly even if the toggle is clicked while
 * this chart is already mounted.
 */
export default function SkillsRadar({ categories }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const draw = () => {
      const width = canvas.width
      const height = canvas.height
      const cx = width / 2
      const cy = height / 2
      const r = Math.min(width, height) / 2 - 34
      const n = categories.length

      const styles = getComputedStyle(document.documentElement)
      const gridColor = styles.getPropertyValue('--border').trim() || 'rgba(0,0,0,.1)'
      const textColor = styles.getPropertyValue('--text-muted').trim() || 'rgba(0,0,0,.5)'
      const accent = styles.getPropertyValue('--accent').trim() || '#3a3a3a'

      ctx.clearRect(0, 0, width, height)

      // Grid rings
      for (let ring = 1; ring <= 4; ring += 1) {
        ctx.beginPath()
        for (let i = 0; i < n; i += 1) {
          const angle = (i / n) * Math.PI * 2 - Math.PI / 2
          const rr = r * (ring / 4)
          const x = cx + rr * Math.cos(angle)
          const y = cy + rr * Math.sin(angle)
          if (i === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.closePath()
        ctx.strokeStyle = gridColor
        ctx.lineWidth = 1
        ctx.stroke()
      }

      // Spokes
      for (let i = 0; i < n; i += 1) {
        const angle = (i / n) * Math.PI * 2 - Math.PI / 2
        ctx.beginPath()
        ctx.moveTo(cx, cy)
        ctx.lineTo(cx + r * Math.cos(angle), cy + r * Math.sin(angle))
        ctx.strokeStyle = gridColor
        ctx.lineWidth = 1
        ctx.stroke()
      }

      // Data polygon
      ctx.beginPath()
      categories.forEach((cat, i) => {
        const angle = (i / n) * Math.PI * 2 - Math.PI / 2
        const rr = r * cat.value
        const x = cx + rr * Math.cos(angle)
        const y = cy + rr * Math.sin(angle)
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      })
      ctx.closePath()
      ctx.fillStyle = `color-mix(in srgb, ${accent} 16%, transparent)`
      ctx.fill()
      ctx.strokeStyle = accent
      ctx.lineWidth = 2
      ctx.stroke()

      // Dots + labels
      categories.forEach((cat, i) => {
        const angle = (i / n) * Math.PI * 2 - Math.PI / 2
        const rr = r * cat.value
        const x = cx + rr * Math.cos(angle)
        const y = cy + rr * Math.sin(angle)
        ctx.beginPath()
        ctx.arc(x, y, 3.5, 0, Math.PI * 2)
        ctx.fillStyle = accent
        ctx.fill()

        const lx = cx + (r + 18) * Math.cos(angle)
        const ly = cy + (r + 18) * Math.sin(angle)
        ctx.font = '10px JetBrains Mono, monospace'
        ctx.fillStyle = textColor
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(cat.label, lx, ly)
      })
    }

    draw()

    // Redraw whenever the theme (data-theme attribute) changes.
    const observer = new MutationObserver(draw)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => observer.disconnect()
  }, [categories])

  return <canvas ref={canvasRef} width={280} height={220} className="skills-radar" />
}
