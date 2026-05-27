import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ChatInput } from '../src/AIChatBot/ChatInput';

const meta: Meta<typeof ChatInput> = {
  title: 'm-one/Ai-Prompt/ChatInput',
  component: ChatInput,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Chat input component with auto-resizing textarea, file attachment button (paperclip icon), and circular send button (arrow icon). Supports both controlled and uncontrolled modes.',
      },
    },
  },
  argTypes: {
    placeholder: {
      control: 'text',
      description: 'Placeholder text for the input',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the input is disabled',
    },
    isLoading: {
      control: 'boolean',
      description: 'Whether the component is in loading state',
    },
    maxLength: {
      control: 'number',
      description: 'Maximum character limit',
    },
    acceptedFileTypes: {
      control: 'text',
      description: 'Accepted file types for attachment',
    },
    value: {
      control: 'text',
      description: 'Input value (controlled mode)',
    },
    controlled: {
      control: 'boolean',
      description: 'Whether this is a controlled component',
    },
    onSubmit: {
      action: 'onSubmit',
      description: 'Callback when message is submitted',
    },
    onChange: {
      action: 'onChange',
      description: 'Callback when input value changes',
    },
    onStop: {
      action: 'onStop',
      description: 'Callback when stop button is clicked (shown when isLoading is true)',
    },
    onFileAttach: {
      action: 'onFileAttach',
      description: 'Callback when files are attached',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '288px', padding: '16px', backgroundColor: '#f3f4f6' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithCustomPlaceholder: Story = {
  args: {
    placeholder: 'Ask me about your app...',
  },
};

export const WithText: Story = {
  args: {
    value: 'Create a customer management system',
    controlled: true,
  },
};

export const WithLongText: Story = {
  args: {
    value:
      'I need an application that can track customer information, their orders, payment history, and communication logs. It should also integrate with our existing email system and provide reporting capabilities for sales analysis.',
    controlled: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const Loading: Story = {
  args: {
    isLoading: true,
    value: 'Processing your request...',
    controlled: true,
  },
};

export const StopButton: Story = {
  args: {
    isLoading: true,
    value: 'Processing your request...',
    controlled: true,
    onStop: () => console.log('Stop button clicked'),
  },
  parameters: {
    docs: {
      description: {
        story: 'When isLoading is true and onStop is provided, the send button becomes a stop button with an X icon.',
      },
    },
  },
};

export const WithMaxLength: Story = {
  args: {
    maxLength: 100,
    placeholder: 'Max 100 characters...',
  },
};

export const CustomFileTypes: Story = {
  args: {
    acceptedFileTypes: '.json,.xml,.csv',
    placeholder: 'Attach data files...',
  },
};

export const ImageOnlyAttachment: Story = {
  args: {
    acceptedFileTypes: 'image/*',
    placeholder: 'Attach images only...',
  },
};

export const ReadyToSend: Story = {
  args: {
    value: 'Create a task management app',
    controlled: true,
  },
};

export const EmptyState: Story = {
  args: {
    value: '',
    controlled: true,
  },
};
