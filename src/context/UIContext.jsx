import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'

const UIContext = createContext(null)

export function UIProvider({ children }) {
  const [lightbox, setLightbox] = useState({ open: false, src: '', alt: '', caption: '' })
  const [certModal, setCertModal] = useState({ open: false, title: '', org: '', img: '' })
  const [videoModal, setVideoModal] = useState({ open: false, title: '', url: '' })
  const [cmdOpen, setCmdOpen] = useState(false)
  const [toast, setToast] = useState({ show: false, message: '' })
  const toastTimer = useRef(null)

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
      cmdOpen,
      openCmd,
      closeCmd,
      toast,
      showToast,
      closeAllOverlays,
    }),
    [lightbox, certModal, videoModal, cmdOpen, toast, openLightbox, closeLightbox, openCertModal, closeCertModal, openVideoModal, closeVideoModal, openCmd, closeCmd, showToast, closeAllOverlays]
  )

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>
}

export function useUI() {
  const ctx = useContext(UIContext)
  if (!ctx) throw new Error('useUI must be used within a UIProvider')
  return ctx
}
