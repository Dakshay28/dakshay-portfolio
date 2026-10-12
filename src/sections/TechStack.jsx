import { skillGroups } from '../data/skills'
import { SectionHeading } from '../components/SectionHeading'
import { GlassCard } from '../components/GlassCard'

const tone = {
  blue: { text: 'text-wp-text', badge: 'bg-wp/15 text-wp-text border-wp/30' },
  green: { text: 'text-term', badge: 'bg-term/10 text-term border-term/30' },
  amber: { text: 'text-amber', badge: 'bg-amber/10 text-amber border-amber/30' },
  muted: { text: 'text-ink', badge: 'bg-line/5 text-ink border-line/15' },
}

// Bento layout: CMS is the hero tile (it's the core of the work),
// Frontend is wide because it has the most items.
const span = {
  cms: 'lg:col-span-3 lg:row-span-2',
  backend: 'lg:col-span-3',
  frontend: 'lg:col-span-3',
  tools: 'lg:col-span-6',
}

export function TechStack() {
  return (
    <section id="stack" className="section-pad section-shell" aria-labelledby="stack-title">
      <SectionHeading
        id="stack-title"
        index={3}
        slug="stack"
        title="The toolbox"
        intro="WordPress at the core, PHP and MySQL underneath, React when the front-end needs to do more."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
        {skillGroups.map((g) => (
          <GlassCard key={g.id} className={`p-6 sm:p-7 ${span[g.id]}`}>
            <div className="flex items-baseline justify-between gap-3">
              <h3 className={`text-xl font-bold ${tone[g.color].text}`}>{g.label}</h3>
              <span className="font-mono text-xs text-muted">{g.file}</span>
            </div>
            <ul
              className={`mt-6 grid gap-3 ${g.id === 'cms' ? 'grid-cols-1 sm:gap-4' : g.id === 'tools' ? 'grid-cols-2 sm:grid-cols-5' : 'grid-cols-2 sm:grid-cols-3'}`}
            >
              {g.items.map((s) => (
                <li key={s.name} className="flex items-center gap-3">
                  <span
                    className={`grid shrink-0 place-items-center rounded-lg border font-mono font-semibold ${tone[g.color].badge} ${
                      g.id === 'cms' ? 'h-12 w-12 text-base' : 'h-9 w-9 text-xs'
                    }`}
                    aria-hidden="true"
                  >
                    {s.mono}
                  </span>
                  <span className={g.id === 'cms' ? 'text-lg font-medium' : 'text-sm'}>{s.name}</span>
                </li>
              ))}
            </ul>
          </GlassCard>
        ))}
      </div>
    </section>
  )
}
