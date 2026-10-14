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
    cover: 'public\screens\screencapture-escindia-in-2026-10-13-17_49_27.png',
    images: [
      { src: 'public\screens\screencapture-escindia-in-2026-10-13-17_49_27.png', label: 'Before' },
      { src: 'public\screens\screencapture-escindia-in-2026-10-13-17_49_27.png', label: 'After' },
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
    stack: ['WordPress', 'PHP', 'GSAP'],
    cover: 'public\screens\screencapture-indiaelectronicsexpo-2026-10-14-16_02_44.png',
    images: [
      { src: 'public\screens\screencapture-indiaelectronicsexpo-2026-10-14-16_02_44.png', label: 'Before' },
      { src: 'public\screens\screencapture-indiaelectronicsexpo-2026-10-14-16_02_44.png', label: 'After' },
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
    title: 'ESC Awards ',
    client: 'ESC',
    url: 'https://escawards.in',
    secondaryUrl: 'https://indiasoft.org',
    role: 'Senior Web Developer',
    
    tags: ['WordPress', 'Custom Themes', 'PHP'],
    stack: ['WordPress', 'PHP', 'ACF', 'REST API'],
    cover: 'public\screens\screencapture-escawards-in-2026-10-13-17_56_51.png',
    images: [
      { src: 'public\screens\screencapture-escawards-in-2026-10-13-17_56_51.png', label: 'Before' },
      { src: 'public\screens\screencapture-escawards-in-2026-10-13-17_56_51.png', label: 'After' },
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
    cover: '/dakshay-portfolio/screens/screencapture-idreamcareer-2026-10-14-15_39_21.png',
    images: [
      { src: '/dakshay-portfolio/screens/screencapture-idreamcareer-2026-10-14-15_39_21.png', label: 'Before' },
      { src: '/dakshay-portfolio/screens/screencapture-idreamcareer-2026-10-14-15_39_21.png', label: 'After' },
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
    cover: '/dakshay-portfolio/screens/screencapture-file-C-Users-hp-Downloads-CareWell-Clinic-Same-Day-Doctor-Appointments-html-2026-10-14-14_31_30 (1).png',
    images: [{ src: '/dakshay-portfolio/screens/screencapture-file-C-Users-hp-Downloads-CareWell-Clinic-Same-Day-Doctor-Appointments-html-2026-10-14-14_31_30 (1).png', label: 'Landing page' }],
    description: 'Lead-generation landing page for a doctor’s clinic, built for Google and Meta ad traffic.',
    problem: 'Paid traffic converts only if the page loads instantly and the booking path is obvious.',
    solution: 'One focused page, a single booking action repeated at decision points, and a tiny JS footprint.',
    features: ['Ad-ready hero', 'Booking CTA flow', 'Trust & services sections', 'Mobile-first layout'],
    results: { lighthouse: { performance: 98, accessibility: 97, bestPractices: 100, seo: 100 }, notes: [], verified: false },
    placeholder: true,
  },
  {
    id: 'noir',
    title: 'beanspotcoffee.com',
    client: 'Concept · campaign site',
    url: 'beanspotcoffee.com',
    role: ' development',
    tags: ['wordpress', 'WooCommerce', 'Freelance'],
    stack: ['wordpress', 'WooCommerce', 'elementor'],
    cover: '/dakshay-portfolio/screens/screencapture-beanspotcoffee-2026-10-13-18_04_05.png',
    images: [{ src: '/dakshay-portfolio/screens/screencapture-beanspotcoffee-2026-10-13-18_04_05 (1).png', label: 'Campaign site' }],
    description: 'Worked on the subscription model for BeanSpot Coffee, focusing on subscription-based coffee offerings and recurring customer engagement. Contributed to the subscription logic and user flow to support a convenient, repeat-purchase experience for customers.',
    problem: 'BeanSpot Coffee needed a custom subscription model that could support its unique membership rules, premium subscriber benefits, complimentary coffee offers, exclusive product access, and coffee bean rewards. The challenge was to translate these business requirements into a flexible, custom-coded solution that worked with WooCommerce without relying entirely on standard subscription functionality..',
    solution: 'Developed a custom-coded solution for the subscription business model at BeanSpot Coffee. Worked on implementing subscription functionality to support recurring coffee orders and create a flexible, convenient purchasing experience for customers. Focused on translating business requirements into a practical technical solution using custom code..',
    features: ['3-Month Complimentary Coffee: Implemented subscription rules allowing eligible premium subscribers to receive complimentary coffee for three months.Premium Subscriber Benefits: Developed business logic to manage benefits for premium subscribers.'],
    results: { lighthouse: { performance: 92, accessibility: 95, bestPractices: 100, seo: 100 }, notes: [], verified: false },
    placeholder: true,
  },
  
   {
    id: 'strada',
    title: 'STRADA Sneaker Store',
    client: 'Concept project · Personal',
    url: '', // add your deployed link, e.g. https://dakshay28.github.io/strada/
    role: 'UI design & front-end development',
    tags: ['React', 'Tailwind CSS', 'Framer Motion', 'E-commerce'],
    stack: ['React (Vite)', 'Tailwind CSS', 'Framer Motion', 'React Router', 'Zustand'],
    cover: '/dakshay-portfolio/screens/screencapture-file-C-Users-hp-Downloads-STRADA-Sneaker-Store-html-2026-10-14-16_22_45.png',
    images: [
      { src: '/dakshay-portfolio/screens/screencapture-file-C-Users-hp-Downloads-STRADA-Sneaker-Store-html-2026-10-14-16_22_45.png', label: 'Home' },
      { src: '/dakshay-portfolio/screens/screencapture-file-C-Users-hp-Downloads-STRADA-Sneaker-Store-html-2026-10-14-16_22_45.png', label: 'Shop & filters' },
      { src: '/dakshay-portfolio/screens/screencapture-file-C-Users-hp-Downloads-STRADA-Sneaker-Store-html-2026-10-14-16_22_45.png', label: 'Product page' },
      { src: '/dakshay-portfolio/screens/screencapture-file-C-Users-hp-Downloads-STRADA-Sneaker-Store-html-2026-10-14-16_22_45.png', label: 'Shopping bag' },
      { src: '/dakshay-portfolio/screens/screencapture-file-C-Users-hp-Downloads-STRADA-Sneaker-Store-html-2026-10-14-16_22_45.png', label: 'Checkout' },
    ],
    description:
      'A bold sneaker and streetwear e-commerce concept with a complete working shopping flow — filters, quick add, product pages, a slide-in bag and a 3-step checkout. Built mobile-first with smooth, purposeful motion.',
    features: [
      'Live colourway switcher in the hero',
      'Filters by category, size, colour and price',
      'Quick Add and Quick View on product cards',
      'Fly-to-cart animation and slide-in bag',
      '3-step checkout with validation and promo codes',
      'Wishlist and cart saved in the browser',
      'Accessible: keyboard support and reduced-motion',
    ],
    results: { lighthouse: 100, notes: [], verified: true }, // replace with real scores after deploying
    placeholder: false,

  },
]

export const heroProjects = projects.filter((p) => p.heroTab).sort((a, b) => a.heroOrder - b.heroOrder)
