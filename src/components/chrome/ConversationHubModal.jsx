import { useState, useEffect, useRef } from 'react'
import { createClient } from '@supabase/supabase-js'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiMessageSquare } from 'react-icons/fi'
import { useUI } from '../../context/UIContext'
import { playClickSound, playCardSlideSound } from '../../utils/sound'
import './ConversationHubModal.css'

const rawSupabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseUrl = rawSupabaseUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '')
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabase =
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseAnonKey.includes('YOUR_') &&
  !supabaseUrl.includes('YOUR_')
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null

const formatTime = (value) => {
  const date = value ? new Date(value) : new Date()

  if (Number.isNaN(date.getTime())) {
    return 'just now'
  }

  return new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}

export const VISITOR_AVATARS = [
  { id: 'boy', label: 'Boy', src: '/avatars/boy.svg' },
  { id: 'girl', label: 'Girl', src: '/avatars/girl.svg' },
  { id: 'boy-2', label: 'Boy 2', src: '/avatars/boy-2.svg' },
  { id: 'girl-2', label: 'Girl 2', src: '/avatars/girl-2.svg' },
]

const normalizeMessage = (message) => ({
  id: message.id ?? `local-${Date.now()}-${Math.random()}`,
  name: message.name || 'Visitor',
  location: message.location || 'Website visitor',
  time: formatTime(message.created_at || message.time),
  text: message.text || '',
  avatar: message.avatar || '/avatars/boy.svg',
  isSelf: Boolean(message.isSelf),
})

const dedupeMessages = (messages, incoming) => {
  const map = new Map()

  messages.forEach((message) => map.set(message.id, message))
  const existing = map.get(incoming.id)
  map.set(incoming.id, {
    ...incoming,
    isSelf: incoming.isSelf || existing?.isSelf || false,
  })

  return Array.from(map.values())
}

const getSessionId = () => {
  const key = 'shander_visitor_session'

  try {
    const current = sessionStorage.getItem(key)
    if (current) return current

    const nextId = globalThis.crypto?.randomUUID?.() || `session-${Date.now()}-${Math.random()}`
    sessionStorage.setItem(key, nextId)
    return nextId
  } catch {
    return `session-${Date.now()}-${Math.random()}`
  }
}

export default function ConversationHubModal() {
  const { chatModal, closeChatModal } = useUI()
  const [messages, setMessages] = useState([])
  const [visitorCount, setVisitorCount] = useState(0)

  const [userName, setUserName] = useState(() => {
    try {
      return localStorage.getItem('shander_conv_hub_user') || 'Visitor'
    } catch {
      return 'Visitor'
    }
  })

  const [userAvatar, setUserAvatar] = useState(() => {
    try {
      const saved = localStorage.getItem('shander_conv_hub_avatar')
      if (saved) return saved
      const randomAvatar = VISITOR_AVATARS[Math.floor(Math.random() * 2)].src
      localStorage.setItem('shander_conv_hub_avatar', randomAvatar)
      return randomAvatar
    } catch {
      return '/avatars/boy.svg'
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

  useEffect(() => {
    const loadMessages = async () => {
      if (supabase) {
        const { data, error } = await supabase
          .from('conversation_messages')
          .select('*')
          .order('created_at', { ascending: true })
          .limit(200)

        if (!error && Array.isArray(data)) {
          setMessages(data.map(normalizeMessage))
          return
        }
      }

      try {
        const saved = localStorage.getItem('shander_conv_hub_messages')
        if (!saved) {
          setMessages([])
          return
        }

        const parsed = JSON.parse(saved)
        setMessages(Array.isArray(parsed) ? parsed.map(normalizeMessage) : [])
      } catch {
        setMessages([])
      }
    }

    const loadVisitorCount = async () => {
      if (!supabase) {
        setVisitorCount(1)
        return
      }

      const { count, error } = await supabase.from('site_visits').select('*', { count: 'exact' })

      if (!error && typeof count === 'number') {
        setVisitorCount(count)
      }
    }

    const registerVisitor = async () => {
      if (!supabase) return

      const sessionId = getSessionId()
      const seenKey = 'shander_visitor_registered'

      if (sessionStorage.getItem(seenKey) === 'true') return

      const { error } = await supabase.from('site_visits').insert([
        {
          session_id: sessionId,
          user_agent: navigator.userAgent,
          referrer: document.referrer || 'direct',
        },
      ])

      if (!error) {
        sessionStorage.setItem(seenKey, 'true')
      }

      const { count: totalCount } = await supabase.from('site_visits').select('*', { count: 'exact' })
      if (typeof totalCount === 'number') {
        setVisitorCount(totalCount)
      }
    }

    loadMessages()
    loadVisitorCount()
    registerVisitor()

    if (!supabase) return

    const messagesChannel = supabase
      .channel('public:conversation_messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'conversation_messages' },
        (payload) => {
          const nextMessage = normalizeMessage({
            ...payload.new,
            isSelf: false,
          })

          setMessages((current) => dedupeMessages(current, nextMessage))
        }
      )
      .subscribe()

    const visitorChannel = supabase
      .channel('public:site_visits')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'site_visits' },
        async () => {
          const { count } = await supabase.from('site_visits').select('*', { count: 'exact' })
          if (typeof count === 'number') {
            setVisitorCount(count)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(messagesChannel)
      supabase.removeChannel(visitorChannel)
    }
  }, [])

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
  }, [messages.length, chatModal.open])

  const handleSelectAvatar = (avatarSrc) => {
    playClickSound(0.14)
    setUserAvatar(avatarSrc)
    try {
      localStorage.setItem('shander_conv_hub_avatar', avatarSrc)
    } catch {}
  }

  const handleSaveName = () => {
    const trimmed = nameInput.trim() || 'Visitor'
    setUserName(trimmed)
    setIsEditingName(false)

    try {
      localStorage.setItem('shander_conv_hub_user', trimmed)
    } catch {}
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    const trimmed = inputText.trim()
    if (!trimmed) return

    playClickSound()

    const safeName = userName || 'Visitor'
    const newMessage = {
      id: `user-${Date.now()}`,
      name: safeName,
      location: 'Website visitor',
      time: 'just now',
      text: trimmed,
      avatar: userAvatar,
      isSelf: true,
    }

    if (supabase) {
      const { data, error } = await supabase
        .from('conversation_messages')
        .insert([
          {
            name: safeName,
            location: 'Website visitor',
            text: trimmed,
            avatar: userAvatar,
          },
        ])
        .select()

      if (!error && data && data[0]) {
        const savedMessage = normalizeMessage({ ...data[0], isSelf: true })
        setMessages((current) => dedupeMessages(current, savedMessage))
      } else {
        const stored = JSON.parse(localStorage.getItem('shander_conv_hub_messages') || '[]')
        const nextMessages = [...stored, newMessage]
        localStorage.setItem('shander_conv_hub_messages', JSON.stringify(nextMessages))
        setMessages((current) => dedupeMessages(current, newMessage))
      }
    } else {
      const stored = JSON.parse(localStorage.getItem('shander_conv_hub_messages') || '[]')
      const nextMessages = [...stored, newMessage]
      localStorage.setItem('shander_conv_hub_messages', JSON.stringify(nextMessages))
      setMessages((current) => dedupeMessages(current, newMessage))
    }

    setInputText('')
    playCardSlideSound()
  }

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
            <div className="conv-hub-header">
              <div className="conv-hub-header__meta">
                <div className="conv-hub-header__count">
                  <FiMessageSquare className="conv-hub-header__icon" aria-hidden="true" />
                  <span>
                    {messages.length} {messages.length === 1 ? 'message' : 'messages'}
                  </span>
                </div>

                <div className="conv-hub-header__live">
                  <span className="conv-hub-header__dot" aria-hidden="true" />
                  <span>{visitorCount} visitors</span>
                </div>
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
                        <span className="conv-hub-meta__location">{msg.location}</span>
                        <span className="conv-hub-meta__device" aria-hidden="true">
                          💻
                        </span>
                        <span className="conv-hub-meta__sep">·</span>
                        <span className="conv-hub-meta__time">{msg.time}</span>
                      </div>

                      <div className="conv-hub-bubble">{msg.text}</div>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="conv-hub-bottom">
              <div className="conv-hub-identity">
                <div className="conv-hub-avatar-picker" role="radiogroup" aria-label="Choose visitor avatar">
                  {VISITOR_AVATARS.map((av) => (
                    <button
                      key={av.id}
                      type="button"
                      className={`conv-hub-avatar-opt ${userAvatar === av.src ? 'is-active' : ''}`}
                      onClick={() => handleSelectAvatar(av.src)}
                      title={`Select ${av.label}`}
                      aria-label={`Select ${av.label}`}
                    >
                      <img src={av.src} alt={av.label} />
                    </button>
                  ))}
                </div>

                <span className="conv-hub-identity__sep">·</span>

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

