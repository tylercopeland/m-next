import React from 'react';
import Dialog from '@m-next/dialog';
import Button from '@m-next/button';
import { colors } from '@m-next/styles';
import * as s from './ContainerDeleteBlockedDialog.styles';

export interface ReferencedComponent {
    controlId: string;
    controlName: string;
}

export interface ContainerDeleteBlockedDialogProps {
    /** Whether the dialog is open */
    isOpen: boolean;
    /** Callback when dialog is closed */
    onClose: () => void;
    /** Array of components that have references */
    referencedComponents: ReferencedComponent[];
    /** Callback when a component is clicked to select it */
    onComponentClick?: (controlId: string) => void;
}

/**
 * Dialog that appears when attempting to delete a container with children that have references.
 * Prevents deletion and shows which components have references.
 */
const ContainerDeleteBlockedDialog: React.FC<ContainerDeleteBlockedDialogProps> = ({
    isOpen,
    onClose,
    referencedComponents,
    onComponentClick,
}) => {
    const handleComponentClick = (controlId: string) => {
        if (onComponentClick) {
            onComponentClick(controlId);
        }
        onClose();
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
                            Can't delete container
                        </s.DialogHeaderText>
                    </s.DialogHeaderTitle>
                    <s.Divider />
                </s.DialogHeaderWrapper>
                <s.DialogContent>
                    <s.DialogText>
                        One or more components inside are currently being referenced. To delete the container, first remove the reference(s) from the component(s):
                    </s.DialogText>
                    {referencedComponents.map((component) => (
                        <s.ComponentList key={component.controlId}>
                            <s.ComponentListItem onClick={() => handleComponentClick(component.controlId)}>
                                {component.controlName}
                            </s.ComponentListItem>
                        </s.ComponentList>
                    ))}
                </s.DialogContent>
                <s.DialogFooter>
                    <Button
                        id="container-delete-blocked-cancel"
                        value="Cancel"
                        onClick={onClose}
                        buttonStyle="ghost"
                        borderColor={colors.blue}
                        color={colors.blue}
                    />
                </s.DialogFooter>
            </s.DialogWrapper>
        </Dialog>
    );
};

export default ContainerDeleteBlockedDialog;
