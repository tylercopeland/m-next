import type { ToggleTextOpt } from './types';

/**
 * Single responsibility: maps textOpt to the "on" label only.
 * Used when the toggle is in runtime mode with Yes/No, On/Off, or True/False.
 */
export function getOnText(textOpt: ToggleTextOpt): string | null {
  switch (textOpt) {
    case 'Yes/No':
      return 'Yes';
    case 'On/Off':
      return 'On';
    case 'True/False':
      return 'True';
    default:
      return null;
  }
}

/**
 * Single responsibility: maps textOpt to the "off" label only.
 * Used when the toggle is in runtime mode with Yes/No, On/Off, or True/False.
 */
export function getOffText(textOpt: ToggleTextOpt): string | null {
  switch (textOpt) {
    case 'Yes/No':
      return 'No';
    case 'On/Off':
      return 'Off';
    case 'True/False':
      return 'False';
    default:
      return null;
  }
}
