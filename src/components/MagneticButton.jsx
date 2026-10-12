import { useMagnetic } from '../hooks/useMagnetic'

/** v2: a light ripple spreads from the click point. */
function ripple(e) {
  const el = e.currentTarget
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const r = el.getBoundingClientRect()
  const size = Math.max(r.width, r.height) * 2.2
  const span = document.createElement('span')
  span.className = 'ripple'
  span.style.width = span.style.height = `${size}px`
  span.style.left = `${e.clientX - r.left}px`
  span.style.top = `${e.clientY - r.top}px`
  el.appendChild(span)
  setTimeout(() => span.remove(), 650)
}

/** Button or link that leans toward the cursor. Renders <a> when href is given. */
export function MagneticButton({ href, variant = 'primary', className = '', children, strength = 0.28, onClick, ...rest }) {
  const ref = useMagnetic(strength)
  const cls = `${variant === 'primary' ? 'btn-primary' : 'btn-ghost'} relative overflow-hidden ${className}`
  const click = (e) => {
    ripple(e)
    onClick?.(e)
  }
  if (href) {
    return (
      <a ref={ref} href={href} className={cls} onClick={click} {...rest}>
        {children}
      </a>
    )
  }
  return (
    <button ref={ref} type="button" className={cls} onClick={click} {...rest}>
      {children}
    </button>
  )
}
