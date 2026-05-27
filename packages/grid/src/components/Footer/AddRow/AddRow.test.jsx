/* eslint-disable import/no-extraneous-dependencies */
import * as React from 'react';
import { matchers } from '@emotion/jest';
import { render, fireEvent } from '@testing-library/react';
import AddRow from './AddRow';

expect.extend(matchers);

describe('<AddRow />', () => {
  describe('Snapshots', () => {
    it('should render defaults', () => {
      expect(render(<AddRow />).container).toMatchSnapshot();
    });

    it('should render custom label', () => {
      expect(render(<AddRow label='New rows!' />).container).toMatchSnapshot();
    });

    it('should render disabled', () => {
      expect(render(<AddRow label='New rows!' disabled />).container).toMatchSnapshot();
    });
  });
  describe('Functional', () => {
    it('should fire event on click', () => {
      const onClick = jest.fn();
      const { getByRole } = render(<AddRow id='test' onClick={onClick} />);
      expect(onClick).not.toHaveBeenCalled();
      const button = getByRole('button');
      fireEvent.click(button);
      expect(onClick).toHaveBeenCalled();
    });

    it('disabled should not fire event on click', () => {
      const onClick = jest.fn();
      const { getByRole } = render(<AddRow id='test' disabled onClick={onClick} />);

      expect(onClick).not.toHaveBeenCalled();
      const button = getByRole('button');
      fireEvent.click(button);
      expect(onClick).not.toHaveBeenCalled();
    });

    it('should not break if no click event', () => {
      const { getByRole } = render(<AddRow id='test' />);

      const button = getByRole('button');
      fireEvent.click(button);
      expect(true).toBeTruthy();
    });
  });
});
