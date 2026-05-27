import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import DeleteDialog from './DeleteDialog';

describe('DeleteDialog', () => {
    const mockOnClose = jest.fn();
    const mockOnConfirm = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders dialog when isOpen is true', () => {
        render(
            <DeleteDialog
                isOpen
                onClose={mockOnClose}
                onConfirm={mockOnConfirm}
                itemType="component"
            />
        );

        expect(screen.getByText('Delete component')).toBeInTheDocument();
        expect(screen.getByText(/Deleting this component will also remove the actions/)).toBeInTheDocument();
    });

    test('does not render dialog when isOpen is false', () => {
        render(
            <DeleteDialog
                isOpen={false}
                onClose={mockOnClose}
                onConfirm={mockOnConfirm}
            />
        );

        expect(screen.queryByText(/Delete/)).not.toBeInTheDocument();
    });

    test('calls onConfirm and onClose when Delete button is clicked', () => {
        render(
            <DeleteDialog
                isOpen
                onClose={mockOnClose}
                onConfirm={mockOnConfirm}
            />
        );

        const deleteButton = screen.getByRole('button', { name: /delete/i });
        userEvent.click(deleteButton);

        expect(mockOnConfirm).toHaveBeenCalledTimes(1);
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    test('calls onClose when Cancel button is clicked', () => {
        render(
            <DeleteDialog
                isOpen
                onClose={mockOnClose}
                onConfirm={mockOnConfirm}
            />
        );

        const cancelButton = screen.getByRole('button', { name: /cancel/i });
        userEvent.click(cancelButton);

        expect(mockOnClose).toHaveBeenCalledTimes(1);
        expect(mockOnConfirm).not.toHaveBeenCalled();
    });

    test('renders custom title when provided', () => {
        render(
            <DeleteDialog
                isOpen
                onClose={mockOnClose}
                onConfirm={mockOnConfirm}
                title="Custom Delete Title"
            />
        );

        expect(screen.getByText('Custom Delete Title')).toBeInTheDocument();
    });

    test('renders custom message when provided as string', () => {
        render(
            <DeleteDialog
                isOpen
                onClose={mockOnClose}
                onConfirm={mockOnConfirm}
                message="This is a custom delete message"
            />
        );

        expect(screen.getByText('This is a custom delete message')).toBeInTheDocument();
    });

    test('renders custom message when provided as React node', () => {
        render(
            <DeleteDialog
                isOpen
                onClose={mockOnClose}
                onConfirm={mockOnConfirm}
                message={<div data-testid="custom-content">Custom React Node</div>}
            />
        );

        expect(screen.getByTestId('custom-content')).toBeInTheDocument();
        expect(screen.getByText('Custom React Node')).toBeInTheDocument();
    });

    test('renders default message for component deletion', () => {
        render(
            <DeleteDialog
                isOpen
                onClose={mockOnClose}
                onConfirm={mockOnConfirm}
            />
        );

        expect(screen.getByText(/Deleting this component will also remove the actions connected to it/)).toBeInTheDocument();
        expect(screen.getByText(/Are you sure you want to delete?/)).toBeInTheDocument();
    });

    test('renders custom button labels when provided', () => {
        render(
            <DeleteDialog
                isOpen
                onClose={mockOnClose}
                onConfirm={mockOnConfirm}
                confirmLabel="Remove"
                cancelLabel="Keep"
            />
        );

        expect(screen.getByRole('button', { name: /remove/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /keep/i })).toBeInTheDocument();
    });

    test('delete button has fuchsia background color', () => {
        render(
            <DeleteDialog
                isOpen
                onClose={mockOnClose}
                onConfirm={mockOnConfirm}
            />
        );

        const deleteButton = screen.getByRole('button', { name: /delete/i });
        expect(deleteButton).toBeInTheDocument();
    });

    test('renders with correct dialog structure', () => {
        render(
            <DeleteDialog
                isOpen
                onClose={mockOnClose}
                onConfirm={mockOnConfirm}
                title="Delete Button Control"
                itemType="button"
            />
        );

        expect(screen.getByText('Delete Button Control')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
    });
});
