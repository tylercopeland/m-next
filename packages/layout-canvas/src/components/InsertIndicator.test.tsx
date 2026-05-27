/**
 * Insert Indicator Tests
 *
 * Tests for the visual insert indicator component.
 *
 * @see [Layout] Vertical Push - Insert (MVP)
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { InsertIndicator, INSERT_LINE_COLOR, INSERT_LINE_HEIGHT } from './InsertIndicator';

describe('InsertIndicator', () => {
  it('should render when visible', () => {
    render(<InsertIndicator x={100} y={200} width={300} visible={true} />);

    const indicator = screen.getByTestId('insert-indicator');
    expect(indicator).toBeInTheDocument();
  });

  it('should not render when not visible', () => {
    render(<InsertIndicator x={100} y={200} width={300} visible={false} />);

    const indicator = screen.queryByTestId('insert-indicator');
    expect(indicator).not.toBeInTheDocument();
  });

  it('should apply correct inline styles', () => {
    const { container } = render(<InsertIndicator x={150} y={200} width={300} visible={true} />);

    const indicator = container.firstChild as HTMLElement;
    expect(indicator.style.left).toBe('150px');
    expect(indicator.style.top).toBe('200px');
    expect(indicator.style.width).toBe('300px');
    expect(indicator.style.height).toBe(`${INSERT_LINE_HEIGHT}px`);
    expect(indicator.style.backgroundColor).toBe('rgb(13, 113, 200)'); // #0D71C8
    expect(indicator.style.position).toBe('absolute');
    expect(indicator.style.pointerEvents).toBe('none');
    expect(indicator.style.zIndex).toBe('300');
  });

  it('should handle zero values', () => {
    const { container } = render(<InsertIndicator x={0} y={0} width={0} visible={true} />);

    const indicator = container.firstChild as HTMLElement;
    expect(indicator.style.left).toBe('0px');
    expect(indicator.style.top).toBe('0px');
    expect(indicator.style.width).toBe('0px');
  });

  describe('constants', () => {
    it('should export correct line color', () => {
      expect(INSERT_LINE_COLOR).toBe('#0D71C8');
    });

    it('should export correct line height', () => {
      expect(INSERT_LINE_HEIGHT).toBe(2);
    });
  });
});
