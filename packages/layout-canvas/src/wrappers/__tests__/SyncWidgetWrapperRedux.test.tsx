import React from 'react';
import { act, render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';

import { RuntimeContextProvider } from '../../contexts/RuntimeContext';
import SyncWidgetWrapperRedux from '../SyncWidgetWrapperRedux';

jest.mock('@m-next/loading-skeleton', () => ({
  __esModule: true,
  default: () => null,
}));

const mockSyncWidget = jest.fn();

jest.mock('@m-next/sync-widget', () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => {
    mockSyncWidget(props);
    const mockReact = jest.requireActual('react') as typeof import('react');
    return mockReact.createElement('div', { 'data-testid': 'sync-widget' });
  },
}));

describe('SyncWidgetWrapperRedux', () => {
  beforeEach(() => {
    mockSyncWidget.mockClear();
  });

  it('dispatches sync widget status load and renders on valid response', async () => {
    const dispatch = jest.fn();
    const store = {
      dispatch,
      getState: () => ({}),
      subscribe: () => () => undefined,
    };

    render(
      <RuntimeContextProvider
        screenKey='screen-key'
        screenId='screen-id'
        activeRecordId='record-1'
        viewFriendlyName='Invoice'
        panelName='panel'
        store={store as any}
        controls={{}}
        dataReducer={{}}
      >
        <SyncWidgetWrapperRedux id='sync-widget-1' mode='runtime' />
      </RuntimeContextProvider>,
    );

    await waitFor(() => {
      expect(dispatch).toHaveBeenCalledTimes(1);
    });

    const dispatchedAction = dispatch.mock.calls[0][0] as any;
    expect(dispatchedAction.type).toBe('MICROSERVICE_API');
    expect(dispatchedAction.microserviceApi?.endpoint).toContain('GetSyncWidgetInfoAsync');

    await act(async () => {
      dispatchedAction.microserviceApi.success({
        data: {
          syncWidgetStatus: 1,
          syncWidgetInfo: 'hello',
        },
      });
    });

    await waitFor(() => {
      expect(mockSyncWidget).toHaveBeenCalled();
    });

    const props = mockSyncWidget.mock.calls[mockSyncWidget.mock.calls.length - 1][0] as any;
    expect(props.status).toBe(1);
    expect(props.message).toBe('hello');
    expect(typeof props.fnSyncWidgetInteractionAnalytics).toBe('function');
  });

  it('does not render when response indicates no widget (status 4)', async () => {
    const dispatch = jest.fn();
    const store = {
      dispatch,
      getState: () => ({}),
      subscribe: () => () => undefined,
    };

    render(
      <RuntimeContextProvider
        screenKey='screen-key'
        screenId='screen-id'
        activeRecordId='record-1'
        viewFriendlyName='Invoice'
        panelName='panel'
        store={store as any}
        controls={{}}
        dataReducer={{}}
      >
        <SyncWidgetWrapperRedux id='sync-widget-1' mode='runtime' />
      </RuntimeContextProvider>,
    );

    await waitFor(() => {
      expect(dispatch).toHaveBeenCalledTimes(1);
    });

    const dispatchedAction = dispatch.mock.calls[0][0] as any;

    await act(async () => {
      dispatchedAction.microserviceApi.success({
        data: {
          syncWidgetStatus: 4,
          syncWidgetInfo: 'ignored',
        },
      });
    });

    expect(mockSyncWidget).not.toHaveBeenCalled();
  });

  it('renders status 5 (Synced – Requires Review) when returned by API', async () => {
    const dispatch = jest.fn();
    const store = {
      dispatch,
      getState: () => ({}),
      subscribe: () => () => undefined,
    };

    render(
      <RuntimeContextProvider
        screenKey='screen-key'
        screenId='screen-id'
        activeRecordId='record-1'
        viewFriendlyName='Invoice'
        panelName='panel'
        store={store as any}
        controls={{}}
        dataReducer={{}}
      >
        <SyncWidgetWrapperRedux id='sync-widget-1' mode='runtime' />
      </RuntimeContextProvider>,
    );

    await waitFor(() => {
      expect(dispatch).toHaveBeenCalledTimes(1);
    });

    const dispatchedAction = dispatch.mock.calls[0][0] as any;

    await act(async () => {
      dispatchedAction.microserviceApi.success({
        data: {
          syncWidgetStatus: 5,
          syncWidgetInfo: 'requires review',
        },
      });
    });

    await waitFor(() => {
      expect(mockSyncWidget).toHaveBeenCalled();
    });

    const props = mockSyncWidget.mock.calls[mockSyncWidget.mock.calls.length - 1][0] as any;
    expect(props.status).toBe(5);
    expect(props.message).toBe('requires review');
  });
});
