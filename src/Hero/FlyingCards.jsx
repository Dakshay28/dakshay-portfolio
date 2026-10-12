// Scene 5 — the browser tabs detach and fly down as project cards.
// Cards sit in their final row at the bottom of the frame; the GSAP
// timeline animates them FROM the tab-strip position (top, small,
// transparent) TO here. The real Projects grid below uses the same
// cards, so the handoff reads as one motion.
import { forwardRef } from 'react'
import { heroProjects } from '../data/projects'
import { asset } from '../lib/asset'

export const FlyingCards = forwardRef(function FlyingCards(_, ref) {
  return (
    <div
      ref={ref}
      className="pointer-events-none absolute inset-x-0 bottom-32 z-20 mx-auto w-[min(1080px,92vw)] sm:bottom-20"
      aria-hidden="true"
    >
      <div className="grid grid-cols-3 gap-2 sm:gap-5">
        {heroProjects.map((p) => (
          <div
            key={p.id}
            data-fly-card
            className="invisible rounded-xl border border-white/10 bg-[#140E24]/90 p-1.5 opacity-0 backdrop-blur sm:p-2.5"
          >
            <div className="aspect-[16/9] overflow-hidden rounded-lg">
              <img src={asset(p.cover)} alt="" className="h-full w-full object-cover object-top" />
            </div>
            <p className="mt-2 truncate px-1 font-mono text-[10px] text-[#A096BE] sm:text-xs">
              <span className="text-term">●</span> {p.heroTab}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
})
