import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import esbuild from 'esbuild';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Anchor every path to THIS FILE, not to process.cwd(). Previously these were
// cwd-relative ('../../m-one/...'), which silently broke the moment the app
// moved or was started from another directory.
const APP = path.dirname(fileURLToPath(import.meta.url));   // m-next/apps/prototype
const WORKSPACE = path.resolve(APP, '../../..');            // /Users/tyler/method
const MONE = path.join(WORKSPACE, 'm-one');
const METHODUI = path.join(WORKSPACE, 'MethodUI');

// Some MethodUI files ship JSX inside .js (not .jsx) — e.g.
// utilities/validation/ErrorBoundary.js. esbuild's default per-extension
// loader inference rejects JSX in .js. We can't set a global jsx loader
// because m-one ships .ts files (toggle, attachments, etc.) that would
// then fail TypeScript syntax. So we scope a custom transform that runs
// before import-analysis and only touches MethodUI's .js files.
const METHODUI_JS = /\/MethodUI\/.+\.js$/;

const methodUiJsxPlugin = {
  name: 'methodui-jsx-loader',
  enforce: 'pre',
  async load(id) {
    if (!METHODUI_JS.test(id)) return null;
    // Defensive: id might be a directory if a parent resolver passed
    // through without appending /index.js. Skip silently.
    let stat;
    try {
      stat = await fs.promises.stat(id);
    } catch {
      return null;
    }
    if (!stat.isFile()) return null;
    const code = await fs.promises.readFile(id, 'utf8');
    const result = await esbuild.transform(code, {
      loader: 'jsx',
      jsx: 'automatic',
      sourcefile: id,
      sourcemap: true,
    });
    return { code: result.code, map: result.map };
  },
};

export default defineConfig({
  plugins: [
    methodUiJsxPlugin,
    react({
      jsxRuntime: 'automatic',
      babel: {
        plugins: ['@emotion/babel-plugin'],
      },
    }),
  ],
  // MethodUI's .js files contain JSX. Vite's per-file transform is
  // handled by the methodUiJsxPlugin above. The dep-optimizer (esbuild)
  // is a separate path — for any MethodUI file that ends up in the
  // pre-bundle, we need to tell esbuild to use the JSX loader for `.js`.
  // Per-extension override here is safe; m-one's `.ts` files still use
  // the default `.ts` loader.
  optimizeDeps: {
    exclude: ['shared', 'utilities'],
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
  resolve: {
    // Aliases as an array so we can use regex matching to distinguish
    // bare-module specifiers from sub-path imports. Order matters — Vite
    // walks top-to-bottom and uses the first match.
    alias: [
      // ---- React + React DOM (single instance via m-one) ----
      { find: /^react$/, replacement: path.join(MONE, 'node_modules/react') },
      { find: /^react-dom$/, replacement: path.join(MONE, 'node_modules/react-dom') },

      // ---- Redux + react-redux (m-one ships them, prototype doesn't declare) ----
      { find: /^react-redux$/, replacement: path.join(MONE, 'node_modules/react-redux') },
      { find: /^redux$/, replacement: path.join(MONE, 'node_modules/redux') },

      // ---- Common third-party deps used by MethodUI files ----
      // Pulled from m-one's node_modules so we don't have to install them
      // in the prototype's package.json. MethodUI files live outside the
      // prototype's tree, so Vite's normal resolver walk doesn't find these.
      { find: /^prop-types$/, replacement: path.join(MONE, 'node_modules/prop-types') },
      { find: /^axios$/, replacement: path.join(MONE, 'node_modules/axios') },
      { find: /^lodash$/, replacement: path.join(MONE, 'node_modules/lodash') },
      { find: /^moment$/, replacement: path.join(MONE, 'node_modules/moment') },
      { find: /^reselect$/, replacement: path.join(MONE, 'node_modules/reselect') },
      { find: /^react-router-dom$/, replacement: path.join(MONE, 'node_modules/react-router-dom') },
      { find: /^react-tooltip$/, replacement: path.join(MONE, 'node_modules/react-tooltip') },
      { find: /^react-loading-skeleton$/, replacement: path.join(MONE, 'node_modules/react-loading-skeleton') },
      // react-custom-scroll isn't installed; map both the bare and the CSS path
      // to harmless stubs.
      { find: /^react-custom-scroll$/, replacement: path.join(APP, 'src/_stubs/react-custom-scroll.jsx') },
      { find: /^react-custom-scroll\/dist\/customScroll\.css$/, replacement: path.join(APP, 'src/_stubs/empty.css') },
      { find: /^@emotion\/styled$/, replacement: path.join(MONE, 'node_modules/@emotion/styled') },
      { find: /^@emotion\/react$/, replacement: path.join(MONE, 'node_modules/@emotion/react') },

      // ---- uuid (legacy default-import compatibility) ----
      { find: /^uuid$/, replacement: path.join(APP, 'src/_stubs/uuid.js') },

      // ---- MethodUI shared barrel (curated kit override) ----
      // Bare `shared` import resolves to a kit-controlled barrel that
      // re-exports only what we use. This breaks the transitive scan that
      // MethodUI's full barrel triggers (which pulls in deps for components
      // we don't render). Sub-path imports like `shared/spinner` stay
      // pointing at the real MethodUI directory.
      { find: /^shared$/, replacement: path.join(APP, 'src/_stubs/shared-barrel.js') },
      // shared/scrollbar wraps react-custom-scroll which isn't installed.
      // Replace with a passthrough <div style="overflow:auto">.
      { find: /^shared\/scrollbar$/, replacement: path.join(APP, 'src/_stubs/shared/scrollbar.jsx') },
      { find: /^shared\/(.+)$/, replacement: path.join(METHODUI, 'public/react/shared') + '/$1' },

      // ---- MethodUI utilities ----
      // Bare `utilities` and `utilities/hooks` go through curated barrels
      // (same pattern as `shared`). Other sub-paths resolve to the real
      // MethodUI directory.
      { find: /^utilities$/, replacement: path.join(APP, 'src/_stubs/utilities-barrel.js') },
      { find: /^utilities\/hooks$/, replacement: path.join(APP, 'src/_stubs/utilities-hooks-barrel.js') },
      { find: /^utilities\/(.+)$/, replacement: path.join(METHODUI, 'public/react/utilities') + '/$1' },

      // ---- State slice stubs (Redux selectors and thunks) ----
      // These are referenced by MethodUI components but we can't run the
      // real Redux thunks. The Provider in App.jsx supplies a static store
      // shape that the selectors here read from.
      { find: /^state\/services\/analytics$/, replacement: path.join(APP, 'src/_stubs/state/services/analytics.js') },
      { find: /^state\/services\/globalErrorLogger$/, replacement: path.join(APP, 'src/_stubs/services/globalErrorLogger.js') },
      { find: /^state\/services$/, replacement: path.join(APP, 'src/_stubs/state/services.js') },
      { find: /^state\/shell\//, replacement: path.join(APP, 'src/_stubs/state/shell.js') },
      { find: /^state\/shell$/, replacement: path.join(APP, 'src/_stubs/state/shell.js') },
      { find: /^state\/user$/, replacement: path.join(APP, 'src/_stubs/state/user.js') },
      { find: /^state\/router$/, replacement: path.join(APP, 'src/_stubs/state/router.js') },
      { find: /^state\/hooks$/, replacement: path.join(APP, 'src/_stubs/state/hooks.js') },
      { find: /^state\/config$/, replacement: path.join(APP, 'src/_stubs/state/config.js') },

      // ---- MethodUI runtime panel system (placeholders) ----
      { find: /^views\/panels\/contextual$/, replacement: path.join(APP, 'src/_stubs/views/panels/contextual.jsx') },

      // ---- MethodUI Runtime state (read by LeftNav's Dashboard) ----
      { find: /^components\/Runtime\/state$/, replacement: path.join(APP, 'src/_stubs/components/Runtime/state.js') },
    ],
    modules: [
      path.join(WORKSPACE, 'node_modules'),
      path.join(MONE, 'node_modules'),
      'node_modules',
    ],
  },
  server: {
    port: 3200,
  },
});
