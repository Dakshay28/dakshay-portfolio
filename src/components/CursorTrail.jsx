// Aurora light trail behind the cursor. A ribbon through the last ~22
// pointer positions, fading from violet to aqua. The rAF loop sleeps
// whenever the trail has fully faded, so an idle mouse costs nothing.
import { useEffect, useRef } from 'react'
import { useApp } from '../lib/AppContext'

export function CursorTrail() {
  const { coarse, reduced } = useApp()
  const canvas = useRef(null)

  useEffect(() => {
    if (coarse || reduced) return
    const c = canvas.current
    const ctx = c.getContext('2d')
    const pts = []
    let raf = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)

    const resize = () => {
      c.width = innerWidth * dpr
      c.height = innerHeight * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()

    const draw = () => {
      ctx.clearRect(0, 0, innerWidth, innerHeight)
      // age points; drop the dead ones
      for (let i = pts.length - 1; i >= 0; i--) {
        pts[i].life -= 0.045
        if (pts[i].life <= 0) pts.splice(i, 1)
      }
      if (pts.length > 1) {
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        for (let i = 1; i < pts.length; i++) {
          const a = pts[i - 1]
          const b = pts[i]
          const t = i / pts.length
          ctx.strokeStyle = `rgba(${Math.round(124 + (45 - 124) * t)}, ${Math.round(92 + (226 - 92) * t)}, ${Math.round(
            255 + (199 - 255) * t,
          )}, ${b.life * 0.55})`
          ctx.lineWidth = 1 + 7 * t * b.life
          ctx.shadowColor = 'rgba(124,92,255,.8)'
          ctx.shadowBlur = 14
          ctx.beginPath()
          ctx.moveTo(a.x, a.y)
          ctx.lineTo(b.x, b.y)
          ctx.stroke()
        }
      }
      raf = pts.length ? requestAnimationFrame(draw) : 0
    }

    const move = (e) => {
      pts.push({ x: e.clientX, y: e.clientY, life: 1 })
      if (pts.length > 22) pts.shift()
      if (!raf) raf = requestAnimationFrame(draw)
    }
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('resize', resize)
    }
  }, [coarse, reduced])

  if (coarse || reduced) return null
  return <canvas ref={canvas} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[199] h-full w-full" />
}
