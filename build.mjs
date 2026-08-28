import { createRequire } from 'node:module'
import { readdirSync } from 'node:fs'
import { join } from 'node:path'

const require = createRequire(import.meta.url)
let esbuild
try {
  ;({ build: esbuild } = await import('esbuild'))
} catch {
  // Local Windows dev fallback: anchor on the repo pnpm store where esbuild
  // lives (the package itself carries esbuild as a devDependency for normal
  // installs; this fallback keeps `node build.mjs` working in this checkout).
  const store = join('D:/Desktop/deepseek-harness/node_modules/.pnpm')
  const hit = readdirSync(store).find((d) => d.startsWith('esbuild@'))
  if (!hit) throw new Error('esbuild not resolvable')
  esbuild = require(join(store, hit, 'node_modules/esbuild/lib/main.js')).build
}

const banner = [
  'window.__ModuleLoader__.load({',
  '  id: "dsh-local-models",',
  '  factory: (require) => {',
  '    var module = { exports: {} };',
  '    var exports = module.exports;',
].join('\n')
const footer = ['    return module.exports;', '  }', '});'].join('\n')

await esbuild({
  entryPoints: ['src/index.ts'],
  bundle: true,
  platform: 'node',
  format: 'esm',
  target: 'node22',
  outfile: 'lib/index.js',
  sourcemap: false,
  logLevel: 'info',
})

await esbuild({
  entryPoints: ['src/client.ts'],
  bundle: true,
  platform: 'browser',
  format: 'cjs',
  target: 'es2022',
  outfile: 'lib/client.js',
  external: ['react', 'react/jsx-runtime', 'react-dom', 'react-dom/client'],
  banner: { js: banner },
  footer: { js: footer },
  sourcemap: false,
  logLevel: 'info',
})