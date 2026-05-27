/**
 * Action Execution Tests for ButtonWrapperRedux
 *
 * Tests the new action execution functionality in ButtonWrapperRedux.v2
 * Demonstrates how to test wrappers with action support.
 *
 * @module wrappers/__tests__/ButtonWrapperRedux.action.test
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import ButtonWrapperRedux from '../ButtonWrapperRedux';
import { createMockActionHandler } from '../../actions/testing';
import { createSuccessResult, createErrorResult } from '../../actions';

// Mock Redux store
const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      screenLayout: (state = initialState.screenLayout || {}) => state,
    },
    preloadedState: initialState,
  });
};

describe('ButtonWrapperRedux - Action Execution', () => {
  const mockControlState = {
    screenLayout: {
      controls: {
        btn_test: {
          id: 'btn_test',
          type: 'button',
          name: 'btn_test',
          caption: 'Test Button',
          visible: true,
          disabled: false,
          onClick: {
            id: 'action_1',
            steps: [
              {
                type: 'ShowMessage',
                parameters: { message: 'Button clicked!' },
              },
            ],
          },
        },
      },
    },
  };

  describe('Designer Mode', () => {
    it('should call onControlClick when clicked in designer mode', () => {
      const mockOnControlClick = jest.fn();
      const store = createMockStore(mockControlState);

      const { getByRole } = render(
        <Provider store={store}>
          <ButtonWrapperRedux id='btn_test' mode='designer' onControlClick={mockOnControlClick} />
        </Provider>,
      );

      const button = getByRole('button');
      fireEvent.click(button);

      expect(mockOnControlClick).toHaveBeenCalledWith('btn_test');
    });

    it('should show selection outline when isSelected=true', () => {
      const store = createMockStore(mockControlState);

      const { container } = render(
        <Provider store={store}>
          <ButtonWrapperRedux id='btn_test' mode='designer' isSelected={true} onControlClick={() => {}} />
        </Provider>,
      );

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.style.outline).toBe('2px solid rgb(0, 102, 204)');
    });
  });

  describe('Runtime Mode', () => {
    it('should execute action when clicked in runtime mode', async () => {
      const mockHandler = createMockActionHandler();
      const store = createMockStore(mockControlState);

      const { getByRole } = render(
        <Provider store={store}>
          <ButtonWrapperRedux
            id='btn_test'
            mode='runtime'
            actionHandler={mockHandler}
            screenId='test_screen'
            recordId='test_record'
          />
        </Provider>,
      );

      const button = getByRole('button');
      fireEvent.click(button);

      // Wait for async action execution
      await waitFor(() => {
        expect(mockHandler.wasActionExecuted('btn_test', 'onClick')).toBe(true);
      });

      const lastAction = mockHandler.getLastAction();
      expect(lastAction).toMatchObject({
        componentId: 'btn_test',
        actionName: 'onClick',
        screenId: 'test_screen',
        recordId: 'test_record',
      });
    });

    it('should handle successful action result', async () => {
      const mockHandler = createMockActionHandler({
        defaultResult: createSuccessResult({
          messages: [{ type: 'success', message: 'Action completed!' }],
        }),
      });
      const store = createMockStore(mockControlState);

      const { getByRole } = render(
        <Provider store={store}>
          <ButtonWrapperRedux id='btn_test' mode='runtime' actionHandler={mockHandler} screenId='test_screen' />
        </Provider>,
      );

      const button = getByRole('button');
      fireEvent.click(button);

      await waitFor(() => {
        expect(mockHandler.executedActions.length).toBe(1);
      });

      // In a real runtime, messages would be displayed to user
      // Here we just verify the handler was called
      expect(mockHandler.wasActionExecuted('btn_test', 'onClick')).toBe(true);
    });

    it('should handle failed action result', async () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

      const mockHandler = createMockActionHandler({
        defaultResult: createErrorResult({
          code: 'TEST_ERROR',
          message: 'Action failed!',
        }),
      });
      const store = createMockStore(mockControlState);

      const { getByRole } = render(
        <Provider store={store}>
          <ButtonWrapperRedux id='btn_test' mode='runtime' actionHandler={mockHandler} screenId='test_screen' />
        </Provider>,
      );

      const button = getByRole('button');
      fireEvent.click(button);

      await waitFor(() => {
        expect(consoleError).toHaveBeenCalledWith(
          '[ButtonWrapper] Action execution failed:',
          expect.objectContaining({
            code: 'TEST_ERROR',
            message: 'Action failed!',
          }),
        );
      });

      consoleError.mockRestore();
    });

    it('should handle navigation result', async () => {
      const mockHandler = createMockActionHandler({
        defaultResult: createSuccessResult({
          navigation: {
            screenId: 'screen_target',
            recordId: '12345',
            mode: 'push',
          },
        }),
      });
      const store = createMockStore(mockControlState);

      const { getByRole } = render(
        <Provider store={store}>
          <ButtonWrapperRedux id='btn_test' mode='runtime' actionHandler={mockHandler} screenId='test_screen' />
        </Provider>,
      );

      const button = getByRole('button');
      fireEvent.click(button);
    });

    it('should not execute action if actionHandler is missing', async () => {
      const store = createMockStore(mockControlState);

      const { getByRole } = render(
        <Provider store={store}>
          <ButtonWrapperRedux id='btn_test' mode='runtime' screenId='test_screen' />
        </Provider>,
      );

      const button = getByRole('button');
      // Should not throw error when clicked without actionHandler
      expect(() => fireEvent.click(button)).not.toThrow();
    });

    it('should not execute action if screenId is missing', async () => {
      const mockHandler = createMockActionHandler();
      const store = createMockStore(mockControlState);

      const { getByRole } = render(
        <Provider store={store}>
          <ButtonWrapperRedux id='btn_test' mode='runtime' actionHandler={mockHandler} />
        </Provider>,
      );

      const button = getByRole('button');
      fireEvent.click(button);

      // Action should not be executed without screenId
      await waitFor(() => {
        expect(mockHandler.executedActions.length).toBe(0);
      });
    });
  });

  describe('Action Context', () => {
    it('should pass screen state to action context', async () => {
      const mockHandler = createMockActionHandler();
      const store = createMockStore(mockControlState);
      const screenState = { isDirty: true, customData: { foo: 'bar' } };

      const { getByRole } = render(
        <Provider store={store}>
          <ButtonWrapperRedux
            id='btn_test'
            mode='runtime'
            actionHandler={mockHandler}
            screenId='test_screen'
            screenState={screenState}
          />
        </Provider>,
      );

      const button = getByRole('button');
      fireEvent.click(button);

      await waitFor(() => {
        const lastAction = mockHandler.getLastAction();
        expect(lastAction?.screenState).toEqual(screenState);
      });
    });

    it('should include metadata in action context', async () => {
      const mockHandler = createMockActionHandler();
      const store = createMockStore(mockControlState);

      const { getByRole } = render(
        <Provider store={store}>
          <ButtonWrapperRedux id='btn_test' mode='runtime' actionHandler={mockHandler} screenId='test_screen' />
        </Provider>,
      );

      const button = getByRole('button');
      fireEvent.click(button);

      await waitFor(() => {
        const lastAction = mockHandler.getLastAction();
        expect(lastAction?.metadata).toBeDefined();
        expect(lastAction?.metadata?.timestamp).toBeDefined();
      });
    });
  });

  describe('Error Handling', () => {
    it('should catch and log action execution errors', async () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

      // Create handler that throws error
      const errorHandler = {
        executeAction: jest.fn().mockRejectedValue(new Error('Network error')),
      };

      const store = createMockStore(mockControlState);

      const { getByRole } = render(
        <Provider store={store}>
          <ButtonWrapperRedux id='btn_test' mode='runtime' actionHandler={errorHandler} screenId='test_screen' />
        </Provider>,
      );

      const button = getByRole('button');
      fireEvent.click(button);

      await waitFor(() => {
        expect(consoleError).toHaveBeenCalledWith('[ButtonWrapper] Error executing action:', expect.any(Error));
      });

      consoleError.mockRestore();
    });
  });
});
