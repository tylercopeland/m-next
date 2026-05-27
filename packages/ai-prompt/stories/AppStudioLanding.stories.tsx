import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import AppStudioLanding from '../src/AppStudioLanding/AppStudioLanding';
import { AppCardProps } from '../src/AppStudioLanding/AppStudioCard';

const meta: Meta<typeof AppStudioLanding> = {
  title: 'm-one/Ai-Prompt/AppStudioLanding',
  component: AppStudioLanding,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Landing page component for AI-powered app creation. Features a personalized greeting, AI prompt input, and help section with team contact option. Designed to provide a clean, focused entry point for users to start building apps with AI assistance.',
      },
    },
  },
  argTypes: {
    userName: {
      control: 'text',
      description: "User's name to display in the personalized greeting",
    },
    onGenerateClick: {
      action: 'onGenerateClick',
      description: 'Callback when user submits a prompt to generate an app',
    },
    onContactTeam: {
      action: 'onContactTeam',
      description: 'Callback when user clicks the contact team button',
    },
    apps: {
      control: 'object',
      description: 'List of AI apps created by the user',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ minHeight: '100vh', background: 'rgb(249, 250, 251)' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    userName: 'Mike',
  },
};

const exampleApps: AppCardProps[] = [
  {
    appName: 'App name',
    updatedAt: '1 hour ago',
    updatedBy: 'John Smith',
    status: 'planning',
  },
  {
    appName: 'Inventory Tracker',
    updatedAt: '2 days ago',
    updatedBy: 'Jane Doe',
    status: 'draft',
  },
  {
    appName: 'Sales Tracker',
    updatedAt: '2 days ago',
    updatedBy: 'Jane Doe',
    status: 'published',
  },
];

export const WithApps: Story = {
  args: {
    userName: 'John Doe',
    apps: exampleApps,
  },
};
