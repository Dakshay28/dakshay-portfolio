// v2: Services become a pinned horizontal track on desktop. The section
// pins while vertical scroll slides the cards sideways; a progress rail
// fills underneath. On phones / reduced motion it's a normal stacked grid.
import { useLayoutEffect, useRef } from 'react'
import { services } from '../data/content'
import { SectionHeading } from '../components/SectionHeading'
import { GlassCard } from '../components/GlassCard'
import { Icon } from '../components/Icons'
import { gsap } from '../lib/scroll'
import { useApp } from '../lib/AppContext'

// Each icon gets its own small hover motion that hints at what it does.
const iconMotion = {
  blocks: 'group-hover:rotate-90',
  cart: 'group-hover:translate-x-1.5',
  gauge: 'group-hover:-rotate-12',
  refresh: 'group-hover:rotate-180',
  atom: 'group-hover:rotate-[120deg]',
  shield: 'group-hover:scale-110',
  pen: 'group-hover:-translate-y-1 group-hover:rotate-6',
}

const accent = ['blue', 'green', 'amber']

export function Services() {
  const { reduced } = useApp()
  const section = useRef(null)
  const track = useRef(null)
  const rail = useRef(null)

  useLayoutEffect(() => {
    if (reduced) return
    const mm = gsap.matchMedia()
    mm.add('(min-width: 1024px)', () => {
      const distance = () => track.current.scrollWidth - track.current.parentElement.clientWidth
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section.current,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      })
      tl.to(track.current, { x: () => -distance(), ease: 'none' }, 0).fromTo(rail.current, { scaleX: 0 }, { scaleX: 1, ease: 'none' }, 0)
      // each card lifts and straightens as it reaches the middle of the screen
      gsap.utils.toArray('[data-service]', track.current).forEach((card) => {
        gsap.fromTo(
          card,
          { rotate: 3, y: 30 },
          {
            rotate: 0,
            y: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: card,
              containerAnimation: tl,
              start: 'left 95%',
              end: 'left 45%',
              scrub: true,
            },
          },
        )
      })
    })
    return () => mm.revert()
  }, [reduced])

  return (
    <section
      ref={section}
      id="services"
      className="section-pad overflow-hidden lg:flex lg:min-h-screen lg:flex-col lg:justify-center lg:py-16"
      aria-labelledby="services-title"
    >
      <div className="section-shell">
        <SectionHeading
          id="services-title"
          index={5}
          slug="services"
          title="What I can build for you"
          intro="Fixed-scope freelance work or ongoing help. Pick a starting point and we'll shape it on a call."
        />
      </div>
      <div className="section-shell">
        <ul ref={track} className="grid gap-4 sm:grid-cols-2 lg:flex lg:w-max lg:gap-6">
          {services.map((s, i) => {
            const tone = accent[i % 3]
            return (
              <li key={s.id} data-service className="lg:w-[380px] lg:shrink-0">
                <GlassCard tilt className="group flex h-full min-h-[300px] flex-col p-7">
                  <span
                    className="grid h-14 w-14 place-items-center rounded-2xl border"
                    style={{
                      borderColor: `rgb(var(--${tone}) / .35)`,
                      background: `rgb(var(--${tone}) / .1)`,
                      color: `rgb(var(--${tone === 'blue' ? 'blue-text' : tone}))`,
                      boxShadow: `0 0 30px rgb(var(--${tone}) / .25)`,
                    }}
                  >
                    <Icon name={s.icon} size={24} className={`transition-transform duration-500 ease-out ${iconMotion[s.icon]}`} />
                  </span>
                  <h3 className="mt-8 text-2xl font-bold">{s.title}</h3>
                  <p className="mt-3 text-muted">{s.body}</p>
                  <a
                    href="#contact"
                    className="mt-auto inline-flex items-center gap-2 pt-8 font-mono text-xs text-muted transition-colors group-hover:text-ink"
                  >
                    Start a project <Icon name="arrowRight" size={14} className="transition-transform group-hover:translate-x-1" />
                  </a>
                </GlassCard>
              </li>
            )
          })}
        </ul>
        <div className="mt-10 hidden h-[2px] w-full overflow-hidden rounded bg-line/10 lg:block" aria-hidden="true">
          <div
            ref={rail}
            className="h-full origin-left"
            style={{ background: 'linear-gradient(90deg, rgb(var(--blue)), rgb(var(--green)), rgb(var(--amber)))' }}
          />
        </div>
      </div>
    </section>
  )
}
