import React from 'react';
import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';
import { FileIcon } from 'lucide-react';
import remarkGfm from 'remark-gfm';
import { FileAttachment } from '@m-next/api-interface';
import {
  MessageGroup,
  MessageMeta,
  MessageBubbleStyled,
  MessageFileMetadata,
  MessageBubblesContainer,
} from './AIChatBot.styles';
import formatFileSize from '../utils/fileSize';

interface ErrorBoundaryState {
  hasError: boolean;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback: React.ReactNode;
}

class MarkdownErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error('Markdown parsing error:', error, errorInfo);
  }

  override render() {
    const { hasError } = this.state;
    const { fallback, children } = this.props;

    if (hasError) {
      return fallback;
    }

    return children;
  }
}

export interface MessageBubbleProps {
  /** Whether this is an assistant message or human message */
  isAssistant: boolean;
  /** The message content to display */
  content: string;
  /** Attachments associated with the message */
  attachments?: FileAttachment[];
  /** Sender name to display */
  senderName?: string;
  /** Timestamp to display (formatted string) */
  timestamp?: string;
  /** Additional CSS class name */
  className?: string;
  /** Test ID for the component */
  'data-testid'?: string;
}

// Helper function to format timestamp
const formatTime = (isoTimestamp?: string): string => {
  if (!isoTimestamp) return '';
  try {
    const date = new Date(isoTimestamp);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return isoTimestamp;
  }
};

// Markdown component definitions moved outside to avoid re-creation on each render
function ParagraphComponent({ children }: { children?: React.ReactNode }) {
  return <div style={{ margin: '0 0 8px 0' }}>{children}</div>;
}

function H1Component({ children }: { children?: React.ReactNode }) {
  return <h1 style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 8px 0' }}>{children}</h1>;
}

function H2Component({ children }: { children?: React.ReactNode }) {
  return <h2 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 6px 0' }}>{children}</h2>;
}

function H3Component({ children }: { children?: React.ReactNode }) {
  return <h3 style={{ fontSize: '14px', fontWeight: '600', margin: '0 0 4px 0' }}>{children}</h3>;
}

function UlComponent({ children }: { children?: React.ReactNode }) {
  return <ul style={{ margin: '0 0 8px 0', paddingLeft: '16px' }}>{children}</ul>;
}

function OlComponent({ children }: { children?: React.ReactNode }) {
  return <ol style={{ margin: '0 0 8px 0', paddingLeft: '16px' }}>{children}</ol>;
}

function LiComponent({ children }: { children?: React.ReactNode }) {
  return <li style={{ margin: '2px 0' }}>{children}</li>;
}

function CodeComponent({ inline, children, ...props }: { inline?: boolean; children?: React.ReactNode }) {
  const isInline = inline === true;
  return isInline ? (
    <code
      {...props}
      style={{
        backgroundColor: '#e5e7eb',
        padding: '2px 4px',
        borderRadius: '3px',
        fontSize: '13px',
        fontFamily: 'Monaco, Consolas, "Courier New", monospace',
      }}
    >
      {children}
    </code>
  ) : (
    <pre
      style={{
        backgroundColor: '#f3f4f6',
        padding: '8px',
        borderRadius: '6px',
        overflow: 'auto',
        fontSize: '13px',
        margin: '8px 0',
      }}
    >
      <code style={{ fontFamily: 'Monaco, Consolas, "Courier New", monospace' }}>{children}</code>
    </pre>
  );
}

function BlockquoteComponent({ children }: { children?: React.ReactNode }) {
  return (
    <blockquote
      style={{
        borderLeft: '3px solid #d1d5db',
        paddingLeft: '12px',
        margin: '8px 0',
        color: '#6b7280',
        fontStyle: 'italic',
      }}
    >
      {children}
    </blockquote>
  );
}

function StrongComponent({ children }: { children?: React.ReactNode }) {
  return <strong style={{ fontWeight: '600' }}>{children}</strong>;
}

function EmComponent({ children }: { children?: React.ReactNode }) {
  return <em style={{ fontStyle: 'italic' }}>{children}</em>;
}

function LinkComponent({ href, children }: { href?: string; children?: React.ReactNode }) {
  const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.borderBottomColor = '#2563eb';
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.borderBottomColor = 'transparent';
  };

  return (
    <a
      href={href}
      target='_blank'
      rel='noopener noreferrer'
      style={{
        color: '#2563eb',
        textDecoration: 'none',
        borderBottom: '1px solid transparent',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </a>
  );
}

function TableComponent({ children }: { children?: React.ReactNode }) {
  return (
    <div style={{ overflowX: 'auto', margin: '8px 0' }}>
      <table
        style={{
          borderCollapse: 'collapse',
          width: '100%',
          fontSize: '14px',
        }}
      >
        {children}
      </table>
    </div>
  );
}

function TheadComponent({ children }: { children?: React.ReactNode }) {
  return <thead>{children}</thead>;
}

function TbodyComponent({ children }: { children?: React.ReactNode }) {
  return <tbody>{children}</tbody>;
}

function TrComponent({ children }: { children?: React.ReactNode }) {
  return <tr style={{ borderBottom: '1px solid #e5e7eb' }}>{children}</tr>;
}

function ThComponent({ children, style, ...props }: { children?: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <th
      {...props}
      style={{
        border: '1px solid #d1d5db',
        padding: '6px 12px',
        backgroundColor: '#f3f4f6',
        fontWeight: '600',
        textAlign: 'left',
        ...style,
      }}
    >
      {children}
    </th>
  );
}

function TdComponent({ children, style, ...props }: { children?: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <td
      {...props}
      style={{
        border: '1px solid #d1d5db',
        padding: '6px 12px',
        ...style,
      }}
    >
      {children}
    </td>
  );
}

// Define custom components with proper typing
const markdownComponents: Components = {
  p: ParagraphComponent,
  h1: H1Component,
  h2: H2Component,
  h3: H3Component,
  ul: UlComponent,
  ol: OlComponent,
  li: LiComponent,
  code: CodeComponent,
  blockquote: BlockquoteComponent,
  strong: StrongComponent,
  em: EmComponent,
  a: LinkComponent,
  table: TableComponent,
  thead: TheadComponent,
  tbody: TbodyComponent,
  tr: TrComponent,
  th: ThComponent,
  td: TdComponent,
};

export function MessageBubble({
  isAssistant,
  content,
  attachments,
  senderName,
  timestamp,
  className,
  'data-testid': testId,
}: MessageBubbleProps) {
  const defaultSenderName = isAssistant ? 'Mia' : 'You';
  const displayName = senderName || defaultSenderName;
  const displayTime = formatTime(timestamp);

  // Fallback function to render plain text if markdown fails
  const renderFallback = () => (
    <MessageGroup
      isUser={!isAssistant}
      className={className}
      data-testid={testId || `message-bubble-${isAssistant ? 'assistant' : 'human'}`}
    >
      {(displayName || displayTime) && (
        <MessageMeta isUser={!isAssistant}>
          {displayName && <span>{displayName}</span>}
          {displayTime && <span>{displayTime}</span>}
        </MessageMeta>
      )}
      <MessageBubbleStyled isUser={!isAssistant}>
        <div style={{ whiteSpace: 'pre-wrap' }}>{content}</div>
      </MessageBubbleStyled>
    </MessageGroup>
  );

  // Validate content before attempting markdown parsing
  if (!content || typeof content !== 'string') {
    return renderFallback();
  }

  return (
    <MessageGroup
      isUser={!isAssistant}
      className={className}
      data-testid={testId || `message-bubble-${isAssistant ? 'assistant' : 'human'}`}
    >
      {(displayName || displayTime) && (
        <MessageMeta isUser={!isAssistant} data-testid={`${testId || 'message'}-meta`}>
          {displayName && <span data-testid={`${testId || 'message'}-sender`}>{displayName}</span>}
          {displayTime && <span data-testid={`${testId || 'message'}-time`}>{displayTime}</span>}
        </MessageMeta>
      )}

      <MessageBubblesContainer isUser={!isAssistant}>
        {/* Show attachments as separate bubbles on top */}
        {attachments &&
          attachments.map((attachment, index) => (
            <MessageBubbleStyled
              key={attachment.url}
              isUser={!isAssistant}
              data-testid={`${testId || 'message'}-attachment-${index}`}
              isAttachment
            >
              <FileIcon size={16} color='#2563eb' />
              <MessageFileMetadata>
                <p className='file-name'>{attachment.name}</p>
                {attachment.size && <span className='file-size'>{formatFileSize(attachment.size)}</span>}
              </MessageFileMetadata>
            </MessageBubbleStyled>
          ))}

        <MessageBubbleStyled isUser={!isAssistant} data-testid={`${testId || 'message'}-content`}>
          <MarkdownErrorBoundary fallback={<div style={{ whiteSpace: 'pre-wrap' }}>{content}</div>}>
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
              {content}
            </ReactMarkdown>
          </MarkdownErrorBoundary>
        </MessageBubbleStyled>
      </MessageBubblesContainer>
    </MessageGroup>
  );
}

export default MessageBubble;
