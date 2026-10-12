// v2: two marquee rows running in opposite directions. Their speed and
// skew follow your scroll velocity (Lenis), and scrolling up reverses them.
import { useEffect, useRef } from 'react'
import { marqueeItems } from '../data/content'
import { getLenis } from '../lib/scroll'
import { useApp } from '../lib/AppContext'

function Row({ items, rowRef, outline }) {
  const row = items.flatMap((t, i) => [
    <span key={`t${i}`} className={outline ? 'marquee-outline' : ''}>
      {t}
    </span>,
    <span key={`s${i}`} className={i % 2 ? 'text-amber' : 'text-term'} aria-hidden="true">
      ✦
    </span>,
  ])
  return (
    <div ref={rowRef} className="flex w-max gap-8 will-change-transform" aria-hidden="true">
      <div className="flex shrink-0 items-center gap-8">{row}</div>
      <div className="flex shrink-0 items-center gap-8">{row}</div>
    </div>
  )
}

export function Marquee() {
  const { reduced } = useApp()
  const a = useRef(null)
  const b = useRef(null)

  useEffect(() => {
    if (reduced) return
    let raf = 0
    let xa = 0
    let xb = 0
    let dir = 1
    let skew = 0
    let last = performance.now()
    let lastY = window.scrollY
    const loop = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const lenis = getLenis()
      const v = lenis ? lenis.velocity : window.scrollY - lastY
      lastY = window.scrollY
      if (Math.abs(v) > 0.5) dir = Math.sign(v)
      const boost = Math.min(Math.abs(v) * 14, 900)
      const speed = (60 + boost) * dir
      const wa = a.current.scrollWidth / 2
      const wb = b.current.scrollWidth / 2
      // keep each row inside one copy's width so the loop is seamless
      xa -= speed * dt
      xb += speed * dt
      if (xa <= -wa) xa += wa
      if (xa > 0) xa -= wa
      if (xb <= -wb) xb += wb
      if (xb > 0) xb -= wb
      skew += (Math.max(-12, Math.min(12, v * 0.6)) - skew) * 0.12
      a.current.style.transform = `translate3d(${xa}px,0,0) skewX(${-skew}deg)`
      b.current.style.transform = `translate3d(${xb}px,0,0) skewX(${-skew}deg)`
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [reduced])

  return (
    <div
      className="relative overflow-hidden border-y border-line/10 py-6 font-display text-3xl font-extrabold tracking-tight sm:py-8 sm:text-5xl"
      aria-label={marqueeItems.join(', ')}
      role="marquee"
    >
      <Row items={marqueeItems} rowRef={a} />
      <div className="mt-3 sm:mt-4">
        <Row items={[...marqueeItems].reverse()} rowRef={b} outline />
      </div>
    </div>
  )
}
