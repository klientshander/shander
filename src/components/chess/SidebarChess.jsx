import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Chess } from 'chess.js'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiRotateCcw,
  FiUser,
  FiCpu,
  FiMaximize2,
  FiChevronDown,
  FiChevronUp,
  FiVolume2,
  FiVolumeX,
} from 'react-icons/fi'
import {
  playChessMoveSound,
  playChessCaptureSound,
  playChessCheckSound,
  playChessWinSound,
} from '../../utils/sound'
import { getBestMove } from '../../utils/chessAI'
import './SidebarChess.css'

const PIECE_SYMBOLS = {
  w: {
    k: '♔',
    q: '♕',
    r: '♖',
    b: '♗',
    n: '♘',
    p: '♙',
  },
  b: {
    k: '♚',
    q: '♛',
    r: '♜',
    b: '♝',
    n: '♞',
    p: '♟',
  },
}

export default function SidebarChess({ onExpand, isModal = false }) {
  const [game, setGame] = useState(() => new Chess())
  const [selectedSquare, setSelectedSquare] = useState(null)
  const [lastMove, setLastMove] = useState(null)
  const [vsBot, setVsBot] = useState(true)
  const [botDifficulty, setBotDifficulty] = useState('medium') // 'easy' | 'medium' | 'hard'
  const [isBotThinking, setIsBotThinking] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)

  const botTimerRef = useRef(null)

  // Current board state 8x8
  const board = useMemo(() => game.board(), [game])
  const turn = game.turn() // 'w' | 'b'
  const isGameOver = game.isGameOver()
  const isCheck = game.isCheck()
  const isCheckmate = game.isCheckmate()
  const isDraw = game.isDraw()

  // Legal moves for selected square
  const legalMoves = useMemo(() => {
    if (!selectedSquare) return []
    return game.moves({ square: selectedSquare, verbose: true })
  }, [game, selectedSquare])

  // Captured pieces calculation
  const capturedPieces = useMemo(() => {
    const history = game.history({ verbose: true })
    const whiteCaptured = []
    const blackCaptured = []

    history.forEach((move) => {
      if (move.captured) {
        if (move.color === 'w') {
          blackCaptured.push(move.captured)
        } else {
          whiteCaptured.push(move.captured)
        }
      }
    })

    return { w: whiteCaptured, b: blackCaptured }
  }, [game])

  // Play sound helper
  const triggerAudio = useCallback(
    (type) => {
      if (!soundEnabled) return
      if (type === 'capture') playChessCaptureSound()
      else if (type === 'check') playChessCheckSound()
      else if (type === 'win') playChessWinSound()
      else playChessMoveSound()
    },
    [soundEnabled]
  )

  // Handle Make Move
  const makeMove = useCallback(
    (from, to) => {
      try {
        const move = game.move({
          from,
          to,
          promotion: 'q', // auto-queen promotion for slick gameplay
        })

        if (move) {
          setGame(new Chess(game.fen()))
          setLastMove({ from, to })
          setSelectedSquare(null)

          if (game.isCheckmate()) {
            triggerAudio('win')
          } else if (game.isCheck()) {
            triggerAudio('check')
          } else if (move.captured) {
            triggerAudio('capture')
          } else {
            triggerAudio('move')
          }

          return true
        }
      } catch {
        return false
      }
      return false
    },
    [game, triggerAudio]
  )

  // AI Bot Trigger when it is Black's turn in vsBot mode
  useEffect(() => {
    if (vsBot && turn === 'b' && !isGameOver) {
      setIsBotThinking(true)
      clearTimeout(botTimerRef.current)

      botTimerRef.current = setTimeout(() => {
        const botMove = getBestMove(game, botDifficulty)
        if (botMove) {
          makeMove(botMove.from, botMove.to)
        }
        setIsBotThinking(false)
      }, 380)
    }

    return () => clearTimeout(botTimerRef.current)
  }, [vsBot, turn, isGameOver, game, botDifficulty, makeMove])

  // Square Click handler
  const handleSquareClick = (row, col) => {
    if (isGameOver || (vsBot && turn === 'b' && isBotThinking)) return

    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
    const squareName = `${files[col]}${8 - row}`
    const piece = board[row][col]

    // If already clicked this square, unselect
    if (selectedSquare === squareName) {
      setSelectedSquare(null)
      return
    }

    // If currently a piece is selected, check if clicked square is a valid target move
    if (selectedSquare) {
      const isLegal = legalMoves.some((m) => m.to === squareName)
      if (isLegal) {
        makeMove(selectedSquare, squareName)
        return
      }
    }

    // Otherwise select the piece if it belongs to active turn
    if (piece && piece.color === turn) {
      setSelectedSquare(squareName)
    } else {
      setSelectedSquare(null)
    }
  }

  // Reset Game
  const resetGame = () => {
    clearTimeout(botTimerRef.current)
    const newG = new Chess()
    setGame(newG)
    setSelectedSquare(null)
    setLastMove(null)
    setIsBotThinking(false)
    triggerAudio('move')
  }

  // Undo Move
  const undoMove = () => {
    if (isBotThinking) return
    game.undo()
    if (vsBot) game.undo() // undo both bot and player move
    setGame(new Chess(game.fen()))
    setSelectedSquare(null)
    setLastMove(null)
    triggerAudio('move')
  }

  // Status message
  const statusMessage = useMemo(() => {
    if (isCheckmate) {
      return turn === 'w' ? '💀 Checkmate! Black Wins' : '🏆 Checkmate! White Wins!'
    }
    if (isDraw) return '🤝 Draw / Stalemate'
    if (isCheck) return '⚠️ Check!'
    if (isBotThinking) return '🤖 shander is thinking...'
    return turn === 'w' ? "White's Turn" : "Black's Turn"
  }, [isCheckmate, isDraw, isCheck, isBotThinking, turn])

  return (
    <div className={`sidebar-chess ${isModal ? 'sidebar-chess--modal' : ''}`}>
      {/* Header */}
      <div className="sidebar-chess__header">
        <div className="sidebar-chess__title-group">
          <span className="sidebar-chess__icon">♟️</span>
          <span className="sidebar-chess__title">Play with me</span>
          <span className={`sidebar-chess__badge ${turn === 'w' ? 'sidebar-chess__badge--white' : 'sidebar-chess__badge--black'}`}>
            {statusMessage}
          </span>
        </div>

        <div className="sidebar-chess__header-actions">
          {!isModal && onExpand && (
            <button
              type="button"
              className="sidebar-chess__btn sidebar-chess__btn--icon"
              onClick={onExpand}
              title="Expand chessboard"
              aria-label="Expand chessboard"
            >
              <FiMaximize2 />
            </button>
          )}

          {!isModal && (
            <button
              type="button"
              className="sidebar-chess__btn sidebar-chess__btn--icon"
              onClick={() => setIsCollapsed(!isCollapsed)}
              title={isCollapsed ? 'Expand mini-game' : 'Collapse mini-game'}
              aria-label={isCollapsed ? 'Expand mini-game' : 'Collapse mini-game'}
            >
              {isCollapsed ? <FiChevronDown /> : <FiChevronUp />}
            </button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {(!isCollapsed || isModal) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22 }}
            className="sidebar-chess__body"
          >
            {/* Mode & Tool Bar */}
            <div className="sidebar-chess__controls">
              <div className="sidebar-chess__mode-toggle">
                <button
                  type="button"
                  className={`sidebar-chess__mode-btn ${vsBot ? 'is-active' : ''}`}
                  onClick={() => {
                    setVsBot(true)
                    resetGame()
                  }}
                >
                  <FiCpu /> vs Bot
                </button>
                <button
                  type="button"
                  className={`sidebar-chess__mode-btn ${!vsBot ? 'is-active' : ''}`}
                  onClick={() => {
                    setVsBot(false)
                    resetGame()
                  }}
                >
                  <FiUser /> 2-Player
                </button>
              </div>

              {vsBot && (
                <select
                  className="sidebar-chess__difficulty"
                  value={botDifficulty}
                  onChange={(e) => setBotDifficulty(e.target.value)}
                  aria-label="Bot difficulty"
                >
                  <option value="easy">Casual</option>
                  <option value="medium">Normal</option>
                  <option value="hard">Master</option>
                </select>
              )}

              <div className="sidebar-chess__action-btns">
                <button
                  type="button"
                  className="sidebar-chess__btn sidebar-chess__btn--icon"
                  onClick={undoMove}
                  title="Undo move"
                  aria-label="Undo move"
                >
                  <FiRotateCcw />
                </button>
                <button
                  type="button"
                  className="sidebar-chess__btn sidebar-chess__btn--new"
                  onClick={resetGame}
                >
                  New
                </button>
              </div>
            </div>

            {/* Black Captured Tray */}
            <div className="sidebar-chess__tray sidebar-chess__tray--black">
              {capturedPieces.w.map((p, idx) => (
                <span key={idx} className="sidebar-chess__captured-piece">
                  {PIECE_SYMBOLS.w[p]}
                </span>
              ))}
            </div>

            {/* Chessboard Grid (8x8) */}
            <div className="sidebar-chess__board-wrap">
              <div className="sidebar-chess__board">
                {board.map((row, rIdx) =>
                  row.map((piece, cIdx) => {
                    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
                    const sq = `${files[cIdx]}${8 - rIdx}`
                    const isDark = (rIdx + cIdx) % 2 === 1
                    const isSelected = selectedSquare === sq
                    const isLegal = legalMoves.some((m) => m.to === sq)
                    const isCapture = isLegal && piece !== null
                    const isLastMoveSq =
                      lastMove && (lastMove.from === sq || lastMove.to === sq)
                    const isKingInCheck =
                      isCheck &&
                      piece &&
                      piece.type === 'k' &&
                      piece.color === turn

                    return (
                      <button
                        type="button"
                        key={sq}
                        onClick={() => handleSquareClick(rIdx, cIdx)}
                        className={`sidebar-chess__square ${
                          isDark ? 'is-dark' : 'is-light'
                        } ${isSelected ? 'is-selected' : ''} ${
                          isLastMoveSq ? 'is-last-move' : ''
                        } ${isKingInCheck ? 'is-check' : ''}`}
                        aria-label={`Square ${sq} ${
                          piece ? `${piece.color === 'w' ? 'White' : 'Black'} ${piece.type}` : 'Empty'
                        }`}
                      >
                        {/* Piece Icon */}
                        {piece && (
                          <span
                            className={`sidebar-chess__piece sidebar-chess__piece--${piece.color}`}
                          >
                            {PIECE_SYMBOLS[piece.color][piece.type]}
                          </span>
                        )}

                        {/* Legal Move Indicator */}
                        {isLegal && !isCapture && (
                          <span className="sidebar-chess__legal-dot" />
                        )}
                        {isCapture && (
                          <span className="sidebar-chess__capture-ring" />
                        )}

                        {/* Rank and File Notation Coordinates on Edges */}
                        {cIdx === 0 && (
                          <span className="sidebar-chess__coord sidebar-chess__coord--rank">
                            {8 - rIdx}
                          </span>
                        )}
                        {rIdx === 7 && (
                          <span className="sidebar-chess__coord sidebar-chess__coord--file">
                            {files[cIdx]}
                          </span>
                        )}
                      </button>
                    )
                  })
                )}
              </div>
            </div>

            {/* White Captured Tray */}
            <div className="sidebar-chess__tray sidebar-chess__tray--white">
              {capturedPieces.b.map((p, idx) => (
                <span key={idx} className="sidebar-chess__captured-piece">
                  {PIECE_SYMBOLS.b[p]}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

