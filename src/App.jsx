import { Suspense, lazy, useCallback, useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useApp } from './lib/AppContext'
import { initLenis, destroyLenis, scrollToTarget } from './lib/scroll'
import { Preloader } from './components/Preloader'
import { Cursor } from './components/Cursor'
import { CursorTrail } from './components/CursorTrail'
import { ScrollProgress } from './components/ScrollProgress'
import { Background } from './components/Background'
import { Navbar } from './components/Navbar'
import LiveBuildHero from './Hero/LiveBuildHero'
import { Projects } from './sections/Projects'
import { About } from './sections/About'
import { TechStack } from './sections/TechStack'
import { Experience } from './sections/Experience'
import { Services } from './sections/Services'
import { Testimonials } from './sections/Testimonials'
import { Marquee } from './sections/Marquee'
import { Contact } from './sections/Contact'
import { Footer } from './sections/Footer'

// Code-split: the editor demo and the case-study "route" load on demand.
const CodeDesign = lazy(() => import('./sections/CodeDesign').then((m) => ({ default: m.CodeDesign })))
const CaseStudyModal = lazy(() => import('./sections/CaseStudyModal'))

/** "#case/<id>" → id, else null */
const readCase = () => {
  const m = window.location.hash.match(/^#case\/([\w-]+)/)
  return m ? m[1] : null
}

export default function App() {
  const { reduced } = useApp()
  const [caseId, setCaseId] = useState(readCase)

  // Lenis smooth scroll site-wide (native scroll for reduced motion).
  useEffect(() => {
    if (reduced) return
    initLenis()
    return () => destroyLenis()
  }, [reduced])

  // Hash "router" for case studies.
  useEffect(() => {
    const on = () => setCaseId(readCase())
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])

  const closeCase = useCallback(() => {
    // go back if we opened it in this session, otherwise just clear the hash
    if (history.state?.caseOpened) history.back()
    else history.replaceState(null, '', window.location.pathname + window.location.search)
    setCaseId(null)
  }, [])

  // Smooth-scroll in-page anchors through Lenis; let #case/… links through.
  useEffect(() => {
    const onClick = (e) => {
      const a = e.target.closest('a[href^="#"]')
      if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey) return
      const href = a.getAttribute('href')
      if (href.startsWith('#case/')) {
        e.preventDefault()
        history.pushState({ caseOpened: true }, '', href)
        setCaseId(href.slice(6))
        return
      }
      const el = href.length > 1 && document.querySelector(href)
      if (el) {
        e.preventDefault()
        scrollToTarget(el, { offset: -20 })
      }
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  return (
    <>
      <a
        href="#projects"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[400] focus:rounded-lg focus:bg-wp focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      <Preloader />
      <Background />
      <ScrollProgress />
      <CursorTrail />
      <Cursor />
      <Navbar />
      <main>
        <LiveBuildHero />
        <Projects />
        <About />
        <TechStack />
        <Experience />
        <Services />
        <Suspense fallback={<div className="h-[640px]" />}>
          <CodeDesign />
        </Suspense>
        <Testimonials />
        <Marquee />
        <Contact />
      </main>
      <Footer />
      <AnimatePresence>
        {caseId && (
          <Suspense fallback={null}>
            <CaseStudyModal key={caseId} id={caseId} onClose={closeCase} />
          </Suspense>
        )}
      </AnimatePresence>
    </>
  )
}
