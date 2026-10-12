import { profile } from '../data/profile'
import { scrollToTarget } from '../lib/scroll'
import { Icon } from '../components/Icons'

// Aurora hues cycled across the letters on hover.
const HUES = ['rgb(var(--blue-text))', 'rgb(var(--green))', 'rgb(var(--amber))']

function WaveWord({ word, offset = 0 }) {
  return (
    <span className="block whitespace-nowrap" aria-hidden="true">
      {[...word].map((ch, i) => (
        <span key={i} style={{ '--i': i + offset, '--c': HUES[(i + offset) % HUES.length] }}>
          {ch}
        </span>
      ))}
    </span>
  )
}

export function Footer() {
  const last = profile.name.split(' ').slice(1).join(' ')
  return (
    <footer className="relative overflow-hidden pb-28 pt-24 sm:pb-12">
      <div className="section-shell">
        <p
          className="wave-name select-none font-display font-extrabold leading-[0.9] tracking-[-0.03em]"
          style={{ fontSize: 'clamp(2.4rem, 11vw, 10.5rem)' }}
          aria-label={profile.name}
        >
          <WaveWord word={profile.firstName} />
          <WaveWord word={last} offset={profile.firstName.length} />
        </p>
        <div className="mt-12 flex flex-wrap items-center justify-between gap-6 border-t border-line/10 pt-6 text-sm text-muted">
          <p className="font-mono">© 2026 {profile.name} · Built with React &amp; ☕</p>
          <button
            type="button"
            onClick={() => scrollToTarget(0, { duration: 2.2 })}
            className="glass flex items-center gap-2 rounded-full px-4 py-2 font-mono text-xs hover:text-ink"
          >
            Back to top <Icon name="arrowUp" size={14} />
          </button>
        </div>
      </div>
    </footer>
  )
}
