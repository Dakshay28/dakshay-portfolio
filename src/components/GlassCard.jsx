import { forwardRef, useCallback, useRef } from 'react'
import { useApp } from '../lib/AppContext'

/**
 * Glass surface with a mouse-follow spotlight and an animated gradient
 * border on hover (styles in index.css → .glass-card).
 * v2: optional `tilt` — the card leans in 3D toward the pointer.
 */
export const GlassCard = forwardRef(function GlassCard({ as: Tag = 'div', className = '', tilt = false, children, ...rest }, ref) {
  const { reduced, coarse } = useApp()
  const doTilt = tilt && !reduced && !coarse
  const raf = useRef(0)

  const onMove = useCallback(
    (e) => {
      const el = e.currentTarget
      const r = el.getBoundingClientRect()
      const x = e.clientX - r.left
      const y = e.clientY - r.top
      el.style.setProperty('--mx', `${x}px`)
      el.style.setProperty('--my', `${y}px`)
      if (!doTilt) return
      const rx = (0.5 - y / r.height) * 9
      const ry = (x / r.width - 0.5) * 11
      cancelAnimationFrame(raf.current)
      raf.current = requestAnimationFrame(() => {
        el.style.transition = 'transform .12s ease-out'
        el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`
      })
    },
    [doTilt],
  )

  const onLeave = useCallback(
    (e) => {
      if (!doTilt) return
      cancelAnimationFrame(raf.current)
      e.currentTarget.style.transition = 'transform .7s cubic-bezier(.16,1,.3,1)'
      e.currentTarget.style.transform = ''
    },
    [doTilt],
  )

  return (
    <Tag
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={`glass-card ${doTilt ? 'will-change-transform [transform-style:preserve-3d]' : ''} ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  )
})
