import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { supabase } from '../utils/supabase'

const UIContext = createContext(null)

export function UIProvider({ children }) {
  const [lightbox, setLightbox] = useState({ open: false, src: '', alt: '', caption: '' })
  const [certModal, setCertModal] = useState({ open: false, title: '', org: '', img: '' })
  const [videoModal, setVideoModal] = useState({ open: false, title: '', url: '' })
  const [chessModal, setChessModal] = useState({ open: false })
  const [chatModal, setChatModal] = useState({ open: false })
  const [cmdOpen, setCmdOpen] = useState(false)
  const [snippetModal, setSnippetModal] = useState({ open: false })
  const [toast, setToast] = useState({ show: false, message: '' })
  const [visitorCount, setVisitorCount] = useState(1)
  const toastTimer = useRef(null)

  useEffect(() => {
    if (!supabase) return

    const fetchCount = async () => {
      const { count, error } = await supabase
        .from('site_visits')
        .select('*', { count: 'exact' })
      if (!error && typeof count === 'number') {
        setVisitorCount(count)
      }
    }

    fetchCount()

    const registerUniqueVisitor = async () => {
      const isLocalhost =
        typeof window !== 'undefined' &&
        (window.location.hostname === 'localhost' ||
          window.location.hostname === '127.0.0.1' ||
          window.location.hostname.startsWith('192.168.'))

      const isBot =
        typeof navigator !== 'undefined' &&
        (navigator.webdriver || /HeadlessChrome|bot|crawl|spider/i.test(navigator.userAgent))

      if (isLocalhost || isBot) return

      const visitorKey = 'shander_unique_visitor_id'
      let visitorId = null

      try {
        visitorId = localStorage.getItem(visitorKey)
      } catch {}

      if (visitorId) return

      const nextVisitorId =
        globalThis.crypto?.randomUUID?.() || `vis-${Date.now()}-${Math.random()}`

      try {
        localStorage.setItem(visitorKey, nextVisitorId)
      } catch {}

      const { error } = await supabase.from('site_visits').insert([
        {
          session_id: nextVisitorId,
          user_agent: navigator.userAgent,
          referrer: document.referrer || 'direct',
        },
      ])

      if (!error) {
        fetchCount()
      }
    }

    registerUniqueVisitor()

    const visitorChannel = supabase
      .channel('public:site_visits')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'site_visits' },
        async () => {
          const { count } = await supabase
            .from('site_visits')
            .select('*', { count: 'exact' })
          if (typeof count === 'number') {
            setVisitorCount(count)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(visitorChannel)
    }
  }, [])

  const openLightbox = useCallback((src, alt, caption) => {
    setLightbox({ open: true, src, alt: alt || '', caption: caption || '' })
  }, [])
  const closeLightbox = useCallback(() => setLightbox((s) => ({ ...s, open: false })), [])

  const openCertModal = useCallback((title, org, img) => {
    setCertModal({ open: true, title, org: org || '', img: img || '' })
  }, [])
  const closeCertModal = useCallback(() => setCertModal((s) => ({ ...s, open: false })), [])

  const openVideoModal = useCallback((title, url) => {
    setVideoModal({ open: true, title: title || 'Project demo', url: url || '' })
  }, [])
  const closeVideoModal = useCallback(() => setVideoModal((s) => ({ ...s, open: false, url: '' })), [])

  const openChessModal = useCallback(() => setChessModal({ open: true }), [])
  const closeChessModal = useCallback(() => setChessModal({ open: false }), [])

  const openSnippetModal = useCallback(() => setSnippetModal({ open: true }), [])
  const closeSnippetModal = useCallback(() => setSnippetModal({ open: false }), [])

  const openChatModal = useCallback(() => setChatModal({ open: true }), [])
  const closeChatModal = useCallback(() => setChatModal({ open: false }), [])

  const openCmd = useCallback(() => setCmdOpen(true), [])
  const closeCmd = useCallback(() => setCmdOpen(false), [])

  const showToast = useCallback((message) => {
    clearTimeout(toastTimer.current)
    setToast({ show: true, message })
    toastTimer.current = setTimeout(() => setToast((s) => ({ ...s, show: false })), 2200)
  }, [])

  const closeAllOverlays = useCallback(() => {
    setLightbox((s) => ({ ...s, open: false }))
    setCertModal((s) => ({ ...s, open: false }))
    setVideoModal((s) => ({ ...s, open: false, url: '' }))
    setChessModal({ open: false })
    setSnippetModal({ open: false })
    setChatModal({ open: false })
    setCmdOpen(false)
  }, [])

  const value = useMemo(
    () => ({
      lightbox,
      openLightbox,
      closeLightbox,
      certModal,
      openCertModal,
      closeCertModal,
      videoModal,
      openVideoModal,
      closeVideoModal,
      chessModal,
      openChessModal,
      closeChessModal,
      snippetModal,
      openSnippetModal,
      closeSnippetModal,
      chatModal,
      openChatModal,
      closeChatModal,
      cmdOpen,
      openCmd,
      closeCmd,
      toast,
      showToast,
      visitorCount,
      closeAllOverlays,
    }),
    [
      lightbox,
      certModal,
      videoModal,
      chessModal,
      snippetModal,
      chatModal,
      cmdOpen,
      toast,
      visitorCount,
      openLightbox,
      closeLightbox,
      openCertModal,
      closeCertModal,
      openVideoModal,
      closeVideoModal,
      openChessModal,
      closeChessModal,
      openSnippetModal,
      closeSnippetModal,
      openChatModal,
      closeChatModal,
      openCmd,
      closeCmd,
      showToast,
      closeAllOverlays,
    ]
  )

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>
}

export function useUI() {
  const ctx = useContext(UIContext)
  if (!ctx) throw new Error('useUI must be used within a UIProvider')
  return ctx
}
