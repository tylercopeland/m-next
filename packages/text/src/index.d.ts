/**
 * Declaration file so the default export is typed as a ForwardRef component
 * over TextProps. Without this, TypeScript infers the default as the whole
 * module when named type exports exist.
 */
import type { ForwardRefExoticComponent, RefAttributes } from 'react';
import type { TextProps, TextWrapperType } from './types';

declare const Text: ForwardRefExoticComponent<TextProps & RefAttributes<HTMLElement>>;

export default Text;
export type { TextProps, TextWrapperType };
