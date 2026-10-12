// Testimonials from managers, teammates and clients.
// Filter tabs (All / Managers / Team / Clients) sit above a draggable
// glass-card carousel; prev/next buttons cover keyboard users.
import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, animate } from 'framer-motion'
import { testimonials } from '../data/content'
import { SectionHeading } from '../components/SectionHeading'
import { GlassCard } from '../components/GlassCard'
import { CodeTabs } from '../components/CodeTabs'
import { Icon } from '../components/Icons'

const KINDS = {
  manager: { label: 'Managers', badge: 'Manager', tone: 'blue', text: 'blue-text' },
  team: { label: 'Team', badge: 'Teammate', tone: 'green', text: 'green' },
  client: { label: 'Clients', badge: 'Client', tone: 'amber', text: 'amber' },
}

const initials = (name) =>
  name
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

function Card({ t }) {
  const k = KINDS[t.type] ?? KINDS.client
  return (
    <GlassCard as="figure" className="flex h-full flex-col p-7">
      <div className="flex items-center justify-between gap-3">
        <span
          className="rounded-full border px-2.5 py-1 font-mono text-[11px]"
          style={{ borderColor: `rgb(var(--${k.tone}) / .35)`, background: `rgb(var(--${k.tone}) / .1)`, color: `rgb(var(--${k.text}))` }}
        >
          {k.badge}
        </span>
        <div className="flex items-center gap-2">
          {t.type === 'client' && t.rating && (
            <span className="flex gap-0.5 text-amber" aria-label={`${t.rating} out of 5 stars`}>
              {Array.from({ length: 5 }, (_, s) => (
                <Icon key={s} name="star" size={14} className={s < t.rating ? '' : 'opacity-20'} />
              ))}
            </span>
          )}
          {t.placeholder && (
            <span className="rounded-md border border-amber/30 bg-amber/10 px-2 py-0.5 font-mono text-[11px] text-amber">sample</span>
          )}
        </div>
      </div>

      <blockquote className="mt-5 flex-1 text-base text-ink/90 sm:text-lg">“{t.quote}”</blockquote>

      <figcaption className="mt-6 flex items-center gap-3 border-t border-line/10 pt-4">
        <span
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full font-mono text-xs font-semibold"
          style={{ background: `rgb(var(--${k.tone}) / .15)`, color: `rgb(var(--${k.text}))` }}
          aria-hidden="true"
        >
          {initials(t.name)}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-semibold">{t.name}</span>
          <span className="block truncate text-sm text-muted">
            {t.role} · {t.company}
          </span>
          {t.relation && <span className="mt-0.5 block font-mono text-[11px] text-muted/80">{t.relation}</span>}
        </span>
        {t.source && (
          <a
            href={t.source}
            target="_blank"
            rel="noreferrer"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line/15 text-muted hover:text-ink"
            aria-label={`Read the original from ${t.name}`}
          >
            <Icon name="arrowUpRight" size={15} />
          </a>
        )}
      </figcaption>
    </GlassCard>
  )
}

export function Testimonials() {
  const track = useRef(null)
  const x = useMotionValue(0)
  const [max, setMax] = useState(0)
  const [filter, setFilter] = useState('all')

  // Only show tabs for kinds that actually have entries.
  const tabs = useMemo(() => {
    const present = Object.keys(KINDS).filter((k) => testimonials.some((t) => t.type === k))
    return [
      { id: 'all', label: 'All', count: testimonials.length },
      ...present.map((k) => ({ id: k, label: KINDS[k].label, count: testimonials.filter((t) => t.type === k).length })),
    ]
  }, [])
  const list = filter === 'all' ? testimonials : testimonials.filter((t) => t.type === filter)

  useEffect(() => {
    const measure = () => setMax(Math.max(0, track.current.scrollWidth - track.current.clientWidth))
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(track.current)
    return () => ro.disconnect()
  }, [filter])

  // Back to the first card whenever the filter changes.
  useEffect(() => {
    animate(x, 0, { type: 'spring', stiffness: 260, damping: 32 })
  }, [filter, x])

  const step = (dir) => {
    const card = track.current.firstElementChild?.getBoundingClientRect().width ?? 320
    const next = Math.max(-max, Math.min(0, x.get() - dir * (card + 20)))
    animate(x, next, { type: 'spring', stiffness: 260, damping: 32 })
  }

  return (
    <section id="testimonials" className="section-pad" aria-labelledby="testimonials-title">
      <div className="section-shell">
        <SectionHeading
          id="testimonials-title"
          index={7}
          slug="testimonials"
          title="What people say"
          intro="Feedback from the managers I've reported to, the teams I've built with, and the clients I've shipped for."
        />
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <CodeTabs
            tabs={tabs}
            value={filter}
            onChange={setFilter}
            label="Filter testimonials"
            idPrefix="tf"
            controls="testimonial-track"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => step(-1)}
              className="glass grid h-11 w-11 place-items-center rounded-full"
              aria-label="Previous testimonials"
            >
              <Icon name="arrowRight" className="rotate-180" />
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              className="glass grid h-11 w-11 place-items-center rounded-full"
              aria-label="Next testimonials"
            >
              <Icon name="arrowRight" />
            </button>
          </div>
        </div>
      </div>
      <div className="overflow-hidden" data-cursor="DRAG">
        <motion.ul
          ref={track}
          id="testimonial-track"
          role="tabpanel"
          aria-labelledby={`tf-${filter}`}
          drag="x"
          dragConstraints={{ left: -max, right: 0 }}
          dragElastic={0.08}
          style={{ x }}
          className="section-shell flex cursor-grab gap-5 active:cursor-grabbing"
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {list.map((t) => (
              <motion.li
                key={`${t.type}-${t.name}-${t.company}`}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ type: 'spring', stiffness: 260, damping: 28 }}
                className="w-[85vw] max-w-[400px] shrink-0"
              >
                <Card t={t} />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      </div>
    </section>
  )
}
