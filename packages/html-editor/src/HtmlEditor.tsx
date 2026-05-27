import React, { useEffect, useRef, Suspense } from 'react';
import * as s from './HtmlEditor.styles';

import { keys, XS, SM, MD, LG, ToolbarConfig } from './constants';
import { ValidationMessage } from '@m-next/validation';
import Caption from '@m-next/caption';

// Froala editor
import FroalaEditor from 'react-froala-wysiwyg';
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import 'froala-editor/js/plugins.pkgd.min';
import LoadingSkeleton from '@m-next/loading-skeleton';

export interface AuthContext {
  account?: string;
  authToken?: string;
  identity?: string;
  runtimeCoreUrl?: string;
  secureToken?: string;
  [key: string]: unknown;
}

interface HtmlEditorProps {
  authContext?: AuthContext;
  caption?: string;
  componentVersion?: string; // Version to control behavior changes (default "0.0.0")
  data?: string;
  disabled?: boolean;
  focused?: boolean;
  height?: string;
  id: string;
  isV4Design?: boolean;
  placeholder?: string;
  required?: boolean;
  width?: string;
  validationMessage?: string;
  onBlur?: (content: string | null) => void;
  onChange?: (content: string) => void;
  onFocus?: () => void;
  onLoad?: (content: string) => void;
}

function HtmlEditor(props: HtmlEditorProps) {
  const {
    authContext = {},
    caption = '',
    data = '',
    disabled = false,
    focused = false,
    height = '100px',
    id = '',
    isV4Design,
    required,
    width = '100%',
    validationMessage,
    onBlur,
    onChange,
    onFocus,
    onLoad,
  } = props;

  // State
  // We need to use any here because the editor controller has a complex type structure
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [editorController, setController] = React.useState<any>(null); // cannot use destructuring with useState, unit tests fail
  const [toolbarButtons, setToolbarButtons] = React.useState<ToolbarConfig | Record<string, never>>({});

  // bump up z-index of the editor on click
  // for cases when two editors are close vertically and popup of the top editor ends up being stacked under the bottom one
  const [editorClicked, setEditorClicked] = React.useState(false);
  const [isEditorLoaded, setIsEditorLoaded] = React.useState(false);

  // Refs
  const editorRef = useRef<HTMLDivElement>(null);
  const isMountedRef = useRef(true);

  // Init variables
  const { account, authToken, identity, runtimeCoreUrl, secureToken } = authContext as AuthContext;
  const token = secureToken || `${account}:${identity}:${authToken}`;
  const authContextInitialized = !!authContext.account;

  const uniqueId = id; // for triggering events to a specific editor when multiple editors are on a page
  const toolbarInitialized = !!Object.keys(toolbarButtons).length;

  // Effects
  // Set buttons display for editor toolbar
  useEffect(() => {
    let editorWidth = editorRef?.current?.parentElement?.offsetWidth || 0;

    if (width && width.indexOf('px') > -1) {
      editorWidth = Number(width.replace('px', ''));
    }

    let toolbarBtns: ToolbarConfig;
    switch (true) {
      case editorWidth >= 1152:
        toolbarBtns = LG;
        break;
      case editorWidth >= 992:
        toolbarBtns = MD;
        break;
      case editorWidth >= 768:
        toolbarBtns = SM;
        break;
      case editorWidth < 768:
        toolbarBtns = XS;
        break;
      default:
        toolbarBtns = LG;
    }
    setToolbarButtons(toolbarBtns);
  }, [editorRef.current, width]);

  // Disable/enable editor
  useEffect(() => {
    if (editorController) {
      setTimeout(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const editor = editorController as any;
        if (editor && typeof editor.edit === 'object') {
          if (disabled) {
            editor.edit.off();
          } else {
            editor.edit.on();
          }
        }
      }, 300);
    }
  }, [editorController, disabled]);

  // Focus
  useEffect(() => {
    if (editorController) {
      setTimeout(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const editor = editorController as any;
        if (focused && editor && typeof editor.events === 'object') {
          editor.events.focus(true);
          if (id === uniqueId && onFocus) {
            onFocus();
          }
        }
      }, 200);
    }
  }, [editorController, focused, id, uniqueId, onFocus]);

  // Update height dynamically when height prop changes (for componentVersion >= 1.0.0)
  useEffect(() => {
    if (editorController && height) {
      const newHeight = parseInt(height.replace('px', ''), 10);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const editor = editorController as any;

      if (editor && editor.opts && editor.opts.height !== newHeight) {
        console.log(
          `[HtmlEditor] Updating Froala height from ${editor.opts.height}px to ${newHeight}px for editor ${id}`,
        );

        // Update the editor's height option
        editor.opts.height = newHeight;

        // Force the editor to resize by updating the iframe/content editable area
        if (editor.$box && editor.$box.length > 0) {
          const editorBox = editor.$box[0];
          const wrapper = editorBox.querySelector('.fr-wrapper');
          if (wrapper) {
            wrapper.style.height = `${newHeight}px`;
          }
        }

        // Also update the editor element directly if it exists
        if (editor.$el && editor.$el.length > 0) {
          const editorElement = editor.$el[0];
          if (editorElement) {
            editorElement.style.height = `${newHeight}px`;
          }
        }

        // Refresh the editor size if the method exists
        if (editor.size && typeof editor.size.refresh === 'function') {
          editor.size.refresh();
        }
      }
    }
  }, [editorController, height, id]);

  // Listen to window clicks
  useEffect(() => {
    window.addEventListener('click', handleClick);
    return () => {
      window.removeEventListener('click', handleClick);
    };
  }, []);

  // Track component mount status to prevent state updates after unmounting
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const handleClick = (e: MouseEvent) => {
    const path = e.composedPath ? e.composedPath() : [];
    for (let i = 0; i <= 5; i++) {
      // check up to 5 parent nodes
      // Check for clicking on a current textarea (for cases when more than one is present on a page)
      const element = path[i] as HTMLElement;
      if (e && path && element && typeof element.className === 'string' && element.id && element.id.indexOf(id) > -1) {
        return setEditorClicked(true);
      }
    }
    return setEditorClicked(false);
  };

  // Initialize editor
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleManualController = (initControls: any) => {
    initControls.initialize();
    if (isMountedRef.current) {
      setController(initControls.getEditor());
    }
  };

  const handleModelChange = (content: string) => onChange && onChange(content);

  const trueHeight = parseInt(height.replace('px', ''), 10);

  return (
    <s.EditorWrapper
      id={`HTML-editor-${id}`}
      width={width}
      disabled={disabled}
      ref={editorRef}
      isValid={!validationMessage}
      isEditorActive={editorClicked}
      isV4Design={isV4Design}
    >
      {caption && <Caption id={`${id}-HTML-editor-caption`} required={required} label={caption} />}
      {!isEditorLoaded && <LoadingSkeleton count={1} height={trueHeight + 50} />}
      <Suspense fallback={null}>
        {toolbarInitialized && authContextInitialized && (
          <FroalaEditor
            model={data?.toString() ?? ''}
            onModelChange={handleModelChange}
            onManualControllerReady={handleManualController}
            config={{
              attribution: false,
              charCounterCount: false,
              height: trueHeight,
              key: keys.v3,
              linkAutoPrefix: '',

              htmlRemoveTags: ['script'],
              imageUpload: true,
              imageDefaultAlign: 'center',
              imageDefaultDisplay: 'inline-block',
              imageAllowedTypes: ['jpeg', 'jpg', 'png'],
              imageMaxSize: 50 * 1024 * 1024,
              imageUploadParam: 'image',
              imageUploadURL: `${runtimeCoreUrl}/api/v1/image/public`,
              imageUploadMethod: 'post',
              requestHeaders: {
                Authorization: `Bearer ${token}`,
              },
              videoUpload: false,

              events: {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                blur: function (this: any) {
                  try {
                    let content = null;
                    if (this && typeof this.codeView === 'object' && typeof this.codeView.isActive === 'function') {
                      const isCodeViewActive = this.codeView.isActive();
                      if (isCodeViewActive && typeof this.codeView.get === 'function') {
                        content = this.codeView.get();
                      }
                    }
                    if (onBlur) {
                      onBlur(content);
                    }
                  } catch {
                    if (onBlur) {
                      onBlur(null);
                    }
                  }
                },
                focus: () => onFocus && onFocus(),
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                initialized: function (this: any) {
                  try {
                    // Only update state if component is still mounted
                    if (isMountedRef.current) {
                      // Set editor as loaded first to ensure UI is responsive
                      setIsEditorLoaded(true);

                      // Safely access html content with fallbacks
                      let cleanedContent = '';
                      if (this && typeof this.html === 'object' && typeof this.html.get === 'function') {
                        cleanedContent = this.html.get() || '';
                      }

                      // Call onLoad callback if provided
                      if (onLoad) {
                        onLoad(cleanedContent);
                      }
                    }
                  } catch (error) {
                    console.error('Error in HtmlEditor initialization:', error);
                  }
                },
              },

              toolbarButtons,

              pluginsEnabled: [
                'align',
                'charCounter',
                'codeBeautifier',
                'codeView',
                'colors',
                'draggable',
                'emoticons',
                'entities',
                'fontFamily',
                'fontSize',
                'fullscreen',
                'image',
                'lineHeight',
                'link',
                'lists',
                'paragraphFormat',
                'paragraphStyle',
                'print',
                'table',
                'video',
                'wordPaste',
              ],
            }}
          />
        )}
      </Suspense>
      <ValidationMessage
        id={`${id}-HTML-editor-validation`}
        message={validationMessage}
        isV4Design={isV4Design}
        compactStyle={false}
      />
    </s.EditorWrapper>
  );
}

export default HtmlEditor;
