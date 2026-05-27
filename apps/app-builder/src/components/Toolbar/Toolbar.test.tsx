import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Toolbar } from './Toolbar';

describe('Toolbar', () => {
  const mockOnClick = jest.fn();

  const defaultTopButtons = [
    { id: 'add', icon: 'add', label: 'Add Component', onClick: mockOnClick },
    { id: 'print', icon: 'print', label: 'Print', onClick: mockOnClick },
  ];

  const defaultBottomButtons = [
    { id: 'settings', icon: 'settings', label: 'Settings', onClick: mockOnClick },
    { id: 'help', icon: 'help', label: 'Help', onClick: mockOnClick },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render without crashing', () => {
      const { container } = render(<Toolbar />);
      expect(container).toBeTruthy();
    });

    it('should render top buttons', () => {
      render(<Toolbar topButtons={defaultTopButtons} />);
      expect(screen.getByLabelText('Add Component')).toBeInTheDocument();
      expect(screen.getByLabelText('Print')).toBeInTheDocument();
    });

    it('should render bottom buttons', () => {
      render(<Toolbar bottomButtons={defaultBottomButtons} />);
      expect(screen.getByLabelText('Settings')).toBeInTheDocument();
      expect(screen.getByLabelText('Help')).toBeInTheDocument();
    });

    it('should render both top and bottom buttons', () => {
      render(
        <Toolbar 
          topButtons={defaultTopButtons} 
          bottomButtons={defaultBottomButtons} 
        />
      );
      expect(screen.getByLabelText('Add Component')).toBeInTheDocument();
      expect(screen.getByLabelText('Settings')).toBeInTheDocument();
    });
  });

  describe('Interaction', () => {
    it('should call onClick when button is clicked', () => {
      render(<Toolbar topButtons={defaultTopButtons} />);
      const addButton = screen.getByLabelText('Add Component');
      fireEvent.click(addButton);
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('should not call onClick when disabled button is clicked', () => {
      const disabledButtons = [
        { id: 'add', icon: 'add', label: 'Add Component', onClick: mockOnClick, disabled: true },
      ];
      render(<Toolbar topButtons={disabledButtons} />);
      const addButton = screen.getByLabelText('Add Component');
      fireEvent.click(addButton);
      expect(mockOnClick).not.toHaveBeenCalled();
    });

    it('should have proper accessibility attributes', () => {
      render(<Toolbar topButtons={defaultTopButtons} />);
      const addButton = screen.getByLabelText('Add Component');
      expect(addButton).toHaveAttribute('aria-label', 'Add Component');
      expect(addButton).toHaveAttribute('title', 'Add Component');
    });
  });

  describe('Disabled state', () => {
    it('should render disabled button with proper styling', () => {
      const disabledButtons = [
        { id: 'add', icon: 'add', label: 'Add Component', onClick: mockOnClick, disabled: true },
      ];
      render(<Toolbar topButtons={disabledButtons} />);
      const addButton = screen.getByLabelText('Add Component');
      expect(addButton).toBeDisabled();
    });

    it('should render enabled button by default', () => {
      render(<Toolbar topButtons={defaultTopButtons} />);
      const addButton = screen.getByLabelText('Add Component');
      expect(addButton).not.toBeDisabled();
    });
  });

  describe('Edge cases', () => {
    it('should handle empty button arrays', () => {
      const { container } = render(<Toolbar topButtons={[]} bottomButtons={[]} />);
      expect(container).toBeTruthy();
    });

    it('should handle undefined button props', () => {
      const { container } = render(<Toolbar />);
      expect(container).toBeTruthy();
    });

    it('should render multiple buttons in correct order', () => {
      render(<Toolbar topButtons={defaultTopButtons} />);
      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(2);
      expect(buttons[0]).toHaveAttribute('aria-label', 'Add Component');
      expect(buttons[1]).toHaveAttribute('aria-label', 'Print');
    });
  });

  describe('AI Button', () => {
    it('should render AI button when aiButtonConfig prop is provided', () => {
      const aiButtonConfig = {
        onClick: mockOnClick,
      };
      render(<Toolbar aiButtonConfig={aiButtonConfig} />);
      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(1);
    });

    it('should not render AI button when aiButtonConfig prop is not provided', () => {
      render(<Toolbar topButtons={defaultTopButtons} />);
      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(2); // only top buttons
    });

    it('should call onClick when AI button is clicked', () => {
      const aiButtonConfig = {
        onClick: mockOnClick,
      };
      render(<Toolbar aiButtonConfig={aiButtonConfig} />);
      const buttons = screen.getAllByRole('button');
      const aiButton = buttons[0];
      fireEvent.click(aiButton);
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('should not call onClick when disabled AI button is clicked', () => {
      const aiButtonConfig = {
        onClick: mockOnClick,
        disabled: true,
      };
      render(<Toolbar aiButtonConfig={aiButtonConfig} />);
      const buttons = screen.getAllByRole('button');
      const aiButton = buttons[0];
      fireEvent.click(aiButton);
      expect(mockOnClick).not.toHaveBeenCalled();
    });

    it('should render AI button after bottom buttons', () => {
      const aiButtonConfig = {
        onClick: mockOnClick,
      };
      render(
        <Toolbar 
          bottomButtons={defaultBottomButtons} 
          aiButtonConfig={aiButtonConfig}
        />
      );
      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(3); // 2 bottom buttons + 1 AI button
    });
  });
});
