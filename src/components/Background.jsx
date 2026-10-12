// Fixed page backdrop (v2): dot grid + three slow aurora ribbons + film grain.
// Ribbons are blurred gradients on the GPU (transform-only animation), so
// they cost almost nothing. Reduced motion freezes them (see index.css).
const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 .55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")"

export function Background() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 dot-grid" />
      <div className="aurora-ribbon aurora-a" />
      <div className="aurora-ribbon aurora-b" />
      <div className="aurora-ribbon aurora-c" />
      <div className="absolute inset-0 opacity-[0.07] mix-blend-overlay" style={{ backgroundImage: GRAIN }} />
    </div>
  )
}
