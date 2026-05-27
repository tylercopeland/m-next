// Mock react-markdown and its plugins BEFORE imports
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ChatMessage, MessageRole } from '@m-next/api-interface';
import { AiChatBox } from './AiChatBox';
import { TaskProgressItem } from './TaskProgress';

jest.mock(
  'react-markdown',
  () =>
    function MockReactMarkdown({ children }: { children: string }) {
      return <div data-testid='markdown-content'>{children}</div>;
    },
);

jest.mock('remark-gfm', () => () => {});
jest.mock('rehype-highlight', () => () => {});

// Mock scrollIntoView
window.HTMLElement.prototype.scrollIntoView = jest.fn();

describe('AiChatBox', () => {
  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const createMockMessage = (id: string, role: MessageRole, text: string, timestamp?: string): ChatMessage => ({
    id,
    role,
    userName: role === MessageRole.HUMAN ? 'User' : 'Mia',
    content: [{ id: `content-${id}`, type: 'text', text }],
    timestamp: timestamp || new Date().toISOString(),
  });

  const mockMessages: ChatMessage[] = [
    createMockMessage('1', MessageRole.HUMAN, 'Hello'),
    createMockMessage('2', MessageRole.ASSISTANT, 'Hi there!'),
  ];

  const mockTaskProgress: TaskProgressItem[] = [
    { id: '1', label: 'User Roles', isCompleted: true },
    { id: '2', label: 'Features', isCompleted: false },
  ];

  it('renders with default props', () => {
    render(<AiChatBox />);
    expect(screen.getByTestId('ai-chatbox')).toBeInTheDocument();
    expect(screen.getByTestId('ai-chatbox-header')).toBeInTheDocument();
    expect(screen.getByTestId('ai-chatbox-messages')).toBeInTheDocument();
    expect(screen.getByTestId('ai-chatbox-input')).toBeInTheDocument();
  });

  it('renders messages', () => {
    render(<AiChatBox messages={mockMessages} />);
    expect(screen.getByTestId('ai-chatbox-message-1')).toBeInTheDocument();
    expect(screen.getByTestId('ai-chatbox-message-2')).toBeInTheDocument();
  });

  it('displays custom user name', () => {
    render(<AiChatBox messages={mockMessages} userName='Tyler' />);
    expect(screen.getByText('Tyler')).toBeInTheDocument();
  });

  it('displays custom assistant name', () => {
    render(<AiChatBox messages={mockMessages} assistantName='Custom AI' />);
    expect(screen.getByText('Custom AI')).toBeInTheDocument();
  });

  it('renders task progress when provided', () => {
    render(<AiChatBox taskProgress={mockTaskProgress} />);
    expect(screen.getByTestId('ai-chatbox-task-progress')).toBeInTheDocument();
    expect(screen.getByText('User Roles')).toBeInTheDocument();
    expect(screen.getByText('Features')).toBeInTheDocument();
  });

  it('renders custom task progress title', () => {
    render(<AiChatBox taskProgress={mockTaskProgress} taskProgressTitle='Custom Plan Title' />);
    expect(screen.getByText('Custom Plan Title')).toBeInTheDocument();
  });

  it('shows loading indicator', () => {
    render(<AiChatBox isLoading />);
    expect(screen.getByTestId('ai-chatbox-loading')).toBeInTheDocument();
  });

  it('calls onSendMessage when message is submitted', () => {
    const mockOnSendMessage = jest.fn();
    render(<AiChatBox onSendMessage={mockOnSendMessage} />);

    const input = screen.getByTestId('ai-chatbox-input-textarea');
    fireEvent.change(input, { target: { value: 'Test message' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(mockOnSendMessage).toHaveBeenCalledWith('Test message', [], undefined);
  });

  it('calls onTaskClick when task is clicked', () => {
    const mockOnTaskClick = jest.fn();
    render(<AiChatBox taskProgress={mockTaskProgress} onTaskClick={mockOnTaskClick} />);

    const taskButton = screen.getByTestId('ai-chatbox-task-progress-task-1');
    fireEvent.click(taskButton);

    expect(mockOnTaskClick).toHaveBeenCalledWith(mockTaskProgress[0]);
  });

  it('applies custom placeholder', () => {
    render(<AiChatBox placeholder='Custom placeholder' />);
    const input = screen.getByTestId('ai-chatbox-input-textarea');
    expect(input).toHaveAttribute('placeholder', 'Custom placeholder');
  });

  it('applies custom className', () => {
    const { container } = render(<AiChatBox className='custom-class' />);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('uses custom test ID', () => {
    render(<AiChatBox data-testid='custom-chatbox' />);
    expect(screen.getByTestId('custom-chatbox')).toBeInTheDocument();
    expect(screen.getByTestId('custom-chatbox-header')).toBeInTheDocument();
    expect(screen.getByTestId('custom-chatbox-messages')).toBeInTheDocument();
    expect(screen.getByTestId('custom-chatbox-input')).toBeInTheDocument();
  });
  it('does not render task progress when empty', () => {
    render(<AiChatBox taskProgress={[]} />);
    expect(screen.queryByTestId('ai-chatbox-task-progress')).not.toBeInTheDocument();
  });

  describe('taskProgressInsertIndex', () => {
    it('renders task progress at the end when taskProgressInsertIndex is null', () => {
      render(<AiChatBox messages={mockMessages} taskProgress={mockTaskProgress} taskProgressInsertIndex={null} />);

      const chatbox = screen.getByTestId('ai-chatbox-messages');
      const taskProgress = screen.getByTestId('ai-chatbox-task-progress');

      // Task progress should be rendered
      expect(taskProgress).toBeInTheDocument();

      // Task progress should come after all messages
      const allElements = Array.from(chatbox.querySelectorAll('[data-testid^="ai-chatbox"]'));
      const taskProgressIndex = allElements.findIndex(
        (el) => el.getAttribute('data-testid') === 'ai-chatbox-task-progress',
      );
      const lastMessageIndex = allElements.findIndex((el) => el.getAttribute('data-testid') === 'ai-chatbox-message-2');

      expect(taskProgressIndex).toBeGreaterThan(lastMessageIndex);
    });

    it('renders task progress after first message when taskProgressInsertIndex is 1', () => {
      render(<AiChatBox messages={mockMessages} taskProgress={mockTaskProgress} taskProgressInsertIndex={1} />);

      const chatbox = screen.getByTestId('ai-chatbox-messages');
      const taskProgress = screen.getByTestId('ai-chatbox-task-progress');

      expect(taskProgress).toBeInTheDocument();

      // Get all message and task progress elements
      const allElements = Array.from(chatbox.querySelectorAll('[data-testid^="ai-chatbox"]'));
      const message1Index = allElements.findIndex((el) => el.getAttribute('data-testid') === 'ai-chatbox-message-1');
      const taskProgressIndex = allElements.findIndex(
        (el) => el.getAttribute('data-testid') === 'ai-chatbox-task-progress',
      );
      const message2Index = allElements.findIndex((el) => el.getAttribute('data-testid') === 'ai-chatbox-message-2');

      // Task progress should be after message 1 but before message 2
      expect(taskProgressIndex).toBeGreaterThan(message1Index);
      expect(taskProgressIndex).toBeLessThan(message2Index);
    });

    it('renders task progress after second message when taskProgressInsertIndex is 2', () => {
      render(<AiChatBox messages={mockMessages} taskProgress={mockTaskProgress} taskProgressInsertIndex={2} />);

      const chatbox = screen.getByTestId('ai-chatbox-messages');
      const taskProgress = screen.getByTestId('ai-chatbox-task-progress');

      expect(taskProgress).toBeInTheDocument();

      const allElements = Array.from(chatbox.querySelectorAll('[data-testid^="ai-chatbox"]'));
      const message2Index = allElements.findIndex((el) => el.getAttribute('data-testid') === 'ai-chatbox-message-2');
      const taskProgressIndex = allElements.findIndex(
        (el) => el.getAttribute('data-testid') === 'ai-chatbox-task-progress',
      );

      // Task progress should be after message 2
      expect(taskProgressIndex).toBeGreaterThan(message2Index);
    });

    it('does not render task progress when taskProgressInsertIndex is out of bounds', () => {
      render(<AiChatBox messages={mockMessages} taskProgress={mockTaskProgress} taskProgressInsertIndex={5} />);

      // Task progress should not be rendered because index 5 is beyond the number of messages
      expect(screen.queryByTestId('ai-chatbox-task-progress')).not.toBeInTheDocument();
    });
  });
});
