import { useMemo } from 'react';
import { InputTranslationResult, translateInputControl } from '../input-control-translator';
import { InputControl } from '../controls/inputControl';

/**
 * Hook that translates backend button control to frontend widget props
 *
 * @param control - Backend control configuration
 * @param onClick - Click handler function
 * @returns Translated button properties and styling
 */
export function useInputTranslation(
  control: InputControl,
  value: string | number | null,
  onChange: (e: React.ChangeEvent<HTMLInputElement> | string) => void,
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void,
  onFocus: (e: React.FocusEvent<HTMLInputElement>) => void,
): InputTranslationResult {
  return useMemo(
    () => translateInputControl(control, value, onChange, onBlur, onFocus),
    [control, value, onChange, onBlur, onFocus],
  );
}
