/**
 * Component Wrappers - Redux versions from app-builder
 *
 * These wrappers are copied from app-builder and maintain Redux dependencies.
 * They can be used as-is by importing from this package.
 *
 * Each wrapper receives an `id` prop and fetches the full control data from Redux.
 *
 * @packageDocumentation
 */

// Generic HOC for creating Redux-connected wrappers
export { createReduxWrapper, isReduxWrapper } from './createReduxWrapper';
export type { ReduxWrapperProps, PureWrapperProps } from './createReduxWrapper';

// Pure wrapper versions (prop-based, no Redux)
export { default as ButtonWrapper } from './ButtonWrapper';

// Redux wrapper versions (ID-based, fetches from Redux)
// These are copied from app-builder and work with any Redux store
export { default as ButtonWrapperRedux } from './ButtonWrapperRedux';
export { default as ButtonGroupWrapperRedux } from './ButtonGroupWrapperRedux';
export { default as InputWrapperRedux } from './InputWrapperRedux';
export { default as DropdownWrapperRedux } from './DropdownWrapperRedux';
export { default as CheckboxWrapperRedux } from './CheckboxWrapperRedux';
export { default as ToggleWrapperRedux } from './ToggleWrapperRedux';
export { default as DateTimePickerWrapperRedux } from './DateTimePickerWrapperRedux';
export { default as RadioGroupWrapperRedux } from './RadioGroupWrapperRedux';
export { default as TextWrapperRedux } from './TextWrapperRedux';
export { default as ImageWrapperRedux } from './ImageWrapperRedux';
export { default as SignatureWrapperRedux } from './SignatureWrapperRedux';
export { default as AttachmentsWrapperRedux } from './AttachmentsWrapperRedux';
export { default as TagWidgetWrapperRedux } from './TagWidgetWrapper';
export { default as GridWrapperRedux } from './GridWrapperRedux';
export { default as ChartWrapperRedux } from './ChartWrapperRedux';
export { default as MapWrapperRedux } from './MapWrapper';
export type { MapDesignerWrapperProps } from './MapWrapper';
export { default as HtmlEditorWrapperRedux } from './HtmlEditorWrapperRedux';
export { default as RecurrenceWrapperRedux } from './RecurrenceWrapper';
export { default as FieldBlockWrapperRedux } from './FieldBlockWrapperRedux';
export { default as CalendarWrapperRedux } from './CalendarWrapperRedux';
export { default as LayoutContainerWrapperRedux } from './LayoutContainerWrapperRedux';
export { default as SyncWidgetWrapperRedux } from './SyncWidgetWrapperRedux';

// Gallery wrapper with subdirectory
export { default as GalleryWrapperRedux } from './gallery/GalleryWrapperRedux';

/**
 * Convenience re-exports with original names (for backward compatibility)
 * App-builder can import these and they work exactly as before
 */
export { default as ButtonWrapper2 } from './ButtonWrapperRedux';
export { default as ButtonGroupWrapper } from './ButtonGroupWrapperRedux';
export { default as InputWrapper } from './InputWrapperRedux';
export { default as DropdownWrapper } from './DropdownWrapperRedux';
export { default as CheckboxWrapper } from './CheckboxWrapperRedux';
export { default as ToggleWrapper } from './ToggleWrapperRedux';
export { default as DateTimePickerWrapper } from './DateTimePickerWrapperRedux';
export { default as RadioGroupWrapper } from './RadioGroupWrapperRedux';
export { default as TextWrapper } from './TextWrapperRedux';
export { default as ImageWrapper } from './ImageWrapperRedux';
export { default as SignatureWrapper } from './SignatureWrapperRedux';
export { default as AttachmentsWrapper } from './AttachmentsWrapperRedux';
export { default as TagWidgetWrapper } from './TagWidgetWrapper';
export { default as GridWrapper } from './GridWrapperRedux';
export { default as ChartWrapper } from './ChartWrapperRedux';
export { default as MapWrapper } from './MapWrapper';
export { default as HtmlEditorWrapper } from './HtmlEditorWrapperRedux';
export { default as RecurrenceWrapper } from './RecurrenceWrapper';
export { default as FieldBlockWrapper } from './FieldBlockWrapperRedux';
export { default as CalendarWrapper } from './CalendarWrapperRedux';
export { default as LayoutContainerWrapper } from './LayoutContainerWrapperRedux';
export { default as SyncWidgetWrapper } from './SyncWidgetWrapperRedux';
export { default as GalleryWrapper } from './gallery/GalleryWrapperRedux';
