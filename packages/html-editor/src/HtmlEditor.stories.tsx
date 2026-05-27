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
  title: 'm-one/HtmlEditor',
  component: HtmlEditor,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    caption: {
      description: 'Label text for the editor',
      control: 'text',
    },
    data: {
      description: 'Default value for the editor',
      control: 'text',
    },
    disabled: {
      description: 'Whether the editor is disabled',
      control: 'boolean',
    },
    required: {
      description: 'Whether the field is required',
      control: 'boolean',
    },
    validationMessage: {
      description: 'Validation message to display',
      control: 'text',
    },
    height: {
      description: 'Height of the editor',
      control: 'text',
    },
    width: {
      description: 'Width of the editor',
      control: 'text',
    },
    focused: {
      description: 'Whether the editor is focused',
      control: 'boolean',
    },
    isV4Design: {
      description: 'Whether to use V4 design',
      control: 'boolean',
    },
  },
  args: {
    id: 'html-editor-story',
    authContext: mockAuthContext,
  },
};

export default meta;
type Story = StoryObj<typeof HtmlEditor>;

/**
 * Default configuration of the HTML Editor.
 */
export const Default: Story = {
  args: {
    caption: 'HTML Editor',
    data: '<p>This is the default content.</p>',
    height: '200px',
  },
};

/**
 * HTML Editor with no label shown.
 */
export const NoLabel: Story = {
  args: {
    caption: '',
    data: '<p>This editor has no label.</p>',
    height: '200px',
  },
};

/**
 * HTML Editor with a required field.
 */
export const Required: Story = {
  args: {
    caption: 'Required HTML Editor',
    required: true,
    data: '<p>This is a required field.</p>',
    height: '200px',
  },
};

/**
 * HTML Editor in a disabled state.
 */
export const Disabled: Story = {
  args: {
    caption: 'Disabled HTML Editor',
    disabled: true,
    data: '<p>This editor is disabled and cannot be edited.</p>',
    height: '200px',
  },
};

/**
 * HTML Editor with validation error.
 */
export const WithValidationError: Story = {
  args: {
    caption: 'HTML Editor with Error',
    data: '<p>This editor has a validation error.</p>',
    validationMessage: 'This field is required',
    height: '200px',
  },
};

/**
 * HTML Editor with rich content.
 */
export const RichContent: Story = {
  args: {
    caption: 'Rich Content Editor',
    data: `
      <h1>Rich Content Example</h1>
      <p>This is a <strong>bold text</strong> and <em>italic text</em>.</p>
      <ul>
        <li>List item 1</li>
        <li>List item 2</li>
        <li>List item 3</li>
      </ul>
      <p>A <a href="https://example.com">link to example.com</a></p>
      <blockquote>This is a blockquote</blockquote>
    `,
    height: '300px',
  },
};

/**
 * HTML Editor with custom dimensions.
 */
export const CustomSize: Story = {
  args: {
    caption: 'Custom Size Editor',
    data: '<p>This editor has custom dimensions.</p>',
    height: '400px',
    width: '800px',
  },
};

/**
 * HTML Editor in focused state.
 */
export const Focused: Story = {
  args: {
    caption: 'Focused HTML Editor',
    data: '<p>This editor is focused.</p>',
    focused: true,
    height: '200px',
  },
};
