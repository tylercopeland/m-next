// One-time deprecation warner — fires once per process for the whole package.
// Used by TabsV2 / TabHeaderV2 to nudge callers toward @m-next/tabs.
//
// Why @m-next/tabs-v2 is deprecated:
//   - The cleaned @m-next/tabs absorbed every V2 prop (containerMargin,
//     tabPadding, borderless, dynamicHeight, contentStyle, headerStyle,
//     containerStyle, legacyPadding, fullHeight, calMenuHeight,
//     fullWidthTabs, collapsible, onTabOrderChange) during Phase 3.
//   - It also picked up the V2 styling improvements that motivated this
//     package in the first place.
//   - The only API drift left is internal: V2 still honors `isMobile` and
//     `onRenderTabHeaderMobile`, both of which cleaned Tabs silently ignores
//     because mobile rendering is now CSS-media-query driven.
//
// Migration: replace `import { TabsV2, TabHeaderV2 } from '@m-next/tabs-v2'`
// with `import { Tabs, TabHeader } from '@m-next/tabs'`. The prop surface
// is the same; rename TabsV2 → Tabs and TabHeaderV2 → TabHeader at the
// call site. Any `isMobile` / `onRenderTabHeaderMobile` calls can drop
// (handled via CSS media queries in the cleaned Tabs).
//
// This file does NOT break anything — it just emits a one-time console warn.

const seen = new Set();

export const warnTabsV2Deprecated = () => {
  const key = 'tabs-v2-package-deprecated';
  if (seen.has(key) || typeof console === 'undefined') return;
  seen.add(key);
  // eslint-disable-next-line no-console
  console.warn(
    '@m-next/tabs-v2 is deprecated and will be removed in a future release. ' +
      'Migrate to @m-next/tabs — Phase 3 cleanup folded every V2 prop into the canonical Tabs component. ' +
      'Rename TabsV2 → Tabs and TabHeaderV2 → TabHeader at the call site; the prop surface is the same.',
  );
};

export default warnTabsV2Deprecated;
