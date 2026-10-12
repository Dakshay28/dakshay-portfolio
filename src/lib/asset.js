// Resolve a path inside /public against Vite's base, so images work
// both at "/" in dev and at "/<repo>/" on GitHub Pages.
export const asset = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`
