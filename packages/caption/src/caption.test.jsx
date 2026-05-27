/* eslint-disable import/no-extraneous-dependencies */
import * as React from 'react';
import { matchers } from '@emotion/jest';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { lightTheme } from '@m-next/styles';
import Caption from './caption';

expect.extend(matchers);
describe('LoadingSkeleton', () => {
  describe('Functional', () => {
    it('Caption defaults', async () => {
      const { getByText } = render(<Caption label='Blue Fish' />);
      const text = getByText('Blue Fish');
      expect(text).toBeDefined();
      expect(text).toHaveStyleRule('color', lightTheme.content.emphasize);
    });

    it('Is required', async () => {
      const { getByText } = render(<Caption label='Blue Fish' required />);
      let text = getByText('Blue Fish');
      expect(text).toBeDefined();

      text = getByText('*');
      expect(text).toBeDefined();
    });

    it('Is float isV4Design', async () => {
      const { getByText } = render(<Caption label='Blue Fish' isV4Design float />);
      const text = getByText('Blue Fish');
      expect(text).toBeDefined();
      expect(text).toHaveStyleRule('color', lightTheme.content.emphasize);
    });

    it('Is isV4Design not valid', async () => {
      const { getByText } = render(<Caption label='Blue Fish' isValid={false} isV4Design />);
      const text = getByText('Blue Fish');
      expect(text).toBeDefined();
      expect(text).toHaveStyleRule('color', lightTheme.content.emphasize);
    });

    it('Is float isV4Design not valid', async () => {
      const { getByText } = render(<Caption label='Blue Fish' isValid={false} isV4Design float />);
      const text = getByText('Blue Fish');
      expect(text).toBeDefined();
      expect(text).toHaveStyleRule('color', lightTheme.negative.secondary);
    });

    it('Is float isV4Design background color', async () => {
      const { getByText } = render(<Caption label='Blue Fish' background='green' isV4Design float />);
      const text = getByText('Blue Fish');
      expect(text).toBeDefined();
      expect(text).toHaveStyleRule('background-color', 'green');
    });

    it('Is float isV4Design disabled', async () => {
      const { getByText } = render(<Caption label='Blue Fish' disabled isV4Design float />);
      const text = getByText('Blue Fish');
      expect(text).toBeDefined();
      expect(text).toHaveStyleRule('color', lightTheme.content.primary);
    });

    it('Is float isV4Design ismobile', async () => {
      const { getByText } = render(<Caption label='Blue Fish' isMobile isV4Design float />);
      const text = getByText('Blue Fish');
      expect(text).toBeDefined();
      expect(text).toHaveStyleRule('font-size', '14px');
    });

    it('Is isV4Design ismobile', async () => {
      const { getByText } = render(<Caption label='Blue Fish' isMobile isV4Design />);
      const text = getByText('Blue Fish');
      expect(text).toBeDefined();
      expect(text).toHaveStyleRule('font-size', '16px');
      expect(text).toHaveStyleRule('transform', 'translateY(16px)');
    });

    it('Is floatXPosFocus', async () => {
      const { getByText } = render(<Caption label='Blue Fish' isMobile isV4Design float floatXPosFocus='2px' />);
      const text = getByText('Blue Fish');
      expect(text).toBeDefined();
      expect(text).toHaveStyleRule('transform', 'translateY(-4px) translateX(2px)');
    });

    it('Is floatXPosUnfocus', async () => {
      const { getByText } = render(<Caption label='Blue Fish' isMobile isV4Design floatXPosUnfocus='20px' />);
      const text = getByText('Blue Fish');
      expect(text).toBeDefined();
      expect(text).toHaveStyleRule('transform', 'translateY(16px) translateX(20px)');
    });
  });
  describe('Snapshots', () => {
    test('Defaults', async () => {
      const { container } = render(
        <Caption
          label='Blue Fish'
          legacyClass='mi-caption-font-xxxsmall mi-caption-alert mi-caption-left mi-text-normal'
        />,
      );
      expect(container).toMatchSnapshot();
    });
  });
});
