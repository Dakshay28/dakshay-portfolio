// ---------------------------------------------------------------
// Hero state — the contract between GSAP and the renderers.
//
//   GSAP timeline  ──tweens──▶  S (plain numbers 0..1)
//                                 │
//          ┌──────────────────────┼─────────────────────┐
//   Scene3D (R3F useFrame)   Scene25D (gsap.ticker)   React overlays
//   reads S every frame      reads S every frame      subscribe to the
//                                                     *discrete* snapshot
//
// GSAP never touches Three objects directly and React never re-renders
// per frame — only when a discrete value (scene, tab, %) changes.
// ---------------------------------------------------------------
import { useSyncExternalStore } from 'react'

/** Timeline length in "beats". Scroll distance is mapped onto this. */
export const TOTAL = 12

/** Scene windows on the timeline (in beats). */
export const SCENES = [
  { id: 'boot', label: 'Boot', start: 0, end: 1.5 },
  { id: 'tunnel', label: 'The code tunnel', start: 1.5, end: 3.5 },
  { id: 'rise', label: 'The browser rises', start: 3.5, end: 5.5 },
  { id: 'zoom', label: 'Zoom into the browser', start: 5.5, end: 9.5 },
  { id: 'out', label: 'Zoom out', start: 9.5, end: 10.5 },
  { id: 'deploy', label: 'Deployed', start: 10.5, end: 12 },
]

/** Where the six browser tabs live on the timeline (scene 4). */
export const TABS_START = 6.2
export const TABS_LEN = 3.2
export const TAB_COUNT = 6

/** Continuous values, mutated by GSAP. */
export const S = {
  boot: 0, // 0→1 terminal lines typed on the monitor
  dive: 0, // 0→1 camera dives into the monitor screen
  tunnel: 0, // 0→1 flight through the code tunnel
  rise: 0, // 0→1 browser window rises into frame
  assemble: 0, // 0→1 wireframe → layout → type & images → polished
  zoom: 0, // 0→1 camera pushes into the browser
  tab: 0, // 0→6 which browser tab is showing (floored)
  out: 0, // 0→1 camera pulls back, browser shrinks
  deploy: 0, // 0→1 success message + confetti
  // pointer parallax (-1..1), written by the hero, smoothed in renderers
  px: 0,
  py: 0,
}

/** Runtime handles (set by LiveBuildHero). */
export const runtime = { st: null, tl: null }

// ---- discrete snapshot for React ---------------------------------
let snap = { scene: 0, tab: 0, pct: 0, bootChars: 0, deployChars: 0, deployed: false, overlay: false }
const listeners = new Set()

export function computeSnapshot(time) {
  let scene = 0
  for (let i = 0; i < SCENES.length; i++) if (time >= SCENES[i].start - 1e-4) scene = i
  const next = {
    scene,
    tab: Math.min(TAB_COUNT - 1, Math.floor(S.tab)),
    pct: Math.round((time / TOTAL) * 100),
    deployChars: Math.round(Math.min(1, S.deploy / 0.45) * DEPLOY_LINE.length),
    deployed: S.deploy > 0.2,
    overlay: time >= 5.85 && time < 9.75,
  }
  if (
    next.scene !== snap.scene ||
    next.tab !== snap.tab ||
    next.pct !== snap.pct ||
    next.deployChars !== snap.deployChars ||
    next.deployed !== snap.deployed ||
    next.overlay !== snap.overlay
  ) {
    snap = { ...snap, ...next }
    listeners.forEach((l) => l())
  }
}

export function useHeroSnapshot() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb)
      return () => listeners.delete(cb)
    },
    () => snap,
    () => snap,
  )
}

export const DEPLOY_LINE = '✓ Build successful · Deployed to production'

/** Scroll the page to a timeline position (in beats). Used by tab clicks. */
export function scrollToBeat(beat, scrollTo) {
  const st = runtime.st
  if (!st) return
  const y = st.start + (st.end - st.start) * (beat / TOTAL)
  scrollTo(y)
}

export const beatForTab = (i) => TABS_START + (i + 0.5) * (TABS_LEN / TAB_COUNT)
