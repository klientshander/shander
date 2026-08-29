// Simple SVG circular progress ring. `percent` is 0-100.
export default function RingProgress({ percent, size = 64, stroke = 4, label }) {
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (Math.min(100, Math.max(0, percent)) / 100) * circumference

  return (
    <svg className="ring-progress" width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="var(--border)"
        strokeWidth={stroke}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="var(--accent)"
        strokeWidth={stroke}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        className="ring-progress__arc"
      />
      {label && (
        <text
          x="50%"
          y="54%"
          textAnchor="middle"
          className="ring-progress__label"
        >
          {label}
        </text>
      )}
    </svg>
  )
}
