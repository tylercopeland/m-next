import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { AiChatBox } from '../src/AIChatBot/AiChatBox';
import { ChatMessage, MessageRole, createTextContent } from '@m-next/api-interface';
import { TaskProgressItem } from '../src/AIChatBot/TaskProgress';

const meta: Meta<typeof AiChatBox> = {
  title: 'm-one/Ai-Prompt/AiChatBox',
  component: AiChatBox,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'AI Chat interface sidebar component. Displays conversation history with user and AI messages, task progress tracking, and input field with file attachment support.',
      },
    },
  },
  argTypes: {
    messages: {
      control: 'object',
      description: 'Array of chat messages',
    },
    isLoading: {
      control: 'boolean',
      description: 'Whether the AI is currently processing',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text for the input field',
    },
    userName: {
      control: 'text',
      description: 'Name to display for user messages',
    },
    assistantName: {
      control: 'text',
      description: 'Name to display for AI messages',
    },
    taskProgress: {
      control: 'object',
      description: 'Array of task progress items',
    },
    taskProgressTitle: {
      control: 'text',
      description: 'Title for the task progress section',
    },
    onCloseClick: {
      action: 'close clicked',
      description: 'Callback when the close button is clicked',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ height: '600px', display: 'flex' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Helper function to create messages
const createMessage = (id: string, role: MessageRole, text: string, timestamp: string): ChatMessage => ({
  id,
  role,
  content: [createTextContent(text)],
  timestamp,
});

// Sample messages
const sampleMessages: ChatMessage[] = [
  createMessage('1', MessageRole.HUMAN, 'Create a locker rental app', '2024-01-15T15:49:00Z'),
  createMessage(
    '2',
    MessageRole.ASSISTANT,
    'Great! I have a few questions to help me build the perfect Locker Rental app for you:',
    '2024-01-15T15:49:30Z',
  ),
  createMessage(
    '3',
    MessageRole.ASSISTANT,
    '**Question 1:** What kind of information do you want to track for each locker? (e.g., size, location, availability, rental period)',
    '2024-01-15T15:49:35Z',
  ),
];

const conversationMessages: ChatMessage[] = [
  createMessage('1', MessageRole.HUMAN, 'Create a locker rental app', '2024-01-15T15:49:00Z'),
  createMessage(
    '2',
    MessageRole.ASSISTANT,
    'Great! I have a few questions to help me build the perfect Vinyl Collection Manager for you:',
    '2024-01-15T15:49:30Z',
  ),
  createMessage(
    '3',
    MessageRole.ASSISTANT,
    '**Question 1:** What kind of information do you want to track for each vinyl record? (e.g., artist, album, condition, purchase date, price)',
    '2024-01-15T15:49:35Z',
  ),
  createMessage('4', MessageRole.HUMAN, 's', '2024-01-15T17:04:00Z'),
  createMessage(
    '5',
    MessageRole.ASSISTANT,
    '**Question 2:** Do you want to track the location of your records (e.g., shelf number, room) or organize them by genre/artist?',
    '2024-01-15T17:04:15Z',
  ),
  createMessage('6', MessageRole.HUMAN, 's', '2024-01-15T17:04:30Z'),
  createMessage(
    '7',
    MessageRole.ASSISTANT,
    '**Question 3:** Would you like features for tracking wishlist items, valuations, or sharing your collection with others?',
    '2024-01-15T17:04:45Z',
  ),
  createMessage('8', MessageRole.HUMAN, 's', '2024-01-15T17:05:00Z'),
  createMessage(
    '9',
    MessageRole.ASSISTANT,
    'Perfect! I have all the information I need. Let me create your Vinyl Collection Manager app plan...',
    '2024-01-15T17:05:15Z',
  ),
];

// Sample task progress
const sampleTaskProgress: TaskProgressItem[] = [
  { id: '1', label: 'User Roles', isCompleted: true },
  { id: '2', label: 'Features', isCompleted: true },
  { id: '3', label: 'Data Entities', isCompleted: true },
  { id: '4', label: 'Business Rules', isCompleted: true },
  { id: '5', label: 'Screens', isCompleted: true },
];

const partialTaskProgress: TaskProgressItem[] = [
  { id: '1', label: 'User Roles', isCompleted: true },
  { id: '2', label: 'Features', isCompleted: true },
  { id: '3', label: 'Data Entities', isCompleted: false },
  { id: '4', label: 'Business Rules', isCompleted: false },
  { id: '5', label: 'Screens', isCompleted: false },
];

export const Default: Story = {
  args: {
    messages: sampleMessages,
    onCloseClick: () => {},
  },
};

export const Empty: Story = {
  args: {
    messages: [],
    onCloseClick: () => {},
  },
};

export const WithCustomUserName: Story = {
  args: {
    messages: sampleMessages,
    userName: 'Tyler',
    onCloseClick: () => {},
  },
};

export const WithCustomAssistantName: Story = {
  args: {
    messages: sampleMessages,
    assistantName: 'Custom AI',
    onCloseClick: () => {},
  },
};

export const Loading: Story = {
  args: {
    messages: sampleMessages,
    isLoading: true,
    onCloseClick: () => {},
  },
};

export const WithTaskProgress: Story = {
  args: {
    messages: conversationMessages,
    taskProgress: sampleTaskProgress,
    onCloseClick: () => {},
  },
};

export const WithPartialTaskProgress: Story = {
  args: {
    messages: sampleMessages,
    taskProgress: partialTaskProgress,
    onCloseClick: () => {},
  },
};

export const WithCustomTaskProgressTitle: Story = {
  args: {
    messages: sampleMessages,
    taskProgress: sampleTaskProgress,
    taskProgressTitle: 'Your App Blueprint',
    onCloseClick: () => {},
  },
};

export const FullConversation: Story = {
  args: {
    messages: conversationMessages,
    taskProgress: sampleTaskProgress,
    userName: 'Tyler',
    assistantName: 'Mia',
    onCloseClick: () => {},
  },
};

export const WithCustomPlaceholder: Story = {
  args: {
    messages: sampleMessages,
    placeholder: 'Ask me about your app...',
    onCloseClick: () => {},
  },
};

export const LongConversation: Story = {
  args: {
    messages: [
      ...conversationMessages,
      createMessage(
        '10',
        MessageRole.ASSISTANT,
        'Your plan is complete! Review it on the right and feel free to ask me any questions for clarification or let me help you make specific adjustments.',
        '2024-01-15T17:05:30Z',
      ),
      createMessage('11', MessageRole.HUMAN, 'Can you add a reporting feature?', '2024-01-15T17:06:00Z'),
      createMessage(
        '12',
        MessageRole.ASSISTANT,
        'Absolutely! I can add reporting capabilities. What kind of reports would you like? Options include:\n\n1. **Collection Summary** - Overview of your entire collection\n2. **Value Reports** - Track total value and appreciation\n3. **Genre Analytics** - Breakdown by genre/artist\n4. **Acquisition Timeline** - When you added records',
        '2024-01-15T17:06:30Z',
      ),
    ],
    taskProgress: sampleTaskProgress,
  },
};
