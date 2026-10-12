import { useEffect, useRef, useState } from 'react'
import { useApp } from '../lib/AppContext'
import { useInViewOnce } from '../hooks/useInViewOnce'

const GLYPHS = '{}<>/\\;$#*+=_[]01ABCDEFabcdef'

/**
 * Text scramble / decode: random code glyphs resolve left-to-right into
 * the real text the first time the element scrolls into view.
 * Screen readers always get the real text (aria-label), never the noise.
 */
export function ScrambleText({ text, as: Tag = 'span', className = '', duration = 900, start = true }) {
  const { reduced } = useApp()
  const [ref, seen] = useInViewOnce({ threshold: 0.4 })
  const [out, setOut] = useState(text)
  const raf = useRef(0)

  useEffect(() => {
    if (!seen || !start || reduced) {
      setOut(text)
      return
    }
    const t0 = performance.now()
    const frame = (now) => {
      const p = Math.min(1, (now - t0) / duration)
      const solved = Math.floor(p * text.length)
      let s = ''
      for (let i = 0; i < text.length; i++) {
        const ch = text[i]
        if (i < solved || ch === ' ') s += ch
        else s += GLYPHS[(Math.random() * GLYPHS.length) | 0]
      }
      setOut(s)
      if (p < 1) raf.current = requestAnimationFrame(frame)
    }
    raf.current = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(raf.current)
  }, [seen, start, reduced, text, duration])

  return (
    <Tag ref={ref} className={className} aria-label={text}>
      <span aria-hidden="true">{out}</span>
    </Tag>
  )
}
