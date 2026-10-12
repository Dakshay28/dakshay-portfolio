import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useMediaQuery } from '../hooks/useMediaQuery'

const AppCtx = createContext(null)

function hasWebGL() {
  try {
    const c = document.createElement('canvas')
    return !!(window.WebGL2RenderingContext && c.getContext('webgl2')) || !!c.getContext('webgl')
  } catch {
    return false
  }
}

export function AppProvider({ children }) {
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)')
  const isMobile = useMediaQuery('(max-width: 767px)')
  const coarse = useMediaQuery('(pointer: coarse)')
  const [webgl] = useState(() => (typeof window === 'undefined' ? false : hasWebGL()))
  const [booted, setBooted] = useState(false) // preloader finished
  const [introDone, setIntroDone] = useState(false) // "Enter ▶" pressed (or skipped)
  const [soundOn, setSoundOn] = useState(false) // muted by default

  // In reduced-motion mode the intro gate is skipped entirely.
  useEffect(() => {
    if (reduced) setIntroDone(true)
  }, [reduced])

  const value = useMemo(
    () => ({
      reduced,
      isMobile,
      coarse,
      // Full WebGL journey only on capable, non-mobile devices.
      // Everyone else gets the 2.5D CSS version of the same six scenes.
      use3D: webgl && !isMobile && !reduced,
      booted,
      setBooted,
      introDone,
      setIntroDone,
      soundOn,
      setSoundOn,
    }),
    [reduced, isMobile, coarse, webgl, booted, introDone, soundOn],
  )
  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>
}

export const useApp = () => useContext(AppCtx)
