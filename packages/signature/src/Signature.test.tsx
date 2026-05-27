import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Signature from './Signature';

// Mock canvas for SignaturePad
HTMLCanvasElement.prototype.getContext = jest.fn(() => (
    {
        fillRect: jest.fn(),
        clearRect: jest.fn(),
        getImageData: jest.fn(() => ({ data: [] })),
        putImageData: jest.fn(),
        createImageData: jest.fn(() => []),
        setTransform: jest.fn(),
        drawImage: jest.fn(),
        save: jest.fn(),
        fillText: jest.fn(),
        restore: jest.fn(),
        beginPath: jest.fn(),
        moveTo: jest.fn(),
        lineTo: jest.fn(),
        closePath: jest.fn(),
        stroke: jest.fn(),
        translate: jest.fn(),
        scale: jest.fn(),
        rotate: jest.fn(),
        arc: jest.fn(),
        measureText: jest.fn(() => ({ width: 0 })),
        transform: jest.fn(),
        rect: jest.fn(),
        clip: jest.fn(),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any
));

jest.mock('./ScreenCapture', () => () => ({
    generate: jest.fn(() => Promise.resolve([new Blob(), new Blob()])),
}));

window.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
}));

const windowOpenSpy = jest.spyOn(window, 'open').mockImplementation(() => null);

describe('Signature', () => {
    const uploadData = {
        name: 'Signature',
        drawing: '',
        documentId: 'mock-uuid',
        documentUrl: 'mock-url',
        signatureUrl: 'mock-url',
        drawingUrl: 'mock-url',
        ipAddress: 'mock-ip',
        isSigned: false,
        signedOn: null,
    }
    const data = {
        name: 'New signature',
        drawing: null,
        documentId: 'mock-uuid',
        documentUrl: 'mock-url',
        signatureUrl: 'mock-url',
        drawingUrl: '',
        ipAddress: '',
        isSigned: true,
        signedOn: null,
    }
    const defaultProps = {
        disabled: false,
        acceptCaption: 'Accept',
        cancelCaption: 'Cancel',
        hideCancel: false,
        displayPreferences: {},
        panelName: 'panel1',
        onAccept: jest.fn(),
        onCancel: jest.fn(),
        onUpload: jest.fn(() => Promise.resolve({ data: uploadData })),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render without crashing', () => {
        render(<Signature {...defaultProps} />);
        expect(screen.getByText(/Add a signature/)).toBeInTheDocument();
    });

    it('should not render when not visible', () => {
        render(<Signature {...defaultProps} visible={false} />);
        expect(screen.queryByText(/Add a signature/)).not.toBeInTheDocument();
    });

    it('should render a typed signature', () => {
        render(<Signature {...defaultProps} data={data} />);
        expect(screen.getByText('New signature')).toBeInTheDocument();
    });
    
    it('should render a drawn signature', () => {
        const drawnData = {
            ...data,
            drawingUrl: 'mock-url',
        }
        render(<Signature {...defaultProps} data={drawnData} />);
        expect(screen.getByText('View signed document')).toBeInTheDocument();
    });

    it('should render signature label', () => {
        render(<Signature {...defaultProps} label='Signature label'/>);
        expect(screen.getByText(/Signature label/)).toBeInTheDocument();

    });

    it('should hide cancel button', () => {
        render(<Signature {...defaultProps} hideCancel />);
        expect(screen.queryByRole('button', { name: /Cancel/ })).not.toBeInTheDocument();
    });

    it('should show the signature modal when component is clicked', () => {
        render(<Signature {...defaultProps} />);
        fireEvent.click(screen.getByText(/Add a signature/));
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByText('Type')).toBeInTheDocument();
        expect(screen.getByText('Draw')).toBeInTheDocument();
    });

    it('should display an error message if the signature is not added', () => {
        render(<Signature {...defaultProps} />);
        fireEvent.click(screen.getByText(/Add a signature/));
        fireEvent.click(screen.getByTestId('signature-widget-modalDialog-footer-primary'));
        expect(screen.getAllByText('Please type your name to continue.')).toHaveLength(2);
        fireEvent.click(screen.getByText(/Draw/));
        expect(screen.getAllByText('Please type your name to continue.')).toHaveLength(1);
        fireEvent.click(screen.getByText(/Clear/));
        fireEvent.click(screen.getByTestId('signature-widget-modalDialog-footer-primary'));
        expect(screen.getAllByText('Please draw your signature to continue.')).toHaveLength(2);
    });

    it('should dismiss an error message if the signature is added', async () => {
        render(<Signature {...defaultProps} />);
        fireEvent.click(screen.getByText(/Add a signature/));
        fireEvent.click(screen.getByTestId('signature-widget-modalDialog-footer-primary'));
        expect(screen.getAllByText('Please type your name to continue.')).toHaveLength(2);
        fireEvent.change(screen.getByTestId(/signature-text-input-Input/), { target: { value: 'New signature' } });
        expect(screen.getAllByText('Please type your name to continue.')).toHaveLength(1);
    });

    it('should display an added typed signature', () => {
        render(<Signature {...defaultProps} />);
        fireEvent.click(screen.getByText(/Add a signature/));
        expect(screen.queryByRole('dialog')).toBeInTheDocument();
        fireEvent.change(screen.getByTestId(/signature-text-input-Input/), { target: { value: 'New signature' } });
        expect(screen.getByTestId(/signature-text-input-Input/)).toHaveValue('New signature');
        fireEvent.click(screen.getByTestId('signature-widget-modalDialog-footer-primary'));
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        expect(screen.getByText('New signature')).toBeInTheDocument();
    });

    it('should handle signature editing', () => {
        render(<Signature {...defaultProps} />);
        fireEvent.click(screen.getByText(/Add a signature/));
        expect(screen.queryByRole('dialog')).toBeInTheDocument();
        const signatureInput = screen.getByTestId(/signature-text-input-Input/);
        fireEvent.change(signatureInput, { target: { value: 'New signature' } });
        fireEvent.click(screen.getByTestId('signature-widget-modalDialog-footer-primary'));
        fireEvent.click(screen.getByText(/Edit signature/));
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(signatureInput).toHaveValue('New signature');
    });

    it('should handle signature editing on enter key pressed', () => {
        render(<Signature {...defaultProps} />);
        fireEvent.click(screen.getByText(/Add a signature/));
        expect(screen.queryByRole('dialog')).toBeInTheDocument();
        fireEvent.change(screen.getByTestId(/signature-text-input-Input/), { target: { value: 'New signature' } });
        fireEvent.click(screen.getByTestId('signature-widget-modalDialog-footer-primary'));
        fireEvent.keyUp(screen.getByText(/Edit signature/), { key: 'Enter', code: 'Enter', charCode: 13 });
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByTestId(/signature-text-input-Input/)).toHaveValue('New signature');
    });

    it('should handle signature viewing', () => {
        render(<Signature {...defaultProps} data={data} />);
        expect(screen.getByText('New signature')).toBeInTheDocument();
        fireEvent.click(screen.getByText(/View signed document/));
        expect(windowOpenSpy).toHaveBeenCalledTimes(1);
        expect(windowOpenSpy).toHaveBeenCalledWith('mock-url', '_blank');
    });

    it('should call onCancel action when cancel button is clicked', () => {
        render(<Signature {...defaultProps} />);
        const cancelBtn = screen.getByRole('button', { name: /Cancel/ });
        fireEvent.click(cancelBtn);
        expect(defaultProps.onCancel).toHaveBeenCalled();
    });

    it('should show error message if trying to accept without signature', async () => {
        render(<Signature {...defaultProps} />);
        const acceptBtn = screen.getByRole('button', { name: /Accept/ });
        fireEvent.click(acceptBtn);
        await waitFor(() =>
            expect(screen.getByText('You must add a signature to continue.')).toBeInTheDocument()
        );
    });

    it('should call onAccept action after successful upload', async () => {
        render(<Signature {...defaultProps} />);
        fireEvent.click(screen.getByText(/Add a signature/));
        const signatureInput = screen.getByTestId(/signature-text-input-Input/);
        fireEvent.change(signatureInput, { target: { value: 'New signature' } });
        fireEvent.click(screen.getByTestId('signature-widget-modalDialog-footer-primary'));
        fireEvent.click(screen.getByRole('button', { name: /Accept/i }));
        await waitFor(() => expect(defaultProps.onAccept).toHaveBeenCalled());
    });
});