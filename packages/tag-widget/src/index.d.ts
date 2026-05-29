/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';

export type TagWidgetSize = 'narrow' | 'regular';

export interface TagDef {
  /** Display name of the tag. */
  name: string;
  /** Hex colour stored upstream — gets mapped to a token color family internally. */
  colour?: string;
}

interface CommonTagWidgetProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Optional id. Auto-generated if absent. */
  id?: string;
  /** Catalog of known tags (used for colouring). */
  tagsList?: TagDef[];
  /** Controlled list of currently-applied tag names. */
  value?: string[];
  /** Visible label rendered above the field. */
  label?: string;
  /** Size of the rendered pills. */
  size?: TagWidgetSize;

  // ============ Deprecated — soft-shimmed ============
  /** @deprecated Use `label`. */
  caption?: string;
  /** @deprecated Use the React forwardRef API — pass `ref` directly. */
  forwardRef?: React.Ref<any>;

  // ============ Silently ignored ============
  /** @deprecated No longer has any effect. */
  isV4Design?: boolean;
  /** @deprecated No longer has any effect — use CSS media queries. */
  isMobile?: boolean;
  /** @deprecated Use `className`. */
  legacyClass?: string;
  /** @deprecated No longer has any effect. */
  displayAuto?: boolean;
  /** @deprecated No longer has any effect. */
  compactStyle?: boolean;
}

export interface EditableTagWidgetProps extends CommonTagWidgetProps {
  /** Suggested / recently-used tag names. Shown in the "recent" group. */
  suggestions?: string[];
  /** Fires with a comma-joined string of the current tag names. */
  onChange?: (value: string) => void;
  /** Disable interaction. Tags become fixed pills. */
  disabled?: boolean;
  /** Show a "Manage Tags" action button in the dropdown footer. */
  showManageTags?: boolean;
  /** Callback for the "Manage Tags" action button. */
  onActionButtonClick?: () => void;
  /** Container width (CSS length or number). */
  width?: number | string;
  /** Placeholder for the inline input. */
  placeholder?: string;
  /** Render the dropdown panel in a portal. */
  isPortal?: boolean;
}

export interface ReadOnlyTagWidgetProps extends CommonTagWidgetProps {
  /** Read-only widgets never accept input. This prop is unused but documented for parity. */
  disabled?: boolean;
}

export interface TagWidgetProps extends EditableTagWidgetProps {
  /** When true, renders the editable variant. When false (default), renders read-only pills. */
  isEditable?: boolean;
}

export const EditableTagWidget: React.ForwardRefExoticComponent<
  EditableTagWidgetProps & React.RefAttributes<HTMLDivElement>
>;
export const ReadOnlyTagWidget: React.ForwardRefExoticComponent<
  ReadOnlyTagWidgetProps & React.RefAttributes<HTMLDivElement>
>;
declare const TagWidget: React.ForwardRefExoticComponent<
  TagWidgetProps & React.RefAttributes<HTMLDivElement>
>;
export default TagWidget;
