/* eslint-disable import/no-extraneous-dependencies */

/**
 * @jest-environment jsdom
 */

import * as React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Banner from './banner';
import BannerContent from './bannerContent';

describe('Banner', () => {
  describe('Functional', () => {
    it('Banner defaults', async () => {
      const result = render(<Banner> </Banner>);
      const text = result.container.querySelector('#banner-content-message-');
      expect(text).toBeDefined();
      expect(text).toHaveTextContent('');
    });

    it('BannerContent defaults', async () => {
      const result = render(<BannerContent> </BannerContent>);
      const text = result.container.querySelector('#banner-content-message-');
      expect(text).toBeDefined();
      expect(text).toHaveTextContent('');
    });

    it('Banner displays message', async () => {
      const { getByText } = render(<Banner message='hi' />);
      const text = getByText('hi');
      expect(text).toBeDefined();
    });

    it('PrimaryAction is Displayed', async () => {
      const mockPrimaryCallback = jest.fn();
      const { getByText, getAllByRole } = render(
        <Banner message='hi' primaryButton='Primary' onPrimaryButtonClick={mockPrimaryCallback} />,
      );
      const text = getByText('hi');
      expect(text).toBeDefined();
      const buttons = getAllByRole('button');
      expect(buttons).toHaveLength(1);
      expect(buttons[0]).toHaveTextContent('Primary');

      fireEvent.click(buttons[0]);
      expect(mockPrimaryCallback.mock.calls).toHaveLength(1);
    });

    it('SecondaryAction is Displayed', async () => {
      const mockPrimaryCallback = jest.fn();
      const mockSecondaryCallback = jest.fn();

      const { getByText, getAllByRole } = render(
        <Banner
          message='hi'
          primaryButton='Primary'
          onPrimaryButtonClick={mockPrimaryCallback}
          secondaryButton='Secondary'
          onSecondaryButtonClick={mockSecondaryCallback}
        />,
      );
      const text = getByText('hi');
      expect(text).toBeDefined();
      const buttons = getAllByRole('button');
      expect(buttons).toHaveLength(2);
      expect(buttons[0]).toHaveTextContent('Secondary');
      expect(buttons[1]).toHaveTextContent('Primary');
      fireEvent.click(buttons[0]);
      fireEvent.click(buttons[1]);
      expect(mockPrimaryCallback.mock.calls).toHaveLength(1);
      expect(mockSecondaryCallback.mock.calls).toHaveLength(1);
    });

    it('Child Node', async () => {
      const mockPrimaryCallback = jest.fn();
      const mockSecondaryCallback = jest.fn();

      const { getByRole, getAllByRole } = render(
        <Banner
          message='hi'
          primaryButton='Primary'
          onPrimaryButtonClick={mockPrimaryCallback}
          secondaryButton='Secondary'
          onSecondaryButtonClick={mockSecondaryCallback}
        >
          <img src='catpic.jpg' alt='cat' />
        </Banner>,
      );
      const text = getByRole('img');
      expect(text).toBeDefined();

      const buttons = getAllByRole('button');
      expect(buttons).toHaveLength(2);
      expect(buttons[0]).toHaveTextContent('Secondary');
      expect(buttons[1]).toHaveTextContent('Primary');
      fireEvent.click(buttons[0]);
      fireEvent.click(buttons[1]);
      expect(mockPrimaryCallback.mock.calls).toHaveLength(1);
      expect(mockSecondaryCallback.mock.calls).toHaveLength(1);
    });

    it('Banner displays close', async () => {
      const { getByText, getByRole } = render(<Banner message='hi' hasClose />);
      const text = getByText('hi');
      expect(text).toBeDefined();

      const img = getByRole('img');
      expect(img).toBeDefined();
    });

    it('Banner with onClose close click does not hide banner', async () => {
      const mockCloseCallback = jest.fn();

      const { getByText, getByRole } = render(<Banner message='hi' hasClose onClose={mockCloseCallback} />);
      let text = getByText('hi');
      expect(text).toBeDefined();

      const img = getByRole('img');
      expect(img).toBeDefined();
      fireEvent.click(img);

      expect(mockCloseCallback.mock.calls).toHaveLength(1);
      text = getByText('hi');
      expect(text).toBeDefined();
    });

    it('Banner displays near', async () => {
      const { getByText } = render(<Banner message='hi' bannerStyle='trailing' />);
      const text = getByText('hi');
      expect(text).toBeDefined();
    });

    it('Banner displays icon for default', async () => {
      const { getByText, getByRole } = render(<Banner message='hi' icon='warning-sign' />);
      const text = getByText('hi');
      expect(text).toBeDefined();

      const img = getByRole('img');
      expect(img).toBeDefined();
    });

    it('Banner displays icon for severity=informational', async () => {
      const { getByText, getByRole } = render(<Banner severity='informational' message='hi' icon='warning-sign' />);
      const text = getByText('hi');
      expect(text).toBeDefined();

      const img = getByRole('img');
      expect(img).toBeDefined();
    });

    it('Banner displays icon for severity=error', async () => {
      const { getByText, getByRole } = render(<Banner severity='error' message='hi' icon='warning-sign' />);
      const text = getByText('hi');
      expect(text).toBeDefined();

      const img = getByRole('img');
      expect(img).toBeDefined();
    });

    it('Banner displays icon for severity=success', async () => {
      const { getByText, getByRole } = render(<Banner severity='success' message='hi' icon='warning-sign' />);
      const text = getByText('hi');
      expect(text).toBeDefined();

      const img = getByRole('img');
      expect(img).toBeDefined();
    });

    it('SecondaryAction is Displayed with severity=error', async () => {
      const mockPrimaryCallback = jest.fn();
      const mockSecondaryCallback = jest.fn();

      const { getByText, getAllByRole } = render(
        <Banner
          message='hi'
          primaryButton='Primary'
          onPrimaryButtonClick={mockPrimaryCallback}
          secondaryButton='Secondary'
          onSecondaryButtonClick={mockSecondaryCallback}
          severity='error'
        />,
      );
      const text = getByText('hi');
      expect(text).toBeDefined();
      const buttons = getAllByRole('button');
      expect(buttons).toHaveLength(2);
      expect(buttons[0]).toHaveTextContent('Secondary');
      expect(buttons[1]).toHaveTextContent('Primary');
      fireEvent.click(buttons[0]);
      fireEvent.click(buttons[1]);
      expect(mockPrimaryCallback.mock.calls).toHaveLength(1);
      expect(mockSecondaryCallback.mock.calls).toHaveLength(1);
    });

    it('SecondaryAction is Displayed with severity=success', async () => {
      const mockPrimaryCallback = jest.fn();
      const mockSecondaryCallback = jest.fn();

      const { getByText, getAllByRole } = render(
        <Banner
          message='hi'
          primaryButton='Primary'
          onPrimaryButtonClick={mockPrimaryCallback}
          secondaryButton='Secondary'
          onSecondaryButtonClick={mockSecondaryCallback}
          severity='success'
        />,
      );
      const text = getByText('hi');
      expect(text).toBeDefined();
      const buttons = getAllByRole('button');
      expect(buttons).toHaveLength(2);
      expect(buttons[0]).toHaveTextContent('Secondary');
      expect(buttons[1]).toHaveTextContent('Primary');
      fireEvent.click(buttons[0]);
      fireEvent.click(buttons[1]);
      expect(mockPrimaryCallback.mock.calls).toHaveLength(1);
      expect(mockSecondaryCallback.mock.calls).toHaveLength(1);
    });
  });
  describe('Snapshots', () => {
    test('Defaults', async () => {
      const { container } = render(<Banner message='hi' />);
      expect(container).toMatchSnapshot();
    });
    test('Success', async () => {
      const { container } = render(
        <Banner
          message='hi'
          severity='success'
          icon='warning-sign'
          primaryButton='Primary'
          secondaryButton='Secondary'
        />,
      );
      expect(container).toMatchSnapshot();
    });
    test('Error', async () => {
      const { container } = render(
        <Banner message='hi' severity='error' icon='warning-sign' primaryButton='Primary' />,
      );
      expect(container).toMatchSnapshot();
    });
    test('Warning', async () => {
      const { container } = render(
        <Banner message='hi' severity='warning' icon='warning-sign' secondaryButton='Secondary' />,
      );
      expect(container).toMatchSnapshot();
    });
    test('Clear', async () => {
      const { container } = render(<Banner message='hi' icon='warning-sign' severity='clear' />);
      expect(container).toMatchSnapshot();
    });
  });
});
