/* eslint-disable import/no-extraneous-dependencies */
import * as React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { matchers } from '@emotion/jest';
import { colors } from '@m-next/styles';
import Pill from './pill';

expect.extend(matchers);
it('Pill defaults', async () => {
  const result = render(<Pill> </Pill>);
  const text = result.getByTestId('pill-text-null');
  expect(text).toHaveTextContent('');
  const textId = result.container.querySelector('#pill-text-null');
  expect(textId).toBeDefined();
  expect(textId).toHaveTextContent('');
});

it('Displays message', async () => {
  const { getByText } = render(<Pill>hi</Pill>);
  const text = getByText('hi');
  expect(text).toBeDefined();
});

it('Displays message and dot', async () => {
  const result = render(<Pill leadIcon={{ name: 'dot' }}>hi</Pill>);
  const text = result.getByText('hi');
  expect(text).toBeDefined();

  const dot = result.container.querySelector('#pill-dot-null');
  expect(dot).toBeDefined();
  expect(dot.classList.contains('pill-lead-icon--dot')).toBe(true);
  expect(dot).toHaveStyleRule('width', '8px');
});

it('Displays message and icon', async () => {
  const result = render(<Pill leadIcon={{ name: 'caret-down' }}>hi</Pill>);
  const text = result.getByText('hi');
  expect(text).toBeDefined();

  const dot = result.container.querySelector('#pill-dot-icon-null'); // Updated the ID selector
  expect(dot).toBeDefined();
  expect(dot.classList.contains('pill-lead-icon--dot')).toBe(false);
});

it('Displays message and dot and no tooltip', async () => {
  const result = render(<Pill leadIcon={{ name: 'user', showTooltip: false }}>hi</Pill>);
  const text = result.getByText('hi');
  expect(text).toBeDefined();

  const icon = result.container.querySelector('.pill-lead-icon-no-tooltip');
  expect(icon).toBeDefined();
  expect(icon.classList.contains('pill-lead-icon-no-tooltip')).toBe(true);
});

it('leadIcon with showTooltip true', () => {
  const result = render(<Pill leadIcon={{ name: 'user', showTooltip: true, label: 'User Icon' }}>hi</Pill>);
  const text = result.getByText('hi');
  expect(text).toBeDefined();

  const tooltip = result.container.querySelector('.tooltip-text');
  expect(tooltip).toBeDefined();
  expect(tooltip).toHaveTextContent('User Icon');
});

it('leadIcon without tooltip click handler when hasClick is true', () => {
  const mockOnClick = jest.fn();
  const result = render(
    <Pill onClick={mockOnClick} leadIcon={{ name: 'user', showTooltip: false }}>
      hi
    </Pill>,
  );

  const icon = result.container.querySelector('.pill-lead-icon-no-tooltip');
  expect(icon).toBeDefined();
  icon.click();
  expect(mockOnClick).toHaveBeenCalledTimes(1);
});

it('Displays message and dot on mobile', async () => {
  const result = render(
    <Pill isMobile leadIcon={{ name: 'dot' }}>
      hi
    </Pill>,
  );
  const text = result.getByText('hi');
  expect(text).toBeDefined();

  const dot = result.container.querySelector('#pill-dot-null');
  expect(dot).toBeDefined();
  expect(dot.classList.contains('pill-lead-icon--dot')).toBe(true);
  expect(dot).toHaveStyleRule('width', '16px');
});

it('Displays variant solid', async () => {
  const result = render(
    <Pill id='test' variant='solid'>
      hi
    </Pill>,
  );
  const wrapper = result.container.querySelector('#test');
  expect(wrapper).toHaveStyleRule('background-color', colors['blue-light']);
});

it('Displays size narrow', async () => {
  const result = render(
    <Pill id='test' size='narrow' leadIcon={{ name: 'dot' }}>
      hi
    </Pill>,
  );
  const wrapper = result.container.querySelector('#test');
  expect(wrapper).toHaveStyleRule('padding', '0 8px');
  expect(wrapper).toHaveStyleRule('border-radius', '8px');
  const text = result.getByText('hi');
  expect(text).toHaveStyleRule('font-size', '12px');
  expect(text).toHaveStyleRule('line-height', '16px');
  expect(text).toHaveStyleRule('padding', '0 2px');

  const dot = result.container.querySelector('#pill-dot-test');
  expect(dot).toHaveStyleRule('width', '8px');
  expect(dot).toHaveStyleRule('height', '8px');
});

it('Invalid Varient Error', async () => {
  jest.spyOn(console, 'error').mockImplementation(() => jest.fn());

  expect(() => render(<Pill variant='chicken'>hi</Pill>)).toThrow(
    "Invalid prop `variant` in 'Pill' component. `variant` should be one of [ 'subtle', 'solid' ] string values.",
  );
});

it('Invalid Size Error', async () => {
  jest.spyOn(console, 'error').mockImplementation(() => jest.fn());

  expect(() => render(<Pill size='large'>hi</Pill>)).toThrow(
    "Invalid prop `size` in 'Pill' component. `size` must be one of [ 'simple', 'narrow' ] string values.",
  );
});

it('Invalid ColorScheme Error', async () => {
  jest.spyOn(console, 'error').mockImplementation(() => jest.fn());

  let message = "Invalid prop `colorScheme` in 'Pill' component. `colorScheme` must be one of: ";
  message +=
    '\n[ "blue" , "green" , "fuchsia" , "grey" , "yellow" , "red" , "purple" , "orange" , "teal" ,"transparent", "v4-blue", "v4-red", "v4-yellow", "v4-purple", "v4-green", "v4-gray", "v4-orange" ]';
  message += '\nUse the `variant` prop to set the shade to "subtle" (lighter) or "solid" (light).';
  expect(() => render(<Pill colorScheme='rainbow'>hi</Pill>)).toThrow(message);
});

it('Variants', () => {
  const variants = ['subtle', 'solid', 'ghost'];

  const colorsVariants = [
    'blue',
    'green',
    'fuchsia',
    'grey',
    'yellow',
    'red',
    'purple',
    'orange',
    'teal',
    'transparent',
    'v4-blue',
    'v4-red',
    'v4-yellow',
    'v4-purple',
    'v4-green',
    'v4-gray',
    'v4-orange',
  ];

  variants.forEach((variant) => {
    colorsVariants.forEach((color) => {
      expect(
        render(
          <Pill variant={variant} colorScheme={color} leadIcon={{ name: 'dot' }}>
            hi
          </Pill>,
        ).container,
      ).toMatchSnapshot();
      expect(
        render(
          <Pill variant={variant} colorScheme={color}>
            hi
          </Pill>,
        ).container,
      ).toMatchSnapshot();
      expect(
        render(
          <Pill variant={variant} colorScheme={color} trailIcon={{ name: 'dot' }}>
            hi
          </Pill>,
        ).container,
      ).toMatchSnapshot();
    });
  });
});

it('Disabled', () => {
  expect(
    render(
      <Pill disabled trailIcon={{ name: 'dot' }} leadIcon={{ name: 'dot' }}>
        hi
      </Pill>,
    ).container,
  ).toMatchSnapshot();

  expect(
    render(
      <Pill disabled trailIcon={{ name: 'dot' }} leadIcon={{ name: 'dot' }} onClick={() => {}} onDelete={() => {}}>
        hi
      </Pill>,
    ).container,
  ).toMatchSnapshot();
});

it('Enabled', () => {
  expect(
    render(
      <Pill trailIcon={{ name: 'dot' }} leadIcon={{ name: 'dot' }}>
        hi
      </Pill>,
    ).container,
  ).toMatchSnapshot();

  expect(
    render(
      <Pill trailIcon={{ name: 'dot' }} leadIcon={{ name: 'dot' }} onClick={() => {}} onDelete={() => {}}>
        hi
      </Pill>,
    ).container,
  ).toMatchSnapshot();
});

it('Icons', () => {
  expect(
    render(
      <Pill bold trailIcon={{ name: 'search' }}>
        hi
      </Pill>,
    ).container,
  ).toMatchSnapshot();
  expect(
    render(
      <Pill bold leadIcon={{ name: 'search' }}>
        hi
      </Pill>,
    ).container,
  ).toMatchSnapshot();

  expect(
    render(
      <Pill bold trailIcon={{ name: 'search', size: 12 }}>
        hi
      </Pill>,
    ).container,
  ).toMatchSnapshot();
  expect(
    render(
      <Pill bold leadIcon={{ name: 'search', size: 12 }}>
        hi
      </Pill>,
    ).container,
  ).toMatchSnapshot();
});
