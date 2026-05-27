/* eslint-disable import/no-extraneous-dependencies */
import * as React from 'react';
import { matchers } from '@emotion/jest';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ExampleComponent from './example';

expect.extend(matchers);

const setup = (props) => {
  const defaultProps = {
    id: 'test',
    message: 'hi',
  };
  // eslint-disable-next-line react/jsx-props-no-spreading
  const utils = render(<ExampleComponent {...{ ...defaultProps, ...props }} />);
  const tree = utils.container;
  return {
    tree,
    ...utils,
  };
};

describe('ExampleComponent', () => {
  describe('Functional', () => {
    test('Displays message', async () => {
      const { getByText } = setup();
      const text = getByText('hi');
      expect(text).toBeDefined();
    });

    test('PrimaryAction is Displayed and click fires', async () => {
      const mockPrimaryCallback = jest.fn();
      const { getByText, getAllByRole } = setup({
        primaryButton: 'Primary',
        onPrimaryButtonClick: mockPrimaryCallback,
      });
      const text = getByText('hi');
      expect(text).toBeDefined();
      const buttons = getAllByRole('button');
      expect(buttons).toHaveLength(1);
      expect(buttons[0]).toHaveTextContent('Primary');

      fireEvent.click(buttons[0]);
      expect(mockPrimaryCallback.mock.calls).toHaveLength(1);
    });
  });
  describe('Snapshots', () => {
    test('Default', async () => {
      const tree = render(<ExampleComponent />).container;
      expect(tree).toMatchSnapshot();
    });

    test('PrimaryAction is Displayed and click fires', async () => {
      const mockPrimaryCallback = jest.fn();
      const { tree } = setup({ primaryButton: 'Primary', onPrimaryButtonClick: mockPrimaryCallback });
      expect(tree).toMatchSnapshot();
    });
  });
});
