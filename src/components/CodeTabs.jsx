// Adapted from 21st.dev "Animated Tabs" (builduilabs): a layoutId bubble
// slides between tabs. Changes: tabs are styled as code tags (<All/>),
// the bubble is a WordPress-blue glow, full ARIA tablist with arrow keys.
import { motion } from 'framer-motion'
import { useRef } from 'react'

export function CodeTabs({ tabs, value, onChange, label, idPrefix = 'tab', controls }) {
  const refs = useRef([])

  const onKey = (e, i) => {
    let n = null
    if (e.key === 'ArrowRight') n = (i + 1) % tabs.length
    if (e.key === 'ArrowLeft') n = (i - 1 + tabs.length) % tabs.length
    if (e.key === 'Home') n = 0
    if (e.key === 'End') n = tabs.length - 1
    if (n !== null) {
      e.preventDefault()
      onChange(tabs[n].id)
      refs.current[n]?.focus()
    }
  }

  return (
    <div role="tablist" aria-label={label} className="flex flex-wrap gap-1.5">
      {tabs.map((t, i) => {
        const active = t.id === value
        return (
          <button
            key={t.id}
            ref={(el) => (refs.current[i] = el)}
            role="tab"
            id={`${idPrefix}-${t.id}`}
            aria-selected={active}
            aria-controls={controls}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(t.id)}
            onKeyDown={(e) => onKey(e, i)}
            className={`relative rounded-lg px-3 py-1.5 font-mono text-[13px] transition-colors ${
              active ? 'text-white' : 'text-muted hover:text-ink'
            }`}
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            {active && (
              <motion.span
                layoutId={`${idPrefix}-bubble`}
                className="absolute inset-0 rounded-lg bg-wp"
                style={{ boxShadow: '0 0 0 1px rgb(var(--blue)), 0 0 24px rgb(var(--blue) / .55)' }}
                transition={{ type: 'spring', bounce: 0.2, duration: 0.55 }}
              />
            )}
            <span className="relative">
              <span className={active ? 'text-white/70' : 'tok-tag'}>&lt;</span>
              {t.label}
              <span className={active ? 'text-white/70' : 'tok-tag'}>/&gt;</span>
              {typeof t.count === 'number' && (
                <span className={`ml-1.5 text-[11px] ${active ? 'text-white/70' : 'text-muted'}`}>{t.count}</span>
              )}
            </span>
          </button>
        )
      })}
    </div>
  )
}
