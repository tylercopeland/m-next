declare module '@m-next/dialog' {
  import * as React from 'react';

  export interface DialogAriaProps {
    labelledby?: string;
    describedby?: string;
  }

  export type DialogFooterContent =
    | { children?: React.ReactNode }
    | {
        primaryButtonLabel?: string;
        primaryDisabled?: boolean;
        primaryVariant?: string;
        onPrimaryButtonClick?: () => void;
        secondaryButtonLabel?: string;
        secondaryVariant?: string;
        secondaryDisabled?: boolean;
        onSecondaryButtonClick?: () => void;
      };

  export interface DialogCustomStyles {
    overlay?: React.CSSProperties;
    content?: React.CSSProperties;
  }

  export interface DialogProps {
    /** Optional id prefix. Auto-generated if absent. Drives ids for header / title / body / footer / dismiss / wrapper. */
    id?: string | null;
    children?: React.ReactNode;
    /** Title rendered in the default header. Also used as the accessible name (aria-labelledby) when set. */
    title?: string;
    onClose?: () => void;
    /** Fires alongside `onClose` when the user clicks the dismiss button. Use this for "explicit dismiss" tracking. */
    onDismiss?: () => void;
    /** Defaults to `'dialog'`. Use `'alertdialog'` for critical confirms / destructive actions. */
    role?: 'dialog' | 'alertdialog';
    isOpen?: boolean;
    hideDismissButton?: boolean;
    /** Override the auto-resolved labelledby/describedby. By default Dialog points labelledby at the title and describedby at the body. */
    aria?: DialogAriaProps;
    /** Extra content rendered into the default header (sits between title and dismiss button). */
    header?: React.ReactNode;
    footer?: DialogFooterContent;
    width?: number | string;
    maxHeight?: number | string;
    /** Custom styles to override default modal overlay and content styles */
    customStyles?: DialogCustomStyles;
    /** Hide the default dialog header wrapper (allows fully custom header in children) */
    hideDefaultHeader?: boolean;
    /** Hide the default dialog body wrapper (renders children directly without DialogBody wrapper) */
    hideDefaultBody?: boolean;
    /** Hide the default dialog footer wrapper (allows fully custom footer in children) */
    hideDefaultFooter?: boolean;

    // ============ Deprecated — soft-shimmed ============
    /** @deprecated Dialog renders a portal; refs to the dialog element are not supported. */
    forwardRef?: React.Ref<any>;

    // ============ Silently ignored ============
    /** @deprecated No longer has any effect. */
    isV4Design?: boolean;
    /** @deprecated No longer has any effect — use CSS media queries. */
    isMobile?: boolean;
    /** @deprecated Use `className` on the content style. */
    legacyClass?: string;
    /** @deprecated No longer has any effect. */
    displayAuto?: boolean;
  }

  const Dialog: React.FC<DialogProps>;

  export default Dialog;
}
