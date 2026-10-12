// Contact: just two ways to reach you — email and phone.
// Each card shows the value as plain selectable text, a copy button,
// and a direct action (open mail app / call). Values live in data/profile.js.
import { useState } from 'react'
import { profile } from '../data/profile'
import { SectionHeading } from '../components/SectionHeading'
import { GlassCard } from '../components/GlassCard'
import { Icon } from '../components/Icons'

function ContactCard({ id, label, value, href, action, icon, tone }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      // clipboard blocked: select the text so it can be copied by hand
      const el = document.getElementById(id)
      const r = document.createRange()
      r.selectNodeContents(el)
      const sel = window.getSelection()
      sel.removeAllRanges()
      sel.addRange(r)
    }
  }
  return (
    <GlassCard tilt className="flex h-full flex-col p-7 sm:p-9">
      <div className="flex items-center justify-between gap-4">
        <span
          className="grid h-12 w-12 place-items-center rounded-2xl border"
          style={{
            borderColor: `rgb(var(--${tone}) / .35)`,
            background: `rgb(var(--${tone}) / .1)`,
            color: `rgb(var(--${tone === 'blue' ? 'blue-text' : tone}))`,
          }}
          aria-hidden="true"
        >
          <Icon name={icon} size={22} />
        </span>
        <span className="font-mono text-sm text-muted">{label}</span>
      </div>

      <p id={id} className="mt-10 select-all font-display text-xl font-bold [overflow-wrap:anywhere] sm:text-2xl xl:text-[1.75rem]" data-cursor="COPY">
        {/* allow a line break right after "@" so long emails split cleanly */}
        {value.includes('@') ? (
          <>
            {value.split('@')[0]}@<wbr />
            {value.split('@')[1]}
          </>
        ) : (
          value
        )}
      </p>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={copy}
          className="btn-ghost !px-5 !py-2.5 text-sm"
          aria-label={`Copy ${label.toLowerCase()} ${value}`}
        >
          <Icon name={copied ? 'check' : 'copy'} size={16} className={copied ? 'text-term' : ''} />
          {copied ? 'Copied' : 'Copy'}
        </button>
        <a href={href} className="btn-primary !px-5 !py-2.5 text-sm">
          {action} <Icon name="arrowUpRight" size={16} />
        </a>
      </div>
      <p className="mt-3 h-4 font-mono text-xs text-term" aria-live="polite">
        {copied ? `${label} copied to clipboard.` : ''}
      </p>
    </GlassCard>
  )
}

export function Contact() {
  return (
    <section id="contact" className="section-pad section-shell" aria-labelledby="contact-title">
      <SectionHeading id="contact-title" index={8} slug="contact" title="Connect with me" />
      <div className="grid gap-5 md:grid-cols-2">
        <ContactCard
          id="contact-email"
          label="Email"
          value={profile.email}
          href={`mailto:${profile.email}`}
          action="Send an email"
          icon="mail"
          tone="blue"
        />
        <ContactCard
          id="contact-phone"
          label="Phone"
          value={profile.phone}
          href={`tel:${profile.phoneLink}`}
          action="Call me"
          icon="phone"
          tone="green"
        />
      </div>
    </section>
  )
}
