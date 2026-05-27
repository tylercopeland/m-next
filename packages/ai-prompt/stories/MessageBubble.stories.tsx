import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { MessageBubble } from '../src/AIChatBot/MessageBubble';

const meta: Meta<typeof MessageBubble> = {
  title: 'm-one/Ai-Prompt/MessageBubble',
  component: MessageBubble,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Message bubble component that displays chat messages with sender name, timestamp, and content. Supports Markdown rendering for rich text formatting. User messages are right-aligned with blue background, AI messages are left-aligned with gray background.',
      },
    },
  },
  argTypes: {
    isAssistant: {
      control: 'boolean',
      description: 'Whether this is an assistant message (true) or user message (false)',
    },
    content: {
      control: 'text',
      description: 'The message content (supports Markdown)',
    },
    senderName: {
      control: 'text',
      description: 'Name of the sender',
    },
    timestamp: {
      control: 'text',
      description: 'ISO timestamp for the message',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '288px', padding: '16px' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

const currentTime = new Date().toISOString();

export const UserMessage: Story = {
  args: {
    isAssistant: false,
    content: 'Create a locker rental app',
    senderName: 'Tyler',
    timestamp: '2024-01-15T15:49:00Z',
  },
};

export const AssistantMessage: Story = {
  args: {
    isAssistant: true,
    content: 'Great! I have a few questions to help me build the perfect Locker Rental app for you:',
    senderName: 'Mia',
    timestamp: '2024-01-15T15:49:30Z',
  },
};

export const DefaultSenderNames: Story = {
  args: {
    isAssistant: true,
    content: 'This message uses the default sender name.',
    timestamp: currentTime,
  },
};

export const WithMarkdownBold: Story = {
  args: {
    isAssistant: true,
    content: '**Question 1:** What kind of information do you want to track for each vinyl record?',
    senderName: 'Mia',
    timestamp: '2024-01-15T15:49:35Z',
  },
};

export const WithMarkdownList: Story = {
  args: {
    isAssistant: true,
    content: `Here are some options:

1. **Collection Summary** - Overview of your entire collection
2. **Value Reports** - Track total value and appreciation
3. **Genre Analytics** - Breakdown by genre/artist
4. **Acquisition Timeline** - When you added records`,
    senderName: 'Mia',
    timestamp: '2024-01-15T17:06:30Z',
  },
};

export const WithCodeBlock: Story = {
  args: {
    isAssistant: true,
    content: `Here's how to query your data:

\`\`\`sql
SELECT * FROM lockers
WHERE status = 'available'
ORDER BY size;
\`\`\``,
    senderName: 'Mia',
    timestamp: currentTime,
  },
};

export const WithInlineCode: Story = {
  args: {
    isAssistant: true,
    content: 'Use the \`createTable()\` function to add a new table to your schema.',
    senderName: 'Mia',
    timestamp: currentTime,
  },
};

export const WithLink: Story = {
  args: {
    isAssistant: true,
    content: 'You can learn more about data modeling in our [documentation](https://docs.example.com).',
    senderName: 'Mia',
    timestamp: currentTime,
  },
};

export const LongMessage: Story = {
  args: {
    isAssistant: true,
    content: `I understand your requirements. Based on what you've described, I recommend setting up the following structure:

**Tables:**
- Lockers (ID, Size, Location, Status)
- Rentals (ID, LockerID, CustomerID, StartDate, EndDate)
- Customers (ID, Name, Email, Phone)

**Features:**
- Real-time availability tracking
- Automated billing
- Email notifications
- Usage analytics

Would you like me to proceed with this design?`,
    senderName: 'Mia',
    timestamp: currentTime,
  },
};

export const ShortUserMessage: Story = {
  args: {
    isAssistant: false,
    content: 's',
    senderName: 'Tyler',
    timestamp: '2024-01-15T17:04:00Z',
  },
};

export const QuestionMessage: Story = {
  args: {
    isAssistant: false,
    content: 'Can you add a reporting feature?',
    senderName: 'Tyler',
    timestamp: '2024-01-15T17:06:00Z',
  },
};

export const WithTable: Story = {
  args: {
    isAssistant: true,
    content: `Here's the pricing breakdown:

| Size | Daily Rate | Weekly Rate |
|------|-----------|-------------|
| Small | $5 | $25 |
| Medium | $10 | $50 |
| Large | $20 | $100 |`,
    senderName: 'Mia',
    timestamp: currentTime,
  },
};

export const WithBlockquote: Story = {
  args: {
    isAssistant: true,
    content: `Based on best practices:

> Always validate user input before processing
> Implement proper error handling
> Use transactions for data integrity

These principles will ensure your app is robust.`,
    senderName: 'Mia',
    timestamp: currentTime,
  },
};

export const NoTimestamp: Story = {
  args: {
    isAssistant: true,
    content: 'This message has no timestamp displayed.',
    senderName: 'Mia',
  },
};

export const CustomAssistantName: Story = {
  args: {
    isAssistant: true,
    content: 'I am a custom AI assistant with a different name.',
    senderName: 'Custom AI',
    timestamp: currentTime,
  },
};

export const CustomUserName: Story = {
  args: {
    isAssistant: false,
    content: 'My name is customized in the display.',
    senderName: 'John Doe',
    timestamp: currentTime,
  },
};

export const WithSingleAttachment: Story = {
  args: {
    isAssistant: false,
    content: 'Here is the spreadsheet with the data you requested.',
    senderName: 'Tyler',
    timestamp: currentTime,
    attachments: [
      {
        name: 'sales_data.xlsx',
        url: 'https://example.com/files/sales_data.xlsx',
        size: 245760,
      },
    ],
  },
};

export const WithMultipleAttachments: Story = {
  args: {
    isAssistant: false,
    content: 'I have attached the quarterly reports and the budget spreadsheet.',
    senderName: 'Tyler',
    timestamp: currentTime,
    attachments: [
      {
        name: 'Q1_Report.xlsx',
        url: 'https://example.com/files/Q1_Report.xlsx',
        size: 512000,
      },
      {
        name: 'Q2_Report.xlsx',
        url: 'https://example.com/files/Q2_Report.xlsx',
        size: 487424,
      },
      {
        name: 'Budget_2024.csv',
        url: 'https://example.com/files/Budget_2024.csv',
        size: 102400,
      },
    ],
  },
};

export const AssistantWithAttachment: Story = {
  args: {
    isAssistant: true,
    content: 'I have generated the report you requested. Please review the attached file.',
    senderName: 'Mia',
    timestamp: currentTime,
    attachments: [
      {
        name: 'Generated_Report.pdf',
        url: 'https://example.com/files/Generated_Report.pdf',
        size: 1048576,
      },
    ],
  },
};
