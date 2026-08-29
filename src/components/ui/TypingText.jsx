import { useEffect, useState } from 'react'

/**
 * Cycles through `words`, typing and deleting each one, terminal-style.
 * Respects prefers-reduced-motion by just showing the first word.
 */
export default function TypingText({ words, typeSpeed = 80, deleteSpeed = 45, holdMs = 1600 }) {
  const [text, setText] = useState('')
  const [wordIndex, setWordIndex] = useState(0)
  const [deleting, setDeleting] = useState(false)
  const prefersReduced =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    if (prefersReduced || !words?.length) {
      setText(words?.[0] ?? '')
      return
    }

    const current = words[wordIndex % words.length]
    let timeout

    if (!deleting) {
      if (text.length < current.length) {
        timeout = setTimeout(() => setText(current.slice(0, text.length + 1)), typeSpeed)
      } else {
        timeout = setTimeout(() => setDeleting(true), holdMs)
      }
    } else if (text.length > 0) {
      timeout = setTimeout(() => setText(current.slice(0, text.length - 1)), deleteSpeed)
    } else {
      setDeleting(false)
      setWordIndex((i) => (i + 1) % words.length)
    }

    return () => clearTimeout(timeout)
  }, [text, deleting, wordIndex, words, typeSpeed, deleteSpeed, holdMs, prefersReduced])

  return (
    <span className="typing-text">
      {text}
      <span className="typing-text__cursor" aria-hidden="true" />
    </span>
  )
}
