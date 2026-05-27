/* eslint-disable @typescript-eslint/no-explicit-any */
// Mock react-markdown and its plugins BEFORE imports
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MessageBubble } from './MessageBubble';

jest.mock(
  'react-markdown',
  () =>
    function MockReactMarkdown({ children }: { children: string }) {
      return <div data-testid='markdown-content'>{children}</div>;
    },
);

jest.mock('remark-gfm', () => () => {});
jest.mock('rehype-highlight', () => () => {});

describe('MessageBubble', () => {
  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders with basic content', () => {
    render(<MessageBubble isAssistant content='Hello world' />);
    expect(screen.getByTestId('markdown-content')).toHaveTextContent('Hello world');
  });

  it('applies custom className', () => {
    const { container } = render(<MessageBubble isAssistant content='Test' className='custom-class' />);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('handles empty content gracefully', () => {
    render(<MessageBubble isAssistant content='' />);
    // Empty content uses fallback rendering, not markdown
    expect(screen.queryByTestId('markdown-content')).not.toBeInTheDocument();
    expect(screen.getByTestId('message-bubble-assistant')).toBeInTheDocument();
  });

  it('handles invalid content types gracefully', () => {
    // Test with null content
    const { unmount } = render(<MessageBubble isAssistant content={null as any} />);
    expect(screen.getByTestId('message-bubble-assistant')).toBeInTheDocument();
    expect(screen.queryByTestId('markdown-content')).not.toBeInTheDocument();
    unmount();

    // Test with undefined content
    render(<MessageBubble isAssistant content={undefined as any} />);
    expect(screen.getByTestId('message-bubble-assistant')).toBeInTheDocument();
    expect(screen.queryByTestId('markdown-content')).not.toBeInTheDocument();
  });

  it('handles table markdown content', () => {
    const tableContent = `
| Column 1 | Column 2 |
|----------|----------|
| Data 1   | Data 2   |
`;
    render(<MessageBubble isAssistant content={tableContent} />);
    const markdown = screen.getByTestId('markdown-content');
    // Table text content doesn't preserve exact whitespace, just check for content
    expect(markdown).toHaveTextContent('Column 1');
    expect(markdown).toHaveTextContent('Column 2');
    expect(markdown).toHaveTextContent('Data 1');
    expect(markdown).toHaveTextContent('Data 2');
  });

  it('displays sender name', () => {
    render(<MessageBubble isAssistant content='Test' senderName='Custom Name' />);
    expect(screen.getByTestId('message-sender')).toHaveTextContent('Custom Name');
  });

  it('displays default sender name for assistant', () => {
    render(<MessageBubble isAssistant content='Test' />);
    expect(screen.getByTestId('message-sender')).toHaveTextContent('Mia');
  });

  it('displays default sender name for user', () => {
    render(<MessageBubble isAssistant={false} content='Test' />);
    expect(screen.getByTestId('message-sender')).toHaveTextContent('You');
  });

  it('formats and displays timestamp', () => {
    const timestamp = '2024-01-15T15:49:00Z';
    render(<MessageBubble isAssistant content='Test' timestamp={timestamp} />);
    const timeElement = screen.getByTestId('message-time');
    // Check that time is formatted (exact format depends on locale)
    expect(timeElement).toBeInTheDocument();
    expect(timeElement.textContent).toMatch(/\d+:\d+\s*(AM|PM)/i);
  });

  it('renders user message with correct alignment', () => {
    render(<MessageBubble isAssistant={false} content='User message' />);
    expect(screen.getByTestId('message-bubble-human')).toBeInTheDocument();
  });

  it('renders assistant message with correct alignment', () => {
    render(<MessageBubble isAssistant content='Assistant message' />);
    expect(screen.getByTestId('message-bubble-assistant')).toBeInTheDocument();
  });
});
