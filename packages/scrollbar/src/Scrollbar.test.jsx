/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Scrollbar from './Scrollbar';

describe('@m-next/scrollbar', () => {
  it('renders children', () => {
    render(
      <Scrollbar>
        <div data-testid='child'>hello</div>
      </Scrollbar>,
    );
    expect(screen.getByTestId('child')).toHaveTextContent('hello');
  });

  it('renders nothing when isVisible is false', () => {
    const { container } = render(
      <Scrollbar isVisible={false}>
        <div data-testid='child'>hidden</div>
      </Scrollbar>,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('auto-generates an id when none is provided', () => {
    const { container } = render(
      <Scrollbar>
        <span>x</span>
      </Scrollbar>,
    );
    // The styled wrapper around SimpleBar carries the id.
    const root = container.querySelector('[id^="m-next-scrollbar-"]');
    expect(root).not.toBeNull();
    expect(root.id).toMatch(/^m-next-scrollbar-\d+$/);
  });

  it('uses the provided id when given', () => {
    const { container } = render(
      <Scrollbar id='my-scroll'>
        <span>x</span>
      </Scrollbar>,
    );
    expect(container.querySelector('#my-scroll')).not.toBeNull();
  });

  it('translates a numeric offset into a px-based calc() max-height', () => {
    const { container } = render(
      <Scrollbar offset={56} id='offset-num'>
        <span>x</span>
      </Scrollbar>,
    );
    const root = container.querySelector('#offset-num');
    // The styled wrapper receives maxHeight as a prop and emits it as a CSS rule.
    // emotion compiles the styled-component output — assert via inline style on
    // the SimpleBar child, which is where we forward the calc.
    const simplebar = root.querySelector('[data-simplebar], .simplebar-content-wrapper');
    // SimpleBar marks its root with `data-simplebar` once mounted.
    expect(root.outerHTML).toMatch(/calc\(100% - 56px\)/);
    expect(simplebar).not.toBeNull();
  });

  it('translates a string offset into a calc() max-height verbatim', () => {
    const { container } = render(
      <Scrollbar offset='3rem' id='offset-str'>
        <span>x</span>
      </Scrollbar>,
    );
    const root = container.querySelector('#offset-str');
    expect(root.outerHTML).toMatch(/calc\(100% - 3rem\)/);
  });

  it('honors maxHeight over offset when both are provided', () => {
    const { container } = render(
      <Scrollbar offset='56px' maxHeight='400px' id='max-wins'>
        <span>x</span>
      </Scrollbar>,
    );
    const root = container.querySelector('#max-wins');
    expect(root.outerHTML).toMatch(/400px/);
    // The offset-derived calc should NOT appear when maxHeight wins.
    expect(root.outerHTML).not.toMatch(/calc\(100% - 56px\)/);
  });

  it('emits a one-time console.warn on legacy `forwardRef` prop', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const dummyRef = { current: null };
    render(
      <Scrollbar forwardRef={dummyRef}>
        <span>x</span>
      </Scrollbar>,
    );
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('forwardRef'));
    warn.mockRestore();
  });

  it('forwards a ref to the SimpleBar instance', () => {
    const ref = React.createRef();
    render(
      <Scrollbar ref={ref}>
        <span>x</span>
      </Scrollbar>,
    );
    // SimpleBar exposes a `recalculate` method on its instance.
    expect(ref.current).not.toBeNull();
    expect(typeof ref.current.recalculate).toBe('function');
  });

  it('passes through className', () => {
    const { container } = render(
      <Scrollbar className='custom-class' id='cn'>
        <span>x</span>
      </Scrollbar>,
    );
    expect(container.querySelector('#cn.custom-class')).not.toBeNull();
  });
});
