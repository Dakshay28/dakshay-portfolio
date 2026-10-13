// ---------------------------------------------------------------
// Personal info — every string on the site that is about "you"
// lives here, so updating the portfolio never means hunting JSX.
// ---------------------------------------------------------------

export const profile = {
  name: 'Dakshay Chauhan',
  firstName: 'Dakshay',
  handle: 'dakshay',
  headline: 'WordPress & PHP Developer | Full-Stack Web Developer',
  role: 'WordPress & PHP Developer',
  roleSecondary: 'Full-Stack Web Developer',
  experienceYears: '5+',
  status: 'hire me ',
  location: 'India',

  current: {
    title: 'Senior Web Developer',
    company: 'Electronics and Computer Software Export Promotion Council (ESC)',
    companyShort: 'ESC',
    period: 'Jul 2025 – Present',
  },
  previous: {
    title: 'WordPress Developer',
    company: 'iDreamCareer.com',
    period: 'May 2021 – Jul 2025',
  },
  education: { degree: 'BCA', school: 'Galgotias University' },

  // TODO: replace with the address you want public. Used by the
  // contact section's copy-to-clipboard and mailto fallback.
  email: 'dakshay.chauhan.28.srk@gmail.comm',
  // TODO: your phone number. `phone` is what visitors see; `phoneLink`
  // is the dial format (country code, digits only) used for tel: links.
  phone: '+91 9012337116',
  phoneLink: '+919012337116',

  links: {
    linkedin: 'https://www.linkedin.com/in/dakshay-chauhan-b2b453166',
    github: 'https://github.com/dakshay28',
    contra: 'https://contra.com/dakshay_chauhan_xsi5dnc7?referralExperimentNid=DEFAULT_REFERRAL_PROGRAM&referrerUsername=dakshay_chauhan_xsi5dnc7', // TODO: paste your gig URL
  },

  // Put a real PDF at public/resume.pdf (a placeholder ships with the repo).
  resume: 'resume.pdf',

  // Optional form backend (Formspree, Getform, a Cloudflare Worker…).
  // Leave empty and the contact form falls back to opening the
  // visitor's email app with the message pre-filled.
  formEndpoint: '',

  // About-section story (keep it short — three short paragraphs max).
  story: [
    'I started with WordPress because it let me ship real sites for real people fast. Six years later I still love that part: turning a brief, a Figma file or a PDF into something a client can log in to and edit on Monday morning.',
    "Today I'm the Senior Web Developer at ESC, where I look after the council's public sites — escindia.in, indiasoft.org, indiaelectronicsexpo.com and escawards.in. Before that I spent four years building WordPress for iDreamCareer.com.",
    'Outside the day job I take on freelance work: custom themes, WooCommerce stores, speed fixes, and React front-ends when a project needs more than a CMS.',
  ],

  // TODO: replace with your real numbers before going live.
  stats: [
    { label: 'Years building for the web', value: 5, suffix: '+' },
    { label: 'Projects shipped', value: 40, suffix: '+' },
    { label: 'Websites live today', value: 25, suffix: '+' },
    { label: 'Happy clients', value: 30, suffix: '+' },
  ],

  // Path to your photo in /public. Placeholder until you add one.
  photo: 'avatar.svg',
}

export const siteUrl = 'https://dakshay28.github.io/dakshay-portfolio/'
