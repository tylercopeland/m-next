import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import esbuild from 'esbuild';
import path from 'path';
import fs from 'fs';

const ROOT = path.resolve(__dirname, '../..'); // m-next/
const WORKSPACE = path.resolve(ROOT, '..'); // /Users/tyler/method

// A handful of m-next packages ship JSX inside `.js` files (not `.jsx`) —
// Scrollbar.styles.js, Sidebar.styles.js, use-theme.js, useToast.js. esbuild
// infers its loader from the extension and rejects JSX in `.js`, so those four
// break a stock Vite setup. We can't set a global `.js -> jsx` loader because
// m-next also ships `.ts` files that would then fail TypeScript syntax, so we
// scope a pre-transform to m-next package sources only.
const MNEXT_JS = /\/m-next\/packages\/[^/]+\/src\/.*\.js$/;

const mNextJsxPlugin = {
  name: 'm-next-jsx-loader',
  enforce: 'pre',
  async load(id) {
    const clean = id.split('?')[0];
    if (!MNEXT_JS.test(clean)) return null;
    let stat;
    try {
      stat = await fs.promises.stat(clean);
    } catch {
      return null;
    }
    if (!stat.isFile()) return null;
    const code = await fs.promises.readFile(clean, 'utf8');
    const result = await esbuild.transform(code, {
      loader: 'jsx',
      jsx: 'automatic',
      sourcefile: clean,
      sourcemap: true,
    });
    return { code: result.code, map: result.map };
  },
};

export default defineConfig({
  plugins: [
    mNextJsxPlugin,
    react({
      jsxRuntime: 'automatic',
      babel: { plugins: ['@emotion/babel-plugin'] },
    }),
  ],

  // @m-next/* are symlinked workspace packages shipping raw source
  // (`main: src/index.js`). Vite must compile them, not pre-bundle them.
  optimizeDeps: {
    exclude: ['@m-next/theme', '@m-next/layout', '@m-next/tokens'],
    esbuildOptions: { loader: { '.js': 'jsx' } },
  },

  resolve: {
    // One React instance, or hooks throw. m-next is pinned to React 17.
    dedupe: ['react', 'react-dom', '@emotion/react', '@emotion/styled'],
  },

  server: {
    port: 3100,
    fs: {
      // Packages live outside this app's directory.
      allow: [WORKSPACE],
    },
  },
});
