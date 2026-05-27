import styled from '@emotion/styled';
import { css, keyframes } from '@emotion/react';
import { colors } from '@m-next/styles';

// Animations
const pulse = keyframes`
  0%, 80%, 100% {
    opacity: 0.3;
    transform: scale(0.8);
  }
  40% {
    opacity: 1;
    transform: scale(1.2);
  }
`;

export const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

// Main Container - Sidebar layout
export const ChatSidebarContainer = styled.aside`
  width: 320px;
  min-width: 320px;
  max-width: 320px;
  background-color: #ffffff;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
`;

// Header
export const ChatHeader = styled.div`
  height: 36px;
  padding: 8px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const PoweredByButton = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  color: #7b2ff7;
  background: none;
  border: none;
  padding: 0;

  span {
    font-size: 14px;
    line-height: 20px;
    font-weight: 600;
  }
`;

export const CloseButton = styled.button`
  cursor: pointer;
  background: transparent;
  border: none;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background-color 0.2s ease;

  & svg {
    width: 10px;
    height: 10px;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

// Messages Area
export const MessagesScrollArea = styled.div`
  flex: 1 1 auto;
  overflow-y: auto;
  padding: 16px;
`;

export const MessagesWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

// Message Bubbles
export const MessageGroup = styled.div<{ isUser: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: ${({ isUser }) => (isUser ? 'flex-end' : 'flex-start')};
`;

export const MessageMeta = styled.div<{ isUser: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;

  span:first-of-type {
    font-size: 12px;
    font-weight: 600;
    color: ${colors['grey-dark']};
  }

  span:last-of-type {
    font-size: 12px;
    font-weight: 400;
    color: ${colors['grey']};
  }
`;

export const MessageBubblesContainer = styled.div<{ isUser: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: ${({ isUser }) => (isUser ? '75%' : '100%')};
  align-items: ${({ isUser }) => (isUser ? 'flex-end' : 'flex-start')};
`;

export const MessageBubbleStyled = styled.div<{ isUser: boolean; isAttachment?: boolean }>`
  background-color: ${({ isUser }) => (isUser ? colors['blue-lighter'] : colors['grey-lighter'])};
  color: ${({ isUser }) => (isUser ? colors['blue-dark'] : colors['grey-dark'])};
  border-radius: 16px;

  ${({ isUser }) =>
    isUser
      ? css`
          border-bottom-right-radius: 8px;
        `
      : css`
          border-bottom-left-radius: 8px;
        `}
  padding: 8px 16px;
  font-size: 14px;
  line-height: 1.5;

  ${({ isAttachment }) =>
    isAttachment &&
    css`
      border-bottom-right-radius: 16px;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px;
    `}

  strong {
    font-weight: 600;
  }

  /* Reset margins for markdown elements */
  & > div:last-child {
    margin-bottom: 0 !important;
  }

  /* Horizontal rule styling */
  hr {
    border: none;
    border-top: 1px solid #e5e7eb;
    margin: 12px 0;
  }

  /* Ensure proper spacing between elements */
  & > *:first-of-type {
    margin-top: 0;
  }

  & > *:last-of-type {
    margin-bottom: 0;
  }
`;

// Loading indicator
export const LoadingDots = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;

  div {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: #9333ea;
    animation: ${pulse} 1.4s ease-in-out infinite;

    &:nth-of-type(2) {
      animation-delay: 0.2s;
    }

    &:nth-of-type(3) {
      animation-delay: 0.4s;
    }
  }
`;

// Message File Metadata
export const MessageFileMetadata = styled.div`
  display: flex;
  flex-direction: column;

  .file-name {
    font-size: 12px;
    font-weight: 500;
    color: #1e3a8a;
  }

  .file-size {
    font-size: 12px;
    color: #2563eb;
  }
`;

// Task Progress Component
export const TaskProgressContainer = styled.div`
  background-color: ${colors['grey-lighter']};
  border-radius: 16px;
  padding: 8px 16px;
`;

export const TaskProgressTitle = styled.div`
  font-size: 14px;
  line-height: 16px;
  font-weight: 600;
  color: ${colors['grey-dark']};
  margin-bottom: 8px;
`;

export const TaskList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const TaskItem = styled.button<{ isCompleted: boolean }>`
  border-radius: 8px;
  padding: 4px 8px;
  width: 100%;
  text-align: left;
  background-color: ${colors.white};
  border: 1px solid transparent;
  cursor: ${({ isCompleted }) => (isCompleted ? 'pointer' : 'default')};
  font-family: inherit;

  &:hover {
    border-color: ${colors['grey-light']};
  }

  .task-content {
    display: flex;
    align-items: center;
    gap: 4px;
    position: relative;
  }

  .task-label {
    font-size: 14px;
    line-height: 16px;
    font-weight: 600;
    flex: 1;
    color: ${colors['grey-dark']};
  }

  .task-arrow {
    width: 14px;
    height: 14px;
    color: #2563eb;
    opacity: 0;
    transition: opacity 0.2s ease;
    flex-shrink: 0;
  }

  .task-status-text {
    font-size: 10px;
    color: #9ca3af;
  }

  &:hover .task-arrow {
    opacity: 1;
  }
`;

export const TaskSpinner = styled.div`
  width: 20px;
  aspect-ratio: 1;
  border-radius: 50%;
  border: 3px solid #d9d9d9;
  border-right-color: ${colors['green']};
  animation: l2 1s infinite linear;

  @keyframes l2 {
    to {
      transform: rotate(1turn);
    }
  }
`;

// Input Area
export const InputContainer = styled.div`
  padding: 16px;
  border-top: 1px solid #e5e7eb;
  overflow: visible;
  flex-shrink: 0;
`;

export const InputWrapper = styled.div<{ disabled?: boolean }>`
  position: relative;
  border-radius: 8px;
  border: 2px solid #e5e7eb;
  background-color: ${colors.white};
  min-height: 92px;
  display: flex;
  flex-direction: column;
  isolation: isolate;
  cursor: text;
  transition: border-color 0.2s ease;
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};

  &:hover:not(:focus-within) {
    border-color: #7b2ff7;
  }

  /* Gradient border */
  &::before {
    content: '';
    position: absolute;
    inset: -1px;
    border-radius: 8px;
    padding: 2px;
    background: transparent;
    -webkit-mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  /* Gradient shadow */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 8px;
    background: linear-gradient(124deg, #ff6b3d 18.11%, #7b2ff7 78.2%);
    filter: blur(4px);
    opacity: 0;
    transition: opacity 0.2s ease;
    pointer-events: none;
    z-index: -1;
  }

  &:focus-within {
    border-color: white;
  }

  &:focus-within::before {
    background: linear-gradient(124deg, #ff6b3d 18.11%, #7b2ff7 78.2%);
    opacity: 1;
  }

  &:focus-within::after {
    opacity: 1;
  }
`;

export const InputInner = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px;
  border-radius: 8px;
  background: ${colors.white};
`;

export const HiddenFileInput = styled.input`
  display: none;
`;

export const StyledTextArea = styled.textarea`
  padding: 0;
  border: none !important;
  padding: 0;
  display: block;
  width: 100%;
  height: auto;
  min-height: 44px;
  font-family: inherit;
  font-size: 14px;
  line-height: 1.5;
  resize: none;
  overflow-y: auto;
  box-sizing: border-box;

  &::placeholder {
    color: #9ca3af;
  }

  &:focus {
    outline: none;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const ButtonRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
`;

export const InputActions = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
`;

export const AttachButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0px;
  height: 24px;
  width: 24px;
`;

export const SendButton = styled.button<{ canSend: boolean; showStop: boolean }>`
  padding: 0;
  border-radius: 50%;
  transition: all 0.2s ease;
  border: none;
  cursor: ${({ canSend, showStop }) => {
    if (canSend || showStop) return 'pointer';
    return 'not-allowed';
  }};
  background-color: ${({ canSend, showStop }) => {
    if (showStop) return colors.grey;
    if (canSend) return '#7B2FF7';
    return '#9AACB4';
  }};
  height: 24px;
  width: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  &:hover:not(:disabled) {
    background-color: ${({ canSend, showStop }) => {
      if (showStop) return colors['grey-dark'];
      if (canSend) return '#4D169C';
      return '#D1D5DB';
    }};
  }
`;

export const AttachedFilesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 0px;
  margin-bottom: 8px;
  max-height: 160px;
  overflow-y: auto;
  overflow-x: hidden;
  width: 100%;
`;

export const AttachedFile = styled.div`
  padding: 4px;
  display: flex;
  gap: 8px;
  align-items: center;
  background: ${colors['grey-lighter']};
  border-radius: 8px;
  position: relative;
  min-width: 0;
  width: 100%;

  .delete-file-button {
    position: absolute;
    top: 4px;
    right: 4px;
    padding: 0;
    height: 16px;
    width: 16px;
    display: grid;
    place-items: center;
    border: none;
    cursor: pointer;
    background: transparent;
    transition: opacity 0.1s ease;
  }
`;

export const FileIconContainer = styled.div`
  width: 56px;
  height: 56px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  background-color: ${colors['grey-light']};
  border-radius: 4px;
`;

export const AttachmentContent = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  flex: 1;
  min-width: 0;
  padding-right: 24px;
`;

export const AttachmentMeta = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex: 1;

  span {
    font-size: 12px;
  }

  span:first-of-type {
    line-height: 16px;
    max-height: 32px;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: 500;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  span:last-of-type {
    color: #6b7280;
  }
`;

// Context Pill
export const ContextPill = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #f5f2ff;
  border: 1px solid #a585ff;
  padding: 4px 8px 4px 12px;
  border-radius: 100px;
  margin-bottom: 8px;
`;

export const ContextLabel = styled.span`
  color: #7b2ff7;
  font-weight: 600;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const ContextName = styled.span`
  display: flex;
  padding: 0 8px;
  align-items: center;
  gap: 5px;
  border-radius: 100px;
  color: #4d169c;
  background: #dcd4ff;
  font-weight: 600;
  height: 24px;
  line-height: 16px;
`;

export const ContextRemoveButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  margin-left: 4px;
  transition: opacity 0.2s ease;

  svg {
    color: #7b2ff7;
    transition: color 0.2s ease;
  }

  &:hover svg {
    color: #4d169c;
  }
`;
