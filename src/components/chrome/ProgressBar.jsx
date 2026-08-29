export default function ProgressBar({ progress }) {
  return (
    <div className="progress-bar" aria-hidden="true">
      <span className="progress-bar__fill" style={{ width: `${Math.min(100, Math.max(0, progress))}%` }} />
    </div>
  )
}
