/**
 * AddressLookupWrapper - Wrapper for AddressLookup control
 *
 * Provides both designer and runtime mode support for the AddressLookup component.
 * Uses context-based pattern matching other wrappers in the codebase.
 */

import React from 'react';
import { getGatewayUrl } from '../../../../apps/app-builder/src/common/services/urlServce';
import { useDesignerContext } from '../contexts/DesignerContext';
import type { ActionHandler } from '../actions/types';

import AddressLookup from '@m-next/address-lookup';

/**
 * Control configuration from backend
 */
interface AddressLookupControl {
  id: string;
  type: string;
  caption?: string;
  hideCaption?: boolean;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  visible?: boolean;
  [key: string]: unknown;
}

/**
 * Props for AddressLookupDesignerWrapper component
 */
export interface AddressLookupWrapperProps {
  /** Control ID */
  id: string;
  /** Control configuration (for runtime mode) */
  control?: AddressLookupControl;
  /** Mode - designer or runtime */
  mode?: 'designer' | 'runtime';
  /** Callback to update control value in runtime */
  runtimeUpdateControlValue?: ((componentId: string, value: unknown) => void) | null;
  /** Current screen state */
  screenState?: Record<string, unknown>;
  /** Action handler for executing control actions */
  actionHandler?: ActionHandler | null;
  /** Current screen ID */
  screenId?: string;
  /** Current record ID */
  recordId?: string;
}

/**
 * AddressLookupDesignerWrapper Component
 *
 * Wraps the M-One AddressLookup component for use in both designer and runtime contexts.
 * In designer mode, retrieves control from DesignerContext.
 * In runtime mode, uses control passed via props.
 */
function AddressLookupDesignerWrapper({
  id,
  control: controlProp,
  mode,
  runtimeUpdateControlValue,
  screenState,
  actionHandler,
  screenId,
  recordId,
}: AddressLookupWrapperProps): React.ReactElement | null {
  // Check if Runtime context exists
  const designerContext = useDesignerContext();

  // Use control from props if provided (runtime mode), otherwise fetch from context (designer mode)
  const isRuntimeMode = !!controlProp || mode === 'runtime';
  const control: AddressLookupControl | undefined = isRuntimeMode
    ? controlProp
    : designerContext?.selectControlById
      ? designerContext.selectControlById(id)
      : undefined;

  if (!control) {
    return null;
  }

  const gatewayUrl = getGatewayUrl();

  const handleChange = async (newValue: unknown): Promise<void> => {
    if (!isRuntimeMode) {
      return;
    }

    if (runtimeUpdateControlValue) {
      runtimeUpdateControlValue(id, newValue);
    }

    if (!actionHandler || !screenId) {
      return;
    }

    try {
      const result = await actionHandler.executeAction({
        componentId: id,
        actionName: 'onChange',
        screenId,
        recordId,
        actionData: {
          value: newValue,
          event: {
            type: 'change',
          },
        },
        screenState,
        metadata: {
          timestamp: Date.now(),
          componentType: control.type,
        },
      });

      if (!result.success && result.error) {
        console.error('[AddressLookupWrapper] Action execution failed:', result.error);
      }
    } catch (error) {
      console.error('[AddressLookupWrapper] Error executing action:', error);
    }
  };

  return (
    <div style={{ padding: 8 }} className='adr-wrapper'>
      <AddressLookup
        id={id}
        caption={control.hideCaption ? undefined : control.caption}
        placeholder={control.placeholder}
        required={control.required}
        disabled={control.disabled}
        isV4Design={true}
        gatewayUrl={gatewayUrl}
        width='100%'
        onChange={handleChange}
      />
    </div>
  );
}

export default AddressLookupDesignerWrapper;
