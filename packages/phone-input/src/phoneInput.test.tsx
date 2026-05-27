/* eslint-disable import/no-extraneous-dependencies */
import * as React from 'react';
import { matchers } from '@emotion/jest';
import { render, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom/extend-expect';
import PhoneInput, { PhoneInputProps } from './phoneInput';

expect.extend(matchers);



const setup = (props?: PhoneInputProps) => {
  const defaultProps = {
    id: 'phoneInputTest',
    value: '+14372207682',
    validationMessage: 'Something went wrong',
  };
    const utils = render(<PhoneInput {...{ ...defaultProps, ...props }} />);
  const tree = utils.container;
  return {
    tree,
    ...utils,
  };
};

describe('PhoneInput', () => {
  describe('Functional', () => {
    test('Displays number', async () => {
      const { getByDisplayValue } = setup();
      const input = getByDisplayValue('+1 (437) 220-7682');
      expect(input).toBeDefined();
    });

    test('Change fires the callback', async () => {
      const mockChangeCallback = jest.fn();
      const { getByDisplayValue } = setup({
        id: 'phoneInputTest',
        value: '+14372207682',
        defaultCountry: 'ca',
        handleChange: mockChangeCallback,
      });
      const input = getByDisplayValue('+1 (437) 220-7682');
      expect(input).toBeDefined();

      if (input) {
        fireEvent.change(input, { target: { value: '123456' } });
      }
      expect(mockChangeCallback.mock.calls).toHaveLength(1);
    });

    test('Displays validation message', async () => {
      const mockChangeCallback = jest.fn();
      const { getByText } = setup({
        id: 'phoneInputTest',
        value: '+14372207682',
        defaultCountry: 'ca',
        validationMessage: 'Something went wrong',
        handleChange: mockChangeCallback,
      });
      const message = getByText('Something went wrong');
      expect(message).toBeDefined();
    });

    test('Focus/Unfocus caption state', async () => {
      const { getByDisplayValue, getByText } = setup({
        id: 'phoneInputTest',
        value: '+14372207682',
        placeholder: 'myPlaceHolder',
      });
      const input = getByDisplayValue('+1 (437) 220-7682');

      fireEvent.focus(input);

      const captionFocused = getByText('myPlaceHolder');
      const focusStyle = window.getComputedStyle(captionFocused)['transform'];

      userEvent.clear(input);
      userEvent.type(input, '1');
      userEvent.type(input, '{backspace}');
      fireEvent.blur(input);

      const captionUnfocused = getByText('myPlaceHolder');
      const unfocusStyle = window.getComputedStyle(captionUnfocused)['transform'];

      expect(input).toBeDefined();
      expect(focusStyle).not.toEqual(unfocusStyle);
    });
  });

  describe('Snapshots', () => {
    test('Default', async () => {
      const tree = render(<PhoneInput />).container;
      expect(tree).toMatchSnapshot();
    });

    test('Change fires the callback', async () => {
      const mockChangeCallback = jest.fn();
      const { tree } = setup({ id: 'phoneInputTest', handleChange: mockChangeCallback });
      expect(tree).toMatchSnapshot();
    });

    test('Empty', async () => {
      const { tree } = setup({ id: 'phoneInputTest' });
      expect(tree).toMatchSnapshot();
    });

    test('DefaultCountry', async () => {
      const { tree } = setup({ id: 'phoneInputTest', defaultCountry: 'us' });
      expect(tree).toMatchSnapshot();
    });

    test('WithPhone', async () => {
      const { tree } = setup({ id: 'phoneInputTest', value: '+14372207682' });
      expect(tree).toMatchSnapshot();
    });

    test('DisableSearch', async () => {
      const { tree } = setup({ id: 'phoneInputTest', enableSearch: false });
      expect(tree).toMatchSnapshot();
    });

    test('ValidationMessage', async () => {
      const { tree } = setup({ id: 'phoneInputTest', validationMessage: 'Something Wrong here' });
      expect(tree).toMatchSnapshot();
    });
  });
});
