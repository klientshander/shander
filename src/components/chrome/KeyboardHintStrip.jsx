export default function KeyboardHintStrip() {
  return (
    <div className="kbd-strip" aria-hidden="true">
      <span>
        <kbd>&uarr; &darr;</kbd> slide
      </span>
      <span>
        <kbd>&#8984;K</kbd> quick nav
      </span>
      <span>
        <kbd>D</kbd> toggle theme
      </span>
    </div>
  )
}
