/**
 * NCNG-847: Container overlays on default state tooltip
 *
 * Verifies the z-index stacking context relationship between the canvas wrapper
 * (ResizeableWrapper) and the right properties panel (RightPanelWrapper).
 *
 * The ResizeableWrapper must create a stacking context (via z-index on a positioned element)
 * so that canvas items' z-index values do not escape and paint above the right panel
 * or its tooltips.
 */

import React from 'react';
import { render } from '@testing-library/react';
import { matchers } from '@emotion/jest';
import { Z_UI } from '@m-next/layout-canvas';
import { ResizeableWrapper, RightPanelWrapper } from '../layoutDesigner.styles';

expect.extend(matchers);

describe('NCNG-847: Z-index layering between canvas and right panel', () => {
  it('ResizeableWrapper creates a stacking context with position and z-index', () => {
    const { container } = render(<ResizeableWrapper isPaletteOpen={false} />);
    const el = container.firstChild;
    expect(el).toHaveStyleRule('z-index', '0');
    expect(el).toHaveStyleRule('position', 'relative');
  });

  it('RightPanelWrapper uses Z_UI.RIGHT_PANEL z-index', () => {
    const { container } = render(<RightPanelWrapper />);
    const el = container.firstChild;
    expect(el).toHaveStyleRule('z-index', String(Z_UI.RIGHT_PANEL));
  });

  it('right panel z-index is greater than canvas wrapper z-index', () => {
    expect(Z_UI.RIGHT_PANEL).toBeGreaterThan(0);
  });

  it('right panel z-index is greater than all canvas item z-index values', () => {
    const maxCanvasZIndex = 90; // Z_CANVAS.DROP_TARGET is the highest at 90
    expect(Z_UI.RIGHT_PANEL).toBeGreaterThan(maxCanvasZIndex);
  });

  it('ResizeableWrapper maintains stacking context when palette is open', () => {
    const { container } = render(<ResizeableWrapper isPaletteOpen={true} />);
    const el = container.firstChild;
    expect(el).toHaveStyleRule('z-index', '0');
    expect(el).toHaveStyleRule('position', 'relative');
  });
});
