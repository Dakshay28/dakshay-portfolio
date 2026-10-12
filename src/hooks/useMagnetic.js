import { useEffect, useRef } from 'react'
import { useApp } from '../lib/AppContext'

/** Magnetic hover: the element leans toward the pointer, then springs back. */
export function useMagnetic(strength = 0.3) {
  const ref = useRef(null)
  const { reduced, coarse } = useApp()
  useEffect(() => {
    const el = ref.current
    if (!el || reduced || coarse) return
    let raf = 0
    const move = (e) => {
      const r = el.getBoundingClientRect()
      const x = (e.clientX - (r.left + r.width / 2)) * strength
      const y = (e.clientY - (r.top + r.height / 2)) * strength
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        el.style.transform = `translate3d(${x}px, ${y}px, 0)`
      })
    }
    const leave = () => {
      cancelAnimationFrame(raf)
      el.style.transition = 'transform .6s cubic-bezier(.16,1,.3,1)'
      el.style.transform = ''
      setTimeout(() => (el.style.transition = ''), 600)
    }
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    return () => {
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', leave)
      cancelAnimationFrame(raf)
    }
  }, [strength, reduced, coarse])
  return ref
}
