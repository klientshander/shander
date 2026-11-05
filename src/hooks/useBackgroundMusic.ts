import { useEffect, useRef, useState, useCallback } from 'react'

const MUSIC_SRC = '/background-music/mice-on-venus.mp3'
const START_TIME = 30 // Start at exact 30 seconds (iconic C418 piano intro)
const TARGET_VOLUME = 0.38

export function useBackgroundMusic() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(() => {
    try {
      const saved = localStorage.getItem('shander_bg_music')
      return saved === 'false'
    } catch {
      return false
    }
  })

  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const audio = new Audio(MUSIC_SRC)
    audio.loop = true
    audio.preload = 'auto'
    audio.volume = TARGET_VOLUME
    audioRef.current = audio

    const setPositionTo30 = () => {
      try {
        if (audio.currentTime < START_TIME) {
          audio.currentTime = START_TIME
        }
      } catch {}
    }

    // Set to 30s as soon as audio metadata is ready
    audio.addEventListener('loadedmetadata', setPositionTo30)
    audio.addEventListener('canplay', setPositionTo30)

    // Ensure loop restarts at 30 seconds instead of silence
    audio.addEventListener('timeupdate', () => {
      if (audio.currentTime < 1) {
        setPositionTo30()
      }
    })
    audio.addEventListener('ended', () => {
      setPositionTo30()
      audio.play().catch(() => {})
    })

    const tryPlay = () => {
      setPositionTo30()
      audio.play().then(() => {
        setIsPlaying(true)
        setIsMuted(false)
      }).catch(() => {
        // Autoplay blocked by browser policy until user gesture
      })
    }

    // Auto-play on first user interaction (click, scroll, keypress, touch)
    const handleFirstInteraction = () => {
      try {
        const savedMute = localStorage.getItem('shander_bg_music') === 'false'
        if (!savedMute) {
          tryPlay()
        }
      } catch {}
      removeInteractionListeners()
    }

    const removeInteractionListeners = () => {
      window.removeEventListener('pointerdown', handleFirstInteraction)
      window.removeEventListener('click', handleFirstInteraction)
      window.removeEventListener('keydown', handleFirstInteraction)
      window.removeEventListener('touchstart', handleFirstInteraction)
    }

    const savedMute = localStorage.getItem('shander_bg_music') === 'false'
    if (!savedMute) {
      setPositionTo30()
      audio.play().then(() => {
        setIsPlaying(true)
        setIsMuted(false)
      }).catch(() => {
        window.addEventListener('pointerdown', handleFirstInteraction, { passive: true })
        window.addEventListener('click', handleFirstInteraction, { passive: true })
        window.addEventListener('keydown', handleFirstInteraction, { passive: true })
        window.addEventListener('touchstart', handleFirstInteraction, { passive: true })
      })
    }

    // Duck / pause when switching tabs, resume when returning
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (!audio.paused) {
          audio.pause()
        }
      } else {
        const isUserMuted = localStorage.getItem('shander_bg_music') === 'false'
        if (!isUserMuted && isPlaying) {
          audio.play().catch(() => {})
        }
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      removeInteractionListeners()
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      audio.removeEventListener('loadedmetadata', setPositionTo30)
      audio.removeEventListener('canplay', setPositionTo30)
      audio.pause()
      audio.src = ''
    }
  }, [])

  const toggleMusic = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return

    if (!audio.paused) {
      audio.pause()
      setIsPlaying(false)
      setIsMuted(true)
      try {
        localStorage.setItem('shander_bg_music', 'false')
      } catch {}
    } else {
      try {
        if (audio.currentTime < START_TIME) {
          audio.currentTime = START_TIME
        }
      } catch {}
      audio.play().then(() => {
        setIsPlaying(true)
        setIsMuted(false)
        try {
          localStorage.setItem('shander_bg_music', 'true')
        } catch {}
      }).catch(() => {})
    }
  }, [])

  return { isPlaying, isMuted, toggleMusic }
}
