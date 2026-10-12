// Thin aurora-gradient bar along the top edge that tracks page scroll.
import { motion, useScroll, useSpring } from 'framer-motion'

export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 })
  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[120] h-[3px] origin-left"
      style={{
        scaleX,
        background: 'linear-gradient(90deg, rgb(var(--blue)), rgb(var(--green)), rgb(var(--amber)))',
        boxShadow: '0 0 12px rgb(var(--blue) / .7)',
      }}
    />
  )
}
