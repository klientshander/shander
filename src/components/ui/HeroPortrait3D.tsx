import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import PaperCrumple from './PaperCrumple'
import './HeroPortrait3D.css'

interface HeroPortrait3DProps {
  src3d?: string
  srcOriginal?: string
  alt?: string
}

type ViewMode = '3d-person' | 'wireframe' | 'crumple'

/**
 * Builds a closed, watertight 3D sculpted character mesh from a transparent cutout image.
 * - Background pixels (alpha < threshold) are completely omitted from the triangle index buffer.
 * - Silhouette interior is inflated in 3D using a Euclidean Distance Transform + spherical cap profile
 *   combined with surface shading relief (Monster-Mash / 3D relief inflation).
 * - Front and back shells meet seamlessly at z = 0 along the silhouette contour.
 */
function buildSculptedPersonGeometry(
  img: HTMLImageElement,
  gridW = 148,
  gridH = 185,
  worldW = 2.75,
  worldH = 3.44
): {
  frontGeo: THREE.BufferGeometry
  backGeo: THREE.BufferGeometry
} {
  const canvas = document.createElement('canvas')
  canvas.width = gridW
  canvas.height = gridH
  const ctx = canvas.getContext('2d')!
  ctx.clearRect(0, 0, gridW, gridH)
  ctx.drawImage(img, 0, 0, gridW, gridH)
  const rgba = ctx.getImageData(0, 0, gridW, gridH).data

  const total = gridW * gridH
  const mask = new Uint8Array(total)
  const lum = new Float32Array(total)
  const phoneBoost = new Float32Array(total)

  // 1. Identify foreground character mask & luminance relief
  for (let y = 0; y < gridH; y++) {
    for (let x = 0; x < gridW; x++) {
      const idx = y * gridW + x
      const p = idx * 4
      const r = rgba[p]
      const g = rgba[p + 1]
      const b = rgba[p + 2]
      const a = rgba[p + 3]

      // Treat opaque and non-white interior pixels as part of the character
      if (a > 42) {
        mask[idx] = 1
      }
      const l = (0.299 * r + 0.587 * g + 0.114 * b) / 255
      lum[idx] = l

      // Detect glowing blue smartphone screen & hands region for extra forward 3D pop
      if (b > r + 20 && b > 140 && y > gridH * 0.65) {
        phoneBoost[idx] = 0.16
      }
    }
  }

  // 2. Two-pass Chamfer Distance Transform from silhouette boundary
  const INF = 1e6
  const dist = new Float32Array(total)
  for (let i = 0; i < total; i++) {
    dist[i] = mask[i] ? INF : 0
  }

  // Forward pass
  for (let y = 0; y < gridH; y++) {
    for (let x = 0; x < gridW; x++) {
      const idx = y * gridW + x
      if (!mask[idx]) continue
      let d = dist[idx]
      if (x > 0) d = Math.min(d, dist[idx - 1] + 1)
      if (y > 0) d = Math.min(d, dist[idx - gridW] + 1)
      if (x > 0 && y > 0) d = Math.min(d, dist[idx - gridW - 1] + 1.414)
      if (x < gridW - 1 && y > 0) d = Math.min(d, dist[idx - gridW + 1] + 1.414)
      dist[idx] = d
    }
  }

  // Backward pass
  for (let y = gridH - 1; y >= 0; y--) {
    for (let x = gridW - 1; x >= 0; x--) {
      const idx = y * gridW + x
      if (!mask[idx]) continue
      let d = dist[idx]
      if (x < gridW - 1) d = Math.min(d, dist[idx + 1] + 1)
      if (y < gridH - 1) d = Math.min(d, dist[idx + gridW] + 1)
      if (x < gridW - 1 && y < gridH - 1) d = Math.min(d, dist[idx + gridW + 1] + 1.414)
      if (x > 0 && y < gridH - 1) d = Math.min(d, dist[idx + gridW - 1] + 1.414)
      dist[idx] = d
    }
  }

  // Smooth the distance field for organic 3D rounded volume
  const smoothDist = new Float32Array(dist)
  const tmp = new Float32Array(total)
  for (let pass = 0; pass < 4; pass++) {
    for (let y = 1; y < gridH - 1; y++) {
      for (let x = 1; x < gridW - 1; x++) {
        const idx = y * gridW + x
        if (!mask[idx]) {
          tmp[idx] = 0
          continue
        }
        tmp[idx] =
          (smoothDist[idx] * 2 +
            smoothDist[idx - 1] +
            smoothDist[idx + 1] +
            smoothDist[idx - gridW] +
            smoothDist[idx + gridW]) /
          6
      }
    }
    smoothDist.set(tmp)
  }

  // Mark silhouette boundary vertices (inside mask, but adjacent to at least one outside vertex)
  const isBoundary = new Uint8Array(total)
  for (let y = 0; y < gridH; y++) {
    for (let x = 0; x < gridW; x++) {
      const idx = y * gridW + x
      if (!mask[idx]) continue
      if (
        x === 0 ||
        x === gridW - 1 ||
        y === 0 ||
        y === gridH - 1 ||
        !mask[idx - 1] ||
        !mask[idx + 1] ||
        !mask[idx - gridW] ||
        !mask[idx + gridW]
      ) {
        isBoundary[idx] = 1
      }
    }
  }

  // 3. Build front & back vertex buffers and UV coordinates
  const frontPos = new Float32Array(total * 3)
  const backPos = new Float32Array(total * 3)
  const uvs = new Float32Array(total * 2)
  const maxRadius = 22.0

  for (let y = 0; y < gridH; y++) {
    const uV = 1 - y / (gridH - 1)
    const py = (0.5 - y / (gridH - 1)) * worldH
    for (let x = 0; x < gridW; x++) {
      const idx = y * gridW + x
      const uU = x / (gridW - 1)
      const px = (x / (gridW - 1) - 0.5) * worldW

      uvs[idx * 2] = uU
      uvs[idx * 2 + 1] = uV

      if (!mask[idx] || isBoundary[idx]) {
        // Boundary vertices sit right on the z = 0 seam so front and back shells close cleanly
        frontPos[idx * 3] = px
        frontPos[idx * 3 + 1] = py
        frontPos[idx * 3 + 2] = 0

        backPos[idx * 3] = px
        backPos[idx * 3 + 1] = py
        backPos[idx * 3 + 2] = 0
      } else {
        const dNorm = Math.min(1, smoothDist[idx] / maxRadius)
        // Spherical cap profile: sqrt(1 - (1 - d)^2) gives realistic 3D rounded limbs/head/torso
        const profile = Math.sqrt(Math.max(0, 1 - (1 - dNorm) * (1 - dNorm)))
        const detail = (lum[idx] - 0.35) * 0.14 + phoneBoost[idx]

        const zFront = Math.max(0.01, profile * 0.46 + detail * dNorm)
        const zBack = -Math.max(0.01, profile * 0.34)

        frontPos[idx * 3] = px
        frontPos[idx * 3 + 1] = py
        frontPos[idx * 3 + 2] = zFront

        backPos[idx * 3] = px
        backPos[idx * 3 + 1] = py
        backPos[idx * 3 + 2] = zBack
      }
    }
  }

  // 4. Emit ONLY triangles where all 3 vertices belong to the character mask
  const frontIndices: number[] = []
  const backIndices: number[] = []

  for (let y = 0; y < gridH - 1; y++) {
    for (let x = 0; x < gridW - 1; x++) {
      const a = y * gridW + x
      const b = a + 1
      const c = a + gridW
      const d = c + 1

      // Triangle 1: (a, c, b)
      if (mask[a] && mask[c] && mask[b]) {
        frontIndices.push(a, c, b)
        backIndices.push(a, b, c) // reversed winding for back shell
      }
      // Triangle 2: (b, c, d)
      if (mask[b] && mask[c] && mask[d]) {
        frontIndices.push(b, c, d)
        backIndices.push(b, d, c)
      }
    }
  }

  const frontGeo = new THREE.BufferGeometry()
  frontGeo.setAttribute('position', new THREE.BufferAttribute(frontPos, 3))
  frontGeo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2))
  frontGeo.setIndex(frontIndices)
  frontGeo.computeVertexNormals()

  const backGeo = new THREE.BufferGeometry()
  backGeo.setAttribute('position', new THREE.BufferAttribute(backPos, 3))
  backGeo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2))
  backGeo.setIndex(backIndices)
  backGeo.computeVertexNormals()

  return { frontGeo, backGeo }
}

export default function HeroPortrait3D({
  src3d = '/gallery/shander-3d-cutout.png',
  srcOriginal = '/gallery/shander.png',
  alt = '3D Character Portrait',
}: HeroPortrait3DProps) {
  const mountRef = useRef<HTMLDivElement | null>(null)
  const [mode, setMode] = useState<ViewMode>('3d-person')
  const [autoSpin, setAutoSpin] = useState(true)
  const [loaded, setLoaded] = useState(false)

  const modeRef = useRef<ViewMode>(mode)
  modeRef.current = mode

  const autoSpinRef = useRef<boolean>(autoSpin)
  autoSpinRef.current = autoSpin

  const frontMatRef = useRef<THREE.MeshStandardMaterial | null>(null)
  const wireMeshRef = useRef<THREE.Mesh | null>(null)
  const pulseRef = useRef(0)

  useEffect(() => {
    const container = mountRef.current
    if (!container) return

    const width = container.clientWidth || 340
    const height = container.clientHeight || 425

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 100)
    camera.position.set(0, 0.02, 5.5)

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.12
    container.innerHTML = ''
    container.appendChild(renderer.domElement)

    // Root 3D character group
    const characterGroup = new THREE.Group()
    scene.add(characterGroup)

    // Minimalist 3D holographic turntable ring beneath the floating person (no background wall)
    const pedestalGroup = new THREE.Group()
    pedestalGroup.position.set(0, -1.68, 0)
    scene.add(pedestalGroup)

    const ringGeo = new THREE.TorusGeometry(0.95, 0.014, 16, 96)
    ringGeo.rotateX(Math.PI / 2)
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xff6b3d,
      transparent: true,
      opacity: 0.45,
    })
    const ringMesh = new THREE.Mesh(ringGeo, ringMat)
    pedestalGroup.add(ringMesh)

    const innerRingGeo = new THREE.TorusGeometry(0.62, 0.008, 12, 72)
    innerRingGeo.rotateX(Math.PI / 2)
    const innerRingMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.35,
    })
    const innerRingMesh = new THREE.Mesh(innerRingGeo, innerRingMat)
    pedestalGroup.add(innerRingMesh)

    // Floating 3D ambient particles around the character
    const particleCount = 32
    const particleGeo = new THREE.BufferGeometry()
    const particlePositions = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2
      const radius = 1.05 + Math.random() * 0.55
      particlePositions[i * 3] = Math.cos(angle) * radius
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 3.1
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 0.9
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3))
    const particleMat = new THREE.PointsMaterial({
      color: 0x60a5fa,
      size: 0.04,
      transparent: true,
      opacity: 0.55,
    })
    const particles = new THREE.Points(particleGeo, particleMat)
    scene.add(particles)

    // Load the isolated transparent cutout & construct the closed 3D person mesh
    let frontMesh: THREE.Mesh | null = null
    let backMesh: THREE.Mesh | null = null
    let wireMesh: THREE.Mesh | null = null
    let charTexture: THREE.Texture | null = null

    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const { frontGeo, backGeo } = buildSculptedPersonGeometry(img, 148, 185, 2.75, 3.44)

      charTexture = new THREE.Texture(img)
      charTexture.colorSpace = THREE.SRGBColorSpace
      charTexture.anisotropy = renderer.capabilities.getMaxAnisotropy()
      charTexture.needsUpdate = true

      const frontMat = new THREE.MeshStandardMaterial({
        map: charTexture,
        roughness: 0.38,
        metalness: 0.08,
        alphaTest: 0.12,
        transparent: true,
      })
      frontMatRef.current = frontMat

      const backMat = new THREE.MeshStandardMaterial({
        map: charTexture,
        color: 0x3a3f4b,
        roughness: 0.72,
        metalness: 0.12,
        alphaTest: 0.12,
        transparent: true,
      })

      frontMesh = new THREE.Mesh(frontGeo, frontMat)
      backMesh = new THREE.Mesh(backGeo, backMat)
      characterGroup.add(frontMesh)
      characterGroup.add(backMesh)

      const wireMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        wireframe: true,
        transparent: true,
        opacity: modeRef.current === 'wireframe' ? 0.38 : 0.0,
      })
      wireMesh = new THREE.Mesh(frontGeo, wireMat)
      wireMesh.position.z = 0.006
      wireMeshRef.current = wireMesh
      characterGroup.add(wireMesh)

      setLoaded(true)
    }
    img.src = src3d

    // Studio 3D lighting + smartphone screen blue glow
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.35)
    scene.add(ambientLight)

    const keyLight = new THREE.DirectionalLight(0xfff5ea, 1.65)
    keyLight.position.set(2.4, 2.8, 3.8)
    scene.add(keyLight)

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.25)
    rimLight.position.set(-2.8, 1.6, -2.2)
    scene.add(rimLight)

    // Smartphone blue-cyan glow right at the phone's 3D coordinates
    const phoneLight = new THREE.PointLight(0x38bdf8, 1.9, 2.8)
    phoneLight.position.set(0.28, -0.82, 0.75)
    characterGroup.add(phoneLight)

    // Interactive cursor light
    const pointerLight = new THREE.PointLight(0xff6b3d, 1.4, 5.5)
    pointerLight.position.set(0, 0, 2.2)
    scene.add(pointerLight)

    // Drag & hover 3D rotation state
    const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 }
    let isDragging = false
    let dragStartX = 0
    let dragStartY = 0
    let accumRotY = 0
    let accumRotX = 0

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true
      dragStartX = e.clientX
      dragStartY = e.clientY
      pulseRef.current = 1.0
    }

    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect()
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1
      const ny = -((e.clientY - rect.top) / rect.height) * 2 + 1
      pointer.targetX = Math.max(-1, Math.min(1, nx))
      pointer.targetY = Math.max(-1, Math.min(1, ny))

      if (isDragging) {
        const dx = (e.clientX - dragStartX) * 0.011
        const dy = (e.clientY - dragStartY) * 0.008
        accumRotY = Math.max(-1.05, Math.min(1.05, accumRotY + dx))
        accumRotX = Math.max(-0.55, Math.min(0.55, accumRotX + dy))
        dragStartX = e.clientX
        dragStartY = e.clientY
      }
    }

    const onPointerUp = () => {
      isDragging = false
    }

    const onPointerLeave = () => {
      isDragging = false
      pointer.targetX = 0
      pointer.targetY = 0
    }

    container.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
    container.addEventListener('pointerleave', onPointerLeave)

    const onResize = () => {
      if (!container) return
      const w = container.clientWidth || 340
      const h = container.clientHeight || 425
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', onResize)

    const clock = new THREE.Clock()
    let rafId = 0

    const animate = () => {
      rafId = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      pointer.x += (pointer.targetX - pointer.x) * 0.09
      pointer.y += (pointer.targetY - pointer.y) * 0.09

      if (!isDragging) {
        accumRotY *= 0.95
        accumRotX *= 0.95
      }

      // Smooth 3D turntable sway + pointer tilt + drag rotation
      const idleTurntableY = autoSpinRef.current ? Math.sin(t * 0.85) * 0.34 : 0
      const idlePitchX = Math.cos(t * 0.65) * 0.05

      const targetRotY = idleTurntableY + pointer.x * 0.48 + accumRotY
      const targetRotX = idlePitchX - pointer.y * 0.26 + accumRotX

      characterGroup.rotation.y += (targetRotY - characterGroup.rotation.y) * 0.1
      characterGroup.rotation.x += (targetRotX - characterGroup.rotation.x) * 0.1

      // 3D floating levitation & click scale pulse
      pulseRef.current *= 0.9
      const scale = 1 + pulseRef.current * 0.045
      characterGroup.scale.setScalar(scale)
      characterGroup.position.y = Math.sin(t * 1.6) * 0.065

      // Pedestal ring counter-rotation
      ringMesh.rotation.z = t * 0.4
      innerRingMesh.rotation.z = -t * 0.65
      const ringScale = 1 + Math.sin(t * 1.6) * 0.04
      pedestalGroup.scale.set(ringScale, 1, ringScale)

      // Move cursor light
      pointerLight.position.x = pointer.x * 2.2
      pointerLight.position.y = pointer.y * 2.2
      phoneLight.intensity = 1.7 + Math.sin(t * 3.2) * 0.4

      // Drift ambient particles
      particles.rotation.y = t * 0.15

      renderer.render(scene, camera)
    }

    animate()

    return () => {
      cancelAnimationFrame(rafId)
      container.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      container.removeEventListener('pointerleave', onPointerLeave)
      window.removeEventListener('resize', onResize)
      if (frontMesh) {
        frontMesh.geometry.dispose()
        ;(frontMesh.material as THREE.Material).dispose()
      }
      if (backMesh) {
        backMesh.geometry.dispose()
        ;(backMesh.material as THREE.Material).dispose()
      }
      if (wireMesh) {
        ;(wireMesh.material as THREE.Material).dispose()
      }
      if (charTexture) charTexture.dispose()
      ringGeo.dispose()
      ringMat.dispose()
      innerRingGeo.dispose()
      innerRingMat.dispose()
      particleGeo.dispose()
      particleMat.dispose()
      renderer.dispose()
    }
  }, [src3d])

  // Sync wireframe visibility when mode changes
  useEffect(() => {
    if (!wireMeshRef.current) return
    const mat = wireMeshRef.current.material as THREE.MeshBasicMaterial
    mat.opacity = mode === 'wireframe' ? 0.38 : 0.0
  }, [mode])

  return (
    <div className="hp3d-root" aria-label={alt}>
      <div
        ref={mountRef}
        className={`hp3d-canvas ${mode === 'crumple' ? 'is-hidden' : ''}`}
      />

      {!loaded && mode !== 'crumple' && (
        <div className="hp3d-loading">Sculpting 3D Model…</div>
      )}

      {mode === 'crumple' && (
        <div className="hp3d-crumple">
          <PaperCrumple
            src={srcOriginal}
            alt={alt}
            width={340}
            height={425}
            sceneHeight="100%"
            releaseBehavior="restore"
            crumpleAmount={0.85}
            crumpleDuration={0.55}
            releaseDuration={0.4}
            foldCount={6}
            foldSharpness={0.6}
            wrinkleDepth={0.65}
            creaseStrength={0.18}
            paperColor="#f4f0e8"
            paperTexture={0.08}
            draggable
            returnToOrigin
            imageFit="cover"
            fitPadding={0}
            roughness={0.92}
            lightIntensity={1.8}
            lightAngle={-35}
            shadow
            shadowOpacity={0.16}
            dragRotation={10}
            dragRadius={180}
            rotation={0}
            seed={7}
            detail={64}
            disabled={false}
          />
        </div>
      )}

      <div className="hp3d-controls" role="toolbar" aria-label="3D character controls">
        <button
          type="button"
          className={`hp3d-pill ${mode === '3d-person' ? 'is-active' : ''}`}
          onClick={() => setMode('3d-person')}
        >
          3D Model
        </button>
        <button
          type="button"
          className={`hp3d-pill ${mode === 'wireframe' ? 'is-active' : ''}`}
          onClick={() => setMode(mode === 'wireframe' ? '3d-person' : 'wireframe')}
        >
          3D Mesh
        </button>
        <button
          type="button"
          className={`hp3d-pill ${autoSpin && mode !== 'crumple' ? 'is-active' : ''}`}
          onClick={() => setAutoSpin((s) => !s)}
        >
          {autoSpin ? 'Spin: On' : 'Spin: Off'}
        </button>
        <button
          type="button"
          className={`hp3d-pill ${mode === 'crumple' ? 'is-active' : ''}`}
          onClick={() => setMode('crumple')}
        >
          Original
        </button>
      </div>
    </div>
  )
}
