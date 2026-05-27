/**
 * Save payload builder utilities for the layout designer.
 *
 * Extracts the V4 control restructuring and request body assembly
 * from layoutDesigner's save useEffect.
 */

interface Control {
  id?: string;
  Type?: string;
  type?: string;
  name?: string;
  caption?: string;
  TypeOverride?: string;
  isBound?: boolean;
  IsComplexType?: boolean;
  FieldType?: number;
  classes?: string;
  visible?: boolean;
  disabled?: boolean;
  widthType?: string;
  hideCaption?: boolean;
  isOutputOnly?: boolean;
  regularCaption?: boolean;
  content?: string;
  defaultValue?: unknown;
  value?: unknown;
  onBlur?: string | null;
  onChange?: string | null;
  onClick?: string | null;
  onFocus?: string | null;
  validationRules?: unknown;
  validationError?: string | null;
  staticLayout?: boolean;
  [key: string]: unknown;
}

interface ControlPayload {
  id: string;
  Type: string;
  name: string;
  TypeOverride: string | undefined;
  isBound: boolean;
  IsComplexType: boolean;
  FieldType: number;
  caption: string;
  classes: string;
  visible: boolean;
  disabled: boolean;
  widthType: string;
  hideCaption: boolean;
  isOutputOnly: boolean;
  regularCaption: boolean;
  content: string;
  defaultValue: unknown;
  value: unknown;
  onBlur: string | null;
  onChange: string | null;
  onClick: string | null;
  onFocus: string | null;
  validationRules: unknown;
  validationError: string | null;
  enableCompaction?: boolean;
  [key: string]: unknown;
}

interface ScreenProperties {
  staticLayout?: boolean;
  [key: string]: unknown;
}

interface LayoutV4 {
  [key: string]: unknown;
}

interface SaveRequestBodyParams {
  controlsPayload: Record<string, ControlPayload>;
  versionId: string;
  actionUpserts: Record<string, unknown>;
  ribbonConfiguration: Record<string, unknown>;
  ribbonVisualization: Record<string, unknown>;
  transformedScreenProperties: Record<string, unknown>;
  layoutV4: LayoutV4 | null;
  isV4Screen: boolean;
}

interface SaveRequestBody {
  layout: Record<string, never>;
  controls: Record<string, Record<string, ControlPayload>>;
  actionUpserts: Record<string, unknown>;
  ribbonConfiguration: Record<string, unknown>;
  ribbonVisualization: Record<string, unknown>;
  screenProperties: Record<string, Record<string, unknown>>;
  LayoutV4?: Record<string, LayoutV4>;
  isV4Screen: boolean;
}

/** Explicitly handled properties that are mapped to the control payload with specific logic */
const HANDLED_PROPERTIES = [
  'id', 'Type', 'type', 'name', 'TypeOverride', 'isBound',
  'IsComplexType', 'FieldType', 'caption', 'classes', 'visible',
  'disabled', 'widthType', 'hideCaption', 'isOutputOnly',
  'regularCaption', 'content', 'defaultValue', 'value',
  'onBlur', 'onChange', 'onClick', 'onFocus',
  'validationRules', 'validationError', 'staticLayout',
] as const;

const INPUT_CONTROL_TYPES = ['TXT', 'EDT', 'DRP', 'CHK', 'TGL', 'DTP', 'TXA', 'TAG', 'HTM', 'SIG', 'ADR', 'GAL'];

/**
 * Builds the controls payload for V4 screens by merging existing controls
 * with pending changes and formatting for the backend API.
 */
export const buildV4ControlsPayload = (
  controls: Record<string, Control>,
  versionChanges: Record<string, Partial<Control>>,
): Record<string, ControlPayload> => {
  const controlsPayload: Record<string, ControlPayload> = {};
  const allControlIds = new Set([...Object.keys(controls || {}), ...Object.keys(versionChanges || {})]);

  allControlIds.forEach((controlId) => {
    const existingControl = controls?.[controlId] || {};
    const controlChanges = versionChanges[controlId] || {};
    const control: Control = { ...existingControl, ...controlChanges };

    const controlPayload: ControlPayload = {
      id: control.id || controlId,
      Type: control.Type || control.type || 'BTN',
      name: control.name || control.caption || `Control_${controlId.slice(-8)}`,

      TypeOverride: control.TypeOverride || control.type,
      isBound: control.isBound || false,
      IsComplexType: control.IsComplexType || false,
      FieldType: control.FieldType || 0,

      caption: control.caption || control.content || (control.defaultValue as string) || '',
      classes: control.classes || '',
      visible: control.visible ?? true,
      disabled: control.disabled || false,

      widthType: control.widthType || 'auto',
      hideCaption: control.hideCaption || false,
      isOutputOnly: control.isOutputOnly || false,
      regularCaption: control.regularCaption || false,

      content: control.content || control.caption || (control.defaultValue as string) || '',
      defaultValue: (() => {
        const isInputControl = INPUT_CONTROL_TYPES.includes(
          (control.TypeOverride || control.type) as string,
        );
        if (isInputControl) {
          return control.defaultValue !== undefined ? control.defaultValue : null;
        }
        // Bound controls (e.g. mapped Labels) must not fall back to content/caption.
        // Without this, a mapped Label's defaultValue persists as "Label_2" in MongoDB even
        // after TextEditor.handleMappedFieldChange clears it, because the save-builder was
        // re-applying it from content/caption as a fallback.
        if (control.isBound) {
          return control.defaultValue !== undefined ? control.defaultValue : null;
        }
        return control.defaultValue || control.content || control.caption || '';
      })(),
      value: control.value || null,

      onBlur: control.onBlur || null,
      onChange: control.onChange || null,
      onClick: control.onClick || null,
      onFocus: control.onFocus || null,

      validationRules: control.validationRules || null,
      validationError: control.validationError || null,

      // Include additional control-specific properties not handled above
      ...Object.keys(control).reduce<Record<string, unknown>>((acc, key) => {
        if (!(HANDLED_PROPERTIES as readonly string[]).includes(key)) {
          acc[key] = control[key];
        }
        return acc;
      }, {}),
    };

    // Containers always use static layout (no compaction)
    if ((control.Type || control.type) === 'L-CON') {
      controlPayload.enableCompaction = false;
    }

    controlsPayload[controlId] = controlPayload;
  });

  return controlsPayload;
};

/**
 * Transforms screen properties for the backend: staticLayout → enableCompaction.
 */
export const transformScreenProperties = (
  screenProperties: ScreenProperties | undefined,
): Record<string, unknown> => {
  const { staticLayout: frontendStaticLayout, ...restScreenProperties } = screenProperties || {};
  return {
    ...restScreenProperties,
    ...(frontendStaticLayout !== undefined && { enableCompaction: !frontendStaticLayout }),
  };
};

/**
 * Assembles the complete save request body.
 */
export const buildSaveRequestBody = ({
  controlsPayload,
  versionId,
  actionUpserts,
  ribbonConfiguration,
  ribbonVisualization,
  transformedScreenProperties,
  layoutV4,
  isV4Screen,
}: SaveRequestBodyParams): SaveRequestBody => ({
  layout: {},
  controls: { [versionId]: controlsPayload },
  actionUpserts: { ...actionUpserts },
  ribbonConfiguration: { ...ribbonConfiguration },
  ribbonVisualization: { ...ribbonVisualization },
  screenProperties: { [versionId]: transformedScreenProperties },
  LayoutV4: layoutV4 ? { [versionId]: layoutV4 } : undefined,
  isV4Screen,
});
