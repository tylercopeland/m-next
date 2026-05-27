import { useMemo } from 'react';
import { ButtonGroupControl } from '../controls/buttonGroupControl';
import { ButtonGroupTranslationResult } from '../types';
import { translateButtonGroupControl } from '../button-group-translator';

/**
 * Hook that translates backend button control to frontend widget props
 *
 * @param control - Backend control configuration
 * @param onClick - Click handler function
 * @returns Translated button properties and styling
 */
export function useButtonGroupTranslation(
  control: ButtonGroupControl | undefined,
  onClick: () => void,
): ButtonGroupTranslationResult {
  return useMemo(() => translateButtonGroupControl(control, onClick), [control, onClick]);
}
