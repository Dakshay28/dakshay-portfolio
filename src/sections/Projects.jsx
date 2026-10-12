import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FILTERS, projects } from '../data/projects'
import { SectionHeading } from '../components/SectionHeading'
import { CodeTabs } from '../components/CodeTabs'
import { GlassCard } from '../components/GlassCard'
import { BrowserFrame } from '../components/BrowserFrame'
import { Icon } from '../components/Icons'
import { asset } from '../lib/asset'

export function ProjectCard({ p }) {
  return (
    <GlassCard as="article" tilt className="project-card flex h-full flex-col p-3" data-cursor="VIEW">
      <BrowserFrame url={p.url ? p.url.replace(/^https?:\/\//, '') : `${p.id}.local`} compact>
        <div className="shot-frame">
          <img src={asset(p.cover)} alt={`${p.title} — full page screenshot`} loading="lazy" decoding="async" width="1280" height="3000" />
        </div>
      </BrowserFrame>
      <div className="flex flex-1 flex-col px-2 pb-2 pt-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-xl font-bold">{p.title}</h3>
            <p className="mt-1 text-sm text-muted">{p.client}</p>
          </div>
          {p.placeholder && (
            <span className="shrink-0 rounded-md border border-amber/30 bg-amber/10 px-2 py-0.5 font-mono text-[11px] text-amber">
              sample
            </span>
          )}
        </div>
        <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Tech stack">
          {p.stack.map((s) => (
            <li key={s} className="chip">
              {s}
            </li>
          ))}
        </ul>
        <div className="mt-auto flex flex-wrap gap-2 pt-6">
          {p.url && (
            <a href={p.url} target="_blank" rel="noreferrer" className="btn-ghost !px-4 !py-2 text-xs">
              Live Site <Icon name="arrowUpRight" size={14} />
              <span className="sr-only">(opens {p.title} in a new tab)</span>
            </a>
          )}
          <a href={`#case/${p.id}`} className="btn-ghost !px-4 !py-2 text-xs !text-wp-text">
            Case Study <Icon name="arrowRight" size={14} />
            <span className="sr-only">for {p.title}</span>
          </a>
        </div>
      </div>
    </GlassCard>
  )
}

export function Projects() {
  const [filter, setFilter] = useState('All')
  const tabs = useMemo(
    () =>
      FILTERS.map((f) => ({
        id: f,
        label: f,
        count: f === 'All' ? projects.length : projects.filter((p) => p.tags.includes(f)).length,
      })),
    [],
  )
  const list = filter === 'All' ? projects : projects.filter((p) => p.tags.includes(filter))

  return (
    <section id="projects" className="section-pad section-shell" aria-labelledby="projects-title">
      <SectionHeading
        id="projects-title"
        index={1}
        slug="projects"
        title="Work that's live"
        intro="Government-council sites, event platforms and freelance builds. Hover a card to scroll the full page; open a case study for the details."
      />
      <div className="mb-10 overflow-x-auto pb-1">
        <CodeTabs tabs={tabs} value={filter} onChange={setFilter} label="Filter projects" idPrefix="pf" controls="project-grid" />
      </div>
      <motion.ul
        layout
        id="project-grid"
        role="tabpanel"
        aria-labelledby={`pf-${filter}`}
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        <AnimatePresence mode="popLayout">
          {list.map((p, i) => (
            <motion.li
              key={p.id}
              layout
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ type: 'spring', stiffness: 260, damping: 28 }}
            >
              {/* v2: each card wipes up out of a mask the first time it scrolls in */}
              <motion.div
                className="h-full"
                initial={{ clipPath: 'inset(18% 0 0 0 round 16px)', y: 40, opacity: 0.2 }}
                whileInView={{ clipPath: 'inset(0% 0 0 0 round 16px)', y: 0, opacity: 1, transitionEnd: { clipPath: 'none' } }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: (i % 3) * 0.08 }}
              >
                <ProjectCard p={p} />
              </motion.div>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
      {list.length === 0 && (
        <p className="mt-4 font-mono text-sm text-muted">
          No projects tagged <span className="text-amber">{filter}</span> yet — add one in{' '}
          <code className="text-ink">data/projects.js</code>.
        </p>
      )}
    </section>
  )
}
