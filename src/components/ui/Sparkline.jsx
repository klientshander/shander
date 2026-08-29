// Small decorative bar sparkline — purely illustrative, edit `data` to taste.
const defaultData = [4, 7, 3, 9, 6, 11, 8, 5, 12, 7, 10, 9, 14, 6, 11]

export default function Sparkline({ data = defaultData }) {
  const max = Math.max(...data)
  return (
    <div className="sparkline" aria-hidden="true">
      {data.map((value, i) => (
        <span
          key={i}
          className="sparkline__bar"
          style={{
            height: `${Math.round((value / max) * 100)}%`,
            opacity: 0.3 + (i / data.length) * 0.7,
          }}
        />
      ))}
    </div>
  )
}
