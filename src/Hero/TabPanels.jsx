// Content of the six browser tabs (scene 4). Also reused by the
// reduced-motion static hero, so it never depends on scroll state.
import { motion } from 'framer-motion'
import { profile } from '../data/profile'
import { skillGroups } from '../data/skills'
import { experience } from '../data/experience'
import { asset } from '../lib/asset'
import { Icon } from '../components/Icons'

const ease = [0.16, 1, 0.3, 1]

/** Split-text reveal: each word rises out of its own mask. */
export function SplitWords({ text, className = '', delay = 0, as: Tag = 'span' }) {
  const words = text.split(' ')
  return (
    <Tag className={className} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom" aria-hidden="true">
          <motion.span
            className="inline-block"
            initial={{ y: '105%' }}
            animate={{ y: 0 }}
            transition={{ duration: 0.7, ease, delay: delay + i * 0.06 }}
          >
            {w}
            {i < words.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}

/** Mask reveal for blocks (wipes up from the bottom). */
function MaskIn({ children, delay = 0, className = '' }) {
  return (
    <motion.div
      className={className}
      initial={{ clipPath: 'inset(100% 0 0 0)' }}
      animate={{ clipPath: 'inset(0% 0 0 0)' }}
      transition={{ duration: 0.8, ease, delay }}
    >
      {children}
    </motion.div>
  )
}

function FadeUp({ children, delay = 0, className = '' }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease, delay }}
    >
      {children}
    </motion.div>
  )
}

export function FreelanceBadge() {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-amber/30 bg-amber/10 px-3 py-1.5 font-mono text-xs text-amber">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber opacity-60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-amber" />
      </span>
      {profile.status}
    </span>
  )
}

// a) index.php ------------------------------------------------------
export function IndexTab() {
  const rows = [
    ['role', profile.current.title],
    ['company', profile.current.companyShort],
    ['since', profile.current.period.split(' –')[0]],
    ['stack', 'WordPress · PHP · React'],
    ['education', `${profile.education.degree}, ${profile.education.school}`],
  ]
  return (
    <div className="grid h-full items-center gap-10 px-6 sm:px-14 lg:grid-cols-[1.4fr_1fr]">
      <div className="flex flex-col gap-6">
        <FadeUp>
          <p className="font-mono text-sm text-muted">
            <span className="tok-tag">&lt;?php</span> <span className="tok-kw">echo</span> <span className="tok-str">$greeting</span>;{' '}
            <span className="tok-tag">?&gt;</span>
          </p>
        </FadeUp>
        <h2 className="text-[2.1rem] font-extrabold leading-[0.95] sm:text-5xl lg:text-7xl">
          <SplitWords text={`Hi, I'm ${profile.firstName}.`} />
        </h2>
        <FadeUp delay={0.35} className="max-w-xl text-base text-muted sm:text-lg">
          {profile.role} and {profile.roleSecondary.toLowerCase()} with <span className="text-ink">{profile.experienceYears} years</span> of
          building sites people actually use.
        </FadeUp>
        <FadeUp delay={0.5}>
          <FreelanceBadge />
        </FadeUp>
      </div>
      <MaskIn delay={0.3} className="hidden lg:block">
        <dl className="rounded-[14px] border border-white/10 bg-white/[0.03] p-6 font-mono text-[13px]">
          <p className="mb-4 text-[#A096BE]">
            <span className="tok-kw">$profile</span> = [
          </p>
          {rows.map(([k, v]) => (
            <div key={k} className="flex gap-3 py-1.5 pl-4">
              <dt className="tok-str w-24 shrink-0">'{k}'</dt>
              <dd className="text-[#F3EEFB]">
                <span className="text-[#A096BE]">=&gt; </span>
                {v}
              </dd>
            </div>
          ))}
          <p className="mt-4 text-[#A096BE]">];</p>
        </dl>
      </MaskIn>
    </div>
  )
}

// b) stack.json ---------------------------------------------------
const chipColor = {
  blue: 'border-wp/40 text-wp-text shadow-[0_0_18px_rgb(var(--blue)/.35)]',
  green: 'border-term/40 text-term shadow-[0_0_18px_rgb(var(--green)/.3)]',
  amber: 'border-amber/40 text-amber shadow-[0_0_18px_rgb(var(--amber)/.25)]',
  muted: 'border-white/15 text-ink shadow-[0_0_14px_rgba(255,255,255,.08)]',
}
export function StackTab() {
  let n = 0
  return (
    <div className="flex h-full flex-col justify-center px-6 font-mono text-sm sm:px-14">
      <p className="text-muted">{'{'}</p>
      <div className="space-y-3 py-2 pl-4 sm:space-y-4 sm:pl-8">
        {skillGroups.map((g) => (
          <div key={g.id} className="flex flex-wrap items-center gap-2">
            <span className="tok-str mr-1">"{g.id}":</span>
            <span className="text-muted">[</span>
            {g.items.map((s) => {
              const d = 0.05 + n++ * 0.035
              return (
                <motion.span
                  key={s.name}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 420, damping: 18, delay: d }}
                  className={`rounded-md border bg-white/[0.03] px-2 py-1 text-[12px] ${chipColor[g.color]}`}
                >
                  {s.name}
                </motion.span>
              )
            })}
            <span className="text-muted">],</span>
          </div>
        ))}
      </div>
      <p className="text-muted">{'}'}</p>
    </div>
  )
}

// c–e) project tabs ------------------------------------------------
export function ProjectTab({ project, index }) {
  return (
    <div className="grid h-full items-center gap-6 px-6 py-6 sm:px-12 md:grid-cols-[1.25fr_1fr] md:gap-10">
      <MaskIn className="order-2 md:order-1">
        {/* device frame */}
        <div className="rounded-[18px] border border-white/10 bg-[#120C20] p-2 shadow-[0_30px_80px_-30px_rgba(124,92,255,.6)]">
          <div className="shot-frame rounded-[12px]">
            <img src={asset(project.cover)} alt={`${project.title} homepage screenshot`} loading="lazy" />
          </div>
        </div>
      </MaskIn>
      <div className="order-1 md:order-2">
        <FadeUp>
          <p className="font-mono text-xs text-muted">
            <span className="tok-com not-italic">// project_</span>
            <span className="tok-num">{String(index + 1).padStart(2, '0')}</span>
          </p>
        </FadeUp>
        <h2 className="mt-2 text-3xl font-bold sm:text-5xl">
          <SplitWords text={project.title} />
        </h2>
        <FadeUp delay={0.25} className="mt-3 text-sm text-muted">
          {project.role} · {project.client}
        </FadeUp>
        <FadeUp delay={0.35} className="mt-4 hidden max-w-md text-base text-ink/85 sm:block">
          {project.description}
        </FadeUp>
        <FadeUp delay={0.45} className="mt-5 flex flex-wrap gap-1.5">
          {project.stack.map((s) => (
            <span key={s} className="chip">
              {s}
            </span>
          ))}
        </FadeUp>
        <FadeUp delay={0.55} className="mt-6 flex flex-wrap gap-3">
          {project.url && (
            <a href={project.url} target="_blank" rel="noreferrer" className="btn-primary !px-5 !py-2.5" data-cursor="VIEW">
              Visit {project.url.replace(/^https?:\/\//, '')} <Icon name="arrowUpRight" size={16} />
            </a>
          )}
          <a href={`#case/${project.id}`} className="btn-ghost !px-5 !py-2.5">
            Case study <Icon name="arrowRight" size={16} />
          </a>
        </FadeUp>
      </div>
    </div>
  )
}

// f) experience.log -----------------------------------------------
export function ExperienceTab() {
  const roles = experience
    .filter((e) => e.branch !== 'education')
    .slice()
    .reverse() // oldest → newest
  return (
    <div className="flex h-full flex-col justify-center px-6 sm:px-14">
      <p className="font-mono text-sm text-muted">
        <span className="text-term">$</span> tail -f experience.log
      </p>
      <div className="relative mt-10 grid gap-10 sm:grid-cols-2">
        <motion.div
          className="absolute left-[7px] top-2 hidden h-[2px] origin-left bg-gradient-to-r from-wp to-term sm:block"
          style={{ right: '0%' }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.1, ease }}
        />
        {roles.map((r, i) => (
          <FadeUp key={r.hash} delay={0.2 + i * 0.35} className="relative pl-0 sm:pt-8">
            <span
              className={`absolute left-0 top-0 hidden h-4 w-4 rounded-full border-2 sm:block ${
                r.current ? 'border-term bg-term shadow-[0_0_16px_rgb(var(--green))]' : 'border-wp bg-bg'
              }`}
            />
            <p className="font-mono text-xs text-amber">
              {r.hash} · {r.period}
            </p>
            <h3 className="mt-2 text-2xl font-bold sm:text-3xl">{r.companyShort}</h3>
            <p className="mt-1 text-sm text-muted">{r.title}</p>
            <p className="mt-3 hidden max-w-sm text-sm text-[#F3EEFB]/80 sm:block">{r.achievements[0]}</p>
            {r.current && <p className="mt-3 font-mono text-xs text-term">HEAD → main</p>}
          </FadeUp>
        ))}
      </div>
    </div>
  )
}
