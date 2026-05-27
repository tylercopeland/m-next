import React from 'react';
import SvgIcon from '@m-next/svg-icon';
import { colors } from '@m-next/styles';
import { ChatHeader, PoweredByButton, CloseButton } from './AIChatBot.styles';

export interface AIHeaderProps {
  /** Title text for the header (default: "Mia") */
  title?: string;
  /** Callback when close button is clicked */
  onClose?: () => void;
  /** Additional CSS class name */
  className?: string;
  /** Test ID for the component */
  'data-testid'?: string;
}
export function AIHeader({ title = 'Method AI', onClose, className, 'data-testid': testId }: AIHeaderProps) {
  const containerTestId = testId || 'ai-header';

  return (
    <ChatHeader className={className} data-testid={containerTestId}>
      <PoweredByButton type='button' data-testid={`${containerTestId}-powered-by`}>
        <SvgIcon name='ai-gradient-icon' size={12} />
        <span>Powered by {title}</span>
      </PoweredByButton>
      <CloseButton
        type='button'
        onClick={onClose}
        aria-label='Close chat'
        data-testid={`${containerTestId}-close-button`}
        disabled={!onClose}
      >
        <SvgIcon name='close-V4' color={colors['grey']} size={6.5} strokeWidth='1.5' />
      </CloseButton>
    </ChatHeader>
  );
}

export default AIHeader;
