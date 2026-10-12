// Soft mechanical keyboard click, synthesised with WebAudio —
// no audio files to download. Silent unless sound is switched on.
import { useCallback, useRef } from 'react'
import { useApp } from '../lib/AppContext'

let ctx = null
let noise = null

function getCtx() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return null
    ctx = new AC()
    // 40ms of filtered noise is enough for a convincing "tick"
    const len = Math.floor(ctx.sampleRate * 0.04)
    noise = ctx.createBuffer(1, len, ctx.sampleRate)
    const d = noise.getChannelData(0)
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3)
  }
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

export function useKeySound() {
  const { soundOn } = useApp()
  const last = useRef(0)
  return useCallback(() => {
    if (!soundOn) return
    const now = performance.now()
    if (now - last.current < 35) return // don't stack clicks
    last.current = now
    const ac = getCtx()
    if (!ac) return
    const src = ac.createBufferSource()
    src.buffer = noise
    src.playbackRate.value = 0.85 + Math.random() * 0.35
    const bp = ac.createBiquadFilter()
    bp.type = 'bandpass'
    bp.frequency.value = 2200 + Math.random() * 1400
    bp.Q.value = 1.2
    const g = ac.createGain()
    g.gain.value = 0.18
    src.connect(bp).connect(g).connect(ac.destination)
    src.start()
  }, [soundOn])
}
