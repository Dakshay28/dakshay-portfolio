/** @type {import('tailwindcss').Config} */
// Colors point at CSS variables (see src/index.css) so the light/dark
// toggle only has to swap variables, never class names.
const v = (name) => `rgb(var(--${name}) / <alpha-value>)`

export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: v('bg'),
        ink: v('text'),
        muted: v('muted'),
        wp: v('blue'), // WordPress blue — fills, borders, glows
        'wp-text': v('blue-text'), // lighter blue for small text on dark
        term: v('green'),
        amber: v('amber'),
        line: v('line'),
      },
      fontFamily: {
        display: ['Syne', 'Inter', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      // Type scale: 1.250 (major third) from a 16px base.
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1.5' }],
        sm: ['0.875rem', { lineHeight: '1.55' }],
        base: ['1rem', { lineHeight: '1.65' }],
        lg: ['1.25rem', { lineHeight: '1.5' }],
        xl: ['1.5625rem', { lineHeight: '1.3' }],
        '2xl': ['1.953rem', { lineHeight: '1.2' }],
        '3xl': ['2.441rem', { lineHeight: '1.1' }],
        '4xl': ['3.052rem', { lineHeight: '1.05' }],
        '5xl': ['3.815rem', { lineHeight: '1' }],
        '6xl': ['4.768rem', { lineHeight: '0.98' }],
      },
      maxWidth: { shell: '76rem' },
      transitionTimingFunction: { out: 'cubic-bezier(.16,1,.3,1)' },
    },
  },
  plugins: [],
}
