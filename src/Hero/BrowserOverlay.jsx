// Scene 4 — the DOM browser the camera "lands in".
// The 3D browser is zoomed until it fills the view, then this crisp,
// accessible DOM version cross-fades over it (GSAP controls the
// container's opacity/scale; React controls which tab is shown).
import { forwardRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { heroProjects } from '../data/projects'
import { useHeroSnapshot, beatForTab, scrollToBeat } from './heroState'
import { IndexTab, StackTab, ProjectTab, ExperienceTab } from './TabPanels'
import { scrollToTarget } from '../lib/scroll'

export const HERO_TABS = [
  { id: 'index', label: 'index.php', path: '' },
  { id: 'stack', label: 'stack.json', path: 'stack.json' },
  ...heroProjects.map((p) => ({ id: p.id, label: p.heroTab, path: `work/${p.id}`, project: p })),
  { id: 'experience', label: 'experience.log', path: 'experience.log' },
]

function TabBody({ tab, i }) {
  if (tab.id === 'index') return <IndexTab />
  if (tab.id === 'stack') return <StackTab />
  if (tab.id === 'experience') return <ExperienceTab />
  return <ProjectTab project={tab.project} index={i - 2} />
}

export const BrowserOverlay = forwardRef(function BrowserOverlay(_, ref) {
  const { tab, overlay } = useHeroSnapshot()
  const current = HERO_TABS[tab] ?? HERO_TABS[0]

  const go = (i) => scrollToBeat(beatForTab(i), (y) => scrollToTarget(y, { duration: 0.9 }))

  return (
    <div
      ref={ref}
      className="invisible absolute inset-x-3 bottom-20 top-16 z-20 opacity-0 sm:inset-x-[4vw] sm:bottom-24 sm:top-20"
      aria-hidden={!overlay}
      // keep it out of the tab order while hidden
      inert={!overlay}
    >
      <div className="flex h-full flex-col overflow-hidden rounded-[18px] border border-white/10 bg-[#110B1E]/95 shadow-[0_40px_120px_-30px_rgba(124,92,255,.55)] backdrop-blur-xl">
        {/* tab strip */}
        <div
          className="flex items-end gap-1 overflow-x-auto bg-[#181030] px-3 pt-2 [scrollbar-width:none]"
          role="tablist"
          aria-label="Portfolio tabs"
        >
          <span className="mr-2 flex gap-1.5 self-center pb-2" aria-hidden="true">
            <i className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <i className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <i className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          </span>
          {HERO_TABS.map((t, i) => {
            const active = i === tab
            return (
              <button
                key={t.id}
                role="tab"
                aria-selected={active}
                onClick={() => go(i)}
                className={`relative shrink-0 rounded-t-lg px-3 py-2 font-mono text-[11px] transition-colors sm:px-4 sm:text-xs ${
                  active ? 'bg-[#110B1E] text-[#F3EEFB]' : 'text-[#A096BE] hover:text-[#F3EEFB]'
                }`}
              >
                <span className={`mr-1.5 inline-block h-1.5 w-1.5 rounded-full ${active ? 'bg-term' : 'bg-white/20'}`} />
                {active ? (
                  <motion.span key={t.label} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                    {t.label}
                  </motion.span>
                ) : (
                  t.label
                )}
                {active && <motion.span layoutId="hero-tab-line" className="absolute inset-x-2 top-0 h-[2px] rounded bg-wp" />}
              </button>
            )
          })}
        </div>
        {/* address bar */}
        <div className="flex items-center gap-3 border-b border-white/[0.06] px-4 py-2">
          <span className="font-mono text-xs text-term" aria-hidden="true">
            ●
          </span>
          <div className="min-w-0 flex-1 truncate rounded-md bg-white/[0.04] px-3 py-1.5 font-mono text-[11px] text-[#A096BE] sm:text-xs">
            https://dakshay.dev/<span className="text-[#F3EEFB]">{current.path}</span>
          </div>
          <span className="hidden font-mono text-[11px] text-[#A096BE] sm:block">
            {String(tab + 1).padStart(2, '0')}/{String(HERO_TABS.length).padStart(2, '0')}
          </span>
        </div>
        {/* page */}
        <div className="relative min-h-0 flex-1 overflow-hidden text-[#F3EEFB]" role="tabpanel" aria-label={current.label}>
          <AnimatePresence mode="wait">
            {overlay && (
              <motion.div
                key={current.id}
                className="absolute inset-0 overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
              >
                <TabBody tab={current} i={tab} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
})
