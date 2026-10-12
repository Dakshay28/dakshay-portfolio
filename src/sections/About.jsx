import { useEffect, useState } from 'react'
import { profile } from '../data/profile'
import { SectionHeading } from '../components/SectionHeading'
import { useInViewOnce } from '../hooks/useInViewOnce'
import { useApp } from '../lib/AppContext'
import { asset } from '../lib/asset'
import { FreelanceBadge } from '../Hero/TabPanels'

function Counter({ value, suffix, label, play }) {
  const { reduced } = useApp()
  const [n, setN] = useState(reduced ? value : 0)
  useEffect(() => {
    if (!play || reduced) return
    let raf
    const t0 = performance.now()
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / 1600)
      setN(Math.round(value * (1 - Math.pow(1 - p, 4))))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [play, value, reduced])
  return (
    <div className="border-t border-line/10 pt-4">
      <dd className="font-display text-4xl font-bold tabular-nums sm:text-5xl">
        {n}
        <span className="text-term">{suffix}</span>
      </dd>
      <dt className="mt-1 text-sm text-muted">{label}</dt>
    </div>
  )
}

export function About() {
  const [ref, seen] = useInViewOnce({ threshold: 0.3 })
  return (
    <section id="about" className="section-pad section-shell" aria-labelledby="about-title">
      <SectionHeading id="about-title" index={2} slug="about" title="Six years of shipping" />
      <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-20">
        {/* photo in a glass frame with scanlines */}
        <div className="glass relative mx-auto w-full max-w-sm rounded-[var(--radius-lg)] p-3 lg:mx-0">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[calc(var(--radius-lg)-8px)] bg-[#140E24]">
            <img src={asset(profile.photo)} alt={`Portrait of ${profile.name}`} className="h-full w-full object-cover" loading="lazy" />
            <div className="scanlines pointer-events-none absolute inset-0" aria-hidden="true" />
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
              aria-hidden="true"
            />
            <p className="absolute bottom-3 left-3 font-mono text-[11px] text-[#F3EEFB]/80">
              <span className="text-term">●</span> REC · {profile.handle}.jpg
            </p>
          </div>
          <div className="flex items-center justify-between px-1 pb-1 pt-3 font-mono text-xs text-muted">
            <span>{profile.location}</span>
            <span>
              {profile.education.degree} · {profile.education.school}
            </span>
          </div>
        </div>

        <div>
          <div className="space-y-5 text-base text-ink/90 sm:text-lg">
            {profile.story.map((s, i) => (
              <p key={i}>{s}</p>
            ))}
          </div>
          <div className="mt-8">
            <FreelanceBadge />
          </div>
          <dl ref={ref} className="mt-12 grid grid-cols-2 gap-x-8 gap-y-8">
            {profile.stats.map((s) => (
              <Counter key={s.label} {...s} play={seen} />
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
