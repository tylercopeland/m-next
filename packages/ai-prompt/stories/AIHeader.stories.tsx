import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { AIHeader } from '../src/AIChatBot/AIHeader';

const meta: Meta<typeof AIHeader> = {
  title: 'm-one/Ai-Prompt/AIHeader',
  component: AIHeader,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'AI Chat header component that displays "Powered by [AI Name]" branding with a sparkles icon. Provides visual identity for the AI assistant.',
      },
    },
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Name of the AI assistant',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '320px', backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }}>
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

export const WithCustomName: Story = {
  args: {
    title: 'Custom AI',
  },
};

export const WithLongName: Story = {
  args: {
    title: 'Advanced Intelligence Assistant',
  },
};

export const WithShortName: Story = {
  args: {
    title: 'AI',
  },
};

export const Copilot: Story = {
  args: {
    title: 'Copilot',
  },
};

export const Assistant: Story = {
  args: {
    title: 'Assistant',
  },
};

export const Claude: Story = {
  args: {
    title: 'Claude',
  },
};

export const GPT: Story = {
  args: {
    title: 'GPT-4',
  },
};
