import { useEffect, useRef, useState } from 'react'
import { gsap } from '../lib/scroll'
import { useApp } from '../lib/AppContext'

const LINES = [
  '[    0.000] booting portfolio kernel',
  '[    0.112] mounting /dev/creativity',
  '[    0.241] loading modules: php, wordpress, react',
  '[    0.388] starting display server',
]

/**
 * Preloader: boot lines + percentage, then a CRT power-off wipe
 * (screen collapses to a bright line, then to a dot) into the site.
 */
export function Preloader() {
  const { setBooted, reduced } = useApp()
  const [pct, setPct] = useState(0)
  const [lines, setLines] = useState(0)
  const [gone, setGone] = useState(false)
  const root = useRef(null)
  const screen = useRef(null)

  useEffect(() => {
    let alive = true
    const minTime = reduced ? 300 : 1500
    const t0 = performance.now()
    let fontsReady = false
    ;(document.fonts?.ready ?? Promise.resolve()).then(() => (fontsReady = true))

    let raf
    const tick = (now) => {
      if (!alive) return
      const t = Math.min(1, (now - t0) / minTime)
      // Hold at 92% until fonts are in, so the reveal never shows FOUT.
      const cap = fontsReady ? 100 : 92
      const p = Math.min(cap, Math.round(100 * (1 - Math.pow(1 - t, 2))))
      setPct(p)
      setLines(Math.min(LINES.length, Math.floor(t * (LINES.length + 1))))
      if (p < 100) raf = requestAnimationFrame(tick)
      else finish()
    }
    const finish = () => {
      if (reduced) {
        done() // no wipe, no fade — just get out of the way
        return
      }
      gsap
        .timeline({ onComplete: done })
        .to(screen.current, { scaleY: 0.006, duration: 0.28, ease: 'power3.in' })
        .to(screen.current, { filter: 'brightness(3)', duration: 0.05 }, '<0.2')
        .to(screen.current, { scaleX: 0, duration: 0.22, ease: 'power3.in' })
        .to(root.current, { opacity: 0, duration: 0.25 }, '-=0.05')
    }
    const done = () => {
      setGone(true)
      setBooted(true)
    }
    raf = requestAnimationFrame(tick)
    return () => {
      alive = false
      cancelAnimationFrame(raf)
    }
  }, [reduced, setBooted])

  if (gone) return null
  return (
    <div ref={root} className="fixed inset-0 z-[300] grid place-items-center bg-[#05030A]" role="status" aria-live="polite">
      <div ref={screen} className="w-full max-w-xl origin-center px-6 font-mono text-[13px] text-[#A096BE]">
        {LINES.slice(0, lines).map((l) => (
          <p key={l} className="leading-7">
            {l} <span className="text-[#2DE2C7]">ok</span>
          </p>
        ))}
        <div className="mt-6 flex items-center gap-4">
          <div className="h-[3px] flex-1 overflow-hidden rounded bg-white/10">
            <div className="h-full bg-[#2DE2C7] shadow-[0_0_12px_#2DE2C7]" style={{ width: `${pct}%` }} />
          </div>
          <span className="w-12 text-right text-[#F3EEFB]">{pct}%</span>
        </div>
        <span className="sr-only">Loading portfolio, {pct} percent</span>
      </div>
    </div>
  )
}
