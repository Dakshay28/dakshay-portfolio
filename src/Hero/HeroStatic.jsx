// prefers-reduced-motion version: the same six scenes as static panels
// with opacity-only fades. No pinning, no camera, no scroll-jacking.
import { motion } from 'framer-motion'
import { heroProjects } from '../data/projects'
import { BOOT_STEPS } from './draw'
import { IndexTab, StackTab, ProjectTab, ExperienceTab } from './TabPanels'
import { DEPLOY_LINE } from './heroState'
import { profile } from '../data/profile'
import { scrollToTarget } from '../lib/scroll'

function Panel({ label, children }) {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.4 }}
      className="section-shell py-10"
      aria-label={label}
    >
      <div className="overflow-hidden rounded-[18px] border border-white/10 bg-[#110B1E] text-[#F3EEFB]">
        <div className="border-b border-white/[0.06] bg-[#181030] px-4 py-2 font-mono text-xs text-[#A096BE]">{label}</div>
        <div className="py-10">{children}</div>
      </div>
    </motion.section>
  )
}

export function HeroStatic() {
  return (
    <section id="top" data-theme="dark" className="relative pt-24 text-[#F3EEFB]" aria-label="Introduction">
      <div className="section-shell flex items-center justify-between pb-4">
        <h1 className="font-mono text-sm text-[#A096BE]">
          {profile.name} — {profile.headline}
        </h1>
        <button type="button" className="btn-ghost !py-2 text-xs" onClick={() => scrollToTarget('#projects')}>
          Skip intro
        </button>
      </div>
      <Panel label="01 · boot">
        <div className="space-y-2 px-6 font-mono text-sm sm:px-14">
          {BOOT_STEPS.map((s) => (
            <div key={s.cmd}>
              <p>
                <span className="text-term">$</span> {s.cmd}
              </p>
              <p className="text-term">{s.ok}</p>
            </div>
          ))}
        </div>
      </Panel>
      <Panel label="02 · index.php">
        <IndexTab />
      </Panel>
      <Panel label="03 · stack.json">
        <StackTab />
      </Panel>
      {heroProjects.map((p, i) => (
        <Panel key={p.id} label={`04 · ${p.heroTab}`}>
          <ProjectTab project={p} index={i} />
        </Panel>
      ))}
      <Panel label="05 · experience.log">
        <ExperienceTab />
      </Panel>
      <Panel label="06 · deploy">
        <div className="px-6 text-center">
          <p className="font-mono text-sm text-term">{DEPLOY_LINE}</p>
          <h2 className="mt-6 text-5xl font-bold sm:text-7xl">Let&rsquo;s build yours.</h2>
          <div className="mt-8 flex justify-center gap-3">
            <a className="btn-primary" href="#projects">
              View projects
            </a>
            <a className="btn-ghost" href="#contact">
              Hire me
            </a>
          </div>
        </div>
      </Panel>
    </section>
  )
}
