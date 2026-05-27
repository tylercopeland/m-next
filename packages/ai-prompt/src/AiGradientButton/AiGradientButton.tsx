import React from 'react';
import SvgIcon from '@m-next/svg-icon';
import { colors } from '@m-next/styles';
import AiGradientButtonStyle from './AiGradientButton.styles';

export interface AiGradientButtonProps {
  /** Button label text */
  value: string;
  /** Click handler */
  onClick?: () => void;
  /** Whether button is disabled */
  disabled?: boolean;
  /** Additional CSS class name */
  className?: string;
  /** Button type */
  type?: 'button' | 'submit' | 'reset';
  /** Test ID for testing */
  'data-testid'?: string;
}

/**
 * Reusable gradient button component with purple-pink gradient
 */
export function AiGradientButton({
  value,
  onClick,
  disabled = false,
  className,
  type = 'button',
  'data-testid': testId,
}: AiGradientButtonProps) {
  return (
    <AiGradientButtonStyle type={type} onClick={onClick} disabled={disabled} className={className} data-testid={testId}>
      <SvgIcon name='ai-icon' size={10} color={colors.white} />
      {value}
    </AiGradientButtonStyle>
  );
}

export default AiGradientButton;
