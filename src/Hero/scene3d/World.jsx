// ---------------------------------------------------------------
// The WebGL world. Everything sits on one z-axis so the whole hero is
// ONE continuous camera move:
//
//    z = +6        camera start
//    z =  0        monitor (scene 1)        ← camera dives through its screen
//    z = -3 … -56  code tunnel (scene 2)
//    z = -66       browser window (scenes 3–6)
//
// No component here owns animation logic: each useFrame just reads
// the numbers GSAP writes into S (see heroState.js).
// ---------------------------------------------------------------
import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import { S } from '../heroState'
import { drawMonitor, drawSnippet, drawGlyph, drawBrowser, SNIPPETS, GLYPHS, paint } from '../draw'

const BROWSER_Z = -66
const damp = THREE.MathUtils.damp

function seeded(seed) {
  let s = seed
  return () => (s = (s * 16807) % 2147483647) / 2147483647
}

/** A CanvasTexture that is repainted only when `key()` changes. */
function useLiveTexture(W, H, painter, key) {
  const { canvas, tex } = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = W
    canvas.height = H
    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    tex.anisotropy = 4
    return { canvas, tex }
  }, [W, H])
  const last = useRef(null)
  useFrame(() => {
    const k = key()
    if (k === last.current) return
    last.current = k
    painter(canvas.getContext('2d'), W, H)
    tex.needsUpdate = true
  })
  useEffect(() => () => tex.dispose(), [tex])
  return tex
}

// ------------------------------------------------------------------
// Camera rig — the single continuous move.
// ------------------------------------------------------------------
export function CameraRig() {
  const { camera } = useThree()
  const look = useMemo(() => new THREE.Vector3(), [])
  const p = useRef({ x: 0, y: 0 })
  useFrame((_, dt) => {
    // Depth: each scene contributes a slice of the dolly.
    const z =
      6 - // start in front of the monitor
      5.65 * S.dive - // push into the screen
      57.6 * S.tunnel - // fly the tunnel
      3.8 * S.zoom + // push into the browser
      7.8 * S.out // pull back for the deploy shot

    // Tunnel sway — only while flying (sin(π·t) is 0 at both ends).
    const fly = Math.sin(Math.PI * S.tunnel)
    const swayX = Math.sin(S.tunnel * Math.PI * 2.2) * 0.9 * fly
    const swayY = Math.cos(S.tunnel * Math.PI * 3.1) * 0.45 * fly

    // Pointer parallax, eased.
    p.current.x = damp(p.current.x, S.px, 3, dt)
    p.current.y = damp(p.current.y, S.py, 3, dt)

    // v2: short camera shake when the deploy lands (envelope peaks at deploy≈0.3)
    const hit = Math.max(0, 1 - Math.abs(S.deploy - 0.3) / 0.12)
    const t = performance.now() / 1000
    const shakeX = Math.sin(t * 61) * 0.06 * hit
    const shakeY = Math.cos(t * 53) * 0.05 * hit

    camera.position.set(swayX + p.current.x * 0.35 + shakeX, swayY - p.current.y * 0.22 + 0.6 * S.deploy + shakeY, z)
    look.set(swayX * 0.4, swayY * 0.4 + 0.3 * S.deploy, z - 10)
    camera.lookAt(look)

    // Widen the lens mid-tunnel for a sense of speed.
    const fov = 45 + 22 * fly
    if (Math.abs(camera.fov - fov) > 0.01) {
      camera.fov = fov
      camera.updateProjectionMatrix()
    }
  })
  return null
}

// ------------------------------------------------------------------
// SCENE 1 — floating monitor
// ------------------------------------------------------------------
export function Monitor() {
  const group = useRef()
  const tex = useLiveTexture(
    1024,
    600,
    (ctx, W, H) => drawMonitor(ctx, W, H, S.boot, S.dive),
    () =>
      // repaint on progress change, plus a 2Hz tick for the blinking caret
      // while diving, repaint ~20×/s so the glitch flickers
      `${Math.round(S.boot * 300)}:${Math.floor(performance.now() / 500) % 2}:${S.dive > 0.02 && S.dive < 1 ? Math.floor(performance.now() / 50) : 0}`,
  )
  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    const g = group.current
    const calm = 1 - S.dive
    g.position.y = 0.35 + Math.sin(t * 0.8) * 0.06 * calm
    g.rotation.y = Math.sin(t * 0.3) * 0.12 * calm
    g.rotation.x = Math.sin(t * 0.25) * 0.03 * calm
    g.visible = S.tunnel < 0.2 // gone once we're deep in the tunnel
  })
  return (
    <group ref={group}>
      <RoundedBox args={[3.5, 2.2, 0.14]} radius={0.07} smoothness={4}>
        <meshStandardMaterial color="#1A1230" metalness={0.6} roughness={0.35} />
      </RoundedBox>
      <mesh position={[0, 0, 0.075]}>
        <planeGeometry args={[3.3, 1.94]} />
        <meshBasicMaterial map={tex} toneMapped={false} />
      </mesh>
      <mesh position={[0, -1.42, -0.12]}>
        <boxGeometry args={[0.28, 0.66, 0.08]} />
        <meshStandardMaterial color="#1E1636" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0, -1.76, -0.05]}>
        <boxGeometry args={[1.3, 0.06, 0.55]} />
        <meshStandardMaterial color="#1E1636" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* screen spill light */}
      <pointLight position={[0, 0, 1.2]} intensity={6} distance={6} color="#7C5CFF" />
    </group>
  )
}

// ------------------------------------------------------------------
// SCENE 2 — code tunnel (instanced)
//   • one InstancedMesh per snippet texture (6 copies each)
//   • one InstancedMesh per glyph texture
//   • one InstancedMesh of "blocks" with per-instance color
// ------------------------------------------------------------------
function placeAlongTunnel(count, rnd, { rMin = 2.4, rMax = 4.6, zMin = -4, zMax = -56 } = {}) {
  const dummy = new THREE.Object3D()
  return Array.from({ length: count }, () => {
    const a = rnd() * Math.PI * 2
    const r = rMin + rnd() * (rMax - rMin)
    dummy.position.set(Math.cos(a) * r, Math.sin(a) * r * 0.75, zMin + rnd() * (zMax - zMin))
    // face roughly toward the tunnel axis / camera
    dummy.rotation.set((rnd() - 0.5) * 0.2, -Math.cos(a) * 0.45, (rnd() - 0.5) * 0.12)
    const s = 0.75 + rnd() * 0.5
    dummy.scale.set(s, s, s)
    dummy.updateMatrix()
    return dummy.matrix.clone()
  })
}

function TexturedInstances({ texture, aspect, size, matrices }) {
  const ref = useRef()
  useLayoutEffect(() => {
    matrices.forEach((m, i) => ref.current.setMatrixAt(i, m))
    ref.current.instanceMatrix.needsUpdate = true
  }, [matrices])
  return (
    <instancedMesh ref={ref} args={[null, null, matrices.length]} frustumCulled={false}>
      <planeGeometry args={[size * aspect, size]} />
      <meshBasicMaterial map={texture} transparent depthWrite={false} side={THREE.DoubleSide} toneMapped={false} />
    </instancedMesh>
  )
}

export function CodeTunnel() {
  const group = useRef()
  const blocks = useRef()

  const { snippetTex, glyphTex, layout } = useMemo(() => {
    const mk = (canvas) => {
      const t = new THREE.CanvasTexture(canvas)
      t.colorSpace = THREE.SRGBColorSpace
      t.anisotropy = 4
      return t
    }
    const snippetTex = SNIPPETS.map((s) => mk(paint(720, 300, (ctx, W, H) => drawSnippet(ctx, W, H, s))))
    const glyphTex = GLYPHS.map((g) => mk(paint(256, 256, (ctx, W, H) => drawGlyph(ctx, W, H, g))))
    const rnd = seeded(1337)
    const layout = {
      snippets: snippetTex.map(() => placeAlongTunnel(6, rnd)),
      glyphs: glyphTex.map(() => placeAlongTunnel(5, rnd, { rMin: 1.8, rMax: 5 })),
      blocks: placeAlongTunnel(110, rnd, { rMin: 2, rMax: 6.5, zMin: -2, zMax: -60 }),
    }
    return { snippetTex, glyphTex, layout }
  }, [])

  useEffect(
    () => () => {
      snippetTex.forEach((t) => t.dispose())
      glyphTex.forEach((t) => t.dispose())
    },
    [snippetTex, glyphTex],
  )

  // Block instances: flat "Gutenberg-like" slabs in the palette colors.
  useLayoutEffect(() => {
    const m = blocks.current
    const palette = ['#7C5CFF', '#2DE2C7', '#FF8FA3', '#2C2348', '#B6A4FF'].map((c) => new THREE.Color(c))
    const rnd = seeded(99)
    const dummy = new THREE.Object3D()
    layout.blocks.forEach((mat, i) => {
      dummy.matrix.copy(mat)
      dummy.matrix.decompose(dummy.position, dummy.quaternion, dummy.scale)
      dummy.scale.set(0.2 + rnd() * 0.55, 0.12 + rnd() * 0.32, 0.06)
      dummy.updateMatrix()
      m.setMatrixAt(i, dummy.matrix)
      m.setColorAt(i, palette[(rnd() * palette.length) | 0])
    })
    m.instanceMatrix.needsUpdate = true
    m.instanceColor.needsUpdate = true
  }, [layout])

  useFrame(({ clock }) => {
    // slow swirl so the tunnel feels alive even when scroll stops
    group.current.rotation.z = Math.sin(clock.elapsedTime * 0.12) * 0.05 + S.tunnel * 0.22
    group.current.visible = S.dive > 0.4 && S.zoom < 1
  })

  return (
    <group ref={group}>
      {snippetTex.map((t, i) => (
        <TexturedInstances key={`s${i}`} texture={t} aspect={720 / 300} size={1.05} matrices={layout.snippets[i]} />
      ))}
      {glyphTex.map((t, i) => (
        <TexturedInstances key={`g${i}`} texture={t} aspect={1} size={0.9} matrices={layout.glyphs[i]} />
      ))}
      <instancedMesh ref={blocks} args={[null, null, layout.blocks.length]} frustumCulled={false}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial metalness={0.3} roughness={0.4} emissive="#160A30" />
      </instancedMesh>
    </group>
  )
}

// ------------------------------------------------------------------
// SCENES 3–6 — the 3D browser window
// ------------------------------------------------------------------
export function Browser3D() {
  const group = useRef()
  const glow = useRef()
  const tex = useLiveTexture(
    1240,
    700,
    (ctx, W, H) => drawBrowser(ctx, W, H, S.assemble, S.deploy > 0.2),
    () => `${Math.round(S.assemble * 400)}:${S.deploy > 0.2}`,
  )
  useFrame(({ clock }) => {
    const g = group.current
    // rise: from below the frame (hidden in fog) to center
    g.position.y = -7 * (1 - S.rise) + 1.25 * S.out + Math.sin(clock.elapsedTime * 0.7) * 0.04 * S.rise
    g.position.z = BROWSER_Z
    // tilt flattens as it settles, then a slight tilt back on zoom-out
    g.rotation.x = 0.5 * (1 - S.rise) - 0.08 * S.out
    g.rotation.y = -0.15 * (1 - S.rise) + 0.12 * S.out * Math.sin(clock.elapsedTime * 0.5)
    const s = 1 - 0.42 * S.out
    g.scale.setScalar(s)
    g.visible = S.tunnel > 0.6
    glow.current.material.opacity = 0.35 * S.rise + 0.4 * S.deploy
  })
  return (
    <group ref={group} position={[0, -7, BROWSER_Z]}>
      {/* glow behind */}
      <mesh ref={glow} position={[0, 0, -0.3]}>
        <planeGeometry args={[9, 6]} />
        <meshBasicMaterial
          color="#7C5CFF"
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          alphaMap={glowMap}
        />
      </mesh>
      <RoundedBox args={[6.5, 4.15, 0.14]} radius={0.09} smoothness={4}>
        <meshStandardMaterial color="#140E24" metalness={0.5} roughness={0.4} />
      </RoundedBox>
      {/* top bar */}
      <mesh position={[0, 1.86, 0.075]}>
        <planeGeometry args={[6.35, 0.34]} />
        <meshBasicMaterial color="#1C1434" />
      </mesh>
      {['#ff5f57', '#febc2e', '#28c840'].map((c, i) => (
        <mesh key={c} position={[-2.95 + i * 0.18, 1.86, 0.08]}>
          <circleGeometry args={[0.05, 16]} />
          <meshBasicMaterial color={c} />
        </mesh>
      ))}
      {/* tabs (they "detach" as DOM cards in scene 5) */}
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[-1.9 + i * 1.1, 1.86, 0.08]}>
          <planeGeometry args={[1.0, 0.22]} />
          <meshBasicMaterial color={i === 0 ? '#2A2142' : '#211A36'} />
        </mesh>
      ))}
      {/* page */}
      <mesh position={[0, -0.17, 0.075]}>
        <planeGeometry args={[6.35, 3.62]} />
        <meshBasicMaterial map={tex} toneMapped={false} />
      </mesh>
    </group>
  )
}

// Soft radial alpha map for glows (built once).
const glowMap = (() => {
  if (typeof document === 'undefined') return null
  const c = paint(128, 128, (ctx, W, H) => {
    const g = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, W / 2)
    g.addColorStop(0, '#fff')
    g.addColorStop(1, '#000')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, W, H)
  })
  return new THREE.CanvasTexture(c)
})()

// ------------------------------------------------------------------
// Background starfield of tiny "pixels" along the whole journey
// ------------------------------------------------------------------
export function Starfield({ count = 1400 }) {
  const geo = useMemo(() => {
    const rnd = seeded(7)
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const a = rnd() * Math.PI * 2
      const r = 7 + rnd() * 22
      pos[i * 3] = Math.cos(a) * r
      pos[i * 3 + 1] = Math.sin(a) * r * 0.7
      pos[i * 3 + 2] = 10 - rnd() * 95
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    return g
  }, [count])
  return (
    <points geometry={geo}>
      <pointsMaterial size={0.05} color="#A096BE" transparent opacity={0.7} sizeAttenuation depthWrite={false} />
    </points>
  )
}

// ==================================================================
// v2 EFFECTS
// ==================================================================

// ------------------------------------------------------------------
// Aurora sky — a big inside-out sphere that follows the camera, so the
// whole journey happens under moving northern lights. The shader draws
// three wavy bands (aqua → violet → coral) that brighten on deploy.
// ------------------------------------------------------------------
const skyVert = /* glsl */ `
  varying vec3 vDir;
  void main() {
    vDir = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`
const skyFrag = /* glsl */ `
  varying vec3 vDir;
  uniform float uTime;
  uniform float uBoost;
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y);
  }
  void main() {
    vec3 d = normalize(vDir);
    float a = atan(d.x, -d.z);
    float band = 0.0;
    for (int i = 0; i < 3; i++) {
      float fi = float(i);
      float wave = sin(a * 3.0 + uTime * 0.12 * (fi + 1.0) + fi * 2.0) * 0.1
                 + noise(vec2(a * 4.0 + fi * 10.0, uTime * 0.08)) * 0.14;
      float centre = 0.12 + fi * 0.13 + wave;
      float curtain = 0.6 + 0.4 * noise(vec2(a * 22.0, uTime * 0.3 + fi));   // vertical streaks
      band += smoothstep(0.14, 0.0, abs(d.y - centre)) * (0.65 - fi * 0.15) * curtain;
    }
    vec3 aqua = vec3(0.18, 0.89, 0.78);
    vec3 violet = vec3(0.49, 0.36, 1.0);
    vec3 coral = vec3(1.0, 0.56, 0.64);
    vec3 col = mix(aqua, violet, smoothstep(0.05, 0.4, d.y));
    col = mix(col, coral, smoothstep(0.38, 0.62, d.y) * 0.6);
    vec3 night = vec3(0.043, 0.027, 0.086);
    gl_FragColor = vec4(night + col * band * (0.32 + uBoost * 0.55), 1.0);
  }
`

export function AuroraSky() {
  const mesh = useRef()
  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uBoost: { value: 0 } }), [])
  useFrame(({ clock, camera }) => {
    uniforms.uTime.value = clock.elapsedTime
    uniforms.uBoost.value = S.deploy
    mesh.current.position.copy(camera.position)
  })
  return (
    <mesh ref={mesh} renderOrder={-1} frustumCulled={false}>
      <sphereGeometry args={[100, 48, 24]} />
      <shaderMaterial
        vertexShader={skyVert}
        fragmentShader={skyFrag}
        uniforms={uniforms}
        side={THREE.BackSide}
        depthWrite={false}
        fog={false}
      />
    </mesh>
  )
}

// ------------------------------------------------------------------
// Warp streaks — 320 thin light bars around the tunnel. They stretch
// with scroll speed, so a fast flick of the wheel feels like light-speed.
// ------------------------------------------------------------------
export function WarpStreaks({ count = 320 }) {
  const ref = useRef()
  const prev = useRef(0)
  const stretch = useRef(1)
  const lastApplied = useRef(-1)
  const base = useMemo(() => {
    const rnd = seeded(4242)
    return Array.from({ length: count }, () => {
      const a = rnd() * Math.PI * 2
      const r = 1.6 + rnd() * 6
      return { x: Math.cos(a) * r, y: Math.sin(a) * r * 0.8, z: -2 - rnd() * 60, len: 0.4 + rnd() * 1.2 }
    })
  }, [count])

  useLayoutEffect(() => {
    const palette = ['#7C5CFF', '#2DE2C7', '#B6A4FF', '#FF8FA3'].map((c) => new THREE.Color(c))
    const rnd = seeded(77)
    base.forEach((_, i) => ref.current.setColorAt(i, palette[(rnd() * palette.length) | 0]))
    ref.current.instanceColor.needsUpdate = true
  }, [base])

  const dummy = useMemo(() => new THREE.Object3D(), [])
  useFrame((_, dt) => {
    const v = Math.abs(S.tunnel - prev.current) / Math.max(dt, 1e-3) // tunnel progress per second
    prev.current = S.tunnel
    const target = 1 + Math.min(v * 30, 14)
    stretch.current += (target - stretch.current) * 0.15
    const visible = S.dive > 0.3 && S.rise < 0.6
    ref.current.visible = visible
    ref.current.material.opacity = 0.25 + Math.min(0.6, (stretch.current - 1) / 8)
    if (!visible || Math.abs(stretch.current - lastApplied.current) < 0.04) return
    lastApplied.current = stretch.current
    base.forEach((b, i) => {
      dummy.position.set(b.x, b.y, b.z)
      dummy.scale.set(1, 1, b.len * stretch.current)
      dummy.updateMatrix()
      ref.current.setMatrixAt(i, dummy.matrix)
    })
    ref.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={ref} args={[null, null, count]} frustumCulled={false}>
      <boxGeometry args={[0.018, 0.018, 1]} />
      <meshBasicMaterial transparent opacity={0.3} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
    </instancedMesh>
  )
}

// ------------------------------------------------------------------
// Deploy shockwave — two rings burst out from the browser when the
// build goes live (deploy 0.2 → 0.75), fading as they grow.
// ------------------------------------------------------------------
export function DeployShockwave() {
  const a = useRef()
  const b = useRef()
  useFrame(() => {
    ;[
      [a.current, 0.18],
      [b.current, 0.28],
    ].forEach(([m, start]) => {
      const t = THREE.MathUtils.clamp((S.deploy - start) / 0.45, 0, 1)
      m.visible = t > 0 && t < 1
      const s = 1 + t * 10
      m.scale.set(s, s, s)
      m.material.opacity = (1 - t) * 0.9
    })
  })
  return (
    <group position={[0, 1.25, BROWSER_Z + 0.2]}>
      <mesh ref={a} visible={false}>
        <ringGeometry args={[0.95, 1, 96]} />
        <meshBasicMaterial color="#2DE2C7" transparent blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>
      <mesh ref={b} visible={false}>
        <ringGeometry args={[0.9, 1, 96]} />
        <meshBasicMaterial color="#7C5CFF" transparent blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>
    </group>
  )
}
