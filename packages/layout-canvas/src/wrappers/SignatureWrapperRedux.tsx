import React, { Suspense, useEffect, useRef, useCallback } from 'react';
import LoadingSkeleton from '@m-next/loading-skeleton';
import { useRuntimeContext } from '../contexts/RuntimeContext';
import { useDesignerContext } from '../contexts/DesignerContext';
import type { SignatureControl } from '@m-next/runtime-interface';
import type { ActionHandler } from '../actions/types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Signature = React.lazy(
  () => import('@m-next/signature') as unknown as Promise<{ default: React.ComponentType<any> }>,
);

// Extend SignatureControl with runtime-specific properties
interface RuntimeSignatureControl extends SignatureControl {
  hasFocus?: boolean;
  value?: Record<string, unknown>; // Signature data from dataReducer (isSigned, documentUrl, signatureUrl, etc.)
}

// Signature data returned from upload
interface SignatureResponseData {
  name?: string;
  drawingUrl?: string;
  [key: string]: unknown;
}

interface SignatureUploadResponse {
  data?: SignatureResponseData;
  error?: string;
}

export interface SignatureWrapperProps {
  id: string;
  control?: RuntimeSignatureControl;
  mode?: 'designer' | 'runtime';
  onControlClick?: (id: string) => void;
  // Runtime action props
  actionHandler?: ActionHandler;
  screenId?: string;
  recordId?: string;
  screenState?: Record<string, unknown>;
  runtimeUpdateControlValue?: (controlId: string, value: unknown) => void;
  runtimeUpdateControlProperty?: (controlId: string, property: string, value: unknown) => void;
  // Runtime display/interaction props
  data?: Record<string, unknown>;
  visible?: boolean;
  onAccept?: () => void;
  onCancel?: () => void;
  onUpload?: (documentId: string, documentData: FormData) => Promise<SignatureUploadResponse>;
  isMobile?: boolean;
  placeholder?: string;
  panelName?: string;
  displayPreferences?: Record<string, unknown>;
}

const SignatureDesignerWrapper: React.FC<SignatureWrapperProps> = ({
  id,
  control: controlProp,
  mode = 'designer',
  onControlClick,
  actionHandler,
  screenId,
  recordId,
  screenState,
  runtimeUpdateControlValue,
  runtimeUpdateControlProperty,
  // Runtime display/interaction props
  data,
  visible = true,
  onAccept,
  onCancel,
  onUpload,
  isMobile,
  placeholder,
  panelName,
  displayPreferences: displayPreferencesProp,
}) => {
  const runtimeContext = useRuntimeContext();
  const designerContext = useDesignerContext();

  const isRuntimeMode = !!controlProp || mode === 'runtime';
  const wrapperRef = useRef<HTMLDivElement>(null);
  const signatureTypeRef = useRef<string>('');

  // Get screenId and recordId from props or RuntimeContext
  const effectiveScreenId = screenId ?? runtimeContext?.screenId;
  const effectiveRecordId = recordId ?? runtimeContext?.activeRecordId;

  // Use control from props if provided (runtime mode), otherwise fetch from DesignerContext (designer mode)
  const control: RuntimeSignatureControl | undefined = isRuntimeMode
    ? controlProp
    : designerContext?.selectControlById
      ? designerContext.selectControlById(id)
      : undefined;

  // Handle setFocusToControl action - focus signature when hasFocus becomes true
  useEffect(() => {
    if (isRuntimeMode && control?.hasFocus) {
      // Signature component uses hardcoded IDs, so find the focusable element within our wrapper
      const focusableElement = wrapperRef.current?.querySelector('#signature-widget-placeholder') as HTMLElement | null;
      if (focusableElement) {
        focusableElement.focus();
      }
      // Reset the hasFocus flag
      if (runtimeUpdateControlProperty) {
        runtimeUpdateControlProperty(id, 'hasFocus', false);
      }
    }
  }, [control?.hasFocus, id, isRuntimeMode, runtimeUpdateControlProperty]);

  // Runtime handler: Execute onAccept action
  const handleOnAccept = useCallback(async () => {
    if (!isRuntimeMode) return;

    // Execute control's onAccept action via actionHandler
    if (actionHandler && effectiveScreenId && control?.onAccept) {
      try {
        await actionHandler.executeAction({
          componentId: id,
          actionName: 'onAccept' as any,
          screenId: effectiveScreenId,
          recordId: effectiveRecordId ?? undefined,
          actionData: {
            event: { type: 'accept' },
          },
          screenState,
          metadata: {
            timestamp: Date.now(),
            componentType: 'signature',
          },
        });
      } catch {
        // Error logged without details to avoid exposing sensitive data
      }
    }

    // Process analytics only if onAccept action exists and a signature was uploaded (matches legacy)
    if (runtimeContext?.processAnalytics && control?.onAccept && signatureTypeRef.current) {
      runtimeContext.processAnalytics('Signature Component Signed', {
        signatureType: signatureTypeRef.current,
      });
    }

    // Call external onAccept if provided
    if (onAccept) {
      onAccept();
    }
  }, [
    isRuntimeMode,
    actionHandler,
    effectiveScreenId,
    control?.onAccept,
    id,
    effectiveRecordId,
    screenState,
    runtimeContext,
    onAccept,
  ]);

  // Runtime handler: Execute onCancel action
  const handleOnCancel = useCallback(async () => {
    if (!isRuntimeMode) return;

    // Execute control's onCancel action via actionHandler
    if (actionHandler && effectiveScreenId && control?.onCancel) {
      try {
        await actionHandler.executeAction({
          componentId: id,
          actionName: 'onCancel' as any,
          screenId: effectiveScreenId,
          recordId: effectiveRecordId ?? undefined,
          actionData: {
            event: { type: 'cancel' },
          },
          screenState,
          metadata: {
            timestamp: Date.now(),
            componentType: 'signature',
          },
        });
      } catch {
        // Error logged without details to avoid exposing sensitive data
      }
    }

    // Call external onCancel if provided
    if (onCancel) {
      onCancel();
    }
  }, [
    isRuntimeMode,
    actionHandler,
    effectiveScreenId,
    control?.onCancel,
    id,
    effectiveRecordId,
    screenState,
    onCancel,
  ]);

  // Runtime handler: Upload signature document
  // Uses runtimeContext.uploadSignature which gets screenId/activeRecordId from Runtime.js
  const handleOnUpload = useCallback(
    async (documentId: string, documentData: FormData): Promise<SignatureUploadResponse | null> => {
      if (!isRuntimeMode) return null;

      if (!effectiveScreenId) {
        throw new Error('Unable to store signature, no active screen id.');
      }

      // Use runtimeContext.uploadSignature - it has access to screenId and activeRecordId
      const uploadFn = onUpload || runtimeContext?.uploadSignature;
      if (!uploadFn) {
        console.error('[SignatureWrapper] No upload function available');
        return null;
      }

      // Upload function uses screenId/activeRecordId from Runtime context directly
      const response: SignatureUploadResponse = await uploadFn(documentId, documentData);

      if (response?.error) {
        throw new Error(response.error);
      }

      // Track signature type for analytics (Type vs Draw)
      if (response?.data) {
        if (response.data.name) {
          signatureTypeRef.current = 'Type';
        } else if (response.data.drawingUrl) {
          signatureTypeRef.current = 'Draw';
        }

        // Update control value with response data
        if (runtimeUpdateControlValue) {
          runtimeUpdateControlValue(id, response.data);
        }
      }

      return response;
    },
    [isRuntimeMode, effectiveScreenId, onUpload, runtimeContext?.uploadSignature, id, runtimeUpdateControlValue],
  );

  if (!control) return null;

  // Ensure control has the properties expected by DesignerComponentWrapper
  const normalizedControl = {
    ...control,
    // Ensure width and height are strings with proper format for DesignerComponentWrapper
    width: typeof control.width === 'string' ? control.width : undefined,
    height: typeof control.height === 'string' ? control.height : undefined,
    widthType: control.widthType || 'auto',
    // Ensure other expected properties exist
    disabled: control.disabled || false,
    acceptCaption: control.acceptCaption || 'Accept',
    cancelCaption: control.cancelCaption || 'Cancel',
    hideCancel: control.hideCancel || false,
    hideCaption: control.hideCaption || false,
    caption: control.caption ?? 'Signature',
    placeholder: control.placeholder ?? placeholder,
  };

  const handleWrapperClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (onControlClick) {
      onControlClick(id);
    }
  };

  return (
    <div
      ref={wrapperRef}
      onClick={handleWrapperClick}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        cursor: 'pointer',
        padding: '8px',
      }}
    >
      <Suspense fallback={<LoadingSkeleton count={1} height={150} />}>
        <Signature
          disabled={normalizedControl.disabled}
          acceptCaption={normalizedControl.acceptCaption}
          cancelCaption={normalizedControl.cancelCaption}
          hideCancel={normalizedControl.hideCancel}
          displayPreferences={displayPreferencesProp || {}}
          label={!normalizedControl.hideCaption ? normalizedControl.caption : null}
          isSignable={isRuntimeMode}
          isV4Design={true}
          // Runtime props - data comes from control.value (merged from dataReducer in Runtime.js)
          data={(control?.value as Record<string, unknown>) || data}
          visible={visible}
          onAccept={isRuntimeMode ? handleOnAccept : undefined}
          onCancel={isRuntimeMode ? handleOnCancel : undefined}
          onUpload={isRuntimeMode ? handleOnUpload : undefined}
          isMobile={isMobile ?? runtimeContext?.isMobile}
          placeholder={normalizedControl.placeholder}
          panelName={panelName ?? runtimeContext?.panelName}
        />
      </Suspense>
    </div>
  );
};

export default SignatureDesignerWrapper;
