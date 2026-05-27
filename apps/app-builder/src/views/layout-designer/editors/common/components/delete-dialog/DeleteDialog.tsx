import React from 'react';
import Dialog from '@m-next/dialog';
import Button from '@m-next/button';
import { colors } from '@m-next/styles';
import * as s from './DeleteDialog.styles';

export interface DeleteDialogProps {
    /** Whether the dialog is open */
    isOpen: boolean;
    /** Callback when dialog is closed */
    onClose: () => void;
    /** Callback when delete is confirmed */
    onConfirm: () => void;
    /** Dialog title */
    title?: string;
    /** Custom message content (string or React node) */
    message?: string | React.ReactNode;
    /** Type of item being deleted (e.g., 'control', 'component', 'ribbon', 'column') */
    itemType?: string;
    /** Label/name of the specific item being deleted */
    itemLabel?: string;
    /** Primary button label */
    confirmLabel?: string;
    /** Secondary button label */
    cancelLabel?: string;
    /** Whether the control has events/actions attached */
    hasEvents?: boolean;
    /** Number of events/actions attached */
    eventCount?: number;
    /** Array of event type labels */
    eventTypes?: string[];
}

/**
 * Reusable delete confirmation dialog component.
 * Provides a consistent delete confirmation experience across the app builder.
 * Follows Method CRM design specifications for delete modals.
 */
const DeleteDialog: React.FC<DeleteDialogProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    itemType = 'component',
    confirmLabel = 'Delete',
    cancelLabel = 'Cancel',
}) => {
    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    const renderMessage = () => {
        // If custom message provided, use it
        if (message) {
            if (typeof message === 'string') {
                return <s.DialogText>{message}</s.DialogText>;
            }
            return <s.DialogText>{message}</s.DialogText>;
        }
        return (
            <s.DialogText>
                <p>Deleting this {itemType} will also remove the actions connected to it and all components within it. This cannot be undone.</p>
                <p>&thinsp;</p>
                <p>Are you sure you want to delete?</p>
            </s.DialogText>
        );
    };

    return (
        <Dialog
            role="alertdialog"
            isOpen={isOpen}
            onClose={onClose}
            customStyles={s.modalStyles}
            hideDefaultHeader
            hideDefaultBody
            hideDefaultFooter
        >
            <s.DialogWrapper>
                <s.DialogHeaderWrapper>
                    <s.DialogHeaderTitle>
                        <s.DialogHeaderText>
                            {title || `Delete ${itemType}`}
                        </s.DialogHeaderText>
                    </s.DialogHeaderTitle>
                    <s.Divider />
                </s.DialogHeaderWrapper>
                <s.DialogContent>
                    {renderMessage()}
                </s.DialogContent>
                <s.DialogFooter>
                    <Button
                        id="delete-dialog-cancel"
                        value={cancelLabel}
                        onClick={onClose}
                        buttonStyle="ghost"
                        borderColor={colors.blue}
                        color={colors.blue}
                    />
                    <Button
                        id="delete-dialog-confirm"
                        value={confirmLabel}
                        onClick={handleConfirm}
                        buttonStyle="primary"
                        backgroundColor={colors.red}
                        borderColor={colors.red}
                        color={colors.white}
                    />
                </s.DialogFooter>
            </s.DialogWrapper>
        </Dialog>
    );
};

export default DeleteDialog;
