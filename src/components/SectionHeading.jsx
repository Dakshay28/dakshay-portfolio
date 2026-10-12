import { ScrambleText } from './ScrambleText'
import { useInViewOnce } from '../hooks/useInViewOnce'

/**
 * Section header:  // 02_projects   (code comment, syntax-colored)
 *                  Heading text▍     (scramble-decoded, caret on the last word)
 *                  ───────           (v2: aurora rule draws itself in)
 */
export function SectionHeading({ index, slug, title, intro, id, align = 'left' }) {
  const [ref, seen] = useInViewOnce({ threshold: 0.4 })
  return (
    <header ref={ref} className={`mb-12 sm:mb-16 ${align === 'center' ? 'text-center mx-auto' : ''} max-w-3xl`}>
      <p className="font-mono text-sm tok-com mb-4 not-italic">
        <span className="text-muted">// </span>
        <span className="tok-num">{String(index).padStart(2, '0')}</span>
        <span className="text-muted">_</span>
        <span className="tok-fn">{slug}</span>
      </p>
      <h2 id={id} className="text-3xl sm:text-4xl lg:text-5xl font-extrabold">
        <ScrambleText text={title} />
        <span className="caret-thin" aria-hidden="true" />
      </h2>
      <span className={`heading-rule ${seen ? 'is-in' : ''}`} aria-hidden="true" />
      {intro && <p className="mt-5 text-muted text-base sm:text-lg max-w-2xl">{intro}</p>}
    </header>
  )
}
