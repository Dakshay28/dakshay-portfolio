// Code + Design: a tiny live editor. Type HTML/CSS on the left, the
// sandboxed iframe on the right re-renders (debounced).
import { useEffect, useMemo, useRef, useState } from 'react'
import { SectionHeading } from '../components/SectionHeading'

const STARTER = `<style>
  .card {
    font-family: system-ui, sans-serif;
    background: #140E24;
    color: #F3EEFB;
    padding: 28px;
    border-radius: 16px;
    border: 1px solid #7C5CFF;
    box-shadow: 0 0 40px #7C5CFF55;
  }
  .card h2 { margin: 0 0 8px; }
  .card button {
    background: #2DE2C7;
    border: 0;
    padding: 10px 18px;
    border-radius: 99px;
    font-weight: 600;
  }
</style>

<div class="card">
  <h2>Hello from WordPress</h2>
  <p>Edit me — change the colors.</p>
  <button>Buy now</button>
</div>`

/** Very small HTML/CSS highlighter for the overlay layer. */
// Single pass over the raw source, so spans we insert are never re-matched.
function highlightHTML(src) {
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  const re = /(<\/?)([a-zA-Z][\w-]*)|([a-zA-Z-]+)=("[^"]*")|(#[0-9a-fA-F]{3,8})\b|([a-zA-Z-]+)(\s*:)(?=[^;{}<>]*;)|([\s\S])/g
  let out = ''
  let m
  while ((m = re.exec(src))) {
    if (m[2]) out += `${esc(m[1])}<span class="tok-tag">${m[2]}</span>`
    else if (m[3]) out += `<span class="tok-attr">${m[3]}</span>=<span class="tok-str">${esc(m[4])}</span>`
    else if (m[5]) out += `<span class="tok-num">${m[5]}</span>`
    else if (m[6]) out += `<span class="tok-fn">${m[6]}</span>${m[7]}`
    else out += esc(m[8])
  }
  return out
}

const wrap = (body) =>
  `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>html,body{margin:0;min-height:100%;background:#0B0716;display:grid;place-items:center;padding:24px;box-sizing:border-box}</style></head><body>${body}</body></html>`

export function CodeDesign() {
  const [code, setCode] = useState(STARTER)
  const [doc, setDoc] = useState(() => wrap(STARTER))
  const pre = useRef(null)
  const ta = useRef(null)

  useEffect(() => {
    const t = setTimeout(() => setDoc(wrap(code)), 250)
    return () => clearTimeout(t)
  }, [code])

  const html = useMemo(() => highlightHTML(code) + '\n', [code])
  const lines = code.split('\n').length

  const syncScroll = () => {
    if (pre.current && ta.current) {
      pre.current.scrollTop = ta.current.scrollTop
      pre.current.scrollLeft = ta.current.scrollLeft
    }
  }

  return (
    <section id="code" className="section-pad section-shell" aria-labelledby="code-title">
      <SectionHeading
        id="code-title"
        index={6}
        slug="code_design"
        title="Code in, design out"
        intro="This is how I work every day: code on one side, the result on the other. Try it — edit the HTML or CSS."
      />
      <div className="grid overflow-hidden rounded-[var(--radius-lg)] border border-line/10 lg:grid-cols-2">
        {/* editor */}
        <div className="relative bg-[#120C20]">
          <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-2.5 font-mono text-xs text-[#A096BE]">
            <span>
              <span className="text-amber">●</span> card.html
            </span>
            <button type="button" onClick={() => setCode(STARTER)} className="hover:text-[#F3EEFB]">
              reset
            </button>
          </div>
          <div className="relative h-[420px] font-mono text-[13px] leading-6">
            <div
              className="pointer-events-none absolute inset-y-0 left-0 w-10 select-none overflow-hidden border-r border-white/[0.05] pt-3 text-right text-[#A096BE]/50"
              aria-hidden="true"
            >
              {Array.from({ length: lines }, (_, i) => (
                <div key={i} className="pr-2">
                  {i + 1}
                </div>
              ))}
            </div>
            <pre
              ref={pre}
              className="pointer-events-none absolute inset-0 m-0 overflow-hidden whitespace-pre py-3 pl-14 pr-4 text-[#F3EEFB]"
              aria-hidden="true"
              dangerouslySetInnerHTML={{ __html: html }}
            />
            <textarea
              ref={ta}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onScroll={syncScroll}
              spellCheck={false}
              data-lenis-prevent
              aria-label="HTML and CSS editor"
              className="absolute inset-0 resize-none whitespace-pre bg-transparent py-3 pl-14 pr-4 text-transparent caret-[#2DE2C7] outline-none"
              style={{ tabSize: 2 }}
              wrap="off"
            />
          </div>
        </div>
        {/* preview */}
        <div className="flex flex-col border-t border-white/[0.06] bg-[#0B0716] lg:border-l lg:border-t-0">
          <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-2.5 font-mono text-xs text-[#A096BE]">
            <span className="text-term">●</span> preview
            <span className="ml-auto">live</span>
          </div>
          <iframe title="Live preview of the editor code" srcDoc={doc} sandbox="" className="h-[420px] w-full border-0" loading="lazy" />
        </div>
      </div>
    </section>
  )
}
