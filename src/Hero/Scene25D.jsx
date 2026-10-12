// ---------------------------------------------------------------
// Mobile / no-WebGL version of the same six scenes, in CSS 3D.
// Same contract as Scene3D: read S on every GSAP tick, write transforms.
// The monitor and browser reuse the exact painters from draw.js on
// 2D canvases, so both versions show identical content.
// ---------------------------------------------------------------
import { useEffect, useMemo, useRef } from 'react'
import { gsap } from '../lib/scroll'
import { S } from './heroState'
import { drawMonitor, drawBrowser, drawSnippet, drawGlyph, SNIPPETS, GLYPHS, paint } from './draw'

const PERSPECTIVE = 800
const BROWSER_Z = -5200

function seeded(seed) {
  let s = seed
  return () => (s = (s * 16807) % 2147483647) / 2147483647
}

export default function Scene25D() {
  const monitorRef = useRef(null)
  const monitorCanvas = useRef(null)
  const browserRef = useRef(null)
  const browserCanvas = useRef(null)
  const chipRefs = useRef([])

  // Pre-render snippet/glyph images once, then place them along the tunnel.
  const chips = useMemo(() => {
    const snippetUrls = SNIPPETS.map((s) => paint(720, 300, (c, W, H) => drawSnippet(c, W, H, s)).toDataURL())
    const glyphUrls = GLYPHS.map((g) => paint(256, 256, (c, W, H) => drawGlyph(c, W, H, g)).toDataURL())
    const rnd = seeded(42)
    const list = []
    for (let i = 0; i < 30; i++) {
      const isGlyph = i % 3 === 2
      const side = i % 2 === 0 ? -1 : 1
      list.push({
        src: isGlyph ? glyphUrls[i % glyphUrls.length] : snippetUrls[i % snippetUrls.length],
        w: isGlyph ? 18 : 52, // vw
        x: side * (22 + rnd() * 30), // vw
        y: (rnd() - 0.5) * 70, // vh
        z: -500 - (i / 30) * 4300 - rnd() * 120,
        r: (rnd() - 0.5) * 30,
      })
    }
    return list
  }, [])

  useEffect(() => {
    const mctx = monitorCanvas.current.getContext('2d')
    const bctx = browserCanvas.current.getContext('2d')
    let mKey = ''
    let bKey = ''

    const update = () => {
      // ----- camera depth (mirrors CameraRig in scene3d/World.jsx)
      const camZ = -(650 * S.dive + 4000 * S.tunnel + 420 * S.zoom) + 750 * S.out
      const fly = Math.sin(Math.PI * S.tunnel)
      const swayX = Math.sin(S.tunnel * Math.PI * 2.2) * 6 * fly // vw

      const place = (el, x, y, z, extra = '') => {
        const d = z - camZ // distance toward the viewer (positive = closer)
        if (d > PERSPECTIVE - 60) {
          el.style.opacity = '0'
          return
        }
        const far = -d
        const fog = far > 2600 ? 0 : far > 1600 ? 1 - (far - 1600) / 1000 : 1
        const near = d > 450 ? 1 - (d - 450) / 290 : 1
        el.style.opacity = String(Math.max(0, Math.min(fog, near)))
        el.style.transform = `translate(-50%, -50%) translate3d(calc(${x - swayX}vw), ${y}vh, ${d}px) ${extra}`
      }

      // ----- scene 1: monitor
      const mk = `${Math.round(S.boot * 200)}:${Math.floor(performance.now() / 500) % 2}:${S.dive > 0.02 && S.dive < 1 ? Math.floor(performance.now() / 60) : 0}`
      if (mk !== mKey) {
        mKey = mk
        drawMonitor(mctx, 1024, 600, S.boot, S.dive)
      }
      const bob = Math.sin(performance.now() / 900) * 0.8 * (1 - S.dive)
      place(monitorRef.current, 0, bob - 2, 0, `rotateY(${Math.sin(performance.now() / 2400) * 6 * (1 - S.dive)}deg)`)

      // ----- scene 2: tunnel chips
      // Like the WebGL tunnel: only alive between the dive and the zoom,
      // fading in as we enter the screen and out as the browser rises.
      const chipAlpha = Math.min(1, S.dive * 2) * (1 - 0.75 * S.rise) * (S.zoom > 0.15 ? 0 : 1)
      chips.forEach((c, i) => {
        const el = chipRefs.current[i]
        if (!el) return
        if (chipAlpha <= 0.01) {
          el.style.opacity = '0'
          return
        }
        place(el, c.x, c.y, c.z, `rotateZ(${c.r}deg) rotateY(${-Math.sign(c.x) * 18}deg)`)
        el.style.opacity = String(parseFloat(el.style.opacity) * chipAlpha)
      })

      // ----- scenes 3–6: browser
      const bk = `${Math.round(S.assemble * 240)}:${S.deploy > 0.2}`
      if (bk !== bKey) {
        bKey = bk
        drawBrowser(bctx, 1240, 700, S.assemble, S.deploy > 0.2)
      }
      const riseY = 70 * (1 - S.rise) - 18 * S.out
      const scale = 1 - 0.4 * S.out
      if (S.tunnel < 0.6) browserRef.current.style.opacity = '0'
      else place(browserRef.current, 0, riseY, BROWSER_Z, `rotateX(${28 * (1 - S.rise)}deg) scale(${scale})`)
    }

    gsap.ticker.add(update)
    update()
    return () => gsap.ticker.remove(update)
  }, [chips])

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#0B0716]" style={{ perspective: `${PERSPECTIVE}px` }} aria-hidden="true">
      <div className="absolute inset-0 dot-grid opacity-60" />
      {/* v2: the same aurora ribbons as the page backdrop, behind the CSS 3D stage */}
      <div className="aurora-ribbon aurora-a" />
      <div className="aurora-ribbon aurora-b" />
      <div className="absolute left-1/2 top-1/2" style={{ transformStyle: 'preserve-3d' }}>
        {/* monitor */}
        <div ref={monitorRef} className="absolute left-0 top-0 w-[86vw] max-w-[560px] will-change-transform">
          <div className="rounded-xl border border-white/10 bg-[#1A1230] p-[6px] shadow-[0_0_60px_rgba(124,92,255,.35)]">
            <canvas ref={monitorCanvas} width={1024} height={600} className="block h-auto w-full rounded-md" />
          </div>
          <div className="mx-auto h-8 w-6 bg-[#1E1636]" />
          <div className="mx-auto h-1.5 w-32 rounded bg-[#1E1636]" />
        </div>
        {/* tunnel */}
        {chips.map((c, i) => (
          <img
            key={i}
            ref={(el) => (chipRefs.current[i] = el)}
            src={c.src}
            alt=""
            className="absolute left-0 top-0 max-w-none will-change-transform"
            style={{ width: `${c.w}vw`, opacity: 0 }}
          />
        ))}
        {/* browser */}
        <div ref={browserRef} className="absolute left-0 top-0 w-[92vw] max-w-[640px] will-change-transform" style={{ opacity: 0 }}>
          <div className="overflow-hidden rounded-xl border border-white/10 bg-[#140E24] shadow-[0_0_80px_rgba(124,92,255,.45)]">
            <div className="flex gap-1.5 bg-[#1C1434] px-3 py-2">
              <i className="h-2 w-2 rounded-full bg-[#ff5f57]" />
              <i className="h-2 w-2 rounded-full bg-[#febc2e]" />
              <i className="h-2 w-2 rounded-full bg-[#28c840]" />
            </div>
            <canvas ref={browserCanvas} width={1240} height={700} className="block h-auto w-full" />
          </div>
        </div>
      </div>
    </div>
  )
}
