// Hero HUD: auto-play + sound (top-left), skip (top-right),
// terminal-style build bar + scene counter (bottom).
import { useEffect, useRef, useState } from 'react'
import { useHeroSnapshot, SCENES, runtime } from './heroState'
import { useApp } from '../lib/AppContext'
import { getLenis, scrollToTarget } from '../lib/scroll'
import { Icon } from '../components/Icons'

const BAR = 10

export function HeroControls() {
  const { pct, scene } = useHeroSnapshot()
  const { soundOn, setSoundOn, introDone } = useApp()
  const [playing, setPlaying] = useState(false)
  const raf = useRef(0)

  // Auto-play: advance the scroll position ourselves each frame.
  // Any manual input (wheel, touch, keys, pointer drag on scrollbar) pauses it.
  useEffect(() => {
    if (!playing) return
    const lenis = getLenis()
    const st = runtime.st
    if (!lenis || !st) return setPlaying(false)
    const total = st.end - st.start
    const speed = total / 38 // whole journey in ~38s
    let last = performance.now()
    const step = (now) => {
      const dt = Math.min(0.1, (now - last) / 1000)
      last = now
      const next = Math.min(st.end + 2, lenis.scroll + speed * dt)
      lenis.scrollTo(next, { immediate: true, force: true })
      if (next >= st.end) return setPlaying(false)
      raf.current = requestAnimationFrame(step)
    }
    // start from the top of the hero if we're past it
    if (lenis.scroll >= st.end - 4) lenis.scrollTo(st.start, { immediate: true, force: true })
    raf.current = requestAnimationFrame(step)
    const stop = () => setPlaying(false)
    const onKey = (e) => {
      if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', ' ', 'Home', 'End'].includes(e.key)) stop()
    }
    window.addEventListener('wheel', stop, { passive: true })
    window.addEventListener('touchstart', stop, { passive: true })
    window.addEventListener('keydown', onKey)
    return () => {
      cancelAnimationFrame(raf.current)
      window.removeEventListener('wheel', stop)
      window.removeEventListener('touchstart', stop)
      window.removeEventListener('keydown', onKey)
    }
  }, [playing])

  const filled = Math.round((pct / 100) * BAR)
  const bar = '█'.repeat(filled) + '░'.repeat(BAR - filled)

  return (
    <div className={`text-[#F3EEFB] transition-opacity duration-500 ${introDone ? 'opacity-100' : 'pointer-events-none opacity-0'}`}>
      {/* top-left */}
      <div className="absolute left-4 top-4 z-40 flex gap-2 sm:left-6 sm:top-5">
        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          className="glass flex h-10 items-center gap-2 rounded-full px-4 font-mono text-xs"
          aria-pressed={playing}
          aria-label={playing ? 'Pause auto-play' : 'Auto-play the build'}
        >
          <Icon name={playing ? 'pause' : 'play'} size={14} className={playing ? 'text-amber' : 'text-term'} />
          <span className="hidden sm:inline">{playing ? 'Pause' : 'Auto-play'}</span>
        </button>
        <button
          type="button"
          onClick={() => setSoundOn(!soundOn)}
          className="glass grid h-10 w-10 place-items-center rounded-full"
          aria-pressed={soundOn}
          aria-label={soundOn ? 'Mute keyboard sounds' : 'Turn on keyboard sounds'}
        >
          <Icon name={soundOn ? 'volume' : 'mute'} size={16} className={soundOn ? 'text-term' : 'text-[#A096BE]'} />
        </button>
      </div>

      {/* top-right */}
      <button
        type="button"
        onClick={() => scrollToTarget('#projects', { duration: 1.6 })}
        className="glass absolute right-4 top-4 z-40 hidden h-10 items-center gap-2 rounded-full px-4 font-mono text-xs text-[#A096BE] hover:text-[#F3EEFB] sm:right-6 sm:top-5 md:flex"
      >
        Skip intro <Icon name="skip" size={14} />
      </button>

      {/* bottom HUD */}
      <div className="absolute inset-x-4 bottom-4 z-40 flex items-end justify-between gap-4 font-mono text-[11px] text-[#A096BE] sm:inset-x-6 sm:bottom-6 sm:text-xs max-sm:bottom-20">
        <div aria-hidden="true">
          <span className="text-term">build</span> [<span className="text-[#F3EEFB]">{bar}</span>] {String(pct).padStart(3, ' ')}%
        </div>
        <div className="text-right" aria-live="polite">
          <span className="text-[#F3EEFB]">{String(scene + 1).padStart(2, '0')}</span>/{String(SCENES.length).padStart(2, '0')}
          <span className="ml-2 hidden sm:inline">{SCENES[scene].label}</span>
        </div>
      </div>
    </div>
  )
}
