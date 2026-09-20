import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  FiX,
  FiTerminal,
  FiAward,
  FiZap,
  FiArrowRight,
  FiRotateCcw,
  FiCheckCircle,
  FiAlertCircle,
} from 'react-icons/fi'
import { codeSnippets } from '../../data/snippets'
import { useUI } from '../../context/UIContext'
import { playClickSound, playHoverSound, playChessWinSound } from '../../utils/sound'
import './CodeSnippetModal.css'

export default function CodeSnippetModal() {
  const { snippetModal, closeSnippetModal } = useUI()

  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [selectedOption, setSelectedOption] = useState(null)
  const [typedValue, setTypedValue] = useState('')
  const [isAnswered, setIsAnswered] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [stats, setStats] = useState({ correct: 0, total: 0 })
  const [isGameOver, setIsGameOver] = useState(false)

  const [highScore, setHighScore] = useState(() => {
    try {
      return parseInt(localStorage.getItem('shander_snippet_high_score') || '0', 10)
    } catch {
      return 0
    }
  })

  const currentSnippet = codeSnippets[currentIndex] || codeSnippets[0]
  const inputRef = useRef(null)

  // Reset or focus on round switch
  useEffect(() => {
    setSelectedOption(null)
    setTypedValue('')
    setIsAnswered(false)
    setIsCorrect(false)
  }, [currentIndex])

  // Save high score
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score)
      try {
        localStorage.setItem('shander_snippet_high_score', String(score))
      } catch {}
    }
  }, [score, highScore])

  const handleSelectAnswer = useCallback(
    (chosenAnswer) => {
      if (isAnswered) return
      playClickSound()

      const normalizedChosen = chosenAnswer.trim()
      const normalizedCorrect = currentSnippet.answer.trim()
      const correct = normalizedChosen.toLowerCase() === normalizedCorrect.toLowerCase()

      setSelectedOption(normalizedChosen)
      setIsAnswered(true)
      setIsCorrect(correct)

      setStats((prev) => ({
        correct: prev.correct + (correct ? 1 : 0),
        total: prev.total + 1,
      }))

      if (correct) {
        playChessWinSound()
        const multiplier = streak >= 3 ? 1.5 : streak >= 1 ? 1.2 : 1.0
        const points = Math.round(100 * multiplier)
        setScore((prev) => prev + points)
        setStreak((prev) => prev + 1)
      } else {
        setStreak(0)
      }
    },
    [isAnswered, currentSnippet, streak]
  )

  const handleTypedSubmit = (e) => {
    e.preventDefault()
    if (!typedValue.trim() || isAnswered) return
    handleSelectAnswer(typedValue)
  }

  const handleNextSnippet = useCallback(() => {
    playClickSound()
    if (currentIndex + 1 < codeSnippets.length) {
      setCurrentIndex((prev) => prev + 1)
    } else {
      setIsGameOver(true)
    }
  }, [currentIndex])

  const handleRestart = useCallback(() => {
    playClickSound()
    setCurrentIndex(0)
    setScore(0)
    setStreak(0)
    setStats({ correct: 0, total: 0 })
    setIsGameOver(false)
    setIsAnswered(false)
    setSelectedOption(null)
    setTypedValue('')
  }, [])

  // Keyboard navigation: 1, 2, 3, 4 for options, Enter for next round, Esc to close
  useEffect(() => {
    if (!snippetModal?.open) return

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeSnippetModal()
        return
      }

      if (isGameOver) {
        if (e.key === 'Enter') handleRestart()
        return
      }

      if (isAnswered) {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowRight') {
          e.preventDefault()
          handleNextSnippet()
        }
        return
      }

      // If user presses 1, 2, 3, 4
      if (['1', '2', '3', '4'].includes(e.key) && currentSnippet.options) {
        const idx = parseInt(e.key, 10) - 1
        if (currentSnippet.options[idx]) {
          e.preventDefault()
          handleSelectAnswer(currentSnippet.options[idx])
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [
    snippetModal?.open,
    isAnswered,
    isGameOver,
    currentSnippet,
    handleNextSnippet,
    handleRestart,
    handleSelectAnswer,
    closeSnippetModal,
  ])

  // Format code with syntax coloring and replace the blank token with an interactive blank element
  const renderedCode = useMemo(() => {
    if (!currentSnippet?.code) return null

    const lines = currentSnippet.code.split('\n')
    return lines.map((line, lIdx) => {
      const parts = line.split(currentSnippet.blankToken)

      return (
        <div key={lIdx} className="snippet-code-line">
          <span className="snippet-code-num">{lIdx + 1}</span>
          <span className="snippet-code-text">
            {parts.map((part, pIdx) => (
              <span key={pIdx}>
                <span dangerouslySetInnerHTML={{ __html: highlightSyntax(part, currentSnippet.language) }} />
                {pIdx < parts.length - 1 && (
                  <span
                    className={`snippet-blank-token ${
                      isAnswered
                        ? isCorrect
                          ? 'snippet-blank-token--correct'
                          : 'snippet-blank-token--wrong'
                        : 'snippet-blank-token--pulse'
                    }`}
                  >
                    {isAnswered ? currentSnippet.answer : '___'}
                  </span>
                )}
              </span>
            ))}
          </span>
        </div>
      )
    })
  }, [currentSnippet, isAnswered, isCorrect])

  return (
    <AnimatePresence>
      {snippetModal?.open && (
        <motion.div
          className="overlay snippet-overlay"
          role="dialog"
          aria-modal="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeSnippetModal}
        >
          <motion.div
            className="overlay__box snippet-modal-box"
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Modal Header */}
            <div className="overlay__header snippet-modal__top">
              <div className="snippet-modal__brand">
                <FiTerminal className="snippet-modal__brand-icon" />
                <div className="snippet-modal__title-wrap">
                  <span className="snippet-modal__title">Code Snippet Guesser</span>
                  <span className="snippet-modal__subtitle">
                    Quick rounds · Score tracker · PHP, Laravel & React
                  </span>
                </div>
              </div>

              <div className="snippet-modal__header-actions">
                <div className="snippet-stat-chip">
                  <FiAward className="snippet-stat-chip__icon" />
                  <span className="snippet-stat-chip__val">{score}</span>
                  <span className="snippet-stat-chip__label">PTS</span>
                </div>

                {streak > 1 && (
                  <div className="snippet-streak-chip">
                    <FiZap className="snippet-streak-chip__icon" />
                    <span>{streak} Streak</span>
                  </div>
                )}

                <button
                  type="button"
                  className="overlay__close snippet-close-btn"
                  onClick={closeSnippetModal}
                  onMouseEnter={playHoverSound}
                  title="Close (Esc)"
                >
                  <FiX aria-hidden="true" />
                  <span>Esc</span>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="snippet-modal__body">
              {!isGameOver ? (
                <>
                  {/* Round Progress Bar & Info */}
                  <div className="snippet-round-bar">
                    <div className="snippet-round-info">
                      <span className="snippet-round-counter">
                        Round {currentIndex + 1} of {codeSnippets.length}
                      </span>
                      <span
                        className="snippet-lang-tag"
                        style={{ '--lang-color': currentSnippet.badgeColor }}
                      >
                        {currentSnippet.language} · {currentSnippet.badge}
                      </span>
                    </div>

                    <div className="snippet-progress-track">
                      <div
                        className="snippet-progress-fill"
                        style={{
                          width: `${((currentIndex + 1) / codeSnippets.length) * 100}%`,
                          backgroundColor: currentSnippet.badgeColor,
                        }}
                      />
                    </div>
                  </div>

                  {/* Question Prompt */}
                  <div className="snippet-question-box">
                    <h3 className="snippet-question-title">{currentSnippet.title}</h3>
                    <p className="snippet-question-desc">{currentSnippet.question}</p>
                  </div>

                  {/* Syntax-Highlighted Code Editor Window */}
                  <div className="snippet-editor-window">
                    <div className="snippet-editor-window__bar">
                      <div className="snippet-editor-window__dots">
                        <span className="snippet-dot snippet-dot--red" />
                        <span className="snippet-dot snippet-dot--yellow" />
                        <span className="snippet-dot snippet-dot--green" />
                      </div>
                      <span className="snippet-editor-window__filename">
                        snippet.{currentSnippet.language.toLowerCase() === 'php' || currentSnippet.language.toLowerCase() === 'laravel' ? 'php' : 'jsx'}
                      </span>
                      <span className="snippet-editor-window__meta">UTF-8</span>
                    </div>

                    <div className="snippet-editor-code">{renderedCode}</div>
                  </div>

                  {/* Interaction Controls: Quick-Pick Options + Instant Type Input */}
                  {!isAnswered ? (
                    <div className="snippet-interactive-area">
                      <div className="snippet-options-label">
                        <span>Pick the fix:</span>
                        <span className="snippet-options-hint">Press keys 1 - 4 on keyboard</span>
                      </div>

                      <div className="snippet-options-grid">
                        {currentSnippet.options.map((option, idx) => (
                          <button
                            type="button"
                            key={option}
                            className="snippet-option-btn"
                            onClick={() => handleSelectAnswer(option)}
                            onMouseEnter={playHoverSound}
                          >
                            <span className="snippet-option-num">{idx + 1}</span>
                            <code className="snippet-option-code">{option}</code>
                          </button>
                        ))}
                      </div>

                      {/* Alternate Type-in form */}
                      <form className="snippet-type-form" onSubmit={handleTypedSubmit}>
                        <input
                          ref={inputRef}
                          type="text"
                          className="snippet-type-input"
                          placeholder="Or type the exact code fix and press Enter..."
                          value={typedValue}
                          onChange={(e) => setTypedValue(e.target.value)}
                          spellCheck={false}
                          autoComplete="off"
                        />
                        <button
                          type="submit"
                          className="snippet-type-submit"
                          disabled={!typedValue.trim()}
                        >
                          Submit
                        </button>
                      </form>
                    </div>
                  ) : (
                    /* Answer Feedback Banner */
                    <motion.div
                      className={`snippet-feedback-card ${
                        isCorrect ? 'snippet-feedback-card--correct' : 'snippet-feedback-card--wrong'
                      }`}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="snippet-feedback-card__head">
                        <div className="snippet-feedback-card__status">
                          {isCorrect ? (
                            <>
                              <FiCheckCircle className="snippet-feedback-icon" />
                              <span>Correct! {streak > 1 ? `(${streak}x Streak Bonus)` : '+100 pts'}</span>
                            </>
                          ) : (
                            <>
                              <FiAlertCircle className="snippet-feedback-icon" />
                              <span>
                                Incorrect — The fix is <code>{currentSnippet.answer}</code>
                              </span>
                            </>
                          )}
                        </div>

                        <button
                          type="button"
                          className="snippet-next-btn"
                          onClick={handleNextSnippet}
                          onMouseEnter={playHoverSound}
                          autoFocus
                        >
                          <span>Next Snippet</span>
                          <FiArrowRight />
                        </button>
                      </div>

                      <p className="snippet-feedback-explanation">{currentSnippet.explanation}</p>
                    </motion.div>
                  )}
                </>
              ) : (
                /* Game Over / Results Summary */
                <motion.div
                  className="snippet-gameover-card"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="snippet-gameover-trophy">
                    <FiAward />
                  </div>

                  <h2 className="snippet-gameover-title">Challenge Complete!</h2>
                  <p className="snippet-gameover-subtitle">
                    Full-Stack Mastery test completed across PHP, Laravel, and React.
                  </p>

                  <div className="snippet-gameover-stats">
                    <div className="snippet-gameover-stat">
                      <span className="snippet-gameover-stat__val">{score}</span>
                      <span className="snippet-gameover-stat__label">Final Score</span>
                    </div>

                    <div className="snippet-gameover-stat">
                      <span className="snippet-gameover-stat__val">
                        {stats.correct} / {stats.total}
                      </span>
                      <span className="snippet-gameover-stat__label">Accuracy</span>
                    </div>

                    <div className="snippet-gameover-stat">
                      <span className="snippet-gameover-stat__val">{highScore}</span>
                      <span className="snippet-gameover-stat__label">High Score</span>
                    </div>
                  </div>

                  <div className="snippet-gameover-actions">
                    <button
                      type="button"
                      className="snippet-action-btn snippet-action-btn--primary"
                      onClick={handleRestart}
                      onMouseEnter={playHoverSound}
                    >
                      <FiRotateCcw />
                      <span>Play Again</span>
                    </button>

                    <button
                      type="button"
                      className="snippet-action-btn snippet-action-btn--secondary"
                      onClick={closeSnippetModal}
                      onMouseEnter={playHoverSound}
                    >
                      <span>Close</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Lightweight syntax token highlighter for modern PHP & React snippets
function highlightSyntax(code, lang = 'php') {
  if (!code) return ''

  // Escape HTML entities
  let out = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  // Strings ('...' or "...")
  out = out.replace(/(['"][^'"]*['"])/g, '<span class="tok-str">$1</span>')

  // Comments (// ... or /* ... */ or <!-- ... -->)
  out = out.replace(
    /(\/\/[^\n]*|\/\*[\s\S]*?\*\/|&lt;!--[\s\S]*?--&gt;)/g,
    '<span class="tok-comment">$1</span>'
  )

  // Keywords
  const keywords = [
    'function',
    'const',
    'let',
    'var',
    'return',
    'match',
    'default',
    'use',
    'new',
    'fn',
    'class',
    'extends',
    'public',
    'private',
    'protected',
    'static',
    'Route',
    'User',
    'useState',
    'useEffect',
    'useMemo',
    'useCallback',
    'useRef',
    'import',
    'from',
    'export',
    'if',
    'else',
    'switch',
    'case',
    'break',
  ]
  const kwRegex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'g')
  out = out.replace(kwRegex, '<span class="tok-kw">$1</span>')

  // Variables & Props ($...)
  out = out.replace(/(\$[a-zA-Z0-9_]+)/g, '<span class="tok-var">$1</span>')

  // Directives (@csrf, etc.)
  out = out.replace(/(@[a-zA-Z0-9_]+)/g, '<span class="tok-directive">$1</span>')

  return out
}

