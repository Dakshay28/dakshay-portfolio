import { useMemo } from 'react'
import { useInViewOnce } from '../hooks/useInViewOnce'
import { useApp } from '../lib/AppContext'

// GitHub-style contribution graph that fills in column by column on
// scroll. The pattern is generated from a seed (decorative) — to show
// real data, fetch your contributions and pass `data` (array of 0–4).
function seeded(seed) {
  let s = seed
  return () => (s = (s * 16807) % 2147483647) / 2147483647
}

export function ContributionGraph({ weeks = 52, data }) {
  const { reduced } = useApp()
  const [ref, seen] = useInViewOnce({ threshold: 0.3 })
  const cells = useMemo(() => {
    if (data) return data
    const rnd = seeded(2821)
    return Array.from({ length: weeks * 7 }, (_, i) => {
      const day = i % 7
      const weekend = day === 0 || day === 6
      const r = rnd()
      const busy = r * (weekend ? 0.6 : 1) + Math.sin(i / 37) * 0.15
      return busy > 0.82 ? 4 : busy > 0.6 ? 3 : busy > 0.4 ? 2 : busy > 0.22 ? 1 : 0
    })
  }, [weeks, data])

  const shades = [
    'rgb(var(--line) / .06)',
    'rgb(var(--green) / .25)',
    'rgb(var(--green) / .45)',
    'rgb(var(--green) / .7)',
    'rgb(var(--green))',
  ]

  return (
    <div ref={ref} className="overflow-x-auto pb-2" aria-hidden="true">
      <div
        className="grid min-w-[620px] grid-flow-col gap-[3px]"
        style={{ gridTemplateRows: 'repeat(7, auto)', gridAutoColumns: 'minmax(0, 1fr)' }}
      >
        {cells.map((lvl, i) => {
          const col = Math.floor(i / 7)
          return (
            <span
              key={i}
              className="aspect-square w-full rounded-[3px]"
              style={{
                background: seen || reduced ? shades[lvl] : shades[0],
                transition: reduced ? 'none' : `background .4s ease ${col * 22}ms`,
              }}
            />
          )
        })}
      </div>
    </div>
  )
}
