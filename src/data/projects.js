// ---------------------------------------------------------------
// Projects — the single source for BOTH the hero browser tabs
// (scene 4) and the Projects grid. Entries with `heroTab` appear in
// the hero, in `heroOrder`.
//
// Field reference
//   id, title, client, url, tags[], stack[], cover, images[{src, label}],
//   role, description, problem, solution, features[],
//   results: { lighthouse: {performance, accessibility, bestPractices, seo},
//              notes[], verified }
//   placeholder: true  → card shows a "sample" badge until you replace it
//
// Screenshots in /public/screens are generated placeholders
// (scripts/make-placeholders.mjs). Swap in real full-page captures —
// tall images (e.g. 1280×3000) make the hover auto-scroll look best.
// ---------------------------------------------------------------

export const FILTERS = ['All', 'WordPress', 'Custom Themes', 'WooCommerce', 'React', 'PHP', 'Landing Pages', 'Freelance']

export const projects = [
  {
    id: 'escindia',
    heroTab: 'escindia.in',
    heroOrder: 1,
    title: 'ESC India',
    client: 'Electronics and Computer Software Export Promotion Council',
    url: 'https://escindia.in',
    role: 'Senior Web Developer',
    tags: ['WordPress', 'Custom Themes', 'PHP'],
    stack: ['WordPress', 'PHP', 'ACF', 'MySQL', 'JavaScript'],
    cover: 'screens/escindia.svg',
    images: [
      { src: 'screens/escindia-before.svg', label: 'Before' },
      { src: 'screens/escindia.svg', label: 'After' },
    ],
    description:
      "The council's main public website: member services, events, publications and export-promotion news, maintained and extended in-house.",
    // TODO: rewrite problem/solution/features in your own words.
    problem:
      'A content-heavy site with many editors needed to stay fast, consistent and easy to update without developer help for every change.',
    solution: 'Structured content with custom fields and reusable blocks, a lean custom theme, and a release routine for safe updates.',
    features: [
      'Editor-friendly custom blocks',
      'Event & publication listings',
      'Optimised media pipeline',
      'Accessibility fixes across templates',
    ],
    results: {
      // TODO: replace with your measured Lighthouse scores, then set verified: true
      lighthouse: { performance: 90, accessibility: 95, bestPractices: 95, seo: 100 },
      notes: [],
      verified: false,
    },
  },
  {
    id: 'iee',
    heroTab: 'indiaelectronicsexpo.com',
    heroOrder: 2,
    title: 'India Electronics Expo',
    client: 'ESC',
    url: 'https://indiaelectronicsexpo.com',
    role: 'Senior Web Developer',
    tags: ['WordPress', 'Landing Pages', 'PHP'],
    stack: ['WordPress', 'PHP', 'GSAP', 'Tailwind'],
    cover: 'screens/iee.svg',
    images: [
      { src: 'screens/iee-before.svg', label: 'Before' },
      { src: 'screens/iee.svg', label: 'After' },
    ],
    description: 'Event website for the India Electronics Expo — exhibitor information, registrations and visitor details for the show.',
    problem: 'An event site has to handle traffic spikes around registration deadlines and change quickly as the show takes shape.',
    solution: 'Template-driven event pages, cached landing pages for campaigns, and lightweight motion that does not slow the first paint.',
    features: ['Exhibitor & visitor journeys', 'Campaign landing pages', 'Registration call-to-actions', 'Responsive schedule pages'],
    results: {
      lighthouse: { performance: 88, accessibility: 94, bestPractices: 96, seo: 100 },
      notes: [],
      verified: false,
    },
  },
  {
    id: 'escawards',
    heroTab: 'escawards.in',
    heroOrder: 3,
    title: 'ESC Awards & IndiaSoft',
    client: 'ESC',
    url: 'https://escawards.in',
    secondaryUrl: 'https://indiasoft.org',
    role: 'Senior Web Developer',
    tags: ['WordPress', 'Custom Themes', 'PHP'],
    stack: ['WordPress', 'PHP', 'ACF', 'REST API'],
    cover: 'screens/escawards.svg',
    images: [
      { src: 'screens/escawards-before.svg', label: 'Before' },
      { src: 'screens/escawards.svg', label: 'After' },
    ],
    description:
      'Two sibling event properties: the ESC Awards nominations site and IndiaSoft, the council’s software & services exhibition.',
    problem: 'Two event brands with different audiences, sharing one small team and one maintenance budget.',
    solution: 'A shared component base in a custom theme, with per-site styling and content models.',
    features: ['Nomination information flow', 'Shared component library', 'Per-event theming', 'REST endpoints for listings'],
    results: {
      lighthouse: { performance: 91, accessibility: 96, bestPractices: 95, seo: 100 },
      notes: [],
      verified: false,
    },
  },
  {
    id: 'idreamcareer',
    title: 'iDreamCareer',
    client: 'iDreamCareer.com',
    url: 'https://idreamcareer.com',
    role: 'WordPress Developer (2021 – 2025)',
    tags: ['WordPress', 'Custom Themes', 'PHP'],
    stack: ['WordPress', 'PHP', 'Elementor', 'MySQL'],
    cover: 'screens/idreamcareer.svg',
    images: [
      { src: 'screens/idreamcareer-before.svg', label: 'Before' },
      { src: 'screens/idreamcareer.svg', label: 'After' },
    ],
    description:
      'Four years of WordPress development for a career-guidance platform for students: pages, landing pages, templates and ongoing upkeep.',
    problem: 'A marketing team that ships campaigns weekly needs pages that are quick to build and stay fast.',
    solution: 'Reusable templates and landing-page sections, plus regular performance passes.',
    features: ['Campaign landing pages', 'Reusable page templates', 'Lead-capture forms', 'Ongoing maintenance'],
    results: {
      lighthouse: { performance: 86, accessibility: 92, bestPractices: 92, seo: 98 },
      notes: [],
      verified: false,
    },
  },
  {
    id: 'carewell',
    title: 'CareWell Clinic',
    client: 'Freelance · US clinic',
    url: '',
    role: 'Design & development',
    tags: ['React', 'Landing Pages', 'Freelance'],
    stack: ['React', 'Tailwind', 'Vite'],
    cover: 'screens/carewell.svg',
    images: [{ src: 'screens/carewell.svg', label: 'Landing page' }],
    description: 'Lead-generation landing page for a doctor’s clinic, built for Google and Meta ad traffic.',
    problem: 'Paid traffic converts only if the page loads instantly and the booking path is obvious.',
    solution: 'One focused page, a single booking action repeated at decision points, and a tiny JS footprint.',
    features: ['Ad-ready hero', 'Booking CTA flow', 'Trust & services sections', 'Mobile-first layout'],
    results: { lighthouse: { performance: 98, accessibility: 97, bestPractices: 100, seo: 100 }, notes: [], verified: false },
    placeholder: true,
  },
  {
    id: 'noir',
    title: 'NOIR Coffee',
    client: 'Concept · campaign site',
    url: '',
    role: 'Design & development',
    tags: ['React', 'Freelance'],
    stack: ['React', 'GSAP', 'Framer Motion'],
    cover: 'screens/noir.svg',
    images: [{ src: 'screens/noir.svg', label: 'Campaign site' }],
    description: 'Editorial campaign website for a specialty coffee brand: horizontal menu, parallax and six scroll chapters.',
    problem: 'A luxury brand story told through motion, without turning into a slideshow.',
    solution: 'Scroll-driven chapters with restrained motion and real content hierarchy.',
    features: ['Horizontal menu scroller', 'Parallax chapters', 'Editorial typography', 'Reduced-motion fallback'],
    results: { lighthouse: { performance: 92, accessibility: 95, bestPractices: 100, seo: 100 }, notes: [], verified: false },
    placeholder: true,
  },
  {
    id: 'woo-store',
    title: 'WooCommerce Store',
    client: 'Freelance · Fiverr',
    url: '',
    role: 'Theme & store setup',
    tags: ['WordPress', 'WooCommerce', 'Freelance', 'PHP'],
    stack: ['WooCommerce', 'PHP', 'ACF'],
    cover: 'screens/woo.svg',
    images: [{ src: 'screens/woo.svg', label: 'Store' }],
    description: 'Placeholder — add one of your WooCommerce builds here.',
    problem: 'Placeholder.',
    solution: 'Placeholder.',
    features: ['Custom product templates', 'Checkout tweaks', 'Payment gateway setup', 'Speed optimisation'],
    results: { lighthouse: { performance: 90, accessibility: 93, bestPractices: 96, seo: 100 }, notes: [], verified: false },
    placeholder: true,
  },
]

export const heroProjects = projects.filter((p) => p.heroTab).sort((a, b) => a.heroOrder - b.heroOrder)
