// Intro gate: terminal with the prompt and a glowing "Enter ▶" button.
// Pressing it types `npm run build`, then unlocks scrolling.
import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useApp } from '../lib/AppContext'
import { useKeySound } from '../hooks/useKeySound'
import { lockScroll, unlockScroll, scrollToTarget } from '../lib/scroll'
import { profile } from '../data/profile'
import { Icon } from '../components/Icons'

const CMD = 'npm run build'

export function IntroTerminal() {
  const { booted, introDone, setIntroDone, soundOn, setSoundOn } = useApp()
  const [typed, setTyped] = useState('')
  const [phase, setPhase] = useState('idle') // idle → typing → done
  const btn = useRef(null)
  const click = useKeySound()

  // Lock scroll until the visitor enters. If the page was reloaded
  // mid-scroll, skip the gate entirely.
  useEffect(() => {
    if (!booted || introDone) return
    if (window.scrollY > 40) {
      setIntroDone(true)
      return
    }
    lockScroll()
    btn.current?.focus({ preventScroll: true })
    return () => unlockScroll()
  }, [booted, introDone, setIntroDone])

  const enter = () => {
    if (phase !== 'idle') return
    setPhase('typing')
    let i = 0
    const t = setInterval(() => {
      i++
      setTyped(CMD.slice(0, i))
      click()
      if (i >= CMD.length) {
        clearInterval(t)
        setTimeout(() => setPhase('done'), 380)
        setTimeout(() => {
          unlockScroll()
          setIntroDone(true)
        }, 900)
      }
    }, 55)
  }

  const skip = () => {
    unlockScroll()
    setIntroDone(true)
    requestAnimationFrame(() => scrollToTarget('#projects', { immediate: true }))
  }

  return (
    <AnimatePresence>
      {booted && !introDone && (
        <motion.div
          className="absolute inset-0 z-50 grid place-items-center bg-[#0B0716]/55 px-5 backdrop-blur-[2px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04, transition: { duration: 0.5 } }}
          role="dialog"
          aria-modal="true"
          aria-label="Start the portfolio"
          onKeyDown={(e) => e.key === 'Escape' && skip()}
        >
          <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-[#120C20]/90 font-mono text-sm text-[#F3EEFB] shadow-[0_30px_120px_-20px_rgba(124,92,255,.55)]">
            <div className="flex items-center gap-2 border-b border-white/[0.06] bg-[#181030] px-4 py-3">
              <i className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
              <i className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
              <i className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
              <span className="ml-3 text-xs text-[#A096BE]">zsh — the-live-build</span>
            </div>
            <div className="space-y-2 px-5 py-6">
              <p className="text-[#A096BE]">Last login: today on ttys001</p>
              <p className="text-[#A096BE]">
                {profile.name} — {profile.headline}
              </p>
              <p className="pt-2">
                <span className="text-term">{profile.handle}@portfolio</span>
                <span className="text-[#A096BE]">:~$ </span>
                <span>{typed}</span>
                {phase !== 'done' && <span className="caret" aria-hidden="true" />}
              </p>
              {phase === 'done' && (
                <p className="text-term">
                  ✓ starting the live build
                  <span className="caret" aria-hidden="true" />
                </p>
              )}
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.06] px-5 py-4">
              <button
                type="button"
                onClick={() => setSoundOn(!soundOn)}
                className="flex items-center gap-2 text-xs text-[#A096BE] hover:text-[#F3EEFB]"
                aria-pressed={soundOn}
              >
                <Icon name={soundOn ? 'volume' : 'mute'} size={15} />
                Sound {soundOn ? 'on' : 'off'}
              </button>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={skip}
                  className="text-xs text-[#A096BE] underline-offset-4 hover:text-[#F3EEFB] hover:underline"
                >
                  Skip intro
                </button>
                <button
                  ref={btn}
                  type="button"
                  onClick={enter}
                  disabled={phase !== 'idle'}
                  className="btn-primary !py-2.5 font-mono"
                  style={{ boxShadow: '0 0 0 1px rgb(56 88 233), 0 0 32px rgba(124,92,255,.8), 0 0 80px rgba(124,92,255,.35)' }}
                >
                  Enter <Icon name="play" size={12} />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
