// Adapted from 21st.dev "Tubelight Navbar" (ayushmxxn): floating glass
// pill with a layoutId "lamp" that glides to the active item.
// Changes: plain anchors + Lenis scrolling instead of next/link, active
// item follows scroll position, Midnight Terminal styling, theme toggle.
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Icon } from './Icons'
import { useTheme } from '../hooks/useTheme'
import { scrollToTarget } from '../lib/scroll'

const ITEMS = [
  { name: 'Work', id: 'projects' },
  { name: 'About', id: 'about' },
  { name: 'Stack', id: 'stack' },
  { name: 'Experience', id: 'experience' },
  { name: 'Services', id: 'services' },
  { name: 'Contact', id: 'contact' },
]

export function Navbar() {
  const [active, setActive] = useState('')
  const [theme, toggleTheme] = useTheme()

  // Active item = the section crossing the middle of the viewport.
  useEffect(() => {
    const els = ITEMS.map((i) => document.getElementById(i.id)).filter(Boolean)
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id))
      },
      { rootMargin: '-50% 0px -50% 0px' },
    )
    els.forEach((el) => io.observe(el))
    const onTop = () => window.scrollY < window.innerHeight * 0.5 && setActive('')
    window.addEventListener('scroll', onTop, { passive: true })
    return () => {
      io.disconnect()
      window.removeEventListener('scroll', onTop)
    }
  }, [])

  const go = (e, id) => {
    e.preventDefault()
    setActive(id)
    scrollToTarget(`#${id}`, { offset: -20 })
  }

  return (
    <nav aria-label="Primary" className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 sm:bottom-auto sm:top-5">
      <div className="glass flex items-center gap-1 rounded-full p-1 shadow-[0_10px_40px_-12px_rgba(0,0,0,.6)]">
        <a
          href="#top"
          onClick={(e) => go(e, 'top')}
          className="hidden px-3 font-mono text-sm font-semibold text-ink sm:block"
          aria-label="Back to start"
        >
          dc<span className="text-term">_</span>
        </a>
        {ITEMS.map((item) => {
          const isActive = active === item.id
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => go(e, item.id)}
              aria-current={isActive ? 'true' : undefined}
              className={`relative rounded-full px-2.5 py-2 text-xs font-medium transition-colors sm:px-4 sm:text-sm ${
                isActive ? 'text-ink' : 'text-muted hover:text-ink'
              } ${item.id === 'stack' || item.id === 'services' ? 'hidden md:block' : ''}`}
            >
              {item.name}
              {isActive && (
                <motion.span
                  layoutId="nav-lamp"
                  className="absolute inset-0 -z-10 rounded-full bg-wp/10"
                  transition={{ type: 'spring', stiffness: 320, damping: 30 }}
                >
                  <span className="absolute -top-1 left-1/2 h-[3px] w-7 -translate-x-1/2 rounded-full bg-wp">
                    <span className="absolute -left-2 -top-2 h-5 w-11 rounded-full bg-wp/30 blur-md" />
                  </span>
                </motion.span>
              )}
            </a>
          )
        })}
        <button
          type="button"
          onClick={toggleTheme}
          className="ml-1 grid h-9 w-9 place-items-center rounded-full text-muted transition-colors hover:text-ink"
          aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
        >
          <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={17} />
        </button>
      </div>
    </nav>
  )
}
