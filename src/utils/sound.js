// ============================================================================
// Web Audio API Synthesizer — Retro 8-Bit / Arcade Sound Effects
// Authentic vintage square-wave chiptune blips, retro jumps, & arcade chirps
// ============================================================================

let audioCtx = null
let noiseBuffer = null
let masterCompressor = null

function getAudioContext() {
  if (typeof window === 'undefined') return null
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext
    if (AudioContextClass) {
      audioCtx = new AudioContextClass()
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {})
  }
  return audioCtx
}

// Master limiter to keep chiptune levels balanced and punchy without distortion
function getMasterOutput(ctx) {
  if (!masterCompressor || masterCompressor.context !== ctx) {
    masterCompressor = ctx.createDynamicsCompressor()
    masterCompressor.threshold.setValueAtTime(-4, ctx.currentTime)
    masterCompressor.knee.setValueAtTime(6, ctx.currentTime)
    masterCompressor.ratio.setValueAtTime(3.5, ctx.currentTime)
    masterCompressor.attack.setValueAtTime(0.001, ctx.currentTime)
    masterCompressor.release.setValueAtTime(0.04, ctx.currentTime)
    masterCompressor.connect(ctx.destination)
  }
  return masterCompressor
}

// Auto-unlock AudioContext on first user interaction anywhere
if (typeof window !== 'undefined') {
  const unlockAudio = () => {
    const ctx = getAudioContext()
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {})
    }
  }
  window.addEventListener('pointerdown', unlockAudio, { once: true, passive: true })
  window.addEventListener('keydown', unlockAudio, { once: true, passive: true })
  window.addEventListener('touchstart', unlockAudio, { once: true, passive: true })
}

// 8-bit pseudo-random noise buffer for vintage arcade hit/impacts
function getNoiseBuffer(ctx) {
  if (!noiseBuffer || noiseBuffer.sampleRate !== ctx.sampleRate) {
    const bufferSize = Math.floor(ctx.sampleRate * 0.05) // 50ms buffer
    noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = noiseBuffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      // 8-bit stepped quantize for lo-fi retro texture
      const step = Math.floor((Math.random() * 2 - 1) * 8) / 8
      const decay = Math.exp(-i / (ctx.sampleRate * 0.015))
      data[i] = step * decay
    }
  }
  return noiseBuffer
}

export const SOUND_PROFILES = [
  { id: 'arcade', label: '8-Bit Arcade', desc: 'Nostalgic retro chiptune blips & pixel game sounds' },
  { id: 'tactile', label: 'Tactile Switch', desc: 'Mechanical switch click & card snap' },
  { id: 'pop', label: 'Haptic Pop', desc: 'Modern bubbly haptic tap' },
]

export function isSoundEnabled() {
  if (typeof window === 'undefined') return false
  try {
    const saved = localStorage.getItem('shander_sound_enabled')
    return saved !== null ? JSON.parse(saved) : true
  } catch {
    return true
  }
}

export function getCurrentSoundProfile() {
  if (typeof window === 'undefined') return 'arcade'
  try {
    return localStorage.getItem('shander_sound_profile') || 'arcade'
  } catch {
    return 'arcade'
  }
}

export function setSoundProfile(profileId) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem('shander_sound_profile', profileId)
    window.dispatchEvent(new CustomEvent('shander_sound_profile_changed', { detail: profileId }))
  } catch {}
}

export function cycleSoundProfile() {
  const current = getCurrentSoundProfile()
  const currentIndex = SOUND_PROFILES.findIndex((p) => p.id === current)
  const nextIndex = (currentIndex + 1) % SOUND_PROFILES.length
  const nextProfile = SOUND_PROFILES[nextIndex].id
  setSoundProfile(nextProfile)
  setTimeout(() => {
    playClickSound(0.12)
  }, 10)
  return SOUND_PROFILES[nextIndex]
}

// ----------------------------------------------------------------------------
// 1. Retro 8-Bit Hover Sound (Nostalgic menu cursor "pip!")
// Like moving the cursor in classic Game Boy / NES menus
// ----------------------------------------------------------------------------
export function playHoverSound(volume = 0.075) {
  if (!isSoundEnabled()) return
  try {
    const ctx = getAudioContext()
    if (!ctx) return
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {})
    }
    const master = getMasterOutput(ctx)
    const now = ctx.currentTime

    // Retro square wave cursor blip (880Hz jumping to 1175Hz in 12ms)
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    const filter = ctx.createBiquadFilter()

    osc.type = 'square'
    osc.frequency.setValueAtTime(880, now) // A5
    osc.frequency.setValueAtTime(1174.66, now + 0.01) // D6

    // CRT / speaker warmth filter to eliminate DAC screech
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(4200, now)

    gain.gain.setValueAtTime(0.0001, now)
    gain.gain.setValueAtTime(volume * 0.85, now + 0.002)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.024)

    osc.connect(filter)
    filter.connect(gain)
    gain.connect(master)

    osc.start(now)
    osc.stop(now + 0.026)
  } catch {}
}

// ----------------------------------------------------------------------------
// 2. Retro 8-Bit Click Sound (Classic arcade menu select "b-dink!")
// Punchy 2-tone arpeggio chirp: C5 -> G5
// ----------------------------------------------------------------------------
export function playClickSound(volume = 0.12) {
  if (!isSoundEnabled()) return
  try {
    const ctx = getAudioContext()
    if (!ctx) return
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {})
    }
    const master = getMasterOutput(ctx)
    const now = ctx.currentTime

    // Classic 8-bit menu select tone (587Hz -> 880Hz)
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    const filter = ctx.createBiquadFilter()

    osc.type = 'square'
    osc.frequency.setValueAtTime(587.33, now) // D5
    osc.frequency.setValueAtTime(880, now + 0.016) // A5

    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(4800, now)

    gain.gain.setValueAtTime(0.0001, now)
    gain.gain.setValueAtTime(volume * 0.9, now + 0.002)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.042)

    osc.connect(filter)
    filter.connect(gain)
    gain.connect(master)

    osc.start(now)
    osc.stop(now + 0.045)
  } catch {}
}

// ----------------------------------------------------------------------------
// 3. Retro 8-Bit Card Slide & Fling (Fast stepped arpeggio warp)
// ----------------------------------------------------------------------------
export function playCardSlideSound(volume = 0.11) {
  if (!isSoundEnabled()) return
  try {
    const ctx = getAudioContext()
    if (!ctx) return
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {})
    }
    const master = getMasterOutput(ctx)
    const now = ctx.currentTime

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    const filter = ctx.createBiquadFilter()

    osc.type = 'square'
    osc.frequency.setValueAtTime(392, now) // G4
    osc.frequency.setValueAtTime(523.25, now + 0.01) // C5
    osc.frequency.setValueAtTime(659.25, now + 0.02) // E5
    osc.frequency.setValueAtTime(783.99, now + 0.03) // G5

    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(4400, now)

    gain.gain.setValueAtTime(0.0001, now)
    gain.gain.setValueAtTime(volume * 0.85, now + 0.002)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.045)

    osc.connect(filter)
    filter.connect(gain)
    gain.connect(master)

    osc.start(now)
    osc.stop(now + 0.048)
  } catch {}
}

// ----------------------------------------------------------------------------
// 4. Retro 8-Bit Inspect / Modal Sound (Classic item found / power-up chime)
// 3-step ascending major triad: E5 -> G#5 -> B5
// ----------------------------------------------------------------------------
export function playCardInspectSound(volume = 0.12) {
  if (!isSoundEnabled()) return
  try {
    const ctx = getAudioContext()
    if (!ctx) return
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {})
    }
    const master = getMasterOutput(ctx)
    const now = ctx.currentTime

    const notes = [659.25, 830.61, 987.77] // E5 -> G#5 -> B5
    notes.forEach((freq, idx) => {
      const start = now + idx * 0.028
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      const filter = ctx.createBiquadFilter()

      osc.type = 'square'
      osc.frequency.setValueAtTime(freq, start)

      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(4500, start)

      gain.gain.setValueAtTime(0.0001, start)
      gain.gain.setValueAtTime(volume * 0.85, start + 0.002)
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.05)

      osc.connect(filter)
      filter.connect(gain)
      gain.connect(master)

      osc.start(start)
      osc.stop(start + 0.052)
    })
  } catch {}
}

// ----------------------------------------------------------------------------
// 5. Retro 8-Bit Chess Sound Effects
// ----------------------------------------------------------------------------
export function playChessMoveSound() {
  if (!isSoundEnabled()) return
  try {
    const ctx = getAudioContext()
    if (!ctx) return
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {})
    }
    const master = getMasterOutput(ctx)
    const now = ctx.currentTime

    // Retro hop / step blip
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'square'
    osc.frequency.setValueAtTime(261.63, now) // C4
    osc.frequency.setValueAtTime(523.25, now + 0.016) // C5

    gain.gain.setValueAtTime(0.12, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.038)

    osc.connect(gain)
    gain.connect(master)
    osc.start(now)
    osc.stop(now + 0.04)
  } catch {}
}

export function playChessCaptureSound() {
  if (!isSoundEnabled()) return
  try {
    const ctx = getAudioContext()
    if (!ctx) return
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {})
    }
    const master = getMasterOutput(ctx)
    const now = ctx.currentTime

    // 8-bit noise hit + downward pitch zap
    const noise = ctx.createBufferSource()
    noise.buffer = getNoiseBuffer(ctx)
    const nGain = ctx.createGain()
    nGain.gain.setValueAtTime(0.14, now)
    nGain.gain.exponentialRampToValueAtTime(0.001, now + 0.035)
    noise.connect(nGain)
    nGain.connect(master)
    noise.start(now)
    noise.stop(now + 0.038)

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(440, now)
    osc.frequency.exponentialRampToValueAtTime(110, now + 0.04)
    gain.gain.setValueAtTime(0.12, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04)
    osc.connect(gain)
    gain.connect(master)
    osc.start(now)
    osc.stop(now + 0.042)
  } catch {}
}

export function playChessCheckSound() {
  if (!isSoundEnabled()) return
  try {
    const ctx = getAudioContext()
    if (!ctx) return
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {})
    }
    const master = getMasterOutput(ctx)
    const now = ctx.currentTime

    // Retro two-tone warning alert
    const osc1 = ctx.createOscillator()
    const gain1 = ctx.createGain()
    osc1.type = 'square'
    osc1.frequency.setValueAtTime(659.25, now) // E5
    osc1.frequency.setValueAtTime(880, now + 0.03) // A5
    gain1.gain.setValueAtTime(0.13, now)
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.065)
    osc1.connect(gain1)
    gain1.connect(master)
    osc1.start(now)
    osc1.stop(now + 0.07)
  } catch {}
}

export function playChessWinSound() {
  if (!isSoundEnabled()) return
  try {
    const ctx = getAudioContext()
    if (!ctx) return
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {})
    }
    const master = getMasterOutput(ctx)

    // Classic 8-bit victory arpeggio: C5 -> E5 -> G5 -> C6
    const notes = [523.25, 659.25, 783.99, 1046.5]
    notes.forEach((freq, idx) => {
      const start = ctx.currentTime + idx * 0.065
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'square'
      osc.frequency.setValueAtTime(freq, start)
      gain.gain.setValueAtTime(0.13, start)
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.18)
      osc.connect(gain)
      gain.connect(master)
      osc.start(start)
      osc.stop(start + 0.19)
    })
  } catch {}
}
