# @m-next/ai-prompt

AI prompt component for interacting with AI assistants. Provides a multiline input area with a submit button and supports API communication.

## Installation

```bash
npm install @m-next/ai-prompt
```

## Usage

```tsx
import { AiPrompt } from '@m-next/ai-prompt';

const callbacks = {
  baseUrl: 'https://your-api.com',
  authToken: 'your-auth-token',
  onResponse: (response) => {
    console.log('AI response:', response);
  },
  onError: (error) => {
    console.error('Error:', error);
  },
};

function App() {
  return (
    <AiPrompt
      assistantId="your-assistant-guid"
      callbacks={callbacks}
      placeholder="Ask me anything..."
      onSubmit={(prompt) => console.log('Submitted:', prompt)}
    />
  );
}
```

## Features

- **Multiline Input**: Resizable textarea with configurable rows
- **Character Limit**: Optional character counting with visual feedback
- **Keyboard Shortcuts**: Submit with Ctrl+Enter or Cmd+Enter
- **Loading States**: Built-in loading indicators during API requests
- **Error Handling**: Display API errors with proper accessibility
- **TypeScript Support**: Full TypeScript definitions included
- **Accessibility**: ARIA labels and proper form semantics

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `assistantId` | `string` | ✓ | - | GUID for the assistant ID |
| `callbacks` | `AiPromptCallbacks` | ✓ | - | API configuration and callbacks |
| `placeholder` | `string` | | `"Enter your prompt..."` | Placeholder text for input |
| `buttonText` | `string` | | `"Send"` | Text for submit button |
| `disabled` | `boolean` | | `false` | Disable the entire component |
| `maxLength` | `number` | | `1000` | Maximum character limit |
| `minRows` | `number` | | `3` | Minimum textarea rows |
| `maxRows` | `number` | | `10` | Maximum textarea rows |
| `isLoading` | `boolean` | | `false` | Show loading state |
| `buttonIcon` | `ReactNode` | | Arrow icon | Custom icon for button |
| `className` | `string` | | - | Additional CSS class |
| `onSubmit` | `function` | | - | Called when prompt is submitted |
| `onChange` | `function` | | - | Called when input changes |

## AiPromptCallbacks

```tsx
interface AiPromptCallbacks {
  baseUrl: string;        // API base URL
  authToken: string;      // Authentication token
  onResponse?: (response: any) => void;  // Success callback
  onError?: (error: Error) => void;      // Error callback
}
```

## API Integration

The component sends POST requests to `${baseUrl}/ai/prompt` with the following payload:

```json
{
  "assistantId": "your-assistant-guid",
  "prompt": "user's input text"
}
```

Expected response format:
```json
{
  "response": "AI's response text",
  // ... other response data
}
```

## Styling

The component uses Emotion CSS-in-JS and follows the M-One design system. All styling is encapsulated within the component.

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run type checking
npm run check-types

# Run linting
npm run lint

# Build for production
npm run build

# Start Storybook
npm run storybook
```