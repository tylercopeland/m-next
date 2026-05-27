import styled from '@emotion/styled';
import { colors } from '@m-next/styles';

export const AiPromptContainer = styled.div<{ isLoading?: boolean }>(
  ({ isLoading }) => `
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  opacity: ${isLoading ? 0.6 : 1};
  pointer-events: ${isLoading ? 'none' : 'auto'};
  transition: opacity 0.2s;
`,
);

export const PromptInputContainer = styled.div`
  position: relative;
  width: 100%;
  border-radius: 16px;
  border: 2px solid ${colors['grey-light']};
  background-color: ${colors.white};
  isolation: isolate;
  height: 200px;
  transition: border-color 0.2s ease;
  display: flex;
  flex-direction: column;

  /* Gradient border */
  &::before {
    content: '';
    position: absolute;
    inset: -1px;
    border-radius: 16px;
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
    border-radius: 16px;
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

  &:hover:not(:focus-within) {
    border-color: #7b2ff7;
  }

  &:focus-within::before {
    background: linear-gradient(124deg, #ff6b3d 18.11%, #7b2ff7 78.2%);
    opacity: 1;
  }

  &:focus-within::after {
    opacity: 1;
  }
`;

export const InnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  border-radius: 16px;
  padding: 16px;
  background: ${colors.white};
  cursor: text;
`;

export const StyledTextArea = styled.textarea`
  flex: 1;
  margin: 0;
  border-radius: 16px;
  border: none !important;
  background: transparent;
  font-family: inherit;
  font-size: 16px;
  line-height: 1.5;
  color: #1f2937;
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
  align-items: flex-end;
  flex-shrink: 0;
  gap: 16px;
`;

export const AttachButton = styled.button`
  padding: 6px;
  margin: 0;
  border-radius: 50%;
  background: none;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
`;

export const ErrorMessage = styled.div`
  color: ${colors['red']};
  font-size: 14px;
  margin-top: 8px;
`;

export const LoadingIndicator = styled.div`
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translateY(-50%);
  font-size: 12px;
  color: ${colors['grey-dark']};
`;

export const ChatBoxContainer = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 16px;
  padding: 16px;
  width: 360px;
  box-sizing: border-box;
`;

export const ChatBubbleContainer = styled.div`
  background-color: ${colors.white};
  border-radius: 16px;
  box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.25);
  padding: 8px 8px 8px;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
`;

export const ChatContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
  flex: 1;
  overflow-y: auto;
  padding: 0 8px;
`;

export const MessagesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const MessageBubble = styled.div<{ isAssistant: boolean }>`
  background-color: ${(props) => (props.isAssistant ? 'transparent' : '#f6fafb')};
  border-radius: 8px;
  padding: 8px 16px;
  max-width: 312px;
  align-self: ${(props) => (props.isAssistant ? 'flex-start' : 'flex-end')};
  font-family: 'Source Sans Pro', sans-serif;
  font-size: 16px;
  line-height: 24px;
  color: #2a394a;
  word-wrap: break-word;
  overflow-wrap: break-word;
  margin-right: 16px;

  /* Reset margins for markdown elements */
  & > div:last-child {
    margin-bottom: 0 !important;
  }

  /* Table styling for markdown tables */
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 8px 0;
    font-size: 14px;
  }

  th,
  td {
    border: 1px solid #e1e4e8;
    padding: 6px 8px;
    text-align: left;
  }

  th {
    background-color: #f6f8fa;
    font-weight: 600;
  }

  /* Horizontal rule styling */
  hr {
    border: none;
    border-top: 1px solid #e1e4e8;
    margin: 12px 0;
  }

  /* Task list styling */
  input[type='checkbox'] {
    margin-right: 6px;
  }

  /* Ensure proper spacing between elements */
  & > *:first-of-type {
    margin-top: 0;
  }

  & > *:last-of-type {
    margin-bottom: 0;
  }
`;

export const MessageBubbleWrapper = styled.div<{ isAssistant: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: ${(props) => (props.isAssistant ? 'flex-start' : 'flex-end')};
`;

export const SuggestionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 8px;
`;

export const SuggestionBubble = styled.button`
  background-color: #e3e9ff;
  border: none;
  border-radius: 100px;
  padding: 4px 16px;
  font-family: 'Source Sans Pro', sans-serif;
  font-weight: 600;
  font-size: 14px;
  line-height: 16px;
  color: #2a394a;
  cursor: pointer;
  align-self: flex-start;
  white-space: nowrap;

  &:hover {
    background-color: #d1d9ff;
  }

  &:active {
    background-color: #b8c6ff;
  }
`;

export const MessageFeedbackContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-top: 8px;
  padding: 0px 16px;
`;

export const FeedbackButtons = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
`;

export const FeedbackButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    opacity: 0.7;
  }
`;

export const ChatInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
`;

export const InputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

export const ChatInput = styled.input`
  width: 100%;
  height: 32px;
  border: 1px solid #bacad0;
  border-radius: 8px;
  padding: 8px 32px 8px 8px;
  font-family: 'Source Sans Pro', sans-serif;
  font-size: 14px;
  line-height: 16px;
  color: #2a394a;
  box-sizing: border-box;

  &::placeholder {
    color: rgba(84, 95, 103, 0.5);
  }

  &:focus {
    outline: none;
    border-color: #3b4aed;
  }
`;

export const SendButton = styled.button`
  position: absolute;
  right: 6px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const AIAssistantHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  height: 24px;
  padding: 6px;
  width: 100%;
  background: linear-gradient(135deg, #ff6b3d 0%, #7b2ff7 100%) border-box;
  border-radius: 28.5px;
  margin-bottom: 16px;
`;

export const AIBadge = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  height: 24px;
  border-radius: 28.5px;
  padding: 6px 36px 6px 24px;
  position: relative;
`;

export const AIBadgeText = styled.span`
  font-family: 'Source Sans Pro', sans-serif;
  font-weight: 600;
  font-size: 12px;
  line-height: 12px;
  color: ${colors.white};
  text-align: center;
  white-space: nowrap;
`;

export const SparkleIcon = styled.div`
  position: absolute;
  left: 8.5px;
  top: 6px;
  width: 12px;
  height: 12px;
`;

export const AIIcon = styled.div`
  background-color: #3b4aed;
  border-radius: 100px;
  width: 16px;
  height: 16px;
  overflow: hidden;
`;
