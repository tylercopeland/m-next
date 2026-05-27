/**
 * Unit tests for TextWrapperRedux (TextDesignerWrapper)
 *
 * Covers NCNG-582: mapped labels on V4 screens must not render when there is
 * no active record (i.e., isBound=true but runtime value is empty/null).
 *
 * IMPORTANT: early-return (return null) must be placed AFTER all
 * hooks to comply with React's rules of hooks. The rerender test below catches
 * any regression where the return is placed between hook calls — React would
 * crash with "Rendered more hooks than during the previous render" on the
 * null→visible transition when a record loads.
 */

import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock heavy external dependencies before importing the component
jest.mock('@m-next/text', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <span data-testid='text-component'>{children}</span>,
}));

jest.mock('@m-next/svg-icon', () => ({
  __esModule: true,
  default: () => <span data-testid='svg-icon' />,
}));

jest.mock('@m-next/styles', () => ({
  colors: { darkGrey: '#666' },
}));

jest.mock('../../contexts/DesignerContext', () => ({
  useDesignerContext: jest.fn(() => null),
}));

// Mock the display content hook so we can control return values
jest.mock('../text/hooks/useDisplayContent', () => ({
  useDisplayContent: jest.fn(),
}));

jest.mock('../text/hooks/useTextStyles', () => ({
  useTextStyles: jest.fn(() => ({
    combinedClasses: '',
    effectiveStyles: { fontColor: undefined, fontWeight: undefined, fontSize: undefined, textAlignment: 'left' },
    calculatedLineHeight: '1.4',
  })),
}));

jest.mock('../text/hooks/useLineClamp', () => ({
  useLineClamp: jest.fn(() => 3),
}));

jest.mock('../text/linkFormatter', () => ({
  formatLink: jest.fn(() => null),
}));

import TextDesignerWrapper from '../TextWrapperRedux';
import { useDisplayContent } from '../text/hooks/useDisplayContent';

const mockUseDisplayContent = useDisplayContent as jest.MockedFunction<typeof useDisplayContent>;

describe('TextDesignerWrapper — NCNG-582: hide mapped label when no active record', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns null in runtime mode when isBound=true and displayContent is empty (no active record)', () => {
    mockUseDisplayContent.mockReturnValue('');

    const control = {
      isBound: true,
      name: 'CompanyName',
      value: null,
    };

    const { container } = render(<TextDesignerWrapper id='ctrl-1' control={control} mode='runtime' />);

    expect(container.firstChild).toBeNull();
  });

  it('returns null in runtime mode when isBound=true and displayContent is empty string from undefined value', () => {
    mockUseDisplayContent.mockReturnValue('');

    const control = {
      isBound: true,
      name: 'Status',
      value: undefined,
    };

    const { container } = render(<TextDesignerWrapper id='ctrl-2' control={control} mode='runtime' />);

    expect(container.firstChild).toBeNull();
  });

  it('renders content in runtime mode when isBound=true and displayContent is non-empty (active record present)', () => {
    mockUseDisplayContent.mockReturnValue('Acme Corp');

    const control = {
      isBound: true,
      name: 'CompanyName',
      value: 'Acme Corp',
    };

    const { container } = render(<TextDesignerWrapper id='ctrl-3' control={control} mode='runtime' />);

    expect(container.firstChild).not.toBeNull();
  });

  it('renders content in runtime mode when isBound=false even with empty displayContent (static label)', () => {
    mockUseDisplayContent.mockReturnValue('');

    const control = {
      isBound: false,
      name: 'StaticLabel',
      value: '',
    };

    const { container } = render(<TextDesignerWrapper id='ctrl-4' control={control} mode='runtime' />);

    // Unbound (static) labels should always render, even when empty
    expect(container.firstChild).not.toBeNull();
  });

  it('renders normally in designer mode regardless of isBound and empty value', () => {
    // In designer mode the control comes from designer context, but since context returns null,
    // the component will show the "control not found" fallback — not null.
    // This verifies the hide-on-no-record logic does NOT apply in designer mode.
    mockUseDisplayContent.mockReturnValue('');

    const { container } = render(<TextDesignerWrapper id='ctrl-5' mode='designer' />);

    // Designer mode with no context shows fallback div, not null
    expect(container.firstChild).not.toBeNull();
  });

  it('toggles null→visible without hooks violation when a record loads after page open', () => {
    // Regression test for the hooks-ordering fix: the early return must come AFTER all hooks.
    // If it is placed between hooks, React crashes on the null→visible transition with
    // "Rendered more hooks than during the previous render".
    mockUseDisplayContent.mockReturnValue('');

    const control = { isBound: true, name: 'CompanyName', value: null };
    const { container, rerender } = render(<TextDesignerWrapper id='ctrl-6' control={control} mode='runtime' />);

    // No active record — component should render null
    expect(container.firstChild).toBeNull();

    // Record loads — displayContent becomes non-empty
    mockUseDisplayContent.mockReturnValue('Acme Corp');
    rerender(<TextDesignerWrapper id='ctrl-6' control={{ ...control, value: 'Acme Corp' }} mode='runtime' />);

    // Component should now render the content without a React hooks crash
    expect(container.firstChild).not.toBeNull();
  });
});
