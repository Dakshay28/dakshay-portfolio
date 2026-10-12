// Tech stack groups. `mono` is the typographic badge shown instead of
// a product logo (keeps the bundle tiny and avoids trademark artwork).
// `core: true` items are the ones shown in the hero's stack.json tab.

export const skillGroups = [
  {
    id: 'cms',
    label: 'CMS',
    file: 'cms.php',
    color: 'blue',
    items: [
      { name: 'WordPress', mono: 'Wp', core: true },
      { name: 'Gutenberg', mono: 'Gb' },
      { name: 'Elementor', mono: 'El' },
      { name: 'ACF', mono: 'Af', core: true },
      { name: 'WooCommerce', mono: 'Wc', core: true },
    ],
  },
  {
    id: 'backend',
    label: 'Backend',
    file: 'server.php',
    color: 'green',
    items: [
      { name: 'PHP', mono: 'Ph', core: true },
      { name: 'Node.js', mono: 'Nd' },
      { name: 'MySQL', mono: 'My', core: true },
      { name: 'PostgreSQL', mono: 'Pg' },
      { name: 'REST API', mono: 'Ap', core: true },
    ],
  },
  {
    id: 'frontend',
    label: 'Frontend',
    file: 'app.jsx',
    color: 'amber',
    items: [
      { name: 'HTML', mono: 'Ht' },
      { name: 'CSS', mono: 'Cs' },
      { name: 'JavaScript', mono: 'Js', core: true },
      { name: 'TypeScript', mono: 'Ts' },
      { name: 'React', mono: 'Re', core: true },
      { name: 'React Router v7', mono: 'Rr' },
      { name: 'Tailwind', mono: 'Tw', core: true },
      { name: 'GSAP', mono: 'Gs', core: true },
      { name: 'Three.js', mono: '3j' },
    ],
  },
  {
    id: 'tools',
    label: 'Tools & Deploy',
    file: 'deploy.sh',
    color: 'muted',
    items: [
      { name: 'Git', mono: 'Gt', core: true },
      { name: 'GitHub', mono: 'Gh' },
      { name: 'Cloudflare Workers', mono: 'Cf' },
      { name: 'cPanel', mono: 'Cp' },
      { name: 'Figma', mono: 'Fg', core: true },
    ],
  },
]

export const coreSkills = skillGroups.flatMap((g) => g.items.filter((i) => i.core).map((i) => ({ ...i, group: g.id })))
