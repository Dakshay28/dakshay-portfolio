// Scene 6 — code-bracket confetti + green particle fireworks.
// Plain 2D canvas; the rAF loop only runs while particles are alive.
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'

const GLYPHS = ['{', '}', '<', '/>', ';', '</>', '{ }', '$', 'BLOCK']
const COLORS = ['#2DE2C7', '#B6A4FF', '#FF8FA3', '#F3EEFB', '#7C5CFF']

export const Confetti = forwardRef(function Confetti(_, ref) {
  const canvas = useRef(null)
  const parts = useRef([])
  const raf = useRef(0)

  const loop = () => {
    const c = canvas.current
    if (!c) return
    const ctx = c.getContext('2d')
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    const W = c.clientWidth
    const H = c.clientHeight
    if (c.width !== W * dpr) {
      c.width = W * dpr
      c.height = H * dpr
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, W, H)
    const list = parts.current
    for (let i = list.length - 1; i >= 0; i--) {
      const p = list[i]
      p.life -= 1
      p.vy += p.g
      p.vx *= p.drag
      p.vy *= p.drag
      p.x += p.vx
      p.y += p.vy
      p.rot += p.vr
      const a = Math.max(0, Math.min(1, p.life / 40))
      if (p.life <= 0 || p.y > H + 60) {
        list.splice(i, 1)
        continue
      }
      ctx.globalAlpha = a
      if (p.kind === 'spark') {
        ctx.fillStyle = p.color
        ctx.shadowColor = p.color
        ctx.shadowBlur = 10
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowBlur = 0
      } else {
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rot)
        ctx.fillStyle = p.color
        if (p.glyph === 'BLOCK') {
          // tiny block-editor tile (2×2 grid)
          const s = p.size * 0.42
          ctx.fillRect(-s, -s, s * 0.9, s * 0.9)
          ctx.fillRect(s * 0.1, -s, s * 0.9, s * 0.9)
          ctx.fillRect(-s, s * 0.1, s * 0.9, s * 0.9)
        } else {
          ctx.font = `600 ${p.size}px "JetBrains Mono", monospace`
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText(p.glyph, 0, 0)
        }
        ctx.restore()
      }
    }
    ctx.globalAlpha = 1
    if (list.length) raf.current = requestAnimationFrame(loop)
    else raf.current = 0
  }

  const start = () => {
    if (!raf.current) raf.current = requestAnimationFrame(loop)
  }

  useImperativeHandle(ref, () => ({
    fire() {
      const c = canvas.current
      if (!c) return
      const W = c.clientWidth
      const H = c.clientHeight
      const small = W < 640
      // 1) glyph burst from the headline area
      const n = small ? 70 : 140
      for (let i = 0; i < n; i++) {
        const a = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 0.9
        const sp = 7 + Math.random() * 11
        parts.current.push({
          kind: 'glyph',
          glyph: GLYPHS[(Math.random() * GLYPHS.length) | 0],
          color: COLORS[(Math.random() * COLORS.length) | 0],
          x: W / 2 + (Math.random() - 0.5) * 120,
          y: H * 0.5,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp,
          g: 0.22,
          drag: 0.985,
          rot: Math.random() * 6,
          vr: (Math.random() - 0.5) * 0.25,
          size: 14 + Math.random() * 14,
          life: 140 + Math.random() * 60,
        })
      }
      // 2) three green fireworks, staggered
      ;[0, 280, 560].forEach((delay, k) => {
        setTimeout(() => {
          const cx = W * (0.22 + 0.28 * k + (Math.random() - 0.5) * 0.08)
          const cy = H * (0.18 + Math.random() * 0.15)
          const m = small ? 36 : 64
          for (let i = 0; i < m; i++) {
            const a = (i / m) * Math.PI * 2
            const sp = 2.5 + Math.random() * 3.5
            parts.current.push({
              kind: 'spark',
              color: Math.random() < 0.8 ? '#2DE2C7' : '#F3EEFB',
              x: cx,
              y: cy,
              vx: Math.cos(a) * sp,
              vy: Math.sin(a) * sp,
              g: 0.05,
              drag: 0.965,
              rot: 0,
              vr: 0,
              size: 1.6 + Math.random() * 1.6,
              life: 70 + Math.random() * 40,
            })
          }
          start()
        }, delay)
      })
      start()
    },
  }))

  useEffect(() => () => cancelAnimationFrame(raf.current), [])

  return <canvas ref={canvas} className="pointer-events-none absolute inset-0 z-30 h-full w-full" aria-hidden="true" />
})
