import type { Meta, StoryObj } from '@storybook/react';
import AppActivationOverlay from '../src/appActivationOverlay';

const meta: Meta<typeof AppActivationOverlay> = {
  component: AppActivationOverlay,
  title: 'm-one/AppActivationOverlay',
  argTypes: {
    iconName: {
      control: { type: 'text' },
      description: 'Icon to display at the top',
    },
    title: {
      control: { type: 'text' },
      description: 'Main title text',
    },
    description: {
      control: { type: 'text' },
      description: 'Description text below title',
    },
    sectionTitle: {
      control: { type: 'text' },
      description: 'Optional section title for bullet points',
    },
    dismissible: {
      control: { type: 'boolean' },
      description: 'Shows/hides the close button',
    },
    showPrimaryCTA: {
      control: { type: 'boolean' },
      description: 'Shows/hides primary CTA button',
    },
    showSecondaryCTA: {
      control: { type: 'boolean' },
      description: 'Shows/hides secondary CTA button',
    },
    onClose: { action: 'onClose' },
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
      url: 'https://www.figma.com/design/sQcN725aGMAha5BuRFqZJh/Growth-2026-Projects?node-id=71-4037&m=dev',
    },
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof AppActivationOverlay>;

// Default story with full content
export const Default: Story = {
  args: {
    id: 'default-overlay',
    iconName: 'invoice',
    title: 'Turn opportunities into closed deals',
    description:
      "Opportunities helps you track potential revenue, understand deal progress, and focus your efforts where they'll have the biggest impact.",
    sectionTitle: 'Why use Opportunities?',
    bulletPoints: [
      { id: '1', text: 'Track deals through every stage of your sales pipeline' },
      { id: '2', text: 'Forecast revenue with close dates and deal values' },
      { id: '3', text: 'Prioritize the right opportunities with clear deal details' },
      { id: '4', text: 'Assign owners and track activity across your team' },
    ],
    primaryCTA: {
      id: 'primary-cta',
      text: 'Create your first opportunity',
      onClick: () => console.log('Primary CTA clicked'),
    },
    secondaryCTA: {
      id: 'secondary-cta',
      text: 'Learn more',
      onClick: () => console.log('Secondary CTA clicked'),
    },
    showPrimaryCTA: true,
    showSecondaryCTA: true,
    dismissible: true,
  },
};

// With mockup element
export const WithMockup: Story = {
  args: {
    ...Default.args,
    image: (
      <div
        style={{
          width: '100%',
          aspectRatio: '1',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '18px',
          fontWeight: 600,
        }}
      >
        Mockup Preview
      </div>
    ),
  },
};

// Simple version without section title or bullets
export const Simple: Story = {
  args: {
    id: 'simple-overlay',
    iconName: 'invoice',
    title: 'Welcome to the feature',
    description: 'This is a simple overlay with just a title, description, and action buttons.',
    primaryCTA: {
      id: 'get-started',
      text: 'Get Started',
      onClick: () => console.log('Get Started clicked'),
    },
    showPrimaryCTA: true,
    dismissible: true,
  },
};

// With only primary button
export const PrimaryButtonOnly: Story = {
  args: {
    id: 'primary-only',
    iconName: 'invoice',
    title: 'Start your journey',
    description: 'Click below to get started with this amazing feature.',
    primaryCTA: {
      id: 'start',
      text: 'Start Now',
      onClick: () => console.log('Start clicked'),
    },
    showPrimaryCTA: true,
    showSecondaryCTA: false,
    dismissible: true,
  },
};

// With bullet points but no section title
export const BulletPointsOnly: Story = {
  args: {
    id: 'bullets-only',
    iconName: 'invoice',
    title: 'Key Benefits',
    description: 'Here are the main advantages of using this feature:',
    bulletPoints: [
      { id: '1', text: 'Save time with automation' },
      { id: '2', text: 'Increase team productivity' },
      { id: '3', text: 'Get better insights' },
    ],
    primaryCTA: {
      id: 'learn-more',
      text: 'Learn More',
      onClick: () => console.log('Learn More clicked'),
    },
    showPrimaryCTA: true,
    dismissible: true,
  },
};

// Non-dismissible version
export const NonDismissible: Story = {
  args: {
    ...Default.args,
    dismissible: false,
  },
};

// With image mockup
export const WithImageMockup: Story = {
  args: {
    ...Default.args,
    image: (
      <img
        src='https://picsum.photos/450'
        alt='Feature mockup'
        style={{
          width: '100%',
          aspectRatio: '1',
          borderRadius: '8px',
          objectFit: 'cover',
        }}
      />
    ),
  },
};

// Long content example
export const LongContent: Story = {
  args: {
    id: 'long-content',
    iconName: 'invoice',
    title: 'Comprehensive Feature Overview',
    description:
      'This is a longer description that explains the feature in more detail. It helps users understand what they can do with this feature and how it will benefit their workflow. The overlay can handle longer text content gracefully.',
    sectionTitle: 'Everything you need to know',
    bulletPoints: [
      { id: '1', text: 'First key benefit that provides significant value to users' },
      { id: '2', text: 'Second important feature that enhances productivity' },
      { id: '3', text: 'Third capability that streamlines your workflow' },
      { id: '4', text: 'Fourth advantage that helps you achieve better results' },
      { id: '5', text: 'Fifth benefit that makes your work easier and faster' },
      { id: '6', text: 'Sixth feature that provides additional flexibility' },
    ],
    primaryCTA: {
      id: 'get-started',
      text: 'Get Started Now',
      onClick: () => console.log('Get Started clicked'),
    },
    secondaryCTA: {
      id: 'watch-demo',
      text: 'Watch Demo',
      onClick: () => console.log('Watch Demo clicked'),
    },
    showPrimaryCTA: true,
    showSecondaryCTA: true,
    dismissible: true,
  },
};
