# The Live Build — Dakshay Chauhan's portfolio

A scroll-driven 3D portfolio: code compiles into a real website as you scroll, ending in a successful deploy.

**Stack:** React 19 + Vite · Tailwind CSS · React Three Fiber + drei · GSAP + ScrollTrigger · Lenis · Framer Motion

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # → dist/  (also writes 404.html + .nojekyll for GitHub Pages)
npm run preview   # serve the production build
```

## Deploy to GitHub Pages

**Option A — GitHub Actions (recommended).** Push to `main`, then in the repo go to *Settings → Pages → Source* and choose **GitHub Actions**. `.github/workflows/deploy.yml` builds and publishes on every push.

**Option B — one command.** `npm run deploy` builds and pushes `dist/` to a `gh-pages` branch (set Pages source to that branch).

`vite.config.js` uses `base: './'`, so it works under any repo name. If the URL changes, update it in `index.html` (canonical, Open Graph, JSON-LD), `public/sitemap.xml`, `public/robots.txt` and `siteUrl` in `src/data/profile.js`.

## Make it yours — everything lives in `src/data/`

| File | What's in it |
| --- | --- |
| `profile.js` | Name, headline, roles, links, email, resume path, About story, counters, photo, optional form endpoint |
| `projects.js` | All projects. Entries with `heroTab` also appear as tabs inside the hero browser (scene 4) and as the flying cards (scene 5) |
| `experience.js` | Git-log timeline entries |
| `skills.js` | Tech stack groups (bento grid + hero `stack.json` tab) |
| `content.js` | Services, testimonials, marquee words, contact-form options |

### Before going live — replace the placeholders

- [ ] **Testimonials** (`content.js`) — they're sample text with a visible "sample" badge. Paste real reviews and set `placeholder: false`.
- [ ] **Counters** (`profile.js → stats`) — set your real numbers.
- [ ] **Email** (`profile.js → email`) and **Fiverr gig URL** (`profile.links.fiverr`).
- [ ] **Photo** — drop your photo in `public/` and point `profile.photo` at it.
- [ ] **Resume** — replace `public/resume.pdf`.
- [ ] **Screenshots** — `public/screens/*.svg` are generated placeholders (`node scripts/make-placeholders.mjs`). Swap in real full-page captures (tall, ~1280×3000 — they auto-scroll on hover).
- [ ] **Case studies** (`projects.js`) — rewrite problem / solution / features in your words; add measured Lighthouse scores and set `results.verified: true` (removes the "sample scores" note).
- [ ] **Placeholder projects** — `carewell`, `noir`, `woo-store` have `placeholder: true`; replace or delete them.
- [ ] **Contact form** — works out of the box by opening the visitor's email app. For in-page sending, set `profile.formEndpoint` (Formspree, Getform, a Cloudflare Worker…) — it receives a JSON POST.
- [ ] **Contribution graph** — decorative pattern. Pass real data via `<ContributionGraph data={[...]}/>` (364 values, 0–4).

## How the hero works

```
src/Hero/
  LiveBuildHero.jsx   ← the GSAP master timeline (read this first — every scene is commented)
  heroState.js        ← shared numbers S {boot, dive, tunnel, rise, assemble, zoom, tab, out, deploy}
  draw.js             ← 2D canvas painters (monitor terminal, code snippets, assembling website)
  Scene3D.jsx         ← lazy WebGL canvas (desktop)
  scene3d/World.jsx   ← camera rig, monitor, instanced code tunnel, 3D browser
  Scene25D.jsx        ← CSS-3D version of the same scenes (mobile / no WebGL)
  BrowserOverlay.jsx  ← DOM browser with the six tabs (scene 4)
  FlyingCards.jsx     ← tabs → project cards (scene 5)
  DeployLayer.jsx, Confetti.jsx ← scene 6
  IntroTerminal.jsx, HeroControls.jsx, HeroStatic.jsx (reduced motion)
```

One GSAP timeline (12 "beats") is scrubbed by ScrollTrigger across the 600vh section. It only tweens plain numbers in `S` and a few overlay opacities. The 3D scene reads `S` every frame; React overlays re-render only when a discrete value changes (scene, tab, %). To retime a scene, change its numbers in `LiveBuildHero.jsx` and the matching window in `SCENES` (`heroState.js`).

## Performance & accessibility notes

- Three.js (~240 KB gz) is its own chunk, requested only after the preloader finishes — it's not on the critical path.
- DPR capped at 1.5 + `AdaptiveDpr`; tunnel objects are `InstancedMesh`; the canvas stops rendering when the hero is off-screen; canvas textures repaint only when their progress value changes.
- `prefers-reduced-motion`: no scroll-jacking, no pinning, static scene panels with fades, native scrolling, no scramble or cursor effects.
- Keyboard: tabs use arrow keys, modal traps focus and closes on Esc, intro has Skip, visible focus rings everywhere.
- SEO: meta + Open Graph image (`public/og.png`), JSON-LD `Person`, `sitemap.xml`, `robots.txt`, `<noscript>` fallback.

## Credits

Navbar adapted from 21st.dev "Tubelight Navbar" (ayushmxxn); filter tabs adapted from 21st.dev "Animated Tabs" (builduilabs). Both restyled to the Midnight Terminal theme.

---

## v2 — Aurora edition (this copy)

Same structure and data files as v1; new theme and extra motion.

**Theme:** "Aurora Terminal" — violet-ink night `#0B0716`, violet primary `#7C5CFF`, aqua `#2DE2C7`, coral `#FF8FA3`. Tokens live at the top of `src/index.css` (dark + light). Display face is **Syne**; all fonts are self-hosted with `@fontsource` (no Google Fonts request).

**New effects**

| Where | Effect | File |
| --- | --- | --- |
| Hero | Aurora sky shader that follows the camera and brightens on deploy | `Hero/scene3d/World.jsx → AuroraSky` |
| Hero | Warp-speed light streaks that stretch with scroll speed in the tunnel | `World.jsx → WarpStreaks` |
| Hero | Digital glitch + CRT scanlines as the camera dives into the monitor | `Hero/draw.js → drawMonitor / glitchSlices` |
| Hero | Laser scan beam with stage label while the site assembles | `draw.js → drawBrowser` |
| Hero | Shockwave rings + camera shake when the deploy lands | `World.jsx → DeployShockwave`, `CameraRig` |
| Hero | Animated aurora gradient on the name and the "Let's build yours." headline | `.aurora-text` in `index.css` |
| Page | Aurora ribbon background + film grain | `components/Background.jsx` |
| Page | Scroll progress bar | `components/ScrollProgress.jsx` |
| Page | Aurora light trail behind the cursor | `components/CursorTrail.jsx` |
| Page | Heading underline that draws itself in | `components/SectionHeading.jsx` |
| Page | Button click ripple | `components/MagneticButton.jsx` |
| Projects | 3D tilt on hover + mask-wipe reveal on scroll | `sections/Projects.jsx`, `GlassCard tilt` |
| Services | Pinned horizontal-scroll track with a progress rail (desktop) | `sections/Services.jsx` |
| Marquee | Two rows in opposite directions; speed, direction and skew follow scroll velocity | `sections/Marquee.jsx` |
| Footer | Letters lift in a wave and take aurora colours on hover | `sections/Footer.jsx` |

All of it switches off for `prefers-reduced-motion`; cursor effects are skipped on touch devices.
