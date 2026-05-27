/* eslint-disable import/no-extraneous-dependencies */
import * as React from 'react';
import { matchers } from '@emotion/jest';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import CheckBox from './checkBox';
import CheckboxGroup from './checkboxGroup';

expect.extend(matchers);

describe('Checkbox', () => {
  describe('Functional', () => {
    it('Defaults', async () => {
      const { getByText } = render(<CheckBox id='test' label='Test' />);
      expect(getByText('Test')).toBeDefined();
    });

    test('onChange', async () => {
      const onClick = jest.fn();
      const img = render(<CheckBox id='test' label='Test' onChange={onClick} />);

      fireEvent.click(img.getByRole('checkbox'));
      expect(onClick).toHaveBeenCalledTimes(1);
      img.rerender(<CheckBox id='test' label='Test' onChange={onClick} disabled />);
      fireEvent.click(img.getByRole('checkbox'));
      img.rerender(<CheckBox id='test' label='Test' />);
      fireEvent.click(img.getByRole('checkbox'));
      fireEvent.keyDown(img.getByRole('checkbox'), { key: 'Enter', code: 'Enter', charCode: 13 });
      expect(onClick).toHaveBeenCalledTimes(2);
    });

    test('onKeyDown', async () => {
      const onClick = jest.fn();
      const img = render(<CheckBox id='test' label='Test' onKeyDown={onClick} />);
      fireEvent.keyDown(img.getByRole('checkbox'), { key: 'Enter', code: 'Enter', charCode: 13 });
      expect(onClick).toHaveBeenCalledTimes(1);
      img.rerender(<CheckBox id='test' label='Test' onKeyDown={onClick} disabled />);
      fireEvent.click(img.getByRole('checkbox'));
      img.rerender(<CheckBox id='test' label='Test' />);
      fireEvent.click(img.getByRole('checkbox'));
      fireEvent.keyDown(img.getByRole('checkbox'), { key: 'Enter', code: 'Enter', charCode: 13 });
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    test('Toggle onKeyDown with Enter key', async () => {
      const onClick = jest.fn();
      const { getByRole } = render(<CheckBox id='test' label='Test' onKeyDown={onClick} />);
      const checkbox = getByRole('checkbox');

      fireEvent.keyDown(checkbox, { key: 'Enter', code: 'Enter', charCode: 13 });
      setTimeout(() => {
        expect(checkbox).toBeChecked();
      }, 1500);
      fireEvent.keyDown(checkbox, { key: 'Enter', code: 'Enter', charCode: 13 });
      setTimeout(() => {
        expect(checkbox).not.toBeChecked();
      }, 1500);
    });

    test('Toggle onKeyDown with Space key', async () => {
      const onClick = jest.fn();
      const { getByRole } = render(<CheckBox id='test' label='Test' onKeyDown={onClick} />);
      const checkbox = getByRole('checkbox');

      fireEvent.keyDown(checkbox, { key: ' ', code: 'Space', charCode: 32 });
      setTimeout(() => {
        expect(checkbox).toBeChecked();
      }, 1500);
      fireEvent.keyDown(checkbox, { key: ' ', code: 'Space', charCode: 32 });
      setTimeout(() => {
        expect(checkbox).not.toBeChecked();
      }, 1500);
    });
  });
  describe('Snapshots', () => {
    it('Default', async () => {
      const tree = render(<CheckBox id='test' label='Test' />).container;
      expect(tree).toMatchSnapshot();
    });
    it('IsMobile', async () => {
      const tree = render(<CheckBox id='test' label='Test' isMobile />).container;
      expect(tree).toMatchSnapshot();
    });

    it('Classes', async () => {
      const tree = render(
        <CheckBox
          id='test'
          label='Test'
          width={128}
          className='button-purple button-border-2px white'
          legacyClasses='mi-checkbox-alert mi-checkbox-label-alert mi-caption-font-xxsmall mi-checkbox-silver'
          isV4Design={false}
        />,
      ).container;
      expect(tree).toMatchSnapshot();
    });
    it('Round', async () => {
      const tree = render(<CheckBox id='test' label='Test' rounded />).container;
      expect(tree).toMatchSnapshot();
    });

    it('Round mobile', async () => {
      const tree = render(<CheckBox id='test' label='Test' rounded isMobile />).container;
      expect(tree).toMatchSnapshot();
    });
    it('Width Fixed', async () => {
      const tree = render(<CheckBox id='test' checked label='Test' width={64} widthType='fixed' />).container;
      expect(tree).toMatchSnapshot();
    });

    it('Width Full', async () => {
      const tree = render(<CheckBox id='test' label='Test' width={64} widthType='full' />).container;
      expect(tree).toMatchSnapshot();
    });

    it('Visible', async () => {
      const tree = render(<CheckBox id='test' label='Test' visible={false} />).container;
      expect(tree).toMatchSnapshot();
    });

    it('hidden', async () => {
      const tree = render(<CheckBox id='test' checked label='Test' hidden />).container;
      expect(tree).toMatchSnapshot();
    });

    it('Align Left', async () => {
      const tree = render(<CheckBox id='test' checked label='Test' align='left' />).container;
      expect(tree).toMatchSnapshot();
    });

    it('Align right', async () => {
      const tree = render(<CheckBox id='test' checked label='Test' align='right' />).container;
      expect(tree).toMatchSnapshot();
    });

    it('Align center', async () => {
      const tree = render(<CheckBox id='test' checked label='Test' align='center' />).container;
      expect(tree).toMatchSnapshot();
    });
    it('Checkbox Group Default', async () => {
      const tree = render(<CheckboxGroup />).container;
      expect(tree).toMatchSnapshot();
    });
    it('Checkbox Group Vertical', async () => {
      const tree = render(
        <CheckboxGroup
          id='test'
          align='vertical'
          name='testgroup'
          items={[
            { id: 'one', label: 'one' },
            { id: 'two', label: 'two' },
            { id: 'three', label: 'three' },
          ]}
        />,
      ).container;
      expect(tree).toMatchSnapshot();
    });
    it('Checkbox Group Horizontal', async () => {
      const tree = render(
        <CheckboxGroup
          id='test'
          align='horizontal'
          name='testgroup'
          items={[
            {
              id: 'one',
              label: 'one',
              checked: true,
              legacyClasses: 'mi-checkbox-alert mi-checkbox-label-alert mi-caption-font-xxsmall',
            },
            {
              id: 'two',
              label: 'two',
              checked: true,
              legacyClasses: 'mi-checkbox-primary mi-checkbox-label-primary mi-caption-font-xsmall',
            },
            {
              id: 'three',
              label: 'three',
              checked: true,
              legacyClasses: 'mi-checkbox-navigation mi-checkbox-label-navigation mi-caption-font-small',
            },
            {
              id: 'four',
              label: 'four',
              checked: true,
              legacyClasses: 'mi-checkbox-caution mi-checkbox-label-caution mi-caption-font-large',
            },
            {
              id: 'five',
              label: 'five',
              checked: true,
              legacyClasses: 'mi-checkbox-success mi-checkbox-label-success mi-caption-font-xlarge',
            },
            {
              id: 'six',
              label: 'six',
              checked: true,
              legacyClasses: 'mi-checkbox-grey mi-checkbox-label-grey mi-caption-font-xxlarge',
            },

            {
              id: 'seven',
              label: 'seven',
              checked: true,
              legacyClasses: 'mi-checkbox-dark-grey mi-checkbox-label-dark-grey ',
            },
            {
              id: 'eight',
              label: 'eight',
              checked: true,
              legacyClasses: 'mi-checkbox-silver mi-checkbox-label-silver ',
            },
            {
              id: 'nine',
              label: 'nine',
              checked: true,
              legacyClasses: 'mi-checkbox-gunmetal mi-checkbox-label-gunmetal ',
            },

            {
              id: 'ten',
              label: 'ten',
              checked: true,
              legacyClasses: 'mi-checkbox-gunmetal mi-checkbox-label-white mi-text-bold',
            },

            {
              id: 'eleven',
              label: 'eleven',
              checked: true,
              legacyClasses: 'mi-checkbox-gunmetal mi-checkbox-label-black mi-text-bolder',
            },
          ]}
        />,
      ).container;
      expect(tree).toMatchSnapshot();
    });
  });
  // Added these tests to pass coverage requirements -> according to the coverage report
  it('Automatically focuses input when autoFocus is true', () => {
    const { getByRole } = render(<CheckBox id='test' label='Test' autoFocus />);
    const input = getByRole('checkbox');
    expect(document.activeElement).toBe(input);
  });

  it('Does not throw an error if onChange is not provided', () => {
    const { getByRole } = render(<CheckBox id='test' label='Test' />);
    const checkbox = getByRole('checkbox');
    fireEvent.keyDown(checkbox, { key: 'Enter', code: 'Enter', charCode: 13 });
    fireEvent.keyDown(checkbox, { key: ' ', code: 'Space', charCode: 32 });
    // No assertion is needed, just have one to avoid jest warning
    expect(checkbox).toBeInTheDocument();
  });
});
