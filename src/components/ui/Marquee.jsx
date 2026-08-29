// An infinitely-scrolling strip of short status lines.
export default function Marquee({ items }) {
  if (!items?.length) return null
  const loop = [...items, ...items, ...items, ...items]
  return (
    <div className="marquee">
      <div className="marquee__track">
        {loop.map((item, i) => (
          <span className="marquee__item" key={i}>
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
