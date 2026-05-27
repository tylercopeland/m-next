import React from 'react';
import { Meta, StoryObj } from '@storybook/react-webpack5';
import Text from './Text';

const meta: Meta<typeof Text> = {
  title: 'm-one/Text',
  component: Text,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    as: {
      control: 'select',
      options: ['P', 'DIV', 'H1'],
      description: 'HTML element to render',
      defaultValue: 'P',
    },
    fontSize: {
      control: 'text',
      description: 'Font size with units (e.g., "14px")',
    },
    fontColor: {
      control: 'color',
      description: 'Text color',
    },
    fontWeight: {
      control: 'select',
      options: ['normal', 'bold', '100', '200', '300', '400', '500', '600', '700', '800', '900'],
      description: 'Font weight',
    },
    lineHeight: {
      control: 'text',
      description: 'Line height with units (e.g., "20px")',
    },
    wordBreak: {
      control: 'select',
      options: ['normal', 'break-all', 'break-word', 'keep-all'],
      description: 'Word break behavior',
    },
    legacyClasses: {
      control: 'text',
      description: 'Legacy Method UI classes for backward compatibility',
    },
    sx: {
      control: 'object',
      description: 'Reflexbox style props for DIV variant',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Text>;

/**
 * Default paragraph text rendering
 */
export const Paragraph: Story = {
  args: {
    children: 'This is a paragraph text component',
    fontSize: '14px',
    fontColor: '#0F1B31', // method-darker color
    lineHeight: '20px',
  },
};

/**
 * Text rendered as a DIV element
 */
export const AsDiv: Story = {
  args: {
    as: 'DIV',
    children: 'This is a DIV text component',
    fontSize: '14px',
    fontColor: '#0F1B31',
    lineHeight: '20px',
    sx: { padding: '10px', border: '1px solid #ccc' },
  },
};

/**
 * Text rendered as a heading (H1)
 */
export const AsHeading: Story = {
  args: {
    as: 'H1',
    children: 'This is a heading text component',
    fontSize: '24px',
    fontColor: '#0F1B31',
    fontWeight: 'bold',
    lineHeight: '32px',
  },
};

/**
 * Text with legacy classes for backward compatibility
 */
export const WithLegacyClasses: Story = {
  args: {
    children: 'Text with legacy classes',
    legacyClasses: 'mi-caption-font-xlarge mi-color-primary',
  },
};

/**
 * Text with custom styling
 */
export const CustomStyling: Story = {
  args: {
    children: 'Custom styled text',
    fontSize: '16px',
    fontColor: '#FF0000',
    fontWeight: 'bold',
    lineHeight: '24px',
    wordBreak: 'break-all',
    sx: {
      textDecoration: 'underline',
      textTransform: 'uppercase',
      letterSpacing: '2px',
    },
  },
};

/**
 * Text with nested children
 */
export const WithNestedChildren: Story = {
  render: () => (
    <Text fontSize='16px' fontColor='#0F1B31'>
      This is a parent text with
      <Text as='DIV' fontSize='14px' fontColor='#FF0000' sx={{ display: 'inline', margin: '0 5px' }}>
        nested child text
      </Text>
      inside it.
    </Text>
  ),
};

/**
 * Text with dynamic props based on conditions
 */
export const WithDynamicProps: Story = {
  render: (args) => {
    const isMobile = args.isMobile || false;
    return (
      <Text
        fontSize={isMobile ? '16px' : '14px'}
        fontColor={isMobile ? '#333333' : '#0F1B31'}
        lineHeight={isMobile ? '24px' : '20px'}
      >
        This text has dynamic styling based on {isMobile ? 'mobile' : 'desktop'} view
      </Text>
    );
  },
  args: {
    isMobile: false,
  },
  argTypes: {
    isMobile: {
      control: 'boolean',
      description: 'Toggle between mobile and desktop styling',
    },
  },
};
