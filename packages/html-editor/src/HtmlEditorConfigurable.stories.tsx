import React from 'react';
import { Meta, StoryObj } from '@storybook/react-webpack5';
import HtmlEditor from './HtmlEditor';

// Mock auth context for the stories
const mockAuthContext = {
  account: 'test-account',
  authToken: 'test-token',
  identity: 'test-identity',
  runtimeCoreUrl: 'https://api.example.com',
  secureToken: 'test-secure-token',
};

const meta: Meta<typeof HtmlEditor> = {
  title: 'm-one/HtmlEditor/Configurable',
  component: HtmlEditor,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'HTML Editor component with configurable properties: Label, ShowLabel, DefaultValue, and Default State.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    caption: {
      description: 'Label text for the editor',
      control: 'text',
      table: {
        category: 'Label',
      },
    },
    showLabel: {
      description: 'Whether to show the label',
      control: 'boolean',
      table: {
        category: 'Label',
      },
    },
    data: {
      description: 'Default value for the editor',
      control: 'text',
      table: {
        category: 'Content',
      },
    },
    disabled: {
      description: 'Default state: disabled',
      control: 'boolean',
      table: {
        category: 'State',
      },
    },
    focused: {
      description: 'Default state: focused',
      control: 'boolean',
      table: {
        category: 'State',
      },
    },
    required: {
      description: 'Default state: required',
      control: 'boolean',
      table: {
        category: 'State',
      },
    },
    validationMessage: {
      description: 'Default state: validation message',
      control: 'text',
      table: {
        category: 'State',
      },
    },
  },
  args: {
    id: 'html-editor-configurable-story',
    authContext: mockAuthContext,
    height: '200px',
  },
};

export default meta;
type Story = StoryObj<typeof HtmlEditor>;

/**
 * Configurable HTML Editor with all properties exposed.
 *
 * This story allows you to experiment with the following properties:
 * - Label: Set the caption text
 * - ShowLabel: Toggle label visibility
 * - DefaultValue: Set the initial HTML content
 * - Default State: Configure disabled, focused, required states
 */
export const Configurable: Story = {
  args: {
    caption: 'HTML Editor Label',
    showLabel: true, // Note: This is implemented by setting caption to empty string when false
    data: '<p>This is the default content.</p>',
    disabled: false,
    focused: false,
    required: false,
    validationMessage: '',
  },
  render: (args) => {
    // Handle showLabel by conditionally setting caption
    const captionToUse = args.showLabel ? args.caption : '';

    return (
      <div style={{ width: '100%', maxWidth: '800px' }}>
        <h3>Configurable HTML Editor</h3>
        <p>Experiment with the controls in the Storybook panel to configure the component.</p>
        <HtmlEditor {...args} caption={captionToUse} />
      </div>
    );
  },
};

/**
 * HTML Editor with Label variations.
 */
export const LabelVariations: Story = {
  render: () => (
    <div style={{ width: '100%', maxWidth: '800px' }}>
      <h3>Label Variations</h3>

      <h4>With Label</h4>
      <HtmlEditor
        id='with-label'
        authContext={mockAuthContext}
        caption='HTML Editor with Label'
        data='<p>Editor with a label.</p>'
        height='150px'
      />

      <h4>Without Label</h4>
      <HtmlEditor
        id='without-label'
        authContext={mockAuthContext}
        caption=''
        data='<p>Editor without a label.</p>'
        height='150px'
      />

      <h4>Required Label</h4>
      <HtmlEditor
        id='required-label'
        authContext={mockAuthContext}
        caption='Required HTML Editor'
        required={true}
        data='<p>Editor with a required label.</p>'
        height='150px'
      />
    </div>
  ),
};

/**
 * HTML Editor with different Default Values.
 */
export const DefaultValueVariations: Story = {
  render: () => (
    <div style={{ width: '100%', maxWidth: '800px' }}>
      <h3>Default Value Variations</h3>

      <h4>Empty</h4>
      <HtmlEditor id='empty-value' authContext={mockAuthContext} caption='Empty Editor' data='' height='150px' />

      <h4>Simple Text</h4>
      <HtmlEditor
        id='simple-text'
        authContext={mockAuthContext}
        caption='Simple Text'
        data='<p>This is a simple text content.</p>'
        height='150px'
      />

      <h4>Rich Content</h4>
      <HtmlEditor
        id='rich-content'
        authContext={mockAuthContext}
        caption='Rich Content'
        data={`
          <h2>Rich HTML Content</h2>
          <p>This editor contains <strong>formatted</strong> <em>text</em> with:</p>
          <ul>
            <li>Bullet points</li>
            <li>And <a href="#">links</a></li>
          </ul>
        `}
        height='200px'
      />
    </div>
  ),
};

/**
 * HTML Editor with different Default States.
 */
export const DefaultStateVariations: Story = {
  render: () => (
    <div style={{ width: '100%', maxWidth: '800px' }}>
      <h3>Default State Variations</h3>

      <h4>Normal State</h4>
      <HtmlEditor
        id='normal-state'
        authContext={mockAuthContext}
        caption='Normal State'
        data='<p>Editor in normal state.</p>'
        height='150px'
      />

      <h4>Disabled State</h4>
      <HtmlEditor
        id='disabled-state'
        authContext={mockAuthContext}
        caption='Disabled State'
        data='<p>Editor in disabled state.</p>'
        disabled={true}
        height='150px'
      />

      <h4>Focused State</h4>
      <HtmlEditor
        id='focused-state'
        authContext={mockAuthContext}
        caption='Focused State'
        data='<p>Editor in focused state.</p>'
        focused={true}
        height='150px'
      />

      <h4>Validation Error State</h4>
      <HtmlEditor
        id='error-state'
        authContext={mockAuthContext}
        caption='Error State'
        data='<p>Editor with validation error.</p>'
        validationMessage='This field has an error'
        height='150px'
      />
    </div>
  ),
};
