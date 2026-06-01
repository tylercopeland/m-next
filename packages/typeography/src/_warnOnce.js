// One-time deprecation warner — fires once per process for the whole package.
// Used by Typeography / Header / Text / TextDiv / TextLine to nudge callers
// toward the modern @m-next/text primitive.
//
// Why @m-next/typeography is deprecated:
//   - Overlaps with @m-next/text (both export a `Text` component).
//   - Uses preset enum-style sizes ('small' | 'medium' | 'large' | ...) where
//     the modern @m-next/text uses raw CSS values ('14px', '22px').
//   - Pre-dates the m-next design-token system.
//
// Migration: callers should replace `import { Text } from '@m-next/typeography'`
// with `import Text from '@m-next/text'` and convert preset sizes to explicit
// fontSize values. See the @m-next/text docs for the mapping.
//
// This file does NOT break anything — it just emits a one-time console warn.

const seen = new Set();

export const warnTypeographyDeprecated = () => {
  const key = 'typeography-package-deprecated';
  if (seen.has(key) || typeof console === 'undefined') return;
  seen.add(key);
  // eslint-disable-next-line no-console
  console.warn(
    '@m-next/typeography is deprecated and will be removed in a future release. Migrate to @m-next/text. ' +
      'Both packages export a `Text` component, but their APIs differ — see the @m-next/text Storybook docs for the mapping.',
  );
};

export default warnTypeographyDeprecated;
