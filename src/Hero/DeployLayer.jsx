// Scene 6 — "DEPLOYED ✓". GSAP fades this container in; the success
// line types out from the discrete snapshot (deployChars).
import { forwardRef } from 'react'
import { useHeroSnapshot, DEPLOY_LINE } from './heroState'
import { MagneticButton } from '../components/MagneticButton'
import { scrollToTarget } from '../lib/scroll'
import { Icon } from '../components/Icons'

export const DeployLayer = forwardRef(function DeployLayer(_, ref) {
  const { deployChars, scene } = useHeroSnapshot()
  const active = scene === 5
  const typed = DEPLOY_LINE.slice(0, deployChars)
  const go = (id) => (e) => {
    e.preventDefault()
    scrollToTarget(id)
  }
  return (
    <div
      ref={ref}
      className="invisible absolute inset-x-0 top-[16%] z-30 flex flex-col items-center px-5 text-center opacity-0 sm:top-[18%]"
      inert={!active}
    >
      <div className="glass rounded-full px-4 py-2 font-mono text-xs text-[#F3EEFB] sm:text-sm" role="status">
        <span className="text-[#A096BE]">$ </span>
        <span className="text-term">{typed}</span>
        {deployChars < DEPLOY_LINE.length && <span className="caret" aria-hidden="true" />}
      </div>
      <h2 className="mt-8 text-4xl font-extrabold text-[#F3EEFB] sm:text-6xl lg:text-7xl">
        <span className="aurora-text">Let&rsquo;s build yours.</span>
        <span className="caret-thin" aria-hidden="true" />
      </h2>
      <p className="mt-5 max-w-md text-[#A096BE]">From brief to production — themes, stores, speed and React apps.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <MagneticButton href="#projects" onClick={go('#projects')}>
          View projects <Icon name="arrowRight" size={16} />
        </MagneticButton>
        <MagneticButton href="#contact" variant="ghost" onClick={go('#contact')} className="!text-[#F3EEFB]">
          Hire me
        </MagneticButton>
      </div>
    </div>
  )
})
