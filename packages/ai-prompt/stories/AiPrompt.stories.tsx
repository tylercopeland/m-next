import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { AiPrompt } from '../src/AiPrompt/AiPrompt';
import { AiPromptProps } from '../src/types';

const meta: Meta<typeof AiPrompt> = {
  title: 'm-one/Ai-Prompt/AiPrompt',
  component: AiPrompt,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'AI prompt component for interacting with AI assistants. Includes a multiline input area and submit button with support for API communication.',
      },
    },
  },
  argTypes: {
    assistantId: {
      control: 'text',
      description: 'GUID for the assistant ID',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text for the input area',
    },
    buttonText: {
      control: 'text',
      description: 'Text for the submit button',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the component is disabled',
    },
    maxLength: {
      control: 'number',
      description: 'Maximum character limit for the prompt',
    },
    minRows: {
      control: 'number',
      description: 'Minimum rows for the textarea',
    },
    maxRows: {
      control: 'number',
      description: 'Maximum rows for the textarea',
    },
    isLoading: {
      control: 'boolean',
      description: 'Loading state indicator',
    },
    onSubmit: {
      action: 'onSubmit',
      description: 'Callback when prompt is submitted',
    },
    onChange: {
      action: 'onChange',
      description: 'Callback when input value changes',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const defaultCallbacks = {
  baseUrl: 'https://api.example.com',
  authToken: 'demo-token',
};

const defaultArgs: Partial<AiPromptProps> = {
  assistantId: 'demo-assistant-123',
};

export const Default: Story = {
  args: {
    ...defaultArgs,
    placeholder:
      "I'm here to help with your data! Whether you want to create something new or understand what you already have, just tell me what you're thinking.",
  },
};

export const WithCustomPlaceholder: Story = {
  args: {
    ...defaultArgs,
    placeholder: 'Ask me anything about your data...',
  },
};

export const WithCustomButtonText: Story = {
  args: {
    ...defaultArgs,
    buttonText: 'Ask AI',
  },
};

export const Loading: Story = {
  args: {
    ...defaultArgs,
    isLoading: true,
  },
};

export const Disabled: Story = {
  args: {
    ...defaultArgs,
    disabled: true,
  },
};
