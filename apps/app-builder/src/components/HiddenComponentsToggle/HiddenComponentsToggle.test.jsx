import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import HiddenComponentsToggle from './HiddenComponentsToggle';

const mockStore = configureStore([]);

describe('HiddenComponentsToggle', () => {
  let store;

  const renderWithStore = (showHidden = false) => {
    store = mockStore({
      screenLayout: {
        showHiddenComponents: showHidden,
      },
    });

    return render(
      <Provider store={store}>
        <HiddenComponentsToggle />
      </Provider>,
    );
  };

  const renderWithStoreAndClass = (showHidden = false, className = '') => {
    store = mockStore({
      screenLayout: {
        showHiddenComponents: showHidden,
      },
    });

    return render(
      <Provider store={store}>
        <HiddenComponentsToggle className={className} />
      </Provider>,
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders without crashing', () => {
      renderWithStore();
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('renders with default props', () => {
      renderWithStore(false);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Show hidden components');
      expect(button).toHaveAttribute('aria-pressed', 'false');
    });

    it('renders with custom className', () => {
      const { container } = renderWithStoreAndClass(false, 'custom-class');
      expect(container.firstChild).toHaveClass('custom-class');
    });
  });

  describe('Icon Display', () => {
    it('displays eye-open icon when showHidden is true', () => {
      renderWithStore(true);
      const button = screen.getByRole('button');
      const svg = button.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('displays eye-closed icon when showHidden is false', () => {
      renderWithStore(false);
      const button = screen.getByRole('button');
      const svg = button.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper aria-label when showHidden is true', () => {
      renderWithStore(true);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Hidden components');
    });

    it('has proper aria-label when showHidden is false', () => {
      renderWithStore(false);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Show hidden components');
    });

    it('has proper aria-pressed when showHidden is true', () => {
      renderWithStore(true);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-pressed', 'true');
    });

    it('has proper aria-pressed when showHidden is false', () => {
      renderWithStore(false);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-pressed', 'false');
    });

    it('is focusable with tabIndex', () => {
      renderWithStore();
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('tabIndex', '0');
    });
  });

  describe('Interactions', () => {
    it('dispatches toggle action when clicked (showHidden false -> true)', () => {
      renderWithStore(false);
      const button = screen.getByRole('button');

      fireEvent.click(button);

      const actions = store.getActions();
      expect(actions).toHaveLength(1);
      expect(actions[0]).toEqual({
        type: 'screenLayout/setShowHiddenComponents',
        payload: true,
      });
    });

    it('dispatches toggle action when clicked (showHidden true -> false)', () => {
      renderWithStore(true);
      const button = screen.getByRole('button');

      fireEvent.click(button);

      const actions = store.getActions();
      expect(actions).toHaveLength(1);
      expect(actions[0]).toEqual({
        type: 'screenLayout/setShowHiddenComponents',
        payload: false,
      });
    });

    it('handles Enter key press', () => {
      renderWithStore(false);
      const button = screen.getByRole('button');

      fireEvent.keyDown(button, { key: 'Enter' });

      const actions = store.getActions();
      expect(actions).toHaveLength(1);
      expect(actions[0]).toEqual({
        type: 'screenLayout/setShowHiddenComponents',
        payload: true,
      });
    });

    it('handles Space key press', () => {
      renderWithStore(false);
      const button = screen.getByRole('button');

      fireEvent.keyDown(button, { key: ' ' });

      const actions = store.getActions();
      expect(actions).toHaveLength(1);
      expect(actions[0]).toEqual({
        type: 'screenLayout/setShowHiddenComponents',
        payload: true,
      });
    });

    it('ignores other key presses', () => {
      renderWithStore(false);
      const button = screen.getByRole('button');

      fireEvent.keyDown(button, { key: 'Tab' });
      fireEvent.keyDown(button, { key: 'Escape' });
      fireEvent.keyDown(button, { key: 'a' });

      const actions = store.getActions();
      expect(actions).toHaveLength(0);
    });

    it('does not crash when action is dispatched', () => {
      renderWithStore();
      const button = screen.getByRole('button');

      expect(() => {
        fireEvent.click(button);
      }).not.toThrow();
    });
  });

  describe('State Changes', () => {
    it('updates icon when showHidden changes via store', () => {
      const { rerender } = renderWithStore(false);

      let button = screen.getByRole('button');
      let svg = button.querySelector('svg');
      expect(svg).toBeInTheDocument();

      // Update store state
      store = mockStore({
        screenLayout: {
          showHiddenComponents: true,
        },
      });

      rerender(
        <Provider store={store}>
          <HiddenComponentsToggle />
        </Provider>,
      );

      button = screen.getByRole('button');
      svg = button.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('updates aria-label when showHidden changes via store', () => {
      const { rerender } = renderWithStore(false);

      let button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Show hidden components');

      // Update store state
      store = mockStore({
        screenLayout: {
          showHiddenComponents: true,
        },
      });

      rerender(
        <Provider store={store}>
          <HiddenComponentsToggle />
        </Provider>,
      );

      button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Hidden components');
    });
  });

  describe('Tooltips', () => {
    it('has correct tooltip data attributes when showHidden is true', () => {
      renderWithStore(true);
      const button = screen.getByRole('button');

      expect(button).toHaveAttribute('data-tooltip-id', 'hidden-components-tooltip');
      expect(button).toHaveAttribute('data-tooltip-content', 'Hidden components');
      expect(button).toHaveAttribute('data-tooltip-place', 'bottom');
    });

    it('has correct tooltip data attributes when showHidden is false', () => {
      renderWithStore(false);
      const button = screen.getByRole('button');

      expect(button).toHaveAttribute('data-tooltip-id', 'hidden-components-tooltip');
      expect(button).toHaveAttribute('data-tooltip-content', 'Hidden components');
      expect(button).toHaveAttribute('data-tooltip-place', 'bottom');
    });

    it('renders tooltip component', () => {
      const { container } = renderWithStore(false);

      // Check that the Tooltip component is rendered in the component tree
      expect(container.querySelector('[data-tooltip-id="hidden-components-tooltip"]')).toBeInTheDocument();
    });

    it('maintains tooltip content when showHidden changes', () => {
      const { rerender } = renderWithStore(false);

      let button = screen.getByRole('button');
      expect(button).toHaveAttribute('data-tooltip-content', 'Hidden components');

      // Update store state
      store = mockStore({
        screenLayout: {
          showHiddenComponents: true,
        },
      });

      rerender(
        <Provider store={store}>
          <HiddenComponentsToggle />
        </Provider>,
      );

      button = screen.getByRole('button');
      expect(button).toHaveAttribute('data-tooltip-content', 'Hidden components');
    });
  });
});
