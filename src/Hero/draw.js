// ---------------------------------------------------------------
// 2D canvas painters shared by the WebGL scene (as CanvasTextures)
// and the mobile 2.5D scene (as plain <canvas> elements).
// Pure functions: (ctx, width, height, progress) → pixels.
// ---------------------------------------------------------------

export const C = {
  bg: '#0B0716',
  panel: '#140E24',
  panel2: '#1C1434',
  text: '#F3EEFB',
  muted: '#A096BE',
  blue: '#7C5CFF',
  blueText: '#B6A4FF',
  green: '#2DE2C7',
  amber: '#FF8FA3',
  purple: '#c792ea',
  red: '#ff8b8b',
  yellow: '#ffcb6b',
}

const MONO = '"JetBrains Mono", ui-monospace, monospace'
const DISPLAY = 'Syne, Inter, system-ui, sans-serif'
const SANS = 'Inter, system-ui, sans-serif'

const clamp01 = (v) => Math.max(0, Math.min(1, v))
const seg = (p, a, b) => clamp01((p - a) / (b - a))

export function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

// ------------------------------------------------------------------
// SCENE 1 — monitor terminal
// ------------------------------------------------------------------
export const BOOT_STEPS = [
  { cmd: 'wp core install --url=dakshay.dev', ok: '✓ Success: WordPress installed' },
  { cmd: 'composer install', ok: '✓ Dependencies installed' },
  { cmd: 'npm run build', ok: '✓ Compiled — starting the live build' },
]

/** Returns the visible terminal state for boot progress p (0..1). */
export function bootLines(p) {
  const out = []
  const per = 1 / BOOT_STEPS.length
  BOOT_STEPS.forEach((s, i) => {
    const local = seg(p, i * per, (i + 1) * per)
    if (local <= 0 && i > 0) return
    const typed = Math.round(seg(local, 0, 0.7) * s.cmd.length)
    out.push({ kind: 'cmd', text: s.cmd.slice(0, typed), done: local >= 0.7 })
    if (local >= 0.78) out.push({ kind: 'ok', text: s.ok })
  })
  return out
}

export function drawMonitor(ctx, W, H, p, glitch = 0) {
  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = '#0F0A1B'
  ctx.fillRect(0, 0, W, H)
  // subtle vignette glow
  const g = ctx.createRadialGradient(W / 2, H / 2, 10, W / 2, H / 2, W * 0.7)
  g.addColorStop(0, 'rgba(124,92,255,0.10)')
  g.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, W, H)

  // title bar
  ctx.fillStyle = '#181030'
  ctx.fillRect(0, 0, W, 54)
  ;['#ff5f57', '#febc2e', '#28c840'].forEach((c, i) => {
    ctx.fillStyle = c
    ctx.beginPath()
    ctx.arc(32 + i * 26, 27, 8, 0, Math.PI * 2)
    ctx.fill()
  })
  ctx.fillStyle = C.muted
  ctx.font = `500 22px ${MONO}`
  ctx.textAlign = 'center'
  ctx.fillText('dakshay@portfolio: ~', W / 2, 35)
  ctx.textAlign = 'left'

  const lines = bootLines(p)
  const lh = 50
  let y = 120
  ctx.font = `500 30px ${MONO}`
  lines.forEach((l, i) => {
    if (l.kind === 'cmd') {
      ctx.fillStyle = C.green
      ctx.fillText('$', 40, y)
      ctx.fillStyle = C.text
      ctx.fillText(l.text, 80, y)
      const last = i === lines.length - 1 && !l.done
      if (last) {
        const w = ctx.measureText(l.text).width
        if (Math.floor(performance.now() / 500) % 2 === 0) {
          ctx.fillStyle = C.green
          ctx.fillRect(84 + w, y - 26, 16, 32)
        }
      }
    } else {
      ctx.fillStyle = C.green
      ctx.fillText(l.text, 80, y)
    }
    y += lh
  })
  // idle prompt once everything has run
  if (p >= 0.999) {
    ctx.fillStyle = C.green
    ctx.fillText('$', 40, y)
    if (Math.floor(performance.now() / 500) % 2 === 0) ctx.fillRect(80, y - 26, 16, 32)
  }
  // progress hint bottom
  ctx.fillStyle = 'rgba(255,255,255,0.06)'
  ctx.fillRect(40, H - 46, W - 80, 6)
  ctx.fillStyle = C.green
  ctx.fillRect(40, H - 46, (W - 80) * p, 6)

  // v2: CRT scanlines, always on
  ctx.fillStyle = 'rgba(0,0,0,0.18)'
  for (let sy = 0; sy < H; sy += 4) ctx.fillRect(0, sy, W, 1)

  // v2: digital glitch as the camera dives into the screen.
  // Random horizontal slices are shifted sideways, with a violet/aqua
  // colour split, and the strength ramps with `glitch` (0..1).
  if (glitch > 0.02) glitchSlices(ctx, W, H, glitch)
}

function glitchSlices(ctx, W, H, k) {
  const n = 3 + Math.floor(k * 10)
  for (let i = 0; i < n; i++) {
    const h = 6 + Math.random() * 40 * k
    const y = Math.random() * (H - h)
    const dx = (Math.random() - 0.5) * 120 * k
    ctx.drawImage(ctx.canvas, 0, y, W, h, dx, y, W, h)
    ctx.fillStyle = Math.random() < 0.5 ? `rgba(124,92,255,${0.25 * k})` : `rgba(45,226,199,${0.22 * k})`
    ctx.fillRect(0, y, W, h)
  }
  // flash toward white near the end of the dive
  if (k > 0.75) {
    ctx.fillStyle = `rgba(243,238,251,${(k - 0.75) * 1.6})`
    ctx.fillRect(0, 0, W, H)
  }
}

// ------------------------------------------------------------------
// SCENE 2 — code snippets for the tunnel
// ------------------------------------------------------------------
export const SNIPPETS = [
  { file: 'functions.php', lang: 'php', code: "add_action( 'init', function () {\n  register_post_type( 'project', $args );\n} );" },
  {
    file: 'reveal.js',
    lang: 'js',
    code: 'const io = new IntersectionObserver(\n  (items) => items.forEach(reveal),\n  { threshold: 0.2 }\n);',
  },
  { file: 'Hero.jsx', lang: 'js', code: "export default function Hero() {\n  return <h1>Hi, I'm Dakshay.</h1>;\n}" },
  { file: 'query.sql', lang: 'sql', code: "SELECT ID, post_title\nFROM wp_posts\nWHERE post_status = 'publish';" },
  { file: 'block.json', lang: 'json', code: '{\n  "name": "dc/hero",\n  "apiVersion": 3,\n  "category": "design"\n}' },
  { file: 'cart.php', lang: 'php', code: "add_filter(\n  'woocommerce_add_to_cart_fragments',\n  'dc_mini_cart'\n);" },
  { file: 'api.js', lang: 'js', code: "const res = await fetch(\n  '/wp-json/wp/v2/posts?per_page=6'\n);" },
  { file: 'deploy.sh', lang: 'sh', code: 'git add .\ngit commit -m "ship it"\ngit push origin main' },
]

const KW = new Set([
  'function',
  'return',
  'const',
  'let',
  'new',
  'await',
  'export',
  'default',
  'async',
  'if',
  'else',
  'SELECT',
  'FROM',
  'WHERE',
  'git',
  'add_action',
  'add_filter',
  'register_post_type',
])

/** Tiny tokenizer → [{t, c}] colored segments for one line. */
export function highlight(line, lang) {
  const out = []
  const re =
    /(\/\/.*$|#.*$)|('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")|(<\/?[A-Za-z][\w-]*|\/?>)|(\$[A-Za-z_]\w*)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_][\w-]*)(?=\s*\()|([A-Za-z_]\w*)|(\s+)|(.)/g
  let m
  while ((m = re.exec(line))) {
    const [tok, com, str, tag, v, num, fn, word] = m
    let c = C.text
    if (com && lang !== 'json') c = C.muted
    else if (str) c = C.green
    else if (tag) c = C.red
    else if (v) c = C.yellow
    else if (num) c = C.amber
    else if (fn) c = KW.has(fn) ? C.purple : C.blueText
    else if (word) c = KW.has(word) ? C.purple : C.text
    else if (/[{}()[\];,]/.test(tok)) c = C.muted
    out.push({ t: tok, c })
  }
  return out
}

export function drawSnippet(ctx, W, H, s) {
  ctx.clearRect(0, 0, W, H)
  roundRect(ctx, 4, 4, W - 8, H - 8, 22)
  ctx.fillStyle = 'rgba(22,15,38,0.88)'
  ctx.fill()
  ctx.lineWidth = 2
  ctx.strokeStyle = 'rgba(255,255,255,0.14)'
  ctx.stroke()
  // file tab
  ctx.font = `600 22px ${MONO}`
  ctx.fillStyle = 'rgba(255,255,255,0.06)'
  roundRect(ctx, 22, 20, ctx.measureText(s.file).width + 64, 40, 10)
  ctx.fill()
  ctx.fillStyle = C.amber
  ctx.fillText('●', 36, 48)
  ctx.fillStyle = C.muted
  ctx.fillText(s.file, 64, 48)
  ctx.font = `500 26px ${MONO}`
  s.code.split('\n').forEach((line, i) => {
    let x = 34
    highlight(line, s.lang).forEach((seg) => {
      ctx.fillStyle = seg.c
      ctx.fillText(seg.t, x, 110 + i * 38)
      x += ctx.measureText(seg.t).width
    })
  })
}

// Generic glyphs floating in the tunnel (no brand artwork)
export const GLYPHS = ['braces', 'tag', 'cart', 'plug', 'block', 'json', 'prompt']

export function drawGlyph(ctx, W, H, kind) {
  ctx.clearRect(0, 0, W, H)
  const cx = W / 2
  const cy = H / 2
  ctx.lineWidth = 12
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  const glow = (c) => {
    ctx.shadowColor = c
    ctx.shadowBlur = 24
    ctx.strokeStyle = c
    ctx.fillStyle = c
  }
  ctx.font = `700 120px ${MONO}`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  switch (kind) {
    case 'braces':
      glow(C.blueText)
      ctx.fillText('{ }', cx, cy)
      break
    case 'tag':
      glow(C.red)
      ctx.font = `700 100px ${MONO}`
      ctx.fillText('</>', cx, cy)
      break
    case 'json':
      glow(C.amber)
      ctx.font = `700 96px ${MONO}`
      ctx.fillText('[ ]', cx, cy)
      break
    case 'prompt':
      glow(C.green)
      ctx.fillText('$_', cx, cy)
      break
    case 'cart': {
      // generic shopping cart
      glow(C.purple)
      ctx.beginPath()
      ctx.moveTo(48, 70)
      ctx.lineTo(80, 70)
      ctx.lineTo(108, 170)
      ctx.lineTo(196, 170)
      ctx.lineTo(214, 100)
      ctx.lineTo(90, 100)
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(116, 204, 14, 0, Math.PI * 2)
      ctx.arc(186, 204, 14, 0, Math.PI * 2)
      ctx.fill()
      break
    }
    case 'plug': {
      glow(C.green)
      roundRect(ctx, 78, 92, 100, 80, 18)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(106, 92)
      ctx.lineTo(106, 54)
      ctx.moveTo(150, 92)
      ctx.lineTo(150, 54)
      ctx.moveTo(128, 172)
      ctx.lineTo(128, 214)
      ctx.stroke()
      break
    }
    case 'block': {
      // block-editor style "add block" square
      glow(C.blueText)
      roundRect(ctx, 58, 58, 140, 140, 22)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(128, 96)
      ctx.lineTo(128, 160)
      ctx.moveTo(96, 128)
      ctx.lineTo(160, 128)
      ctx.stroke()
      break
    }
  }
  ctx.shadowBlur = 0
  ctx.textAlign = 'left'
  ctx.textBaseline = 'alphabetic'
}

// ------------------------------------------------------------------
// SCENE 3 — the website assembling itself inside the browser
//   0.00–0.25  gray wireframe boxes (dashed)
//   0.25–0.50  layout: boxes fill in
//   0.50–0.75  typography + images snap in
//   0.75–1.00  polish: color, button glow, badge
// ------------------------------------------------------------------
const BOXES = [
  { id: 'nav', x: 0.04, y: 0.05, w: 0.92, h: 0.08 },
  { id: 'title', x: 0.06, y: 0.22, w: 0.5, h: 0.2 },
  { id: 'body', x: 0.06, y: 0.46, w: 0.42, h: 0.12 },
  { id: 'cta', x: 0.06, y: 0.63, w: 0.18, h: 0.08 },
  { id: 'img', x: 0.6, y: 0.2, w: 0.34, h: 0.52 },
  { id: 'c1', x: 0.06, y: 0.8, w: 0.27, h: 0.16 },
  { id: 'c2', x: 0.365, y: 0.8, w: 0.27, h: 0.16 },
  { id: 'c3', x: 0.67, y: 0.8, w: 0.27, h: 0.16 },
]

export function drawBrowser(ctx, W, H, a, deployed = false) {
  ctx.clearRect(0, 0, W, H)
  const polish = seg(a, 0.75, 1)
  ctx.fillStyle = polish > 0 ? lerpColor('#150F26', '#110B1E', polish) : '#150F26'
  ctx.fillRect(0, 0, W, H)

  if (polish > 0) {
    const g = ctx.createRadialGradient(W * 0.78, H * 0.4, 10, W * 0.78, H * 0.4, W * 0.5)
    g.addColorStop(0, `rgba(124,92,255,${0.28 * polish})`)
    g.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, W, H)
  }

  const wire = seg(a, 0, 0.25)
  const fill = seg(a, 0.25, 0.5)
  const type = seg(a, 0.5, 0.75)

  BOXES.forEach((b, i) => {
    const appear = clamp01(wire * BOXES.length - i) // staggered
    if (appear <= 0) return
    const x = b.x * W
    const y = b.y * H
    const w = b.w * W
    const h = b.h * H
    ctx.globalAlpha = appear
    // filled layout block
    if (fill > 0 && !(type > 0.4 && ['title', 'body'].includes(b.id))) {
      ctx.fillStyle = `rgba(38,28,64,${0.9 * fill})`
      roundRect(ctx, x, y, w, h, 12)
      ctx.fill()
    }
    // dashed wireframe
    if (fill < 1) {
      ctx.setLineDash([10, 8])
      ctx.lineWidth = 2
      ctx.strokeStyle = `rgba(160,150,190,${0.7 * (1 - fill)})`
      roundRect(ctx, x, y, w, h, 12)
      ctx.stroke()
      ctx.setLineDash([])
    }
    ctx.globalAlpha = 1
  })

  if (type > 0) {
    ctx.globalAlpha = type
    // nav
    ctx.font = `600 22px ${MONO}`
    ctx.fillStyle = C.text
    ctx.fillText('dc_', 0.065 * W, 0.105 * H)
    ctx.font = `500 18px ${SANS}`
    ctx.fillStyle = C.muted
    ;['Work', 'About', 'Stack', 'Contact'].forEach((t, i) => ctx.fillText(t, (0.62 + i * 0.08) * W, 0.103 * H))
    // headline
    ctx.font = `700 ${Math.round(H * 0.085)}px ${DISPLAY}`
    ctx.fillStyle = C.text
    ctx.fillText('Hi, I’m', 0.06 * W, 0.3 * H)
    ctx.fillText('Dakshay.', 0.06 * W, 0.4 * H)
    // body lines
    ctx.fillStyle = C.muted
    ctx.font = `400 20px ${SANS}`
    ctx.fillText('WordPress & PHP Developer', 0.06 * W, 0.5 * H)
    ctx.fillText('Full-Stack Web Developer · 6+ years', 0.06 * W, 0.55 * H)
    // image snapping in: scale 1.12 → 1
    const snap = seg(type, 0.3, 1)
    const b = BOXES[4]
    const s = 1.12 - 0.12 * easeOutBack(snap)
    const iw = b.w * W * s
    const ih = b.h * H * s
    const ix = b.x * W + (b.w * W - iw) / 2
    const iy = b.y * H + (b.h * H - ih) / 2
    ctx.globalAlpha = type * snap
    const ig = ctx.createLinearGradient(ix, iy, ix + iw, iy + ih)
    ig.addColorStop(0, '#2A1A66')
    ig.addColorStop(0.55, '#7C5CFF')
    ig.addColorStop(1, '#2DE2C7')
    ctx.fillStyle = ig
    roundRect(ctx, ix, iy, iw, ih, 16)
    ctx.fill()
    // code glyph on the "image"
    ctx.fillStyle = 'rgba(255,255,255,0.85)'
    ctx.font = `700 ${Math.round(ih * 0.28)}px ${MONO}`
    ctx.textAlign = 'center'
    ctx.fillText('</>', ix + iw / 2, iy + ih / 2 + ih * 0.1)
    ctx.textAlign = 'left'
    // card text
    ctx.globalAlpha = type
    ctx.font = `600 18px ${SANS}`
    ;['Custom themes', 'WooCommerce', 'Speed'].forEach((t, i) => {
      ctx.fillStyle = C.text
      ctx.fillText(t, (BOXES[5 + i].x + 0.02) * W, 0.875 * H)
      ctx.fillStyle = C.muted
      ctx.fillRect((BOXES[5 + i].x + 0.02) * W, 0.9 * H, BOXES[5 + i].w * W * 0.6, 6)
    })
    ctx.globalAlpha = 1
  }

  if (polish > 0) {
    // CTA button with glow
    const b = BOXES[3]
    ctx.shadowColor = C.blue
    ctx.shadowBlur = 30 * polish
    ctx.fillStyle = C.blue
    roundRect(ctx, b.x * W, b.y * H, b.w * W, b.h * H, (b.h * H) / 2)
    ctx.globalAlpha = polish
    ctx.fill()
    ctx.shadowBlur = 0
    ctx.fillStyle = '#fff'
    ctx.font = `600 18px ${SANS}`
    ctx.fillText('Hire me', b.x * W + 34, b.y * H + b.h * H * 0.64)
    // freelance badge
    ctx.fillStyle = 'rgba(255,143,163,0.14)'
    roundRect(ctx, 0.06 * W, 0.155 * H, 250, 34, 17)
    ctx.fill()
    ctx.fillStyle = C.amber
    ctx.beginPath()
    ctx.arc(0.06 * W + 20, 0.155 * H + 17, 5, 0, Math.PI * 2)
    ctx.fill()
    ctx.font = `600 15px ${MONO}`
    ctx.fillText('Available for freelance', 0.06 * W + 34, 0.155 * H + 22)
    // nav underline
    ctx.fillStyle = C.blue
    ctx.fillRect(0.62 * W, 0.115 * H, 46, 3)
    ctx.globalAlpha = 1
  }

  // v2: laser scan — one aqua beam sweeps the page for each build stage
  // (wireframe, layout, type & images, polish).
  if (a > 0.001 && a < 0.999) {
    const local = (a * 4) % 1
    const ly = local * H
    const beam = ctx.createLinearGradient(0, ly - 90, 0, ly)
    beam.addColorStop(0, 'rgba(45,226,199,0)')
    beam.addColorStop(1, 'rgba(45,226,199,0.22)')
    ctx.fillStyle = beam
    ctx.fillRect(0, ly - 90, W, 90)
    ctx.shadowColor = '#2DE2C7'
    ctx.shadowBlur = 24
    ctx.fillStyle = '#2DE2C7'
    ctx.fillRect(0, ly - 2, W, 3)
    ctx.shadowBlur = 0
    // stage label riding on the beam
    const stage = ['wireframe', 'layout', 'type + images', 'polish'][Math.min(3, Math.floor(a * 4))]
    ctx.font = `600 16px ${MONO}`
    ctx.fillStyle = 'rgba(11,7,22,0.85)'
    roundRect(ctx, W - 230, ly - 34, 200, 26, 13)
    ctx.fill()
    ctx.fillStyle = '#2DE2C7'
    ctx.fillText(`▸ ${stage}`, W - 216, ly - 16)
  }

  if (deployed) {
    ctx.fillStyle = 'rgba(45,226,199,0.16)'
    roundRect(ctx, W - 300, H - 70, 270, 44, 22)
    ctx.fill()
    ctx.fillStyle = C.green
    ctx.font = `600 18px ${MONO}`
    ctx.fillText('✓ deployed', W - 270, H - 41)
  }
}

function easeOutBack(t) {
  const c1 = 1.70158
  const c3 = c1 + 1
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2)
}

function lerpColor(a, b, t) {
  const pa = parseInt(a.slice(1), 16)
  const pb = parseInt(b.slice(1), 16)
  const r = Math.round(((pa >> 16) & 255) * (1 - t) + ((pb >> 16) & 255) * t)
  const g = Math.round(((pa >> 8) & 255) * (1 - t) + ((pb >> 8) & 255) * t)
  const bl = Math.round((pa & 255) * (1 - t) + (pb & 255) * t)
  return `rgb(${r},${g},${bl})`
}

/** Create an offscreen canvas and paint into it once. */
export function paint(W, H, fn) {
  const c = document.createElement('canvas')
  c.width = W
  c.height = H
  fn(c.getContext('2d'), W, H)
  return c
}
