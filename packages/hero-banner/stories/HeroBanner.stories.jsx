import React from 'react';
import HeroBanner from '../src';

export default {
  component: HeroBanner,
  title: 'm-one/Hero Banner',
  argTypes: {
    backgroundColor: {
      control: { type: 'select' },
      options: ['blue-lighter', 'orange-lighter', 'green-lighter'],
    },
    imageSrc: {
      control: { type: 'text' },
    },
    isMobile: {
      control: { type: 'boolean' },
    },
    onPrimaryButtonClick: { action: 'primary clicked' },
    onSecondaryButtonClick: { action: 'secondary clicked' },
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
      url: 'https://www.figma.com/design/RtDzRM5HX6nK9EdPdydDEb/Growth---BigBet-Build?node-id=1207-3019&m=dev',
    },
  },
};

function Template(args) {
  return <HeroBanner {...args} />;
}

// Base Examples
export const Default = Template.bind({});
Default.args = {
  id: 'default',
  title: 'Welcome to Method',
  description: 'Get started with our platform and learn how Method can help you save time and win more work.',
  imageSrc:
    'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e002076/GSFC_20171208_Archive_e002076~medium.jpg',
  backgroundColor: 'blue-lighter',
};

export const WithPrimaryButton = Template.bind({});
WithPrimaryButton.args = {
  id: 'primary-button',
  title: 'Welcome to Method',
  description: 'Get started with our platform and learn how Method can help you save time and win more work.',
  imageSrc: 'https://images-assets.nasa.gov/image/GRC-2024-C-02645/GRC-2024-C-02645~medium.jpg',
  primaryButton: 'Get Started',
  backgroundColor: 'blue-lighter',
};

export const WithBothButtons = Template.bind({});
WithBothButtons.args = {
  id: 'both-buttons',
  title: 'Welcome to Method',
  description: 'Get started with our platform and learn how Method can help you save time and win more work.',
  imageSrc: 'https://images-assets.nasa.gov/image/PIA25163/PIA25163~medium.jpg',
  primaryButton: 'Get Started',
  secondaryButton: 'Learn More',
  backgroundColor: 'blue-lighter',
};

export const BlueWithImage = Template.bind({});
BlueWithImage.args = {
  id: 'blue-image',
  title: 'Schedule Your Demo',
  description: 'Book a personalized demo to see how Method works for your business.',
  imageSrc:
    'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000282/GSFC_20171208_Archive_e000282~small.jpg',
  primaryButton: 'Book Demo',
  backgroundColor: 'blue-lighter',
};

export const OrangeWithImage = Template.bind({});
OrangeWithImage.args = {
  id: 'orange-image',
  title: 'Active Campaign Running',
  description: 'Your marketing campaign is currently active and reaching customers.',
  imageSrc: 'https://images-assets.nasa.gov/image/PIA00342/PIA00342~medium.jpg',
  primaryButton: 'View Campaign',
  secondaryButton: 'Edit',
  backgroundColor: 'orange-lighter',
};

export const GreenWithImage = Template.bind({});
GreenWithImage.args = {
  id: 'green-image',
  title: 'Method Pay Ready',
  description: 'Start accepting online payments and get paid faster with Method Pay.',
  imageSrc: 'https://images-assets.nasa.gov/image/carina_nebula/carina_nebula~medium.jpg',
  primaryButton: 'Enable Payments',
  backgroundColor: 'green-lighter',
};

// Edge Cases
export const TitleOnly = Template.bind({});
TitleOnly.args = {
  id: 'title-only',
  title: 'Simple Title',
  imageSrc: 'https://placehold.co/600x400?text=Hello+World',
  backgroundColor: 'blue-lighter',
};

// Custom Styling
export const CustomStyling = Template.bind({});
CustomStyling.args = {
  id: 'custom-styling',
  title: 'Custom Styled Banner',
  description: 'This example shows custom styling capabilities.',
  imageSrc: 'https://images-assets.nasa.gov/image/iss070e034016/iss070e034016~medium.jpg',
  primaryButton: 'Custom Button',
  backgroundColor: 'orange-lighter',
  className: 'custom-hero-banner',
  style: { border: '2px solid #E05D2A', borderRadius: '16px' },
  iconContainerStyle: { transform: 'scale(1.2)' },
};

// Interactive Example
export const Interactive = Template.bind({});
Interactive.args = {
  id: 'interactive',
  title: 'Interactive Example',
  description: 'Click the buttons to see the actions in the Actions panel below.',
  imageSrc: 'https://images-assets.nasa.gov/image/iss073e0735314/iss073e0735314~medium.jpg',
  primaryButton: 'Primary Action',
  secondaryButton: 'Secondary Action',
  backgroundColor: 'blue-lighter',
};

// Mobile Examples
export const MobileDefault = Template.bind({});
MobileDefault.args = {
  id: 'mobile-default',
  title: 'Welcome to Method',
  description:
    "In just a few minutes, you'll learn how Method can help you save time, stay organized, and win more work — all from one place.",
  imageSrc: 'https://images-assets.nasa.gov/image/PIA25163/PIA25163~medium.jpg',
  primaryButton: 'Watch get started video',
  backgroundColor: 'blue-lighter',
  isMobile: true,
};

export const MobileWithBothButtons = Template.bind({});
MobileWithBothButtons.args = {
  id: 'mobile-both-buttons',
  title: 'Schedule Your Demo',
  description: 'Book a personalized demo to see how Method works for your business.',
  imageSrc:
    'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000282/GSFC_20171208_Archive_e000282~small.jpg',
  primaryButton: 'Book Demo',
  secondaryButton: 'Learn More',
  backgroundColor: 'blue-lighter',
  isMobile: true,
};
