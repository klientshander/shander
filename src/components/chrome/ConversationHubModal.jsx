import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiMessageSquare } from 'react-icons/fi'
import { useUI } from '../../context/UIContext'
import { playClickSound, playCardSlideSound } from '../../utils/sound'
import './ConversationHubModal.css'

export default function ConversationHubModal() {
  const { chatModal, closeChatModal } = useUI()
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem('shander_conv_hub_messages')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) {
          return parsed
        }
      }
    } catch {}
    return []
  })

  const [userName, setUserName] = useState(() => {
    try {
      return localStorage.getItem('shander_conv_hub_user') || 'Hi'
    } catch {
      return 'Hi'
    }
  })

  const [isEditingName, setIsEditingName] = useState(false)
  const [nameInput, setNameInput] = useState(userName)
  const [inputText, setInputText] = useState('')
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const scrollToBottom = (behavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior })
  }

  // Scroll to bottom when opening modal or on new message
  useEffect(() => {
    if (chatModal.open) {
      setTimeout(() => {
        scrollToBottom('instant')
        inputRef.current?.focus()
      }, 80)
    }
  }, [chatModal.open])

  useEffect(() => {
    if (chatModal.open) {
      scrollToBottom('smooth')
    }
  }, [messages.length])

  // Save display name
  const handleSaveName = () => {
    const trimmed = nameInput.trim() || 'Visitor'
    setUserName(trimmed)
    setIsEditingName(false)
    try {
      localStorage.setItem('shander_conv_hub_user', trimmed)
    } catch {}
  }

  const handleSendMessage = (e) => {
    e.preventDefault()
    const trimmed = inputText.trim()
    if (!trimmed) return

    playClickSound()

    const newMessage = {
      id: `user-${Date.now()}`,
      name: userName || 'Hi',
      location: 'Negros Occidental, PH',
      time: 'just now',
      text: trimmed,
      avatar: '/gallery/shander.png',
      isSelf: true,
    }

    const updatedMessages = [...messages, newMessage]
    setMessages(updatedMessages)
    setInputText('')

    // Save user message to localStorage
    try {
      const stored = localStorage.getItem('shander_conv_hub_messages')
      const parsedStored = stored ? JSON.parse(stored) : []
      localStorage.setItem(
        'shander_conv_hub_messages',
        JSON.stringify([...parsedStored, newMessage])
      )
    } catch {}

    playCardSlideSound()
  }

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && chatModal.open) {
        closeChatModal()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [chatModal.open, closeChatModal])

  return (
    <AnimatePresence>
      {chatModal.open && (
        <motion.div
          className="conv-hub-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={closeChatModal}
          role="dialog"
          aria-modal="true"
          aria-label="Conversation Hub"
        >
          <motion.div
            className="conv-hub-box"
            initial={{ opacity: 0, scale: 0.94, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar matching media_1789901767050.png */}
            <div className="conv-hub-header">
              <div className="conv-hub-header__count">
                <FiMessageSquare className="conv-hub-header__icon" aria-hidden="true" />
                <span>{messages.length} {messages.length === 1 ? 'message' : 'messages'}</span>
              </div>

              <button
                type="button"
                className="conv-hub-header__close"
                onClick={closeChatModal}
                title="Close (Esc)"
                aria-label="Close conversation hub"
              >
                <FiX aria-hidden="true" />
              </button>
            </div>

            {/* Scrollable Messages Stream */}
            <div className="conv-hub-messages">
              {messages.length === 0 ? (
                <div className="conv-hub-empty">
                  <div className="conv-hub-empty__icon-wrap">
                    <FiMessageSquare className="conv-hub-empty__icon" aria-hidden="true" />
                  </div>
                  <p className="conv-hub-empty__title">No messages yet</p>
                  <p className="conv-hub-empty__desc">
                    Be the first to say something in the Conversation Hub!
                  </p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`conv-hub-row ${msg.isSelf ? 'is-self' : ''}`}
                  >
                    <div className="conv-hub-avatar-wrap">
                      <img
                        src={msg.avatar || '/gallery/shander.png'}
                        alt={msg.name}
                        className="conv-hub-avatar"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    </div>

                    <div className="conv-hub-msg-wrap">
                      <div className="conv-hub-meta">
                        <span className="conv-hub-meta__author">{msg.name}</span>
                        <span className="conv-hub-meta__sep">·</span>
                        <span className="conv-hub-meta__location">
                          {msg.location}
                        </span>
                        <span className="conv-hub-meta__device" aria-hidden="true">
                          💻
                        </span>
                        <span className="conv-hub-meta__sep">·</span>
                        <span className="conv-hub-meta__time">{msg.time}</span>
                      </div>

                      <div className="conv-hub-bubble">
                        {msg.text}
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Bottom Input Area matching media_1789901767050.png */}
            <div className="conv-hub-bottom">
              <div className="conv-hub-identity">
                <span className="conv-hub-identity__label">chatting as</span>
                {isEditingName ? (
                  <span className="conv-hub-identity__edit-wrap">
                    <input
                      type="text"
                      className="conv-hub-identity__input"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      onBlur={handleSaveName}
                      onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                      autoFocus
                      maxLength={30}
                    />
                    <button
                      type="button"
                      className="conv-hub-identity__save-btn"
                      onClick={handleSaveName}
                    >
                      save
                    </button>
                  </span>
                ) : (
                  <button
                    type="button"
                    className="conv-hub-identity__btn"
                    onClick={() => {
                      setNameInput(userName)
                      setIsEditingName(true)
                    }}
                    title="Click to edit name"
                  >
                    <strong>{userName}</strong>
                  </button>
                )}
              </div>

              <form className="conv-hub-form" onSubmit={handleSendMessage}>
                <input
                  ref={inputRef}
                  type="text"
                  className="conv-hub-input"
                  placeholder="say something..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />
                <button
                  type="submit"
                  className={`conv-hub-send-btn ${inputText.trim() ? 'is-ready' : ''}`}
                  disabled={!inputText.trim()}
                >
                  <span>send</span>
                  <span className="conv-hub-send-arrow" aria-hidden="true">
                    ↵
                  </span>
                </button>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

