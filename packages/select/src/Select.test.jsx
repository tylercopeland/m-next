import React from 'react';
import { matchers } from '@emotion/jest';
import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Select from './Select';

expect.extend(matchers);

const setUp = (props) => {
  const defaultProps = {
    id: 'select',
    options: [
      {
        icon: 'address-lookup',
        title: 'Explore',
        description: 'Discover new ways to manage your business',
      },
    ],
    onChange: () => {},
    selectedValue: null,
  };
  const utils = render(<Select {...{ ...defaultProps, ...props }} />);
  const tree = utils.container;
  return {
    tree,
    ...utils,
  };
};

describe('Select Component', () => {
  test('Default', () => {
    const props = {
      options: [
        {
          icon: 'address-lookup',
          title: 'Explore',
          description: 'Discover new ways to manage your business',
        },
      ],
    };
    const { tree } = setUp(props);
    const wrapper = tree.querySelector('#select-wrapper');
    expect(wrapper).toBeDefined();
  });

  test('Small Version', () => {
    const props = {
      size: 'small',
    };
    const { tree } = setUp(props);
    const wrapper = tree.querySelector('#select-wrapper');
    expect(wrapper).toBeDefined();
  });

  test('No Title', () => {
    const props = {
      options: [
        {
          icon: 'address-lookup',
          description: 'Discover new ways to manage your business',
        },
      ],
    };
    const { tree } = setUp(props);
    const title = tree.querySelector('#select--title');
    expect(title).toBeNull();
  });

  test('No Description', () => {
    const props = {
      options: [
        {
          icon: 'address-lookup',
          title: 'Explore',
        },
      ],
    };
    const { tree } = setUp(props);
    const description = tree.querySelector('#select--description');
    expect(description).toBeNull();
  });

  test('Select Accessibility and Interaction', async () => {
    const onChange = jest.fn();
    const props = {
      options: [
        {
          icon: 'address-lookup',
          title: 'test',
          description: 'Discover new ways to manage your business',
        },
      ],
      onChange,
    };
    const { tree } = setUp(props);
    const option = tree.querySelector('#select-test-option-wrapper');
    expect(option).toBeVisible();
    fireEvent.click(option);

    // for accessibility
    fireEvent.keyDown(option, { key: ' ', code: 'Space' });
    fireEvent.keyDown(option, { key: 'Enter', code: 'Enter' });

    expect(onChange).toHaveBeenCalled();
  });

  test('Select Change', async () => {
    const onChange = jest.fn();
    const { container } = setUp({ onChange });
    const option = container.querySelector('#select-Explore-option-wrapper');
    fireEvent.click(option);
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  test('snapshots', () => {
    const result = setUp();
    expect(result).toMatchSnapshot();
  });
});
