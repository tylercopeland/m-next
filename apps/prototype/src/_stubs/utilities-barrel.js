// Curated re-exports from MethodUI's `utilities/` barrel.
//
// Same pattern as shared-barrel.js — MethodUI's utilities/index.js does
// `export *` from javaScriptUtils + nullable + withFormMeta, which pulls
// in validation/ErrorBoundary (uuid issue, already stubbed) plus more.
// Sub-files use lots of state slices, hooks like useResizeObserver, etc.
//
// Kit needs only the small set of helpers actually invoked by Method-native
// shell code paths. Re-export those from the underlying source files
// directly so Vite doesn't follow the full barrel graph.

export {
  handleActionKey,
  preventPropagation,
  shiftFocusToPageWrapper,
  getAllFocusableElements,
  handleEnterKey,
  handleTabbingOnKeyDown,
  isNotEmpty,
  isEmpty,
  toPascalCase,
  toCamelCase,
  isValidEmail,
  isValidPhone,
  isValidNDigitCode,
  fromEntries,
  normalize,
  addItemToArray,
} from 'utilities/javaScriptUtils';

export { default as nullable } from 'utilities/nullable';
