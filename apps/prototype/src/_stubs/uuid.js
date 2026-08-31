// Stub for the `uuid` package.
//
// Why we stub: MethodUI's utilities/validation/ErrorBoundary.js does
// `import uuid from 'uuid'` (legacy uuid@2 default-export style). The
// real uuid@9 package ships only named exports, so the default import
// is `undefined` and calling it crashes at module init.
//
// Why we don't import from the real package here: the Vite alias for
// `uuid` would intercept any `from 'uuid'` inside this stub, creating
// an infinite resolve loop.
//
// What this gives us: a self-contained random-id generator that satisfies
// both the legacy default-export style (`import uuid from 'uuid'; uuid()`)
// and modern named-import style (`import { v4 } from 'uuid'`).
//
// This is NOT cryptographically secure — fine for a prototype, never
// use it for anything that needs real UUIDs.

const random = () =>
  ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (c ^ (Math.random() * 16) >> (c / 4)).toString(16),
  );

export const v4 = random;
export const v1 = random;
export const v3 = random;
export const v5 = random;
export const NIL = '00000000-0000-0000-0000-000000000000';
export const version = () => 4;
export const validate = () => true;
export const stringify = (arr) => arr.join('-');
export const parse = (str) => str.split('-');

export default random;
