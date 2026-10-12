// Case study modal, opened via the URL hash (#case/<id>) so it's
// linkable and the browser Back button closes it. Lazy-loaded.
import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { projects } from '../data/projects'
import { ScoreRing } from '../components/ScoreRing'
import { Icon } from '../components/Icons'
import { asset } from '../lib/asset'
import { getLenis } from '../lib/scroll'

function BeforeAfter({ before, after, title }) {
  const [pos, setPos] = useState(50)
  return (
    <figure className="overflow-hidden rounded-[var(--radius-md)] border border-white/10">
      <div className="relative aspect-[16/10] select-none bg-[#140E24]">
        <img src={asset(after.src)} alt={`${title} — ${after.label}`} className="absolute inset-0 h-full w-full object-cover object-top" />
        <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <img
            src={asset(before.src)}
            alt={`${title} — ${before.label}`}
            className="absolute inset-0 h-full w-full object-cover object-top"
          />
        </div>
        <div
          className="pointer-events-none absolute inset-y-0 w-[2px] bg-term shadow-[0_0_12px_rgb(var(--green))]"
          style={{ left: `${pos}%` }}
        />
        <span className="absolute left-3 top-3 chip !bg-black/60">{before.label}</span>
        <span className="absolute right-3 top-3 chip !bg-black/60">{after.label}</span>
        <input
          type="range"
          min="0"
          max="100"
          value={pos}
          onChange={(e) => setPos(+e.target.value)}
          className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
          aria-label="Drag to compare before and after"
          data-cursor="DRAG"
        />
      </div>
    </figure>
  )
}

export default function CaseStudyModal({ id, onClose }) {
  const p = projects.find((x) => x.id === id)
  const dialog = useRef(null)
  const lastFocus = useRef(null)

  useEffect(() => {
    lastFocus.current = document.activeElement
    getLenis()?.stop()
    dialog.current?.focus()
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'Tab') {
        // simple focus trap
        const f = dialog.current.querySelectorAll('a[href],button,input,[tabindex]:not([tabindex="-1"])')
        if (!f.length) return
        const first = f[0]
        const last = f[f.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      getLenis()?.start()
      lastFocus.current?.focus?.({ preventScroll: true })
    }
  }, [onClose])

  if (!p) return null
  const lh = p.results.lighthouse
  const before = p.images.find((i) => /before/i.test(i.label))
  const after = p.images.find((i) => !/before/i.test(i.label))

  return (
    <motion.div
      className="fixed inset-0 z-[150] flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        ref={dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="case-title"
        tabIndex={-1}
        data-lenis-prevent
        className="glass relative max-h-[92svh] w-full max-w-4xl overflow-y-auto rounded-t-[var(--radius-lg)] bg-bg/95 p-6 outline-none sm:rounded-[var(--radius-lg)] sm:p-10"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 30, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 30 }}
      >
        <button
          type="button"
          onClick={onClose}
          className="glass absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full"
          aria-label="Close case study"
        >
          <Icon name="x" />
        </button>

        <p className="font-mono text-sm tok-com not-italic">
          <span className="text-muted">// case_study/</span>
          <span className="tok-fn">{p.id}</span>
        </p>
        <h2 id="case-title" className="mt-3 text-3xl font-bold sm:text-5xl">
          {p.title}
        </h2>
        <p className="mt-2 text-muted">
          {p.role} · {p.client}
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {p.url && (
            <a href={p.url} target="_blank" rel="noreferrer" className="btn-primary !py-2.5 text-xs">
              Live Site <Icon name="arrowUpRight" size={14} />
            </a>
          )}
          {p.secondaryUrl && (
            <a href={p.secondaryUrl} target="_blank" rel="noreferrer" className="btn-ghost !py-2.5 text-xs">
              {p.secondaryUrl.replace(/^https?:\/\//, '')} <Icon name="arrowUpRight" size={14} />
            </a>
          )}
        </div>

        <div className="mt-8">
          {before && after ? (
            <BeforeAfter before={before} after={after} title={p.title} />
          ) : (
            <img
              src={asset(p.cover)}
              alt={`${p.title} screenshot`}
              className="aspect-[16/10] w-full rounded-[var(--radius-md)] border border-white/10 object-cover object-top"
            />
          )}
        </div>

        <div className="mt-10 grid gap-8 sm:grid-cols-2">
          <div>
            <h3 className="font-mono text-sm text-amber">problem</h3>
            <p className="mt-2 text-ink/90">{p.problem}</p>
          </div>
          <div>
            <h3 className="font-mono text-sm text-term">solution</h3>
            <p className="mt-2 text-ink/90">{p.solution}</p>
          </div>
        </div>

        <div className="mt-10 grid gap-8 sm:grid-cols-2">
          <div>
            <h3 className="font-mono text-sm text-wp-text">key features</h3>
            <ul className="mt-3 space-y-2">
              {p.features.map((f) => (
                <li key={f} className="flex gap-2 text-ink/90">
                  <Icon name="check" size={16} className="mt-1 shrink-0 text-term" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-mono text-sm text-wp-text">tech stack</h3>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {p.stack.map((s) => (
                <li key={s} className="chip">
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 rounded-[var(--radius-md)] border border-white/10 p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="font-mono text-sm text-ink">lighthouse</h3>
            {!p.results.verified && (
              <span className="font-mono text-[11px] text-amber">sample scores — replace with your measured results</span>
            )}
          </div>
          <div className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-4">
            <ScoreRing score={lh.performance} label="Performance" />
            <ScoreRing score={lh.accessibility} label="Accessibility" />
            <ScoreRing score={lh.bestPractices} label="Best practices" />
            <ScoreRing score={lh.seo} label="SEO" />
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
