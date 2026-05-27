/* eslint-disable import/no-extraneous-dependencies */
import * as React from 'react';
import { matchers } from '@emotion/jest';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Dialog from './dialog';

expect.extend(matchers);

describe('Functional', () => {
  test('Message Only', async () => {
    const mockCloseCallback = jest.fn();
    const mockDismissCallback = jest.fn();

    const { getByText, getByLabelText } = render(
      <Dialog
        title='Leave app builder without saving'
        isOpen
        onClose={mockCloseCallback}
        onDismiss={mockDismissCallback}
        footer={{
          primaryButtonLabel: "Don't save and close",
        }}
      >
        <div>
          You have not saved this screen since you last made changes to it. Leaving the app builder without saving will
          result in your changes being lost.
        </div>
      </Dialog>,
    );
    let text = getByText('Leave app builder without saving');
    expect(text).toBeDefined();

    text = getByText(
      'You have not saved this screen since you last made changes to it. Leaving the app builder without saving will result in your changes being lost.',
    );
    expect(text).toBeDefined();
    const close = getByLabelText('close-V4 icon');
    expect(close).toBeDefined();
    fireEvent.click(close);
    expect(mockCloseCallback.mock.calls).toHaveLength(1);
    expect(mockDismissCallback.mock.calls).toHaveLength(1);
  });

  test('Not Open', async () => {
    const { queryByText } = render(
      <Dialog id='test' title='Leave app builder without saving'>
        <div>
          You have not saved this screen since you last made changes to it. Leaving the app builder without saving will
          result in your changes being lost.
        </div>
      </Dialog>,
    );

    const text = queryByText(
      'You have not saved this screen since you last made changes to it. Leaving the app builder without saving will result in your changes being lost.',
    );
    expect(text).toBeNull();
  });

  test('With Primary Button', async () => {
    const mockPrimaryCallback = jest.fn();

    const { getByText } = render(
      <Dialog
        id='test'
        title='Leave app builder without saving'
        isOpen
        hideDismissButton
        footer={{
          primaryButtonLabel: "Don't save and close",
          onPrimaryButtonClick: mockPrimaryCallback,
        }}
      >
        <div>
          You have not saved this screen since you last made changes to it. Leaving the app builder without saving will
          result in your changes being lost.
        </div>
      </Dialog>,
    );

    let text = getByText('Leave app builder without saving');
    expect(text).toBeDefined();

    text = getByText(
      'You have not saved this screen since you last made changes to it. Leaving the app builder without saving will result in your changes being lost.',
    );
    expect(text).toBeDefined();

    const button = getByText("Don't save and close");
    fireEvent.click(button);
    expect(mockPrimaryCallback.mock.calls).toHaveLength(1);
  });

  test('With Primary Button and Secondary Button', async () => {
    const mockPrimaryCallback = jest.fn();
    const mockSecondaryCallback = jest.fn();

    const { getByText } = render(
      <Dialog
        id='test'
        title='Leave app builder without saving'
        isOpen
        footer={{
          primaryButtonLabel: "Don't save and close",
          onPrimaryButtonClick: mockPrimaryCallback,
          secondaryButtonLabel: 'Cancel',
          onSecondaryButtonClick: mockSecondaryCallback,
        }}
      >
        <div>
          You have not saved this screen since you last made changes to it. Leaving the app builder without saving will
          result in your changes being lost.
        </div>
      </Dialog>,
    );
    let text = getByText('Leave app builder without saving');
    expect(text).toBeDefined();

    text = getByText(
      'You have not saved this screen since you last made changes to it. Leaving the app builder without saving will result in your changes being lost.',
    );
    expect(text).toBeDefined();

    const button = getByText("Don't save and close");
    fireEvent.click(button);
    expect(mockPrimaryCallback.mock.calls).toHaveLength(1);

    const button2 = getByText('Cancel');
    fireEvent.click(button2);
    expect(mockSecondaryCallback.mock.calls).toHaveLength(1);
  });

  test('With Primary Button and Secondary Button no id', async () => {
    const mockPrimaryCallback = jest.fn();
    const mockSecondaryCallback = jest.fn();

    const { getByText } = render(
      <Dialog
        title='Leave app builder without saving'
        isOpen
        footer={{
          primaryButtonLabel: "Don't save and close",
          onPrimaryButtonClick: mockPrimaryCallback,
          secondaryButtonLabel: 'Cancel',
          onSecondaryButtonClick: mockSecondaryCallback,
        }}
      >
        <div>
          You have not saved this screen since you last made changes to it. Leaving the app builder without saving will
          result in your changes being lost.
        </div>
      </Dialog>,
    );
    let text = getByText('Leave app builder without saving');
    expect(text).toBeDefined();

    text = getByText(
      'You have not saved this screen since you last made changes to it. Leaving the app builder without saving will result in your changes being lost.',
    );
    expect(text).toBeDefined();

    const button = getByText("Don't save and close");
    fireEvent.click(button);
    expect(mockPrimaryCallback.mock.calls).toHaveLength(1);

    const button2 = getByText('Cancel');
    fireEvent.click(button2);
    expect(mockSecondaryCallback.mock.calls).toHaveLength(1);
  });
});
