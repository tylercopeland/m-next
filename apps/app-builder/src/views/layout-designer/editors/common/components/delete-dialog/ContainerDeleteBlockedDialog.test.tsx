import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import ContainerDeleteBlockedDialog from './ContainerDeleteBlockedDialog';

describe('ContainerDeleteBlockedDialog', () => {
    const mockOnClose = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders dialog when isOpen is true', () => {
        render(
            <ContainerDeleteBlockedDialog
                isOpen
                onClose={mockOnClose}
                referencedComponents={[
                    { controlId: 'btn-1', controlName: 'Button 1' },
                    { controlId: 'txt-2', controlName: 'Text Input 2' }
                ]}
            />
        );

        expect(screen.getByText("Can't delete container")).toBeInTheDocument();
        expect(screen.getByText(/One or more components inside are currently being referenced/)).toBeInTheDocument();
    });

    test('does not render dialog when isOpen is false', () => {
        render(
            <ContainerDeleteBlockedDialog
                isOpen={false}
                onClose={mockOnClose}
                referencedComponents={[{ controlId: 'btn-1', controlName: 'Button 1' }]}
            />
        );

        expect(screen.queryByText("Can't delete container")).not.toBeInTheDocument();
    });

    test('calls onClose when Cancel button is clicked', () => {
        render(
            <ContainerDeleteBlockedDialog
                isOpen
                onClose={mockOnClose}
                referencedComponents={[{ controlId: 'btn-1', controlName: 'Button 1' }]}
            />
        );

        const cancelButton = screen.getByRole('button', { name: /cancel/i });
        userEvent.click(cancelButton);

        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    test('renders all referenced component names', () => {
        const components = [
            { controlId: 'btn-1', controlName: 'Button 1' },
            { controlId: 'txt-2', controlName: 'Text Input 2' },
            { controlId: 'grid-3', controlName: 'Grid Component 3' }
        ];

        render(
            <ContainerDeleteBlockedDialog
                isOpen
                onClose={mockOnClose}
                referencedComponents={components}
            />
        );

        components.forEach(component => {
            expect(screen.getByText(component.controlName)).toBeInTheDocument();
        });
    });

    test('renders empty list when no referenced components', () => {
        render(
            <ContainerDeleteBlockedDialog
                isOpen
                onClose={mockOnClose}
                referencedComponents={[]}
            />
        );

        expect(screen.getByText(/One or more components inside are currently being referenced/)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    });

    test('has correct dialog structure', () => {
        render(
            <ContainerDeleteBlockedDialog
                isOpen
                onClose={mockOnClose}
                referencedComponents={[
                    { controlId: 'btn-1', controlName: 'Button 1' },
                    { controlId: 'input-2', controlName: 'Input 2' }
                ]}
            />
        );

        expect(screen.getByText("Can't delete container")).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: /delete/i })).not.toBeInTheDocument();
    });
});
