/**
 * Utility functions for handling dirty screen state in Grid component.
 * These help reduce repetitive dirty check patterns.
 */
import type {
  RuntimeContext,
  CreateDirtyScreenHandlerParams,
  DirtyScreenHandlerOptions,
  DirtyScreenHandler,
} from './types';

/**
 * Creates a dirty screen handler that wraps common dirty-check-and-execute patterns.
 *
 * @param params - Configuration object
 * @param params.screenDataContext - The screen data context with isDirty and setIsDirty
 * @param params.showDirtyScreenAlert - Function to show the dirty screen alert dialog
 * @returns A function that handles dirty screen checks before executing actions
 */
export const createDirtyScreenHandler = ({
  screenDataContext,
  showDirtyScreenAlert,
}: CreateDirtyScreenHandlerParams): DirtyScreenHandler => {
  /**
   * Executes an action, showing a dirty screen warning if the screen has unsaved changes.
   * If dirty, shows alert and executes action only if user chooses "Continue without saving".
   * If not dirty, executes action immediately.
   *
   * @param action - The action to execute (called in both dirty and clean cases)
   * @param options - Optional configuration
   * @param options.onConfirm - Custom confirm handler (default: null, closes dialog)
   * @param options.beforeAction - Called before action in dirty case (default: clears isDirty)
   */
  return (action: () => void, options: DirtyScreenHandlerOptions = {}): void => {
    const { onConfirm = null, beforeAction = null } = options;

    if (screenDataContext?.isDirty) {
      showDirtyScreenAlert(onConfirm, () => {
        if (beforeAction) {
          beforeAction();
        } else {
          screenDataContext?.setIsDirty?.(false);
        }
        action();
      });
    } else {
      action();
    }
  };
};

/**
 * Shows a dirty screen alert dialog.
 * This is the standard dialog configuration used across the grid.
 *
 * @param runtimeContext - The runtime context with showMessageDialog
 * @param onConfirm - Callback when user clicks "Let me save first"
 * @param onCancel - Callback when user clicks "Continue without saving"
 */
export const showDirtyScreenAlertDialog = (
  runtimeContext: RuntimeContext | null | undefined,
  onConfirm: (() => void) | null,
  onCancel: () => void,
): void => {
  runtimeContext?.showMessageDialog?.({
    id: 'runtime-message-screen-alert',
    hasOutsideClick: false,
    hideDismissButton: true,
    heading: 'Are you sure?',
    message: 'Please save before changing your view or you may lose your information.',
    onCancelLabel: 'Continue without saving',
    onCancelCallback: onCancel,
    onConfirmLabel: 'Let me save first',
    onConfirmCallback: onConfirm,
    onDismissFocusId: '',
    onConfirmFocusId: '',
  });
};
