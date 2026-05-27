import { useMemo } from 'react';
import type { AttachmentsTranslationResult } from '../types';
import { translateAttachmentsControl } from '../attachments-translator';
import { AttachmentsControl } from '../controls/attachmentsControl';

/**
 * Hook that translates backend button control to frontend widget props
 *
 * @param control - Backend control configuration
 * @param onClick - Click handler function
 * @returns Translated button properties and styling
 */
export function useAttachmentsTranslation(
  control: AttachmentsControl,
  onClick: () => void,
): AttachmentsTranslationResult {
  return useMemo(() => translateAttachmentsControl(control), [control, onClick]);
}
