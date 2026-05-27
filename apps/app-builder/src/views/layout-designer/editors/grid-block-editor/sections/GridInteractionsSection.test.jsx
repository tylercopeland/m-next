import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import GridInteractionsSection from './GridInteractionsSection';

const mockOnChange = jest.fn();

const defaultProps = {
    control: {
        id:'test',
        isSearchable: false,
        showSort: false,
        showExport: false,
        showRefresh: false,
        isSelectable: false,
        canReorderColumns: false,
        canAddMoreRows: false,
        addLabel: '',
        newRowsCount: 0,
        showDeleteColumn: false,
        showDeleteConfirmation: false,
    },
    onChange: mockOnChange,
};

const renderComponent = (props = {}) => render(<GridInteractionsSection {...defaultProps} {...props} />);

describe('GridInteractionsSection', () => {
    afterEach(() => {
        mockOnChange.mockClear();
    });

    it('should call onChange when toggling search', () => {
        const { getByTestId } = renderComponent();
        fireEvent.click(getByTestId('show-search-Toggle-input'));
        expect(mockOnChange).toHaveBeenCalledWith({
            ...defaultProps.control,
            isSearchable: true,
        });
    });

    it('should call onChange when toggling sort', () => {
        const { getByTestId } = renderComponent();
        fireEvent.click(getByTestId('show-sort-Toggle-input'));
        expect(mockOnChange).toHaveBeenCalledWith({
            ...defaultProps.control,
            showSort: true,
        });
    });

    it('should call onChange when toggling export', () => {
        const { getByTestId } = renderComponent();
        fireEvent.click(getByTestId('show-export-Toggle-input'));
        expect(mockOnChange).toHaveBeenCalledWith({
            ...defaultProps.control,
            showExport: true,
        });
    });

    it('should call onChange when toggling refresh', () => {
        const { getByTestId } = renderComponent();
        fireEvent.click(getByTestId('show-refresh-Toggle-input'));
        expect(mockOnChange).toHaveBeenCalledWith({
            ...defaultProps.control,
            showRefresh: true,
        });
    });

    it('should call onChange when toggling select records', () => {
        const { getByTestId } = renderComponent();
        fireEvent.click(getByTestId('show-row-select-Toggle-input'));
        expect(mockOnChange).toHaveBeenCalledWith({
            ...defaultProps.control,
            isSelectable: true,
        });
    });

    it('should call onChange when toggling reorder columns', () => {
        const { getByTestId } = renderComponent();
        fireEvent.click(getByTestId('show-reorder-columns-Toggle-input'));
        expect(mockOnChange).toHaveBeenCalledWith({
            ...defaultProps.control,
            canReorderColumns: true,
        });
    });

    it('should call onChange when toggling add lines', () => {
        const { getByTestId } = renderComponent();
        fireEvent.click(getByTestId('can-add-more-rows-Toggle-input'));
        expect(mockOnChange).toHaveBeenCalledWith({
            ...defaultProps.control,
            canAddMoreRows: true,
        });
    });

    it('should call onChange when toggling delete records', () => {
        const { getByTestId } = renderComponent();
        fireEvent.click(getByTestId('can-delete-rows-Toggle-input'));
        expect(mockOnChange).toHaveBeenCalledWith({
            ...defaultProps.control,
            showDeleteColumn: true,
        });
    });

    it('should call onChange when toggling delete confirmation', () => {
        const { getByTestId } = renderComponent({
            control: { ...defaultProps.control, showDeleteColumn: true },
        });
        fireEvent.click(getByTestId('show-delete-confirmation-Toggle-input'));
        expect(mockOnChange).toHaveBeenCalledWith({
            ...defaultProps.control,
            showDeleteColumn: true,
            showDeleteConfirmation: true,
        });
    });
});