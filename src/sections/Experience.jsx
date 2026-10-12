// Git-log timeline. The branch line draws itself as you scroll
// (ScrollTrigger scrub on scaleY); commit dots light up as the line
// reaches them.
import { useLayoutEffect, useRef } from 'react'
import { experience } from '../data/experience'
import { SectionHeading } from '../components/SectionHeading'
import { ContributionGraph } from '../components/ContributionGraph'
import { gsap } from '../lib/scroll'
import { useApp } from '../lib/AppContext'

export function Experience() {
  const { reduced } = useApp()
  const list = useRef(null)
  const line = useRef(null)

  useLayoutEffect(() => {
    if (reduced) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        line.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: { trigger: list.current, start: 'top 70%', end: 'bottom 60%', scrub: 0.5 },
        },
      )
      gsap.utils.toArray('[data-commit]').forEach((el) => {
        gsap.fromTo(
          el,
          { '--lit': 0 },
          { '--lit': 1, duration: 0.3, scrollTrigger: { trigger: el, start: 'top 62%', toggleActions: 'play none none reverse' } },
        )
      })
    }, list)
    return () => ctx.revert()
  }, [reduced])

  return (
    <section id="experience" className="section-pad section-shell" aria-labelledby="experience-title">
      <SectionHeading id="experience-title" index={4} slug="experience" title="git log --career" />

      <div className="glass mb-14 rounded-[var(--radius-md)] p-5">
        <div className="mb-3 flex items-baseline justify-between font-mono text-xs text-muted">
          <span>commits · last 12 months</span>
          <span>
            less <i className="mx-1 inline-block h-2.5 w-2.5 rounded-sm bg-term/25 align-middle" />
            <i className="mx-1 inline-block h-2.5 w-2.5 rounded-sm bg-term align-middle" /> more
          </span>
        </div>
        <ContributionGraph />
      </div>

      <ol ref={list} className="relative ml-2 sm:ml-4">
        {/* branch rail */}
        <span className="absolute bottom-2 left-[7px] top-2 w-[2px] bg-line/10" aria-hidden="true" />
        <span
          ref={line}
          className="absolute bottom-2 left-[7px] top-2 w-[2px] origin-top bg-gradient-to-b from-term via-wp to-amber"
          style={reduced ? undefined : { transform: 'scaleY(0)' }}
          aria-hidden="true"
        />
        {experience.map((e) => (
          <li key={e.hash} data-commit className="relative pb-14 pl-10 last:pb-0 sm:pl-14" style={{ '--lit': reduced ? 1 : 0 }}>
            <span
              className="absolute left-0 top-1.5 h-4 w-4 rounded-full border-2"
              style={{
                borderColor: e.current ? 'rgb(var(--green))' : 'rgb(var(--blue))',
                background: `rgb(var(${e.current ? '--green' : '--blue'}) / calc(var(--lit) * 1))`,
                boxShadow: `0 0 calc(var(--lit) * 18px) rgb(var(${e.current ? '--green' : '--blue'}))`,
              }}
              aria-hidden="true"
            />
            <p className="font-mono text-xs">
              <span className="text-amber">commit {e.hash}</span>
              <span className="text-muted"> (</span>
              {e.current && <span className="text-term">HEAD → </span>}
              <span className="text-wp-text">{e.branch}</span>
              <span className="text-muted">)</span>
            </p>
            <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_auto] sm:items-baseline">
              <h3 className="text-2xl font-bold">{e.title}</h3>
              <p className="font-mono text-sm text-muted">{e.period}</p>
            </div>
            <p className="mt-1 text-muted">{e.company}</p>
            <ul className="mt-4 max-w-2xl space-y-2">
              {e.achievements.map((a) => (
                <li key={a} className="flex gap-3 text-ink/90">
                  <span className="mt-[0.15rem] font-mono text-term" aria-hidden="true">
                    +
                  </span>
                  {a}
                </li>
              ))}
            </ul>
            {e.stack.length > 0 && (
              <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Stack">
                {e.stack.map((s) => (
                  <li key={s} className="chip">
                    {s}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ol>
    </section>
  )
}
