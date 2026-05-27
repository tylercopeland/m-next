/* eslint-disable import/no-extraneous-dependencies */
import * as React from 'react';
import { matchers } from '@emotion/jest';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import '@testing-library/jest-dom/extend-expect';
import RadioGroup from './RadioGroup';

expect.extend(matchers);

const setup = (props) => {
  const defaultProps = {
    id: 'test',
    name: 'test',
    selectedValue: 'one',
    options: [
      {
        label: 'one',
        value: 'one',
      },
      {
        label: 'two',
        value: 'two',
      },
      {
        label: 'three',
        value: 'three',
      },
    ],
  };
  const utils = render(<RadioGroup {...{ ...defaultProps, ...props }} />);
  const tree = utils.container;
  return {
    tree,
    ...utils,
  };
};

describe('RadioGroup', () => {
  describe('Functional', () => {
    test('Fire onChange', async () => {
      const onChange = jest.fn();

      const { getByText } = setup({ onChange });
      userEvent.click(getByText('two'));

      expect(onChange).toHaveBeenCalledTimes(1);
    });
  });
  describe('Snapshots', () => {
    test('Default', async () => {
      const tree = render(<RadioGroup id='test' name='test' options={[]} />).container;
      expect(tree).toMatchSnapshot();
    });

    test('Three options isV4Design', async () => {
      const { tree } = setup();
      expect(tree).toMatchSnapshot();

      const { tree2 } = setup({ isV4Design: false });
      expect(tree2).toMatchSnapshot();
    });

    test('Three options', async () => {
      const { tree } = setup({ isV4Design: false });
      expect(tree).toMatchSnapshot();
    });

    test('Direction row', async () => {
      const { tree } = setup({ direction: 'row' });
      expect(tree).toMatchSnapshot();
      const { tree2 } = setup({ direction: 'row', isV4Design: false });
      expect(tree2).toMatchSnapshot();
    });

    test('Right Align', async () => {
      const { tree } = setup({ rightAlign: true });
      expect(tree).toMatchSnapshot();
      const { tree2 } = setup({ rightAlign: true, isV4Design: false });
      expect(tree2).toMatchSnapshot();
    });

    test('Fixed width', async () => {
      const { tree } = setup({ widthType: 'fixed', width: '40px' });
      expect(tree).toMatchSnapshot();
      const { tree2 } = setup({ widthType: 'fixed', width: '40px', isV4Design: false });
      expect(tree2).toMatchSnapshot();
    });

    test('With subtext', async () => {
      const tree = render(
        <RadioGroup
          id='test'
          name='test'
          options={[
            {
              label: 'one',
              value: 'one',
              subtext: 'subtext',
            },
            {
              label: 'two',
              value: 'two',
            },
            {
              label: 'three',
              value: 'three',
              subtext: 'subtext end',
            },
          ]}
        />,
      ).container;
      expect(tree).toMatchSnapshot();
    });

    test('With minWidth', async () => {
      const { tree } = setup({ direction: 'row', minWidth: 300 });
      expect(tree).toMatchSnapshot();
    });
  });
});
