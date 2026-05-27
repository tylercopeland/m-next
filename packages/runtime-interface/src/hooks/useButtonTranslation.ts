import { useMemo } from 'react';
import { translateButtonControl } from '../button-translator';
import type { ButtonControl, ButtonTranslationResult } from '../types';

/**
 * Hook that translates backend button control to frontend widget props
 *
 * @param control - Backend control configuration
 * @param onClick - Click handler function
 * @returns Translated button properties and styling
 */
export function useButtonTranslation(control: ButtonControl, onClick: () => void): ButtonTranslationResult {
  return useMemo(() => translateButtonControl(control, onClick), [control, onClick]);
}
