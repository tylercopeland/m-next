import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { TaskProgress, TaskProgressItem } from '../src/AIChatBot/TaskProgress';

const meta: Meta<typeof TaskProgress> = {
  title: 'm-one/Ai-Prompt/TaskProgress',
  component: TaskProgress,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Task progress component that displays a list of tasks with completion status. Each task shows a checkmark when completed and is clickable to view details.',
      },
    },
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Title for the progress section',
    },
    tasks: {
      control: 'object',
      description: 'Array of task items',
    },
    onTaskClick: {
      action: 'onTaskClick',
      description: 'Callback when a task is clicked',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '280px', padding: '16px' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

const completedTasks: TaskProgressItem[] = [
  { id: '1', label: 'User Roles', isCompleted: true },
  { id: '2', label: 'Features', isCompleted: true },
  { id: '3', label: 'Data Entities', isCompleted: true },
  { id: '4', label: 'Business Rules', isCompleted: true },
  { id: '5', label: 'Screens', isCompleted: true },
];

const partialTasks: TaskProgressItem[] = [
  { id: '1', label: 'User Roles', isCompleted: true },
  { id: '2', label: 'Features', isCompleted: true },
  { id: '3', label: 'Data Entities', isCompleted: false },
  { id: '4', label: 'Business Rules', isCompleted: false },
  { id: '5', label: 'Screens', isCompleted: false },
];

const singleCompletedTask: TaskProgressItem[] = [
  { id: '1', label: 'User Roles', isCompleted: true },
  { id: '2', label: 'Features', isCompleted: false },
  { id: '3', label: 'Data Entities', isCompleted: false },
  { id: '4', label: 'Business Rules', isCompleted: false },
  { id: '5', label: 'Screens', isCompleted: false },
];

const noCompletedTasks: TaskProgressItem[] = [
  { id: '1', label: 'User Roles', isCompleted: false },
  { id: '2', label: 'Features', isCompleted: false },
  { id: '3', label: 'Data Entities', isCompleted: false },
  { id: '4', label: 'Business Rules', isCompleted: false },
  { id: '5', label: 'Screens', isCompleted: false },
];

export const Default: Story = {
  args: {
    tasks: completedTasks,
  },
};

export const WithCustomTitle: Story = {
  args: {
    title: 'Your App Blueprint',
    tasks: completedTasks,
  },
};

export const PartiallyCompleted: Story = {
  args: {
    tasks: partialTasks,
  },
};

export const SingleTaskCompleted: Story = {
  args: {
    tasks: singleCompletedTask,
  },
};

export const NoTasksCompleted: Story = {
  args: {
    tasks: noCompletedTasks,
  },
};

export const ThreeTasks: Story = {
  args: {
    tasks: [
      { id: '1', label: 'Define Requirements', isCompleted: true },
      { id: '2', label: 'Design Schema', isCompleted: true },
      { id: '3', label: 'Build Screens', isCompleted: false },
    ],
  },
};

export const LongTaskNames: Story = {
  args: {
    tasks: [
      { id: '1', label: 'User Authentication and Authorization', isCompleted: true },
      { id: '2', label: 'Database Schema Design', isCompleted: true },
      { id: '3', label: 'API Endpoint Configuration', isCompleted: false },
      { id: '4', label: 'Frontend Component Library', isCompleted: false },
    ],
  },
};

export const EmptyTasks: Story = {
  args: {
    tasks: [],
  },
};

export const SingleTask: Story = {
  args: {
    tasks: [{ id: '1', label: 'Initialize Project', isCompleted: true }],
  },
};

export const ManyTasks: Story = {
  args: {
    tasks: [
      { id: '1', label: 'User Roles', isCompleted: true },
      { id: '2', label: 'Features', isCompleted: true },
      { id: '3', label: 'Data Entities', isCompleted: true },
      { id: '4', label: 'Business Rules', isCompleted: true },
      { id: '5', label: 'Screens', isCompleted: true },
      { id: '6', label: 'Workflows', isCompleted: false },
      { id: '7', label: 'Integrations', isCompleted: false },
      { id: '8', label: 'Security', isCompleted: false },
    ],
  },
};
