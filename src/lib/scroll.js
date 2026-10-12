// ---------------------------------------------------------------
// Smooth scroll + GSAP wiring.
//
// One Lenis instance drives the page. GSAP's ticker calls lenis.raf
// so Lenis and every ScrollTrigger update in the same frame —
// that's what keeps the scrubbed hero perfectly in sync.
// ---------------------------------------------------------------
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

let lenis = null
let tick = null

export function initLenis() {
  if (lenis) return lenis
  lenis = new Lenis({ lerp: 0.1, smoothWheel: true, wheelMultiplier: 0.9 })
  lenis.on('scroll', ScrollTrigger.update)
  tick = (time) => lenis && lenis.raf(time * 1000)
  gsap.ticker.add(tick)
  gsap.ticker.lagSmoothing(0)
  return lenis
}

export function destroyLenis() {
  if (!lenis) return
  gsap.ticker.remove(tick)
  lenis.destroy()
  lenis = null
}

export const getLenis = () => lenis

/** Scroll to a selector, element or pixel offset — Lenis if present, native otherwise. */
export function scrollToTarget(target, opts = {}) {
  if (lenis) {
    lenis.scrollTo(target, { duration: 1.4, ...opts })
    return
  }
  if (typeof target === 'number') {
    window.scrollTo({ top: target, behavior: opts.immediate ? 'auto' : 'smooth' })
    return
  }
  const el = typeof target === 'string' ? document.querySelector(target) : target
  el?.scrollIntoView({ behavior: opts.immediate ? 'auto' : 'smooth' })
}

export function lockScroll() {
  lenis?.stop()
  document.documentElement.style.overflow = 'hidden'
}
export function unlockScroll() {
  document.documentElement.style.overflow = ''
  lenis?.start()
}

export { gsap, ScrollTrigger }
