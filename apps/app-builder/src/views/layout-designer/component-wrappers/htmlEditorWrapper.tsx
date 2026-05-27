import React, { Suspense, useMemo, useRef, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import HtmlEditor from '@m-next/html-editor';
import { createHtmlEditorControl } from '@m-next/runtime-interface';
import type { HtmlEditorControl } from '@m-next/runtime-interface';
import { AuthContext } from '@m-next/html-editor/src/HtmlEditor';
import { selectControls } from '../../../common/services/screenLayoutSlice';
import type { RootState } from '../../../types/screenLayoutTypes';
import {
  selectAccountName,
  selectMethodIdentity,
  selectTokenRTC,
} from '../../../common/services/sessionSlice';
import { getValueFromComplexValue } from '../../../components/complex-value/complex-value-utils';
import { getRuntimeUrl } from '../../../common/services/urlServce';

interface HtmlEditorWrapperProps {
  id: string;
  onControlClick?: (id: string) => void;
}

const HtmlEditorWrapper: React.FC<HtmlEditorWrapperProps> = ({ id }) => {
  const controlList = useSelector((state) => selectControls(state as RootState));
  const control = controlList?.[id] as HtmlEditorControl | undefined;

  // Get authentication information from session
  const accountName = useSelector(selectAccountName);
  const methodIdentity = useSelector(selectMethodIdentity);
  const tokenRTC = useSelector(selectTokenRTC);

  // Track wrapper height for dynamic resizing
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [editorHeightPx, setEditorHeightPx] = useState<number>(300);

  // Determine if we should use dynamic height based on componentVersion
  // For now, enable dynamic height for ALL controls to ensure resize works
  // TODO: Once all controls are migrated to componentVersion 1.0.0, we can use version check
  const componentVersion = (control as unknown as { componentVersion?: string }).componentVersion || '0.0.0';
  const useDynamicHeight = true; // Always use dynamic height in layout canvas

  // Use ResizeObserver to track wrapper height changes and calculate editor height
  useEffect(() => {
    const currentWrapper = wrapperRef.current;
    if (!currentWrapper) {
      return;
    }

    const updateEditorHeight = () => {
      const wrapperHeight = currentWrapper.clientHeight;
      // Account for:
      // - Caption: ~32px (if not hidden)
      // - Validation message space: ~18px
      // - EditorWrapper margin-bottom: 20px
      // - Wrapper padding: 16px (8px top + 8px bottom)
      // - Additional spacing: ~10px
      const reservedSpace = control?.hideCaption ? 80 : 112;
      const calculatedHeightPx = Math.max(100, wrapperHeight - reservedSpace);
      if (useDynamicHeight) {
        setEditorHeightPx(calculatedHeightPx);
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      updateEditorHeight();
    });

    resizeObserver.observe(currentWrapper);

    // Initial calculation
    updateEditorHeight();

    return () => {
      resizeObserver.disconnect();
    };
  }, [useDynamicHeight, control?.hideCaption, id]);

  // Create authContext object
  const authContext = useMemo(
    () => ({
      account: accountName || '',
      identity: methodIdentity || '',
      authToken: tokenRTC || '',
      runtimeCoreUrl: getRuntimeUrl(),
      secureToken:
        accountName && methodIdentity && tokenRTC
          ? `${accountName}:${methodIdentity}:${tokenRTC}`
          : '',
    } as AuthContext),
    [accountName, methodIdentity, tokenRTC]
  );

  // Extract the value from the complex value object with null checks
  const defaultValue = useMemo(() => getValueFromComplexValue(control?.defaultValue, controlList), [control, controlList]);

  // Create proper HtmlEditorControl using the factory function
  const htmlEditorControl: HtmlEditorControl = control
    ? createHtmlEditorControl(
        {
          id: control.id,
          hideCaption: control.hideCaption,
          caption: control.caption,
          classes: control.classes,
          name: control.name,
          widthType: control.widthType,
          width: control.width,
          visible: control.visible,
          disabled: control.disabled,
          isBound: control.isBound,
          defaultValue: control.defaultValue,
        },
        {
          content: (control as unknown as { content?: string }).content || '',
          height: (control as unknown as { height?: number }).height || 300,
          toolbar: (control as unknown as { toolbar?: string[] }).toolbar,
          readonly: (control as unknown as { readonly?: boolean }).readonly,
          placeholder: (control as unknown as { placeholder?: string }).placeholder || '',
          allowImages: (control as unknown as { allowImages?: boolean }).allowImages,
          allowLinks: (control as unknown as { allowLinks?: boolean }).allowLinks,
          allowTables: (control as unknown as { allowTables?: boolean }).allowTables,
          allowCodeView: (control as unknown as { allowCodeView?: boolean }).allowCodeView,
          maxLength: (control as unknown as { maxLength?: number }).maxLength,
          theme: (control as unknown as { theme?: 'light' | 'dark' }).theme,
          spellCheck: (control as unknown as { spellCheck?: boolean }).spellCheck,
        }
      )
    : createHtmlEditorControl({ id: id || 'unknown' });

  // 🔧 SYNCHRONOUS CONTROL CREATION: Redux control should always exist now
  if (!control) {
    return (
      <div
        style={{
          padding: '8px 16px',
          border: '1px dashed #ccc',
          backgroundColor: '#f5f5f5',
          color: '#666',
          fontSize: '12px',
        }}
      >
        Loading HTML Editor...
      </div>
    );
  }

  // Calculate final height in pixels
  // If useDynamicHeight, use the calculated pixel height from ResizeObserver
  // Otherwise, use the static height from control (already in pixels or default 300)
  const finalHeightPx = useDynamicHeight ? editorHeightPx : (htmlEditorControl.height as number || 300);

  return (
    <div
      ref={wrapperRef}
      style={{
        width: '100%',
        height: '100%',
        padding: '8px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Suspense
        fallback={
          <div style={{ height: 300, background: '#eee' }}>Loading HTML editor...</div>
        }
      >
        <HtmlEditor
          authContext={authContext}
          id={id}
          caption={control.hideCaption ? undefined : control.caption}
          placeholder={htmlEditorControl.placeholder || ''}
          required={(control as unknown as { required?: boolean }).required}
          disabled={control.disabled}
          isV4Design
          data={defaultValue}
          height={`${finalHeightPx}px`}
          componentVersion={componentVersion}
        />
      </Suspense>
    </div>
  );
};

export default HtmlEditorWrapper;
