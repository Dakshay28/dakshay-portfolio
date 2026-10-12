// Generates tall placeholder "full-page screenshots" as SVG into
// public/screens/. Run:  node scripts/make-placeholders.mjs
// Replace them with real captures whenever you have them (keep the
// file names, or update `cover` / `images` in src/data/projects.js).
import { mkdirSync, writeFileSync } from 'node:fs'

const OUT = new URL('../public/screens/', import.meta.url)
mkdirSync(OUT, { recursive: true })

const W = 1280
const H = 3000

const sites = [
  { file: 'escindia', title: 'ESC India', sub: 'Export Promotion Council', a: '#3858E9', b: '#0e1430', bg: '#0b0e1a', ink: '#E8EAF0' },
  { file: 'iee', title: 'India Electronics Expo', sub: 'Exhibit · Visit · Connect', a: '#FFB547', b: '#2a1a05', bg: '#0f0c08', ink: '#F5EFE6' },
  { file: 'escawards', title: 'ESC Awards', sub: 'Celebrating excellence', a: '#c792ea', b: '#1c1030', bg: '#0d0a14', ink: '#EEE8F6' },
  { file: 'idreamcareer', title: 'iDreamCareer', sub: 'Career guidance for students', a: '#3DDC97', b: '#08241a', bg: '#f4f7f5', ink: '#0f1c16', light: true },
  { file: 'carewell', title: 'CareWell Clinic', sub: 'Book a visit today', a: '#2a9df4', b: '#e8f3fd', bg: '#ffffff', ink: '#0b2133', light: true },
  { file: 'noir', title: 'NOIR', sub: 'Specialty coffee', a: '#d9b38c', b: '#1a140f', bg: '#0c0a08', ink: '#f2e9df' },
  { file: 'woo', title: 'Your Store', sub: 'WooCommerce', a: '#7f54b3', b: '#f1ebf8', bg: '#fbfaff', ink: '#1d1430', light: true },
]

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;')

function page(s, before = false) {
  const font = before ? 'Georgia, serif' : 'Inter, Arial, sans-serif'
  const a = before ? '#6b7280' : s.a
  const bg = before ? '#e9e9e9' : s.bg
  const ink = before ? '#333' : s.ink
  const card = before ? '#ffffff' : s.light ? '#ffffff' : 'rgba(255,255,255,0.05)'
  const line = before ? '#c9c9c9' : s.light ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)'
  const muted = before ? '#777' : s.light ? 'rgba(0,0,0,0.45)' : 'rgba(255,255,255,0.45)'
  const r = before ? 0 : 18
  let y = 0
  const parts = []
  // nav
  parts.push(`<rect width="${W}" height="90" fill="${before ? '#d6d6d6' : bg}"/>`)
  parts.push(`<text x="60" y="56" font-family="${font}" font-size="26" font-weight="700" fill="${ink}">${esc(s.title)}</text>`)
  ;['Home', 'About', 'Events', 'Contact'].forEach((t, i) =>
    parts.push(`<text x="${760 + i * 120}" y="54" font-family="${font}" font-size="18" fill="${muted}">${t}</text>`),
  )
  y = 90
  // hero
  if (before) {
    parts.push(`<rect y="${y}" width="${W}" height="520" fill="#bdbdbd"/>`)
    parts.push(`<text x="${W / 2}" y="${y + 270}" text-anchor="middle" font-family="${font}" font-size="54" fill="#444">Welcome to ${esc(s.title)}</text>`)
    parts.push(`<text x="${W / 2}" y="${y + 320}" text-anchor="middle" font-family="${font}" font-size="20" fill="#555">Click here to learn more</text>`)
    y += 520
  } else {
    parts.push(`<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${s.b}"/><stop offset="1" stop-color="${a}" stop-opacity="0.55"/></linearGradient></defs>`)
    parts.push(`<rect y="${y}" width="${W}" height="720" fill="url(#g)"/>`)
    parts.push(`<text x="80" y="${y + 300}" font-family="${font}" font-size="88" font-weight="800" fill="${ink}" letter-spacing="-3">${esc(s.title)}</text>`)
    parts.push(`<text x="82" y="${y + 360}" font-family="${font}" font-size="28" fill="${ink}" opacity="0.7">${esc(s.sub)}</text>`)
    parts.push(`<rect x="82" y="${y + 420}" width="220" height="62" rx="31" fill="${a}"/>`)
    parts.push(`<text x="192" y="${y + 459}" text-anchor="middle" font-family="${font}" font-size="20" font-weight="700" fill="${s.light ? '#fff' : '#0b0b0b'}">Get started</text>`)
    parts.push(`<rect x="760" y="${y + 120}" width="440" height="480" rx="28" fill="${a}" opacity="0.25"/>`)
    parts.push(`<rect x="800" y="${y + 160}" width="360" height="400" rx="20" fill="${bg}" opacity="0.7"/>`)
    y += 720
  }
  // stats / logos row
  y += 60
  for (let i = 0; i < 4; i++) {
    parts.push(`<text x="${110 + i * 290}" y="${y + 40}" font-family="${font}" font-size="44" font-weight="700" fill="${a}">${[120, 35, 9, 24][i]}${['+', 'k', '', '/7'][i]}</text>`)
    parts.push(`<rect x="${110 + i * 290}" y="${y + 60}" width="150" height="10" rx="5" fill="${line}"/>`)
  }
  y += 140
  // section title
  const section = (title) => {
    y += 70
    parts.push(`<text x="80" y="${y}" font-family="${font}" font-size="44" font-weight="700" fill="${ink}">${title}</text>`)
    parts.push(`<rect x="80" y="${y + 24}" width="420" height="12" rx="6" fill="${line}"/>`)
    y += 70
  }
  section(before ? 'Latest News' : 'What we do')
  for (let row = 0; row < 2; row++) {
    for (let i = 0; i < 3; i++) {
      const x = 80 + i * 380
      parts.push(`<rect x="${x}" y="${y}" width="350" height="360" rx="${r}" fill="${card}" stroke="${line}"/>`)
      parts.push(`<rect x="${x + 20}" y="${y + 20}" width="310" height="170" rx="${r ? 12 : 0}" fill="${a}" opacity="${0.18 + ((i + row) % 3) * 0.12}"/>`)
      parts.push(`<rect x="${x + 20}" y="${y + 220}" width="220" height="16" rx="8" fill="${ink}" opacity="0.8"/>`)
      parts.push(`<rect x="${x + 20}" y="${y + 255}" width="300" height="10" rx="5" fill="${line}"/>`)
      parts.push(`<rect x="${x + 20}" y="${y + 278}" width="260" height="10" rx="5" fill="${line}"/>`)
      parts.push(`<rect x="${x + 20}" y="${y + 310}" width="110" height="28" rx="${r ? 14 : 0}" fill="${a}" opacity="0.8"/>`)
    }
    y += 400
  }
  section(before ? 'Upcoming Events' : 'Featured')
  parts.push(`<rect x="80" y="${y}" width="${W - 160}" height="420" rx="${r}" fill="${a}" opacity="${before ? 0.25 : 0.16}"/>`)
  parts.push(`<rect x="140" y="${y + 80}" width="460" height="28" rx="14" fill="${ink}" opacity="0.8"/>`)
  for (let i = 0; i < 4; i++) parts.push(`<rect x="140" y="${y + 140 + i * 30}" width="${500 - i * 60}" height="12" rx="6" fill="${ink}" opacity="0.3"/>`)
  parts.push(`<rect x="760" y="${y + 60}" width="380" height="300" rx="${r}" fill="${bg}" opacity="0.6"/>`)
  y += 480
  section('Testimonials')
  for (let i = 0; i < 2; i++) {
    const x = 80 + i * 570
    parts.push(`<rect x="${x}" y="${y}" width="540" height="220" rx="${r}" fill="${card}" stroke="${line}"/>`)
    for (let k = 0; k < 4; k++) parts.push(`<rect x="${x + 30}" y="${y + 40 + k * 28}" width="${460 - k * 50}" height="10" rx="5" fill="${line}"/>`)
    parts.push(`<circle cx="${x + 54}" cy="${y + 180}" r="20" fill="${a}" opacity="0.6"/>`)
  }
  y += 280
  // footer fills the rest
  parts.push(`<rect y="${y}" width="${W}" height="${H - y}" fill="${before ? '#3a3a3a' : s.light ? s.ink : '#050608'}"/>`)
  for (let i = 0; i < 4; i++) {
    parts.push(`<rect x="${80 + i * 300}" y="${y + 80}" width="140" height="14" rx="7" fill="#ffffff" opacity="0.5"/>`)
    for (let k = 0; k < 4; k++) parts.push(`<rect x="${80 + i * 300}" y="${y + 120 + k * 30}" width="${180 - k * 20}" height="9" rx="4" fill="#ffffff" opacity="0.2"/>`)
  }
  parts.push(`<text x="80" y="${H - 50}" font-family="${font}" font-size="16" fill="#ffffff" opacity="0.4">Placeholder screenshot — replace with a real capture</text>`)

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect width="${W}" height="${H}" fill="${bg}"/>${parts.join('')}</svg>`
}

for (const s of sites) {
  writeFileSync(new URL(`${s.file}.svg`, OUT), page(s))
  writeFileSync(new URL(`${s.file}-before.svg`, OUT), page(s, true))
}
console.log(`wrote ${sites.length * 2} placeholder screenshots`)
