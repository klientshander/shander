import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { navItems } from '../../data/nav'
import { useUI } from '../../context/UIContext'

export default function CommandPalette({ onNavigate }) {
  const { cmdOpen, closeCmd } = useUI()
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(0)
  const inputRef = useRef(null)

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return navItems
    return navItems.filter((item) => item.label.toLowerCase().includes(q))
  }, [query])

  useEffect(() => {
    if (cmdOpen) {
      setQuery('')
      setFocused(0)
      const id = setTimeout(() => inputRef.current?.focus(), 30)
      return () => clearTimeout(id)
    }
  }, [cmdOpen])

  useEffect(() => {
    setFocused(0)
  }, [query])

  const go = (id) => {
    onNavigate(id)
    closeCmd()
  }

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setFocused((f) => (f + 1) % Math.max(results.length, 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setFocused((f) => (f - 1 + results.length) % Math.max(results.length, 1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (results[focused]) go(results[focused].id)
    } else if (e.key === 'Escape') {
      closeCmd()
    }
  }

  return (
    <AnimatePresence>
      {cmdOpen && (
        <motion.div
          className="cmd-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeCmd}
        >
          <motion.div
            className="cmd-box"
            initial={{ opacity: 0, scale: 0.94, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -6 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Quick navigation"
          >
            <input
              ref={inputRef}
              className="cmd-box__input"
              type="text"
              placeholder="Search sections…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              autoComplete="off"
              spellCheck="false"
            />
            <div className="cmd-box__results">
              {results.map((item, index) => {
                const Icon = item.icon
                return (
                  <button
                    type="button"
                    key={item.id}
                    className={`cmd-box__item ${index === focused ? 'is-focused' : ''}`}
                    onMouseEnter={() => setFocused(index)}
                    onClick={() => go(item.id)}
                  >
                    <Icon aria-hidden="true" />
                    <span>{item.label}</span>
                    <span className="cmd-box__key">
                      {String(navItems.findIndex((n) => n.id === item.id)).padStart(2, '0')}
                    </span>
                  </button>
                )
              })}
              {results.length === 0 && <p className="cmd-box__empty">No matching sections.</p>}
            </div>
            <div className="cmd-box__hint">
              <span>
                <kbd>&uarr;&darr;</kbd> navigate
              </span>
              <span>
                <kbd>Enter</kbd> go
              </span>
              <span>
                <kbd>Esc</kbd> close
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
