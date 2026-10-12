import { useEffect, useRef, useState } from 'react'
import { useApp } from '../lib/AppContext'

/**
 * Custom cursor: a glowing ring with a blinking caret in the middle.
 * Any element with data-cursor="VIEW" (or "COPY", "DRAG"…) swaps the caret
 * for that label. Disabled on touch devices and for reduced motion.
 */
export function Cursor() {
  const { coarse, reduced } = useApp()
  const ring = useRef(null)
  const [label, setLabel] = useState('')
  const [down, setDown] = useState(false)
  const [hidden, setHidden] = useState(true)
  const enabled = !coarse && !reduced

  useEffect(() => {
    if (!enabled) return
    document.documentElement.classList.add('has-cursor')
    const pos = { x: innerWidth / 2, y: innerHeight / 2 }
    const cur = { ...pos }
    let raf = 0
    const loop = () => {
      cur.x += (pos.x - cur.x) * 0.22
      cur.y += (pos.y - cur.y) * 0.22
      if (ring.current) ring.current.style.transform = `translate3d(${cur.x}px, ${cur.y}px, 0)`
      raf = requestAnimationFrame(loop)
    }
    const move = (e) => {
      pos.x = e.clientX
      pos.y = e.clientY
      setHidden(false)
      const t = e.target.closest?.('[data-cursor]')
      setLabel(t ? t.getAttribute('data-cursor') : '')
    }
    const leave = () => setHidden(true)
    const pd = () => setDown(true)
    const pu = () => setDown(false)
    window.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('pointerleave', leave)
    window.addEventListener('pointerdown', pd)
    window.addEventListener('pointerup', pu)
    raf = requestAnimationFrame(loop)
    return () => {
      document.documentElement.classList.remove('has-cursor')
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerleave', leave)
      window.removeEventListener('pointerdown', pd)
      window.removeEventListener('pointerup', pu)
    }
  }, [enabled])

  if (!enabled) return null
  const big = !!label
  return (
    <div
      ref={ring}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[200]"
      style={{ opacity: hidden ? 0 : 1, transition: 'opacity .2s' }}
    >
      <div
        className="-translate-x-1/2 -translate-y-1/2 grid place-items-center rounded-full border font-mono text-[10px] font-semibold tracking-wider transition-[width,height,background,border-color] duration-300 ease-out"
        style={{
          width: big ? 72 : 30,
          height: big ? 72 : 30,
          borderColor: big ? 'rgb(var(--green))' : 'rgb(var(--blue-text) / .7)',
          background: big ? 'rgb(var(--green) / .12)' : 'transparent',
          boxShadow: '0 0 18px rgb(var(--blue) / .45), inset 0 0 10px rgb(var(--blue) / .25)',
          transform: `scale(${down ? 0.85 : 1})`,
        }}
      >
        {big ? (
          <span className="text-term">{label}</span>
        ) : (
          <span className="block h-3 w-[2px] bg-term" style={{ animation: 'blink 1.05s steps(1) infinite' }} />
        )}
      </div>
    </div>
  )
}
