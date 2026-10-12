// GitHub Pages helpers, run after `vite build`:
//  • 404.html = index.html, so unknown paths still load the app
//  • .nojekyll, so files/folders starting with "_" are served
import { copyFileSync, writeFileSync } from 'node:fs'

copyFileSync('dist/index.html', 'dist/404.html')
writeFileSync('dist/.nojekyll', '')
console.log('postbuild: wrote dist/404.html and dist/.nojekyll')
