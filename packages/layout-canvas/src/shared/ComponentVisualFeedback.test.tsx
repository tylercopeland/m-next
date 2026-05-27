import React from 'react';
import { render } from '@testing-library/react';
import { ComponentVisualFeedback } from './ComponentVisualFeedback';

// Mock SvgIcon to avoid dependency on @m-next/svg-icon internals
jest.mock('@m-next/svg-icon', () => {
  const MockSvgIcon = (props: Record<string, unknown>) => (
    <span data-testid={`svg-icon-${props.name}`} data-color={props.color} />
  );
  MockSvgIcon.displayName = 'SvgIcon';
  return MockSvgIcon;
});

const defaultProps = {
  isSelected: false,
  isHovered: false,
  isHidden: false,
  hasValidationError: false,
  isNearTop: false,
  supportsHeightResize: false,
  isDragInProgress: false,
  isResizeInProgress: false,
  componentName: 'Test Component',
};

describe('ComponentVisualFeedback', () => {
  it('renders nothing when mode is runtime (isDraggable false)', () => {
    const { container } = render(<ComponentVisualFeedback {...defaultProps} isDesignerMode={false} />);
    expect(container.innerHTML).toBe('');
  });

  it('renders nothing when isInContainer is true (container handles its own feedback)', () => {
    const { container } = render(
      <ComponentVisualFeedback {...defaultProps} isDesignerMode={true} isInContainer={true} />,
    );
    expect(container.innerHTML).toBe('');
  });

  it('renders BorderOverlay when isSelected is true', () => {
    const { container } = render(<ComponentVisualFeedback {...defaultProps} isDesignerMode={true} isSelected={true} />);
    // BorderOverlay is rendered; Badge is also rendered when selected
    const borderOverlays = container.querySelectorAll('[class]');
    expect(borderOverlays.length).toBeGreaterThan(0);
  });

  it('renders BorderOverlay when isHovered is true', () => {
    const { container } = render(<ComponentVisualFeedback {...defaultProps} isDesignerMode={true} isHovered={true} />);
    expect(container.innerHTML).not.toBe('');
  });

  it('renders DashedBorderOverlay when hasValidationError and not selected', () => {
    const { container } = render(
      <ComponentVisualFeedback
        {...defaultProps}
        isDesignerMode={true}
        hasValidationError={true}
        isSelected={false}
        isHovered={false}
      />,
    );
    expect(container.innerHTML).not.toBe('');
  });

  it('renders grey badge with eye icon when isHidden and not selected/hovered', () => {
    const { getByTestId } = render(
      <ComponentVisualFeedback
        {...defaultProps}
        isDesignerMode={true}
        isHidden={true}
        isSelected={false}
        isHovered={false}
      />,
    );
    expect(getByTestId('svg-icon-eye-closed-V4')).toBeTruthy();
  });

  it('renders eye icon in Badge when isHidden and hovered', () => {
    const { getByTestId } = render(
      <ComponentVisualFeedback {...defaultProps} isDesignerMode={true} isHidden={true} isHovered={true} />,
    );
    expect(getByTestId('svg-icon-eye-closed-V4')).toBeTruthy();
  });

  it('renders UnconfiguredBadge when hasValidationError and not selected/hovered', () => {
    const { getByTestId } = render(
      <ComponentVisualFeedback
        {...defaultProps}
        isDesignerMode={true}
        hasValidationError={true}
        isSelected={false}
        isHovered={false}
      />,
    );
    expect(getByTestId('svg-icon-warning-V4')).toBeTruthy();
  });

  it('renders Badge with component name when isSelected', () => {
    const { getByText } = render(
      <ComponentVisualFeedback {...defaultProps} isDesignerMode={true} isSelected={true} componentName='My Button' />,
    );
    expect(getByText('My Button')).toBeTruthy();
  });

  it('renders Badge with component name when isHovered', () => {
    const { getByText } = render(
      <ComponentVisualFeedback {...defaultProps} isDesignerMode={true} isHovered={true} componentName='My Label' />,
    );
    expect(getByText('My Label')).toBeTruthy();
  });

  it('does NOT render Badge when neither selected nor hovered', () => {
    const { queryByText } = render(
      <ComponentVisualFeedback
        {...defaultProps}
        isDesignerMode={true}
        isSelected={false}
        isHovered={false}
        componentName='Hidden Badge'
      />,
    );
    expect(queryByText('Hidden Badge')).toBeNull();
  });

  it('renders ProtectedBadge when isStaticContainer and isDragInProgress', () => {
    const { getByText } = render(
      <ComponentVisualFeedback
        {...defaultProps}
        isDesignerMode={true}
        isStaticContainer={true}
        isDragInProgress={true}
      />,
    );
    expect(getByText('PROTECTED')).toBeTruthy();
  });

  it('does NOT render ProtectedBadge when isStaticContainer but no drag in progress', () => {
    const { queryByText } = render(
      <ComponentVisualFeedback
        {...defaultProps}
        isDesignerMode={true}
        isStaticContainer={true}
        isDragInProgress={false}
      />,
    );
    expect(queryByText('PROTECTED')).toBeNull();
  });

  it('renders InvalidDropOverlay when isInvalidDropTarget is true', () => {
    const { getByText } = render(
      <ComponentVisualFeedback {...defaultProps} isDesignerMode={true} isInvalidDropTarget={true} />,
    );
    expect(getByText('Cannot nest containers')).toBeTruthy();
  });

  it('renders move icon in Badge', () => {
    const { getByTestId } = render(
      <ComponentVisualFeedback {...defaultProps} isDesignerMode={true} isSelected={true} />,
    );
    expect(getByTestId('svg-icon-move-icon')).toBeTruthy();
  });

  it('renders warning icon in Badge when hasValidationError and selected', () => {
    const { getByTestId } = render(
      <ComponentVisualFeedback {...defaultProps} isDesignerMode={true} isSelected={true} hasValidationError={true} />,
    );
    expect(getByTestId('svg-icon-warning-V4')).toBeTruthy();
  });

  it('renders eye icon in Badge when isHidden and selected', () => {
    const { getAllByTestId } = render(
      <ComponentVisualFeedback {...defaultProps} isDesignerMode={true} isSelected={true} isHidden={true} />,
    );
    const eyeIcons = getAllByTestId('svg-icon-eye-closed-V4');
    expect(eyeIcons.length).toBeGreaterThan(0);
  });

  it('renders BorderOverlay during drag in progress even when not selected/hovered', () => {
    const { container } = render(
      <ComponentVisualFeedback {...defaultProps} isDesignerMode={true} isDragInProgress={true} />,
    );
    // Should render something (BorderOverlay) even though not selected
    expect(container.innerHTML).not.toBe('');
  });

  it('renders BorderOverlay during resize in progress', () => {
    const { container } = render(
      <ComponentVisualFeedback {...defaultProps} isDesignerMode={true} isResizeInProgress={true} />,
    );
    expect(container.innerHTML).not.toBe('');
  });
});
