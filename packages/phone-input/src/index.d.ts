/**
 * Declaration file so consumers picking up the prebuilt package see a clean
 * function component typed over PhoneInputProps.
 */
import type { FunctionComponent } from 'react';
import type { PhoneInputProps, PhoneInputChangeHandler } from './types';

declare const PhoneInput: FunctionComponent<PhoneInputProps>;

export default PhoneInput;
export type { PhoneInputProps, PhoneInputChangeHandler };
