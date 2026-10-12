import { useEffect, useState } from 'react'
import { useApp } from '../lib/AppContext'

/** Lighthouse-style score ring that counts up from 0 when `play` is true. */
export function ScoreRing({ score, label, play = true, size = 84 }) {
  const { reduced } = useApp()
  const [v, setV] = useState(reduced ? score : 0)
  useEffect(() => {
    if (!play) return
    if (reduced) return setV(score)
    let raf
    const t0 = performance.now()
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / 1400)
      setV(Math.round(score * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [play, score, reduced])

  const color = v >= 90 ? '#2DE2C7' : v >= 50 ? '#FF8FA3' : '#ff6b6b'
  const r = 36
  const c = 2 * Math.PI * r
  return (
    <figure className="flex flex-col items-center gap-2">
      <svg width={size} height={size} viewBox="0 0 84 84" role="img" aria-label={`${label}: ${score}`}>
        <circle cx="42" cy="42" r={r} fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="6" />
        <circle
          cx="42"
          cy="42"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - v / 100)}
          transform="rotate(-90 42 42)"
        />
        <text x="42" y="48" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="20" fontWeight="600" fill={color}>
          {v}
        </text>
      </svg>
      <figcaption className="text-center text-xs text-muted">{label}</figcaption>
    </figure>
  )
}
