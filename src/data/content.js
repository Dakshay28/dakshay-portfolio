// Services, testimonials and the marquee line.

export const services = [
  {
    id: 'themes',
    title: 'Custom WordPress Themes',
    body: 'Hand-built themes with clean templates, custom blocks and fields your team can actually edit.',
    icon: 'blocks',
  },
  {
    id: 'woo',
    title: 'WooCommerce Stores',
    body: 'Product templates, checkout tweaks, payment and shipping setup — a store that sells, not just lists.',
    icon: 'cart',
  },
  {
    id: 'speed',
    title: 'Speed Optimization',
    body: 'Core Web Vitals fixes: images, caching, script diet and database cleanup, measured before and after.',
    icon: 'gauge',
  },
  {
    id: 'redesign',
    title: 'Website Redesign',
    body: 'A fresh design on your existing content, migrated without losing rankings or links.',
    icon: 'refresh',
  },
  {
    id: 'react',
    title: 'React Web Apps',
    body: 'Front-ends and dashboards in React when the job needs more than a CMS — or a headless WordPress.',
    icon: 'atom',
  },
  {
    id: 'care',
    title: 'Maintenance & Security',
    body: 'Updates, backups, uptime checks and hardening, so the site keeps working while you run the business.',
    icon: 'shield',
  },
  {
    id: 'figma',
    title: 'Figma / PDF to WordPress',
    body: 'Send the design; get a pixel-faithful, responsive WordPress build you can edit.',
    icon: 'pen',
  },
]

// ---------------------------------------------------------------
// Testimonials — three kinds of voices:
//   type: 'manager' | 'team' | 'client'
//
// Fields
//   name, role, company     who said it
//   relation                one line on how you worked together
//                           ("Managed Dakshay at ESC, 2025 – present")
//   quote                   their words, verbatim — 2–4 sentences
//   rating                  clients only (1–5); managers/team show no stars
//   source                  optional link to the original
//                           (LinkedIn recommendation, Fiverr review)
//   placeholder: true       shows a "sample" badge — remove once real
//
// IMPORTANT: these are placeholders, not real feedback. Ask before
// publishing anyone's words, quote them exactly, and keep work details
// that aren't public out of it. LinkedIn recommendations are the easiest
// source: they are already public and the person wrote them for this.
// ---------------------------------------------------------------
export const testimonials = [
  {
    type: 'manager',
    name: 'Ritu singh',
    role: 'Their title',
    company: 'ESC',
    relation: 'Managed Dakshay at ESC',
    quote: 'We would like to appreciate Dakshay for his dedication, hard work, and valuable contributions as a Web Developer. 👏His commitment to his work and willingness to give his best have been truly appreciated.Wishing him continued growth, new opportunities, and great success in his future endeavours. All the best, Dakshay! 🚀.',
    source: '',
    placeholder: true,
  },
  {
    type: 'manager',
    name: 'Sandeep Arya',
    role: 'Head - Digital Marketing ',
    company: 'Jamboree Education',
    relation: 'Managed Dakshay at iDreamCareer, 2021 – 2025',
    quote:
      'I worked with Dakshay for approximately two years and found him to be highly professional, dedicated, and diligent in his work. He has a strong problem-solving mindset and consistently comes up with practical, relevant, and easy-to-implement solutions. He is reliable, honors his commitments, and consistently delivers on expectations within the agreed timelines. It was a pleasure working with him, and I would highly recommend him.',
    source: '',
    placeholder: true,
  },
  {
    type: 'team',
    name: 'sakshi arya',
    role: 'Web-Developer',
    company: 'ESC',
    relation: 'Worked with Dakshay on the ESC website',
    quote: 'A talented and dedicated professional with strong technical skills, a problem-solving mindset, and a passion for learning and innovation. It was a great experience working together, and I truly appreciate the knowledge, guidance, and support throughout our time working together. Wishing you continued success in all your future endeavours!.',
    source: '',
    placeholder: true,
  },
  {
    type: 'team',
    name: 'Ramansh sharna',
    role: 'Web-Developer',
    company: 'ESC',
    relation: 'Shipped campaign pages with Dakshay',
    quote: 'A second teammate quote. Hand-off, code quality and how deadlines were handled are good things for them to mention.',
    source: '',
    placeholder: true,
  },
  {
    type: 'client',
    name: 'Client name',
    role: 'Owner',
    company: 'Company · Fiverr order',
    relation: 'Freelance client',
    rating: 5,
    quote: 'Paste a real client review here. Short and specific works best: what you built, how it went, what changed for them.',
    source: '',
    placeholder: true,
  },
  {
    type: 'client',
    name: 'Client name',
    role: 'Founder',
    company: 'Company · WooCommerce store',
    relation: 'Freelance client',
    rating: 5,
    quote: 'Paste a second client review here, ideally one that mentions speed, communication or a result they measured.',
    source: '',
    placeholder: true,
  },
]

export const marqueeItems = ['WORDPRESS', 'PHP', 'REACT', 'WOOCOMMERCE', 'SPEED OPTIMIZATION', 'AVAILABLE FOR FREELANCE']

export const projectTypes = [
  'Custom WordPress theme',
  'WooCommerce store',
  'Speed optimization',
  'Redesign',
  'React web app',
  'Maintenance',
  'Something else',
]
export const budgets = ['< $500', '$500 – $1.5k', '$1.5k – $5k', '$5k +', 'Not sure yet']
