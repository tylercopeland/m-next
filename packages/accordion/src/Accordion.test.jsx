/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Accordion from './Accordion';

describe('@m-next/accordion', () => {
  describe('Accordion root', () => {
    it('renders children inside a container with an auto-generated id', () => {
      const { container } = render(
        <Accordion>
          <Accordion.Item id='a' title='A'>
            body
          </Accordion.Item>
        </Accordion>,
      );
      const root = container.firstChild;
      expect(root).toBeInTheDocument();
      expect(root.id).toMatch(/^m-next-accordion-\d+$/);
    });

    it('uses the provided id when given', () => {
      const { container } = render(
        <Accordion id='settings'>
          <Accordion.Item id='a' title='A'>
            body
          </Accordion.Item>
        </Accordion>,
      );
      expect(container.firstChild.id).toBe('settings');
    });

    it('emits a one-time console.warn on legacy `forwardRef` prop', () => {
      const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
      const dummyRef = { current: null };
      render(
        <Accordion forwardRef={dummyRef}>
          <Accordion.Item id='a' title='A'>
            body
          </Accordion.Item>
        </Accordion>,
      );
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('forwardRef'));
      warn.mockRestore();
    });
  });

  describe('Accordion.Item — uncontrolled', () => {
    it('renders headers as buttons with aria-expanded=false by default', () => {
      render(
        <Accordion>
          <Accordion.Item id='general' title='General'>
            general body
          </Accordion.Item>
          <Accordion.Item id='security' title='Security'>
            security body
          </Accordion.Item>
        </Accordion>,
      );
      const generalBtn = screen.getByRole('button', { name: /general/i });
      const securityBtn = screen.getByRole('button', { name: /security/i });
      expect(generalBtn.tagName).toBe('BUTTON');
      expect(generalBtn).toHaveAttribute('aria-expanded', 'false');
      expect(securityBtn).toHaveAttribute('aria-expanded', 'false');
      // Bodies should not render when collapsed.
      expect(screen.queryByText('general body')).not.toBeInTheDocument();
      expect(screen.queryByText('security body')).not.toBeInTheDocument();
    });

    it('opens an item on header click and exposes its body via role="region"', () => {
      render(
        <Accordion>
          <Accordion.Item id='general' title='General'>
            general body
          </Accordion.Item>
        </Accordion>,
      );
      const btn = screen.getByRole('button', { name: /general/i });
      fireEvent.click(btn);
      expect(btn).toHaveAttribute('aria-expanded', 'true');
      const region = screen.getByRole('region', { name: /general/i });
      expect(region).toHaveTextContent('general body');
      // aria-controls on the header must point at the body id.
      expect(btn.getAttribute('aria-controls')).toBe(region.id);
    });

    it('honors `defaultExpanded` as a single string', () => {
      render(
        <Accordion defaultExpanded='security'>
          <Accordion.Item id='general' title='General'>
            general body
          </Accordion.Item>
          <Accordion.Item id='security' title='Security'>
            security body
          </Accordion.Item>
        </Accordion>,
      );
      expect(screen.queryByText('general body')).not.toBeInTheDocument();
      expect(screen.getByText('security body')).toBeInTheDocument();
    });

    it('honors `defaultExpanded` as an array (allowMultiple required to keep them open)', () => {
      render(
        <Accordion allowMultiple defaultExpanded={['general', 'security']}>
          <Accordion.Item id='general' title='General'>
            general body
          </Accordion.Item>
          <Accordion.Item id='security' title='Security'>
            security body
          </Accordion.Item>
        </Accordion>,
      );
      expect(screen.getByText('general body')).toBeInTheDocument();
      expect(screen.getByText('security body')).toBeInTheDocument();
    });

    it('radio-style by default: opening one closes the other', () => {
      render(
        <Accordion>
          <Accordion.Item id='general' title='General'>
            general body
          </Accordion.Item>
          <Accordion.Item id='security' title='Security'>
            security body
          </Accordion.Item>
        </Accordion>,
      );
      fireEvent.click(screen.getByRole('button', { name: /general/i }));
      expect(screen.getByText('general body')).toBeInTheDocument();
      fireEvent.click(screen.getByRole('button', { name: /security/i }));
      expect(screen.queryByText('general body')).not.toBeInTheDocument();
      expect(screen.getByText('security body')).toBeInTheDocument();
    });

    it('allowMultiple: opening one leaves others open', () => {
      render(
        <Accordion allowMultiple>
          <Accordion.Item id='general' title='General'>
            general body
          </Accordion.Item>
          <Accordion.Item id='security' title='Security'>
            security body
          </Accordion.Item>
        </Accordion>,
      );
      fireEvent.click(screen.getByRole('button', { name: /general/i }));
      fireEvent.click(screen.getByRole('button', { name: /security/i }));
      expect(screen.getByText('general body')).toBeInTheDocument();
      expect(screen.getByText('security body')).toBeInTheDocument();
    });

    it('clicking an open item closes it (toggle behavior)', () => {
      render(
        <Accordion defaultExpanded='general'>
          <Accordion.Item id='general' title='General'>
            general body
          </Accordion.Item>
        </Accordion>,
      );
      const btn = screen.getByRole('button', { name: /general/i });
      expect(screen.getByText('general body')).toBeInTheDocument();
      fireEvent.click(btn);
      expect(screen.queryByText('general body')).not.toBeInTheDocument();
      expect(btn).toHaveAttribute('aria-expanded', 'false');
    });

    it('disabled items do not toggle on click', () => {
      render(
        <Accordion>
          <Accordion.Item id='billing' title='Billing' disabled>
            billing body
          </Accordion.Item>
        </Accordion>,
      );
      const btn = screen.getByRole('button', { name: /billing/i });
      fireEvent.click(btn);
      expect(btn).toHaveAttribute('aria-expanded', 'false');
      expect(screen.queryByText('billing body')).not.toBeInTheDocument();
    });

    it('renders an icon when provided', () => {
      render(
        <Accordion>
          <Accordion.Item id='general' title='General' icon={<span data-testid='icon'>★</span>}>
            body
          </Accordion.Item>
        </Accordion>,
      );
      expect(screen.getByTestId('icon')).toBeInTheDocument();
    });
  });

  describe('Accordion.Item — controlled', () => {
    it('honors `expanded` prop and fires onExpandedChange without mutating internal state', () => {
      const handleChange = jest.fn();
      const { rerender } = render(
        <Accordion expanded={['general']} onExpandedChange={handleChange}>
          <Accordion.Item id='general' title='General'>
            general body
          </Accordion.Item>
          <Accordion.Item id='security' title='Security'>
            security body
          </Accordion.Item>
        </Accordion>,
      );
      expect(screen.getByText('general body')).toBeInTheDocument();
      expect(screen.queryByText('security body')).not.toBeInTheDocument();

      fireEvent.click(screen.getByRole('button', { name: /security/i }));
      // Radio-style: opening security would close general, so next = ['security'].
      expect(handleChange).toHaveBeenCalledWith(['security']);
      // Internal state did NOT change (controlled).
      expect(screen.getByText('general body')).toBeInTheDocument();
      expect(screen.queryByText('security body')).not.toBeInTheDocument();

      rerender(
        <Accordion expanded={['security']} onExpandedChange={handleChange}>
          <Accordion.Item id='general' title='General'>
            general body
          </Accordion.Item>
          <Accordion.Item id='security' title='Security'>
            security body
          </Accordion.Item>
        </Accordion>,
      );
      expect(screen.queryByText('general body')).not.toBeInTheDocument();
      expect(screen.getByText('security body')).toBeInTheDocument();
    });

    it('controlled allowMultiple: next array contains both ids', () => {
      const handleChange = jest.fn();
      render(
        <Accordion
          allowMultiple
          expanded={['general']}
          onExpandedChange={handleChange}
        >
          <Accordion.Item id='general' title='General'>
            general body
          </Accordion.Item>
          <Accordion.Item id='security' title='Security'>
            security body
          </Accordion.Item>
        </Accordion>,
      );
      fireEvent.click(screen.getByRole('button', { name: /security/i }));
      expect(handleChange).toHaveBeenCalledWith(['general', 'security']);
    });

    it('controlled expanded accepts a single string', () => {
      render(
        <Accordion expanded='security'>
          <Accordion.Item id='general' title='General'>
            general body
          </Accordion.Item>
          <Accordion.Item id='security' title='Security'>
            security body
          </Accordion.Item>
        </Accordion>,
      );
      expect(screen.queryByText('general body')).not.toBeInTheDocument();
      expect(screen.getByText('security body')).toBeInTheDocument();
    });
  });

  describe('Accordion.Item — auto-id warning', () => {
    it('emits a one-time console.warn when an Item omits `id`', () => {
      const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
      render(
        <Accordion>
          <Accordion.Item title='No id'>body</Accordion.Item>
        </Accordion>,
      );
      expect(warn).toHaveBeenCalledWith(
        expect.stringContaining('missing an `id`'),
      );
      warn.mockRestore();
    });
  });
});
