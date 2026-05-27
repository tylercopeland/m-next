/**
 * Handler for progress messages
 */

import type { Dispatch, SetStateAction } from 'react';
import type { MessageHandler } from './messageHandlerRegistry';

/**
 * Progress data structure
 */
export interface ProgressData {
  /** Progress message text */
  message?: string;
  /** Progress percentage (0-100) */
  percentage?: number;
  /** Current step */
  step?: number;
  /** Total steps */
  totalSteps?: number;
}

/**
 * Create the handler for progress messages
 * @param setProgressMessage - State setter for progress message
 * @returns The handler function
 */
export function createProgressHandler(setProgressMessage: Dispatch<SetStateAction<string>>): MessageHandler {
  return (data: unknown) => {
    const progressData = data as ProgressData;
    const message = progressData?.message || '';

    console.log('[ProgressHandler] Progress update:', message);

    if (message) {
      setProgressMessage(message);
    }
  };
}
