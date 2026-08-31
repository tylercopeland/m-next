// Curated re-exports from MethodUI's `shared/` barrel — only what's
// actually pulled via `import { X } from 'shared'` in the desktopShell
// import chain. Anything else triggers transitive cascades that pull
// in deps the kit prototype hasn't satisfied (state slices, axios, etc.).

export { default as base } from 'shared/global/base';
export { default as Overlay } from 'shared/overlay';
export { default as PopUp } from 'shared/popUp';
export { default as TitleDropdown } from 'shared/titleDropdown';
export { default as TextLink } from 'shared/textLink';
export { default as VisuallyHidden } from 'shared/visuallyHidden';

// Stubs for heavy components that cascade into runtime deps and stubs
// for shared/* names referenced transitively by other MethodUI files
// (CheckBoxSelection, Accordion, Button — used by shared/accordion which
// some path drags in via import-analysis even when no consumer renders it).
export {
  ImageWidget,
  NotificationBanner,
  BANNER_TYPES,
  CheckBoxSelection,
  Accordion,
  Button,
} from '../_stubs/shared-stubs.jsx';
