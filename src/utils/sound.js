// ============================================================================
// Web Audio API Synthesizer with Tactile Sound Effects & Switchable Profiles
// Enhanced volume, prominent transients, studio-balanced dynamics
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

// Master transparent dynamics compressor/limiter
// Keeps transients loud, punchy, and prominent while preventing distortion or clipping
function getMasterOutput(ctx) {
  if (!masterCompressor || masterCompressor.context !== ctx) {
    masterCompressor = ctx.createDynamicsCompressor()
    masterCompressor.threshold.setValueAtTime(-4, ctx.currentTime)
    masterCompressor.knee.setValueAtTime(6, ctx.currentTime)
    masterCompressor.ratio.setValueAtTime(3.2, ctx.currentTime)
    masterCompressor.attack.setValueAtTime(0.002, ctx.currentTime)
    masterCompressor.release.setValueAtTime(0.05, ctx.currentTime)
    masterCompressor.connect(ctx.destination)
  }
  return masterCompressor
}

function getNoiseBuffer(ctx) {
  if (!noiseBuffer || noiseBuffer.sampleRate !== ctx.sampleRate) {
    const bufferSize = Math.floor(ctx.sampleRate * 0.08) // 80ms noise
    noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = noiseBuffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      // Filtered exponential decay noise curve for tactile acoustic texture
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.025))
    }
  }
  return noiseBuffer
}

// Available sound profiles
export const SOUND_PROFILES = [
  { id: 'tactile', label: 'Tactile Switch', desc: 'Mechanical switch click & card snap' },
  { id: 'pop', label: 'Haptic Pop', desc: 'Modern bubbly haptic tap' },
  { id: 'wooden', label: 'Minimal Thud', desc: 'Deep warm acoustic block click' },
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
  if (typeof window === 'undefined') return 'tactile'
  try {
    return localStorage.getItem('shander_sound_profile') || 'tactile'
  } catch {
    return 'tactile'
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
  // Play preview of the newly chosen sound effect immediately with prominent volume
  setTimeout(() => {
    playClickSound(0.2)
  }, 10)
  return SOUND_PROFILES[nextIndex]
}

// ----------------------------------------------------------------------------
// 1. 3D Card Deck Slide & Flip Sound Effect (for Project Carousel)
// ----------------------------------------------------------------------------
export function playCardSlideSound(volume = 0.22) {
  if (!isSoundEnabled()) return
  try {
    const ctx = getAudioContext()
    if (!ctx) return
    const master = getMasterOutput(ctx)
    const now = ctx.currentTime
    const profile = getCurrentSoundProfile()

    if (profile === 'pop') {
      // Clean modern double-pop for card slide
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(880, now)
      osc.frequency.exponentialRampToValueAtTime(340, now + 0.05)

      gain.gain.setValueAtTime(volume * 0.95, now)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05)

      osc.connect(gain)
      gain.connect(master)
      osc.start(now)
      osc.stop(now + 0.055)
      return
    }

    if (profile === 'wooden') {
      // Resonant woodblock slide
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(580, now)
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.045)

      gain.gain.setValueAtTime(volume * 1.0, now)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.045)

      osc.connect(gain)
      gain.connect(master)
      osc.start(now)
      osc.stop(now + 0.05)
      return
    }

    // Default: 'tactile' card shuffle friction glide + crisp lock snap
    // 1. Friction glide sweep
    const noise = ctx.createBufferSource()
    noise.buffer = getNoiseBuffer(ctx)

    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.setValueAtTime(2800, now)
    filter.frequency.exponentialRampToValueAtTime(700, now + 0.05)
    filter.Q.setValueAtTime(2.6, now)

    const noiseGain = ctx.createGain()
    noiseGain.gain.setValueAtTime(volume * 0.85, now)
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05)

    noise.connect(filter)
    filter.connect(noiseGain)
    noiseGain.connect(master)

    noise.start(now)
    noise.stop(now + 0.055)

    // 2. Physical card snap
    const snapOsc = ctx.createOscillator()
    const snapGain = ctx.createGain()
    snapOsc.type = 'triangle'
    snapOsc.frequency.setValueAtTime(440, now + 0.006)
    snapOsc.frequency.exponentialRampToValueAtTime(110, now + 0.045)

    snapGain.gain.setValueAtTime(0.0001, now)
    snapGain.gain.setValueAtTime(volume * 0.75, now + 0.006)
    snapGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.048)

    snapOsc.connect(snapGain)
    snapGain.connect(master)

    snapOsc.start(now + 0.006)
    snapOsc.stop(now + 0.052)
  } catch {}
}

// ----------------------------------------------------------------------------
// 2. Upgraded Tactile UI Click Sound (for Buttons, Links, Tabs)
// ----------------------------------------------------------------------------
export function playClickSound(volume = 0.18) {
  if (!isSoundEnabled()) return
  try {
    const ctx = getAudioContext()
    if (!ctx) return
    const master = getMasterOutput(ctx)
    const now = ctx.currentTime
    const profile = getCurrentSoundProfile()

    if (profile === 'pop') {
      // Clean modern bubble tap
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(1260, now)
      osc.frequency.exponentialRampToValueAtTime(390, now + 0.032)

      gain.gain.setValueAtTime(volume * 0.95, now)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.032)

      osc.connect(gain)
      gain.connect(master)
      osc.start(now)
      osc.stop(now + 0.035)
      return
    }

    if (profile === 'wooden') {
      // Warm resonant woodblock click
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(920, now)
      osc.frequency.exponentialRampToValueAtTime(210, now + 0.03)

      gain.gain.setValueAtTime(volume * 1.0, now)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03)

      osc.connect(gain)
      gain.connect(master)
      osc.start(now)
      osc.stop(now + 0.033)
      return
    }

    // Default: 'tactile' Mechanical Switch Click
    // 1. High-frequency contact click transient
    const noise = ctx.createBufferSource()
    noise.buffer = getNoiseBuffer(ctx)

    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.setValueAtTime(3400, now)
    filter.Q.setValueAtTime(3.6, now)

    const noiseGain = ctx.createGain()
    noiseGain.gain.setValueAtTime(volume * 0.88, now)
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.016)

    noise.connect(filter)
    filter.connect(noiseGain)
    noiseGain.connect(master)

    noise.start(now)
    noise.stop(now + 0.018)

    // 2. Tactile body thud
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(390, now)
    osc.frequency.exponentialRampToValueAtTime(130, now + 0.026)

    gain.gain.setValueAtTime(volume * 0.68, now)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.026)

    osc.connect(gain)
    gain.connect(master)

    osc.start(now)
    osc.stop(now + 0.028)
  } catch {}
}

// ----------------------------------------------------------------------------
// 3. Card Demo / Media Zoom Inspect Chime
// ----------------------------------------------------------------------------
export function playCardInspectSound(volume = 0.18) {
  if (!isSoundEnabled()) return
  try {
    const ctx = getAudioContext()
    if (!ctx) return
    const master = getMasterOutput(ctx)
    const now = ctx.currentTime

    // Two harmonic ascending tones (B5 -> E6)
    const osc1 = ctx.createOscillator()
    const gain1 = ctx.createGain()
    osc1.type = 'sine'
    osc1.frequency.setValueAtTime(987.77, now)
    gain1.gain.setValueAtTime(volume * 0.6, now)
    gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.075)
    osc1.connect(gain1)
    gain1.connect(master)
    osc1.start(now)
    osc1.stop(now + 0.08)

    const osc2 = ctx.createOscillator()
    const gain2 = ctx.createGain()
    osc2.type = 'sine'
    osc2.frequency.setValueAtTime(1318.51, now + 0.025)
    gain2.gain.setValueAtTime(0.0001, now)
    gain2.gain.setValueAtTime(volume * 0.75, now + 0.025)
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.11)
    osc2.connect(gain2)
    gain2.connect(master)
    osc2.start(now + 0.025)
    osc2.stop(now + 0.115)
  } catch {}
}

// ----------------------------------------------------------------------------
// 4. High-Pitched Crystal UI Hover Sound (Prominent & Balanced)
// ----------------------------------------------------------------------------
export function playHoverSound(volume = 0.14) {
  if (!isSoundEnabled()) return
  try {
    const ctx = getAudioContext()
    if (!ctx) return
    const master = getMasterOutput(ctx)
    const now = ctx.currentTime

    // High frequency ascending crystal blip (2600Hz -> 3800Hz)
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(2600, now)
    osc.frequency.exponentialRampToValueAtTime(3800, now + 0.028)

    gain.gain.setValueAtTime(0.0001, now)
    gain.gain.exponentialRampToValueAtTime(volume * 0.9, now + 0.003)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03)

    osc.connect(gain)
    gain.connect(master)

    osc.start(now)
    osc.stop(now + 0.032)

    // High harmonic sparkle overtone (4400Hz -> 5200Hz)
    const sparkOsc = ctx.createOscillator()
    const sparkGain = ctx.createGain()

    sparkOsc.type = 'triangle'
    sparkOsc.frequency.setValueAtTime(4400, now)
    sparkOsc.frequency.exponentialRampToValueAtTime(5200, now + 0.02)

    sparkGain.gain.setValueAtTime(0.0001, now)
    sparkGain.gain.setValueAtTime(volume * 0.45, now + 0.002)
    sparkGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.022)

    sparkOsc.connect(sparkGain)
    sparkGain.connect(master)

    sparkOsc.start(now)
    sparkOsc.stop(now + 0.024)
  } catch {}
}

// ----------------------------------------------------------------------------
// 5. Chess Sound Effects
// ----------------------------------------------------------------------------
export function playChessMoveSound() {
  if (!isSoundEnabled()) return
  try {
    const ctx = getAudioContext()
    if (!ctx) return
    const master = getMasterOutput(ctx)
    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'triangle'
    osc.frequency.setValueAtTime(460, now)
    osc.frequency.exponentialRampToValueAtTime(160, now + 0.045)

    gain.gain.setValueAtTime(0.18, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045)

    osc.connect(gain)
    gain.connect(master)

    osc.start(now)
    osc.stop(now + 0.05)
  } catch {}
}

export function playChessCaptureSound() {
  if (!isSoundEnabled()) return
  try {
    const ctx = getAudioContext()
    if (!ctx) return
    const master = getMasterOutput(ctx)
    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(750, now)
    osc.frequency.exponentialRampToValueAtTime(220, now + 0.065)

    gain.gain.setValueAtTime(0.22, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.065)

    osc.connect(gain)
    gain.connect(master)

    osc.start(now)
    osc.stop(now + 0.07)
  } catch {}
}

export function playChessCheckSound() {
  if (!isSoundEnabled()) return
  try {
    const ctx = getAudioContext()
    if (!ctx) return
    const master = getMasterOutput(ctx)
    const now = ctx.currentTime
    const osc1 = ctx.createOscillator()
    const gain1 = ctx.createGain()
    osc1.type = 'sine'
    osc1.frequency.setValueAtTime(880, now)
    osc1.frequency.exponentialRampToValueAtTime(1320, now + 0.085)
    gain1.gain.setValueAtTime(0.18, now)
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.085)
    osc1.connect(gain1)
    gain1.connect(master)
    osc1.start(now)
    osc1.stop(now + 0.09)
  } catch {}
}

export function playChessWinSound() {
  if (!isSoundEnabled()) return
  try {
    const ctx = getAudioContext()
    if (!ctx) return
    const master = getMasterOutput(ctx)

    const notes = [523.25, 659.25, 783.99, 1046.5]
    notes.forEach((freq, idx) => {
      const start = ctx.currentTime + idx * 0.08
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(freq, start)
      gain.gain.setValueAtTime(0.16, start)
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.22)
      osc.connect(gain)
      gain.connect(master)
      osc.start(start)
      osc.stop(start + 0.22)
    })
  } catch {}
}
