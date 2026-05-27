/* eslint-disable import/no-extraneous-dependencies */
import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import AppActivationBanner from '../src/appActivationBanner';
import type { AppActivationBannerProps } from '../src/appActivationBanner';

const meta: Meta<typeof AppActivationBanner> = {
  component: AppActivationBanner,
  title: 'm-one/AppActivationBanner',
  argTypes: {
    backgroundColor: {
      control: 'select',
      options: ['blue-lighter', 'green-lighter', 'yellow-lighter', 'grey-lighter'],
    },
  },
  parameters: {
    cssresources: [
      {
        id: 'Method Styles',
        code: '<link rel="stylesheet" type="text/css" href="https://alocetsystem.method.me/apps/public/styles/styles.min.css"></link>',
        picked: true,
      },
    ],
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/sQcN725aGMAha5BuRFqZJh/Growth-2026-Projects?node-id=113-3390&m=dev',
    },
  },
};

export default meta;
type Story = StoryObj<typeof AppActivationBanner>;

// Template with state management for close
const Template = (args: AppActivationBannerProps) => {
  const [visible, setVisible] = useState(true);

  const handleClose = () => {
    setVisible(false);
    // Reset after 2 seconds for demo purposes
    setTimeout(() => setVisible(true), 2000);
  };

  return <AppActivationBanner {...args} visible={visible} onClose={handleClose} />;
};

// Default Invoice Overlay from Figma
export const InvoiceFeature: Story = {
  render: (args) => <Template {...args} />,
  args: {
    id: 'invoice-banner',
    iconName: 'invoice',
    title: 'Turn more prospects into paying customers',
    description:
      'Leads helps you capture, organize, and act on every potential opportunity so no prospect falls through the cracks. Stay focused on what matters — building pipeline and closing more business — with a clear, centralized view of all your leads and customer interactions.',
    sectionTitle: 'Why use Customers & Leads?',
    bulletPoints: [
      {
        id: 'bullet-1',
        text: 'Capture and organize leads instantly so you can act while interest is high',
      },
      {
        id: 'bullet-2',
        text: 'Track lead status and progress from new inquiry to qualified opportunity',
      },
      {
        id: 'bullet-3',
        text: 'Manage communications in one place to stay on top of follow-ups and next steps',
      },
      {
        id: 'bullet-4',
        text: 'Sync with your CRM automatically so your contacts and deals are always up to date',
      },
    ],
    primaryCTA: {
      id: 'primary-btn',
      text: 'Add your first contact',
      onClick: () => console.log('Primary button clicked'),
    },
    secondaryCTA: {
      id: 'secondary-btn',
      text: 'Learn more',
      onClick: () => console.log('Secondary button clicked'),
    },
    backgroundColor: 'blue-lighter',
    dismissible: true,
  },
};

// Simple version with minimal content
export const SimpleFeature: Story = {
  render: (args) => <Template {...args} />,
  args: {
    id: 'simple-banner',
    title: 'New Feature Available',
    description: 'Check out our latest feature to improve your workflow.',
    primaryCTA: {
      id: 'try-btn',
      text: 'Try it now',
      onClick: () => console.log('Try button clicked'),
    },
    dismissible: true,
  },
};

// With custom icon and colors
export const CustomStyling: Story = {
  render: (args) => <Template {...args} />,
  args: {
    id: 'custom-banner',
    iconName: 'bell',
    title: 'Important Update',
    description: 'We have made important changes to how data synchronization works.',
    sectionTitle: "What's New",
    bulletPoints: [
      {
        id: 'bullet-1',
        text: 'Real-time sync across all devices',
      },
      {
        id: 'bullet-2',
        text: 'Automatic conflict resolution',
      },
    ],
    primaryCTA: {
      id: 'learn-btn',
      text: 'Learn More',
      onClick: () => console.log('Learn more clicked'),
    },
    backgroundColor: 'green-lighter',
    dismissible: true,
  },
};

// Without close button
export const NoCloseButton: Story = {
  render: (args) => <Template {...args} />,
  args: {
    id: 'no-close-banner',
    iconName: 'lightbulb',
    title: 'Pro Tip',
    description: 'Use keyboard shortcuts to navigate faster through your workflow.',
    dismissible: false,
  },
};

// Multiple bullet points (6 items, 3 per column)
export const ManyBulletPoints: Story = {
  render: (args) => <Template {...args} />,
  args: {
    id: 'many-bullets-banner',
    iconName: 'star',
    title: 'Comprehensive Feature Set',
    description: 'Everything you need to manage your business effectively.',
    bulletPoints: [
      { id: 'b1', text: 'Advanced reporting and analytics' },
      { id: 'b2', text: 'Custom workflows and automation' },
      { id: 'b3', text: 'Multi-user collaboration' },
      { id: 'b4', text: 'Mobile app support' },
      { id: 'b5', text: 'Priority customer support' },
      { id: 'b6', text: 'Regular feature updates' },
    ],
    primaryCTA: {
      id: 'upgrade-btn',
      text: 'Upgrade Now',
      onClick: () => console.log('Upgrade clicked'),
    },
    secondaryCTA: {
      id: 'compare-btn',
      text: 'Compare Plans',
      onClick: () => console.log('Compare clicked'),
    },
    dismissible: true,
  },
};

// With only primary button
export const SingleButton: Story = {
  render: (args) => <Template {...args} />,
  args: {
    id: 'single-button-banner',
    iconName: 'checkmark',
    title: 'Setup Complete',
    description: 'Your account is ready to use. Start exploring the features now.',
    primaryCTA: {
      id: 'get-started-btn',
      text: 'Get Started',
      onClick: () => console.log('Get started clicked'),
    },
    dismissible: true,
  },
};

// Warning style
export const WarningBanner: Story = {
  render: (args) => <Template {...args} />,
  args: {
    id: 'warning-banner',
    iconName: 'alert-triangle',
    title: 'Action Required',
    description: 'Your trial period expires in 3 days. Upgrade to continue using all features.',
    bulletPoints: [
      { id: 'w1', text: 'Unlimited access to all features' },
      { id: 'w2', text: 'Priority support' },
    ],
    primaryCTA: {
      id: 'upgrade-btn',
      text: 'Upgrade Account',
      onClick: () => console.log('Upgrade clicked'),
    },
    secondaryCTA: {
      id: 'remind-btn',
      text: 'Remind me later',
      onClick: () => console.log('Remind later clicked'),
    },
    backgroundColor: 'yellow-lighter',
    dismissible: true,
  },
};

// No icon
export const NoIcon: Story = {
  render: (args) => <Template {...args} />,
  args: {
    id: 'no-icon-banner',
    title: 'Welcome to Method',
    description: 'Start building your business workflows with our powerful platform.',
    bulletPoints: [
      { id: 'n1', text: 'Easy to use interface' },
      { id: 'n2', text: 'Powerful automation' },
    ],
    primaryCTA: {
      id: 'start-btn',
      text: 'Start Tutorial',
      onClick: () => console.log('Tutorial clicked'),
    },
    dismissible: true,
  },
};
