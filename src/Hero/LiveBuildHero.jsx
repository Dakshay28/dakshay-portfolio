// =================================================================
//  THE LIVE BUILD — pinned, scroll-scrubbed hero (~600vh)
//
//  How it fits together
//  --------------------
//  • The <section> is 600vh tall; its child is `position: sticky` and
//    100vh tall, so the stage stays put while the page scrolls by.
//  • ONE GSAP timeline (12 beats long) is scrubbed by ScrollTrigger
//    from "section top hits viewport top" to "section bottom hits
//    viewport bottom". 500vh of scrolling ⇒ 12 beats.
//  • The timeline tweens plain numbers in S (heroState.js) and the
//    opacity/transform of a few DOM overlays. The 3D scene (or the
//    2.5D mobile scene) reads S every frame. React overlays only
//    re-render when a *discrete* value (scene / tab / %) changes.
//
//  Beat map
//  --------
//   0.0 ─ 1.5   SCENE 1  BOOT            monitor types its commands
//   1.5 ─ 3.5   SCENE 2  CODE TUNNEL     dive through the screen, fly
//   3.5 ─ 5.5   SCENE 3  BROWSER RISES   rise, then assemble the page
//   5.5 ─ 9.5   SCENE 4  ZOOM IN         DOM browser, 6 tabs
//   9.5 ─10.5   SCENE 5  ZOOM OUT        tabs fly down as cards
//  10.5 ─12.0   SCENE 6  DEPLOYED ✓      success line, confetti, CTA
// =================================================================
import { Suspense, lazy, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger } from '../lib/scroll'
import { useApp } from '../lib/AppContext'
import { S, TOTAL, TABS_START, TABS_LEN, TAB_COUNT, runtime, computeSnapshot } from './heroState'
import { BrowserOverlay } from './BrowserOverlay'
import { FlyingCards } from './FlyingCards'
import { DeployLayer } from './DeployLayer'
import { Confetti } from './Confetti'
import { HeroControls } from './HeroControls'
import { IntroTerminal } from './IntroTerminal'
import { HeroStatic } from './HeroStatic'
import { profile } from '../data/profile'

const Scene3D = lazy(() => import('./Scene3D'))
const Scene25D = lazy(() => import('./Scene25D'))

export default function LiveBuildHero() {
  const { reduced } = useApp()
  if (reduced) return <HeroStatic />
  return <AnimatedHero />
}

function AnimatedHero() {
  const { use3D, booted } = useApp()
  const section = useRef(null)
  const caption = useRef(null)
  const flash = useRef(null)
  const veil = useRef(null)
  const deployVeil = useRef(null)
  const overlay = useRef(null)
  const cards = useRef(null)
  const deploy = useRef(null)
  const confetti = useRef(null)
  const [active, setActive] = useState(true)

  // ---------------------------------------------------------------
  // The master timeline
  // ---------------------------------------------------------------
  useLayoutEffect(() => {
    // reset state in case of hot reload
    Object.assign(S, { boot: 0, dive: 0, tunnel: 0, rise: 0, assemble: 0, zoom: 0, tab: 0, out: 0, deploy: 0 })

    const ctx = gsap.context(() => {
      const flyCards = gsap.utils.toArray('[data-fly-card]', cards.current)
      let fired = false

      const tl = gsap.timeline({
        paused: true,
        defaults: { ease: 'none' },
        onUpdate() {
          computeSnapshot(tl.time())
          // fire confetti once each time we cross into the deploy moment
          if (!fired && S.deploy > 0.2) {
            fired = true
            confetti.current?.fire()
          } else if (fired && S.deploy < 0.08) {
            fired = false
          }
        },
      })

      // ── SCENE 1 · BOOT (0 → 1.5) ─────────────────────────────────
      // `boot` drives the monitor's terminal: 3 commands type out and
      // each one's ✓ status line turns green. ease:none keeps the
      // typing speed proportional to scroll speed.
      tl.addLabel('boot', 0)
        .to(S, { boot: 1, duration: 1.3 }, 0)
        // the intro caption (h1) drifts up and fades as we leave
        .to(caption.current, { autoAlpha: 0, y: -40, duration: 0.4, ease: 'power1.in' }, 1.2)

      // ── SCENE 2 · CODE TUNNEL (1.5 → 3.5) ────────────────────────
      // `dive` pushes the camera through the monitor screen (ease in:
      // it accelerates toward the glass). A quick green flash masks
      // the moment we pass through. Then `tunnel` flies 57 units down
      // the z-axis past instanced code panels, glyphs and blocks.
      tl.addLabel('tunnel', 1.5)
        .to(S, { dive: 1, duration: 0.5, ease: 'power2.in' }, 1.5)
        .to(flash.current, { opacity: 0.85, duration: 0.18, ease: 'power2.in' }, 1.82)
        .to(flash.current, { opacity: 0, duration: 0.35, ease: 'power2.out' }, 2.0)
        .to(S, { tunnel: 1, duration: 1.5, ease: 'power1.inOut' }, 2.0)

      // ── SCENE 3 · THE BROWSER RISES (3.5 → 5.5) ──────────────────
      // `rise` lifts the 3D browser out of the fog (power3.out = it
      // settles softly). `assemble` repaints its page texture through
      // 4 stages: wireframe → layout → type & images → polish.
      tl.addLabel('rise', 3.5).to(S, { rise: 1, duration: 0.7, ease: 'power3.out' }, 3.5).to(S, { assemble: 1, duration: 1.3 }, 4.2)

      // ── SCENE 4 · ZOOM INTO THE BROWSER (5.5 → 9.5) ──────────────
      // `zoom` dollies the camera until the browser fills the view;
      // the DOM browser cross-fades in on top (sharp text, real links).
      // `tab` then counts 0 → 6 linearly: every 1/6th of this window
      // shows the next tab (index.php, stack.json, 3 projects, log).
      tl.addLabel('zoom', 5.5)
        .to(S, { zoom: 1, duration: 0.6, ease: 'power2.inOut' }, 5.5)
        // a dark veil hides the oversized 3D page around the DOM browser
        .to(veil.current, { opacity: 0.88, duration: 0.3 }, 5.8)
        .fromTo(overlay.current, { autoAlpha: 0, scale: 0.94 }, { autoAlpha: 1, scale: 1, duration: 0.3, ease: 'power2.out' }, 5.85)
        .to(S, { tab: TAB_COUNT - 0.001, duration: TABS_LEN }, TABS_START)

      // ── SCENE 5 · ZOOM OUT (9.5 → 10.5) ──────────────────────────
      // The DOM browser fades back into the shrinking 3D browser while
      // `out` pulls the camera back. The three project tabs "detach":
      // each card starts at the tab strip (top, 30% size, invisible)
      // and drops into a row at the bottom — the same cards that lead
      // the Projects grid right after the hero.
      tl.addLabel('out', 9.5)
        .to(overlay.current, { autoAlpha: 0, scale: 0.9, duration: 0.3, ease: 'power2.in' }, 9.5)
        .to(veil.current, { opacity: 0, duration: 0.35 }, 9.55)
        .to(S, { out: 1, duration: 1.0, ease: 'power2.inOut' }, 9.5)
        .fromTo(
          flyCards,
          {
            autoAlpha: 0,
            scale: 0.3,
            rotate: (i) => (i - 1) * -8,
            x: (i, el) => {
              const r = el.parentElement.getBoundingClientRect()
              const cardW = r.width / 3
              const cardCenter = r.left + cardW * (i + 0.5)
              const tabCenter = window.innerWidth * 0.06 + 110 + i * 150
              return tabCenter - cardCenter
            },
            y: () => -window.innerHeight * 0.68,
          },
          { autoAlpha: 1, scale: 1, rotate: 0, x: 0, y: 0, duration: 0.75, ease: 'power3.out', stagger: 0.09 },
          9.62,
        )

      // ── SCENE 6 · DEPLOYED ✓ (10.5 → 12) ─────────────────────────
      // `deploy` types the success line (first 45%) and, past 0.2,
      // triggers the confetti burst (see onUpdate above). The CTA layer
      // rises in; the cards dim so the headline leads.
      tl.addLabel('deploy', 10.5)
        .to(S, { deploy: 1, duration: 1.2 }, 10.5)
        // radial veil keeps the headline readable over the 3D browser
        .to(deployVeil.current, { opacity: 1, duration: 0.4 }, 10.5)
        .fromTo(deploy.current, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power2.out' }, 10.6)
        .to(flyCards, { autoAlpha: 0.55, duration: 0.4 }, 10.7)
        .to({}, { duration: TOTAL - 11.7 }, 11.7) // hold the final frame

      runtime.tl = tl
      runtime.st = ScrollTrigger.create({
        trigger: section.current,
        start: 'top top',
        end: 'bottom bottom',
        animation: tl,
        scrub: 0.6, // 0.6s catch-up = buttery, but still feels attached
        invalidateOnRefresh: true,
      })
      computeSnapshot(0)
    }, section)

    return () => {
      ctx.revert()
      runtime.st = null
      runtime.tl = null
    }
  }, [])

  // Recompute trigger positions once the preloader is gone and fonts are in.
  useEffect(() => {
    if (booted) ScrollTrigger.refresh()
  }, [booted])

  // Pointer parallax + pause rendering when the hero is off-screen.
  useEffect(() => {
    const onMove = (e) => {
      S.px = (e.clientX / innerWidth) * 2 - 1
      S.py = (e.clientY / innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { rootMargin: '100px' })
    io.observe(section.current)
    return () => {
      window.removeEventListener('pointermove', onMove)
      io.disconnect()
    }
  }, [])

  return (
    <section
      id="top"
      ref={section}
      data-theme="dark"
      className="relative h-[600vh] text-[#F3EEFB]"
      style={{ height: '600svh' }}
      aria-label="The Live Build — scroll to watch the portfolio compile"
    >
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden bg-[#0B0716]">
        {/* 3D (desktop) or 2.5D (mobile / no WebGL) stage */}
        {booted && <Suspense fallback={null}>{use3D ? <Scene3D active={active} /> : <Scene25D />}</Suspense>}

        {/* Scene 1 caption — the page's h1 */}
        <div ref={caption} className="pointer-events-none absolute inset-x-0 bottom-24 z-10 px-5 sm:bottom-28 sm:px-10">
          <div className="mx-auto max-w-shell">
            <h1 className="max-w-2xl text-2xl font-bold leading-tight sm:text-4xl">
              <span className="aurora-text">{profile.name}</span>
              <span className="block text-base font-medium text-[#A096BE] sm:text-xl">{profile.headline}</span>
            </h1>
            <p className="mt-4 font-mono text-xs text-term">↓ scroll to compile the site</p>
          </div>
        </div>

        {/* Scene 2 — pass-through-the-glass flash */}
        <div
          ref={flash}
          className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle,#2DE2C7,#7C5CFF_60%,#0B0716)] opacity-0"
        />

        <div ref={veil} className="pointer-events-none absolute inset-0 z-10 bg-[#0B0716] opacity-0" />
        <div
          ref={deployVeil}
          className="pointer-events-none absolute inset-0 z-20 opacity-0"
          style={{ background: 'radial-gradient(ellipse 60% 45% at 50% 38%, rgba(11,7,22,.92) 35%, rgba(11,7,22,0) 100%)' }}
        />
        <BrowserOverlay ref={overlay} />
        <FlyingCards ref={cards} />
        <DeployLayer ref={deploy} />
        <Confetti ref={confetti} />
        <HeroControls />
        <IntroTerminal />
      </div>
    </section>
  )
}
