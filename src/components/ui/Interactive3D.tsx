import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { playClickSound } from '../../utils/sound'
import './Interactive3D.css'

export type ShapeMode = 'core' | 'crystal' | 'matrix' | 'gyro'

interface Interactive3DProps {
  theme?: 'dark' | 'light'
}

const MODES: { id: ShapeMode; label: string; meta: string }[] = [
  { id: 'core', label: 'Torus Core', meta: '1,920 tris · Dual-Mesh' },
  { id: 'crystal', label: 'Iso Crystal', meta: '320 tris · Cage + Satellites' },
  { id: 'matrix', label: 'Voxel Cube', meta: '27 nodes · Reactive Array' },
  { id: 'gyro', label: 'Dyson Gyro', meta: '4 rings · Orbital Gimbal' },
]

export default function Interactive3D({ theme = 'dark' }: Interactive3DProps) {
  const mountRef = useRef<HTMLDivElement | null>(null)
  const [mode, setMode] = useState<ShapeMode>('core')
  const [wireframe, setWireframe] = useState(false)
  const [autoRotate, setAutoRotate] = useState(true)

  const stateRef = useRef({
    mode: 'core' as ShapeMode,
    wireframe: false,
    autoRotate: true,
    theme: theme || 'dark',
    pulse: 0,
    pulseVel: 0,
    isDragging: false,
    lastX: 0,
    lastY: 0,
    velX: 0.008,
    velY: 0.005,
    pointerX: 0,
    pointerY: 0,
    rebuild: null as (() => void) | null,
    triggerPulse: null as (() => void) | null,
  })

  stateRef.current.mode = mode
  stateRef.current.wireframe = wireframe
  stateRef.current.autoRotate = autoRotate
  stateRef.current.theme = theme || 'dark'

  useEffect(() => {
    stateRef.current.rebuild?.()
  }, [mode, wireframe, theme])

  useEffect(() => {
    const container = mountRef.current
    if (!container) return

    const width = container.clientWidth || 380
    const height = container.clientHeight || 340

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100)
    camera.position.set(0, 0, 6.2)

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.setSize(width, height)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.15
    container.innerHTML = ''
    container.appendChild(renderer.domElement)

    // Root groups
    const rootGroup = new THREE.Group()
    const shapeGroup = new THREE.Group()
    const ringsGroup = new THREE.Group()
    const particlesGroup = new THREE.Group()
    rootGroup.add(shapeGroup)
    rootGroup.add(ringsGroup)
    scene.add(rootGroup)
    scene.add(particlesGroup)

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
    scene.add(ambientLight)

    const keyLight = new THREE.DirectionalLight(0x7aa7ff, 2.8)
    keyLight.position.set(4, 5, 5)
    scene.add(keyLight)

    const fillLight = new THREE.DirectionalLight(0x38bdf8, 1.4)
    fillLight.position.set(-5, -3, 3)
    scene.add(fillLight)

    const rimLight = new THREE.PointLight(0xa855f7, 3.2, 12)
    rimLight.position.set(0, -3.5, -2)
    scene.add(rimLight)

    // Floating starfield particles
    const particleCount = 90
    const particleGeo = new THREE.BufferGeometry()
    const positions = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i++) {
      const r = 2.4 + Math.random() * 2.2
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = r * Math.cos(phi)
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const particleMat = new THREE.PointsMaterial({
      color: 0x7aa7ff,
      size: 0.045,
      transparent: true,
      opacity: 0.65,
    })
    const particleSystem = new THREE.Points(particleGeo, particleMat)
    particlesGroup.add(particleSystem)

    // Dynamic elements references for animation
    let dynamicParts: THREE.Object3D[] = []
    let voxelOrigins: THREE.Vector3[] = []

    const clearGroup = (group: THREE.Group) => {
      while (group.children.length > 0) {
        const child = group.children[0] as THREE.Mesh
        if (child.geometry) child.geometry.dispose()
        if (Array.isArray(child.material)) {
          child.material.forEach((m) => m.dispose())
        } else if (child.material) {
          child.material.dispose()
        }
        group.remove(child)
      }
    }

    const buildSceneGeometry = () => {
      clearGroup(shapeGroup)
      clearGroup(ringsGroup)
      dynamicParts = []
      voxelOrigins = []

      const isLight = stateRef.current.theme === 'light'
      const wf = stateRef.current.wireframe
      const currentMode = stateRef.current.mode

      const primaryColor = isLight ? 0x2563eb : 0x7aa7ff
      const bodyColor = isLight ? 0x1e293b : 0x111827
      const wireColor = isLight ? 0x2563eb : 0x93c5fd
      particleMat.color.setHex(primaryColor)

      const mainMat = new THREE.MeshStandardMaterial({
        color: wf ? primaryColor : bodyColor,
        metalness: 0.78,
        roughness: 0.22,
        wireframe: wf,
        emissive: new THREE.Color(primaryColor),
        emissiveIntensity: wf ? 0.45 : 0.14,
        flatShading: currentMode === 'crystal',
      })

      const wireOverlayMat = new THREE.MeshBasicMaterial({
        color: wireColor,
        wireframe: true,
        transparent: true,
        opacity: wf ? 0.15 : 0.32,
      })

      const ringMat = new THREE.MeshBasicMaterial({
        color: primaryColor,
        transparent: true,
        opacity: isLight ? 0.45 : 0.38,
        side: THREE.DoubleSide,
      })

      if (currentMode === 'core') {
        // Torus Knot + wireframe shell + 2 orbital rings
        const knotGeo = new THREE.TorusKnotGeometry(1.05, 0.32, 128, 24, 2, 3)
        const knotMesh = new THREE.Mesh(knotGeo, mainMat)
        shapeGroup.add(knotMesh)

        const shellGeo = new THREE.TorusKnotGeometry(1.09, 0.34, 64, 12, 2, 3)
        const shellMesh = new THREE.Mesh(shellGeo, wireOverlayMat)
        shapeGroup.add(shellMesh)
        dynamicParts.push(shellMesh)

        const ring1 = new THREE.Mesh(new THREE.TorusGeometry(1.95, 0.015, 16, 100), ringMat)
        ring1.rotation.x = Math.PI / 2.6
        ringsGroup.add(ring1)

        const ring2 = new THREE.Mesh(new THREE.TorusGeometry(2.2, 0.012, 16, 100), ringMat)
        ring2.rotation.y = Math.PI / 3
        ring2.rotation.x = -Math.PI / 4
        ringsGroup.add(ring2)
      } else if (currentMode === 'crystal') {
        // Faceted Icosahedron + outer wireframe cage + orbiting satellites
        const icoGeo = new THREE.IcosahedronGeometry(1.25, 1)
        const icoMesh = new THREE.Mesh(icoGeo, mainMat)
        shapeGroup.add(icoMesh)

        const cageGeo = new THREE.IcosahedronGeometry(1.58, 1)
        const cageMesh = new THREE.Mesh(cageGeo, wireOverlayMat)
        shapeGroup.add(cageMesh)
        dynamicParts.push(cageMesh)

        // 6 satellite octahedrons
        const satGeo = new THREE.OctahedronGeometry(0.14, 0)
        const satMat = new THREE.MeshStandardMaterial({
          color: primaryColor,
          emissive: primaryColor,
          emissiveIntensity: 0.6,
          metalness: 0.5,
          roughness: 0.2,
          wireframe: wf,
        })
        for (let i = 0; i < 6; i++) {
          const angle = (i / 6) * Math.PI * 2
          const sat = new THREE.Mesh(satGeo, satMat)
          sat.position.set(Math.cos(angle) * 2.05, Math.sin(angle * 2) * 0.45, Math.sin(angle) * 2.05)
          ringsGroup.add(sat)
        }

        const orbitRing = new THREE.Mesh(new THREE.TorusGeometry(2.05, 0.012, 16, 96), ringMat)
        orbitRing.rotation.x = Math.PI / 2
        ringsGroup.add(orbitRing)
      } else if (currentMode === 'matrix') {
        // 3x3x3 Voxel Cube Array that expands on pulse/hover
        const boxGeo = new THREE.BoxGeometry(0.46, 0.46, 0.46)
        const edgeGeo = new THREE.EdgesGeometry(boxGeo)
        const edgeMat = new THREE.LineBasicMaterial({
          color: wireColor,
          transparent: true,
          opacity: 0.55,
        })

        const step = 0.58
        for (let x = -1; x <= 1; x++) {
          for (let y = -1; y <= 1; y++) {
            for (let z = -1; z <= 1; z++) {
              const cube = new THREE.Mesh(boxGeo, mainMat)
              const origin = new THREE.Vector3(x * step, y * step, z * step)
              cube.position.copy(origin)
              if (!wf) {
                const edges = new THREE.LineSegments(edgeGeo, edgeMat)
                cube.add(edges)
              }
              shapeGroup.add(cube)
              dynamicParts.push(cube)
              voxelOrigins.push(origin)
            }
          }
        }
      } else if (currentMode === 'gyro') {
        // Glowing central sphere + 4 concentric gimbal rings
        const coreGeo = new THREE.OctahedronGeometry(0.75, 2)
        const coreMat = new THREE.MeshStandardMaterial({
          color: primaryColor,
          emissive: primaryColor,
          emissiveIntensity: 0.5,
          metalness: 0.6,
          roughness: 0.15,
          wireframe: true,
        })
        const coreMesh = new THREE.Mesh(coreGeo, coreMat)
        shapeGroup.add(coreMesh)

        const innerSphere = new THREE.Mesh(
          new THREE.SphereGeometry(0.48, 32, 32),
          mainMat
        )
        shapeGroup.add(innerSphere)

        const radii = [1.15, 1.48, 1.82, 2.15]
        radii.forEach((r, idx) => {
          const rGeo = new THREE.TorusGeometry(r, 0.032 - idx * 0.004, 16, 100)
          const rMesh = new THREE.Mesh(rGeo, idx % 2 === 0 ? mainMat : wireOverlayMat)
          rMesh.rotation.set(idx * 0.6, idx * 0.8, idx * 0.4)
          ringsGroup.add(rMesh)
          dynamicParts.push(rMesh)
        })
      }
    }

    stateRef.current.rebuild = buildSceneGeometry
    stateRef.current.triggerPulse = () => {
      stateRef.current.pulseVel = 0.28
    }

    buildSceneGeometry()

    // Resize observer
    const onResize = () => {
      if (!container) return
      const w = container.clientWidth || 380
      const h = container.clientHeight || 340
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', onResize)

    // Animation loop
    let rafId = 0
    let clock = 0

    const animate = () => {
      rafId = requestAnimationFrame(animate)
      clock += 0.016

      const s = stateRef.current

      // Spring physics for pulse shockwave
      s.pulse += s.pulseVel
      s.pulseVel += (0 - s.pulse) * 0.14
      s.pulseVel *= 0.82

      // Rotation physics
      if (!s.isDragging) {
        if (s.autoRotate) {
          s.velX += (0.007 - s.velX) * 0.05
          s.velY += (0.004 - s.velY) * 0.05
        } else {
          s.velX *= 0.92
          s.velY *= 0.92
        }
      }

      shapeGroup.rotation.y += s.velX
      shapeGroup.rotation.x += s.velY

      // Subtle floating bob
      rootGroup.position.y = Math.sin(clock * 1.8) * 0.08

      // Rings & particles counter-rotation
      ringsGroup.rotation.y -= 0.006
      ringsGroup.rotation.z += 0.004
      particlesGroup.rotation.y += 0.0018
      particlesGroup.rotation.x = s.pointerY * 0.25

      // Light follows pointer subtly
      keyLight.position.x = 4 + s.pointerX * 3
      keyLight.position.y = 5 - s.pointerY * 3

      // Mode-specific dynamic reactions
      const pulseScale = 1 + s.pulse * 0.35
      if (s.mode === 'matrix') {
        const breathe = 1 + Math.sin(clock * 2.4) * 0.08 + s.pulse * 0.65
        dynamicParts.forEach((cube, idx) => {
          const orig = voxelOrigins[idx]
          if (orig) {
            cube.position.set(orig.x * breathe, orig.y * breathe, orig.z * breathe)
            cube.rotation.x = s.pulse * 0.8
            cube.rotation.y = s.pulse * 0.8
          }
        })
      } else if (s.mode === 'gyro') {
        dynamicParts.forEach((ring, idx) => {
          const dir = idx % 2 === 0 ? 1 : -1
          ring.rotation.x += 0.012 * dir * (1 + idx * 0.25)
          ring.rotation.y += 0.009 * -dir
          ring.scale.setScalar(1 + s.pulse * 0.18)
        })
      } else {
        shapeGroup.scale.setScalar(pulseScale)
        dynamicParts.forEach((part) => {
          part.scale.setScalar(1 + s.pulse * 0.25)
        })
      }

      renderer.render(scene, camera)
    }

    animate()

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', onResize)
      clearGroup(shapeGroup)
      clearGroup(ringsGroup)
      particleGeo.dispose()
      particleMat.dispose()
      renderer.dispose()
    }
  }, [])

  // Pointer handlers for 3D orbit drag & click pulse
  const dragDistanceRef = useRef(0)

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    stateRef.current.isDragging = true
    stateRef.current.lastX = e.clientX
    stateRef.current.lastY = e.clientY
    dragDistanceRef.current = 0
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    stateRef.current.pointerX = ((e.clientX - rect.left) / rect.width) * 2 - 1
    stateRef.current.pointerY = ((e.clientY - rect.top) / rect.height) * 2 - 1

    if (!stateRef.current.isDragging) return
    const dx = e.clientX - stateRef.current.lastX
    const dy = e.clientY - stateRef.current.lastY
    stateRef.current.lastX = e.clientX
    stateRef.current.lastY = e.clientY
    dragDistanceRef.current += Math.hypot(dx, dy)

    stateRef.current.velX = dx * 0.012
    stateRef.current.velY = dy * 0.012
  }

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    stateRef.current.isDragging = false
    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch {
      // ignore
    }
    if (dragDistanceRef.current < 6) {
      playClickSound()
      stateRef.current.triggerPulse?.()
    }
  }

  const activeMeta = MODES.find((m) => m.id === mode)?.meta || ''

  return (
    <div className="rd-3d-showcase" data-reveal>
      <div className="rd-3d-showcase__stage-wrap">
        <div className="rd-3d-showcase__hud-top">
          <span className="rd-3d-showcase__badge">
            <span className="rd-3d-showcase__dot" /> WEBGL 2.0 // THREE.JS
          </span>
          <span className="rd-3d-showcase__telemetry">{activeMeta}</span>
        </div>

        <div
          ref={mountRef}
          className="rd-3d-showcase__canvas"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          role="img"
          aria-label="Interactive 3D geometry canvas — drag to rotate, click to pulse"
        />

        <div className="rd-3d-showcase__hud-bottom">
          <span>Drag to orbit 360° • Click object to shockwave</span>
        </div>
      </div>

      <div className="rd-3d-showcase__controls">
        <span className="rd-pill">
          <span className="rd-pill__dot" /> Interactive 3D Lab
        </span>
        <h3 className="rd-3d-showcase__title">3D Cyber-Core &amp; Geometry</h3>
        <p className="rd-3d-showcase__desc">
          Real-time Three.js WebGL sculpture rendered directly in your browser. Drag the model to
          spin with inertia, click it to trigger a physics shockwave, or switch geometries below.
        </p>

        <div className="rd-3d-showcase__modes" role="group" aria-label="Select 3D geometry">
          {MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              className={`rd-3d-mode-btn ${mode === m.id ? 'is-active' : ''}`}
              onClick={() => {
                playClickSound()
                setMode(m.id)
                stateRef.current.triggerPulse?.()
              }}
            >
              {m.label}
            </button>
          ))}
        </div>

        <div className="rd-3d-showcase__toggles">
          <button
            type="button"
            className={`rd-3d-toggle-btn ${wireframe ? 'is-on' : ''}`}
            onClick={() => {
              playClickSound()
              setWireframe((w) => !w)
            }}
          >
            Wireframe: {wireframe ? 'ON' : 'OFF'}
          </button>
          <button
            type="button"
            className={`rd-3d-toggle-btn ${autoRotate ? 'is-on' : ''}`}
            onClick={() => {
              playClickSound()
              setAutoRotate((r) => !r)
            }}
          >
            Auto-Orbit: {autoRotate ? 'ON' : 'OFF'}
          </button>
          <button
            type="button"
            className="rd-3d-toggle-btn rd-3d-toggle-btn--pulse"
            onClick={() => {
              playClickSound()
              stateRef.current.triggerPulse?.()
            }}
          >
            Pulse Shockwave ⚡
          </button>
        </div>
      </div>
    </div>
  )
}

