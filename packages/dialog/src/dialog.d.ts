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
            onPrimaryButtonClick?: () => void;
            secondaryButtonLabel?: string;
            onSecondaryButtonClick?: () => void;
        };

    export interface DialogCustomStyles {
        overlay?: React.CSSProperties;
        content?: React.CSSProperties;
    }

    export interface DialogProps {
        id?: string | null;
        children?: React.ReactNode;
        title?: string;
        onClose?: () => void;
        onDismiss?: () => void;
        role?: 'dialog' | 'alertdialog';
        isOpen?: boolean;
        hideDismissButton?: boolean;
        aria?: DialogAriaProps;
        header?: React.ReactNode;
        footer?: DialogFooterContent;
        width?: number | string;
        /** Custom styles to override default modal overlay and content styles */
        customStyles?: DialogCustomStyles;
        /** Hide the default dialog header wrapper (allows fully custom header in children) */
        hideDefaultHeader?: boolean;
        /** Hide the default dialog body wrapper (renders children directly without DialogBody wrapper) */
        hideDefaultBody?: boolean;
        /** Hide the default dialog footer wrapper (allows fully custom footer in children) */
        hideDefaultFooter?: boolean;
    }

    const Dialog: React.FC<DialogProps>;

    export default Dialog;
}