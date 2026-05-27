# @m-next/api-interface

API interface types for communication between chat assistants and UI packages.

## Overview

This package defines the clean contract for how chat APIs and UIs communicate, using structured messages with human/assistant roles and typed content blocks. It represents a breaking change from the previous mixed message system to a more structured approach.

## Key Concepts

### Messages

- **Role-based**: Every message has either `human` or `assistant` role
- **Content Array**: Each message contains an array of content blocks
- **Typed Content**: Content blocks are either `text` or `artifact`

### Content Types

- **Text Content**: Plain text, markdown, or HTML content
- **Artifact Content**: Structured data for visualizations (charts, grids, code, etc.)
- **Content Timing**: Start/end times and duration for each content block

### Artifacts

- **Generic Structure**: Unified interface for all visualizable content
- **Visualizer Types**: `chart`, `grid`, `code`, `canvas`, `table_schema`
- **Versioning**: Each artifact has version tracking with UUID and incremental numbers

## Basic Usage

```typescript
import {
  ChatRequest,
  ChatResponse,
  ChatResponseBuilder,
  createTextContent,
  createAssistantMessage,
} from '@m-next/api-interface';

// Create a simple text response
const response = new ChatResponseBuilder()
  .addMessage(createAssistantMessage([createTextContent('Hello! How can I help you today?')]))
  .build();
```

## Working with Artifacts

```typescript
import {
  createArtifact,
  createArtifactContent,
  ArtifactVisualizer,
} from '@m-next/api-interface';

// Create a chart artifact
const chartArtifact = createArtifact('Sales Chart', ArtifactVisualizer.CHART, {
  type: 'line',
  data: [
    /* chart data */
  ],
  options: {
    /* chart options */
  },
});

// Include it in a message
const message = createAssistantMessage([
  createTextContent("Here's your sales chart:"),
  createArtifactContent(chartArtifact, 'Monthly sales data visualization'),
]);
```

## Content Timing

Track processing times for individual content blocks:

```typescript
import {
  createTextContent,
  createArtifactContent,
  createContentTiming,
  createContentTimingFromDuration,
  createInstantTiming,
  ConversationUtils,
} from '@m-next/api-interface';

// Create timing from start/end times
const textTiming = createContentTiming('2025-09-16T19:30:00.000Z', '2025-09-16T19:30:02.500Z');

const textContent = createTextContent(
  'This text took 2.5 seconds to generate',
  'plain',
  textTiming
);

// Create timing from duration
const artifactTiming = createContentTimingFromDuration(
  '2025-09-16T19:30:03.000Z',
  1200 // 1.2 seconds
);

const artifactContent = createArtifactContent(
  chartArtifact,
  'Generated in 1.2 seconds',
  artifactTiming
);

// For instant operations
const instantContent = createTextContent('Fast response', 'plain', createInstantTiming());
```

### Timing Analysis

Analyze conversation timing with built-in utilities:

```typescript
// Get timing statistics for a conversation
const stats = ConversationUtils.getTimingStatistics(messages);

console.log('Total content processing time:', stats.totalContentTime + 'ms');
console.log('Average per content block:', stats.averageContentTime + 'ms');
console.log('Slowest content duration:', stats.slowestContent?.timing.durationMs + 'ms');
console.log('Fastest content duration:', stats.fastestContent?.timing.durationMs + 'ms');

// Get specific timing data
const timedContent = ConversationUtils.getContentWithTiming(messages);
const totalTime = ConversationUtils.getTotalContentProcessingTime(messages);
const avgTime = ConversationUtils.getAverageContentProcessingTime(messages);
```

## API Structure

### Request Format

```typescript
interface ChatRequest {
  message: string;
  conversationHistory?: ChatMessage[];
  session?: {
    /* auth and context */
  };
  options?: {
    /* model, temperature, etc. */
  };
}
```

### Response Format

```typescript
interface ChatResponse {
  status: 'success' | 'error';
  messages: ChatMessage[];
  error?: {
    /* error details */
  };
  metadata?: {
    /* token usage, timing, etc. */
  };
}
```

## Migration from Legacy System

The new system replaces the previous approach where responses could have:

- `response`: Text response
- `artifactMessage`: Single artifact
- `messages`: Mixed array

**Old approach:**

```typescript
// Legacy - mixed structure
{
  status: 'success',
  response: 'Here is your chart',
  artifactMessage: { type: 'ARTIFACT', artifact: {...} }
}
```

**New approach:**

```typescript
// New - structured messages
{
  status: 'success',
  messages: [
    {
      role: 'assistant',
      content: [
        { type: 'text', text: 'Here is your chart' },
        { type: 'artifact', artifact: {...} }
      ]
    }
  ]
}
```

## Utilities

The package includes several utility classes:

- **ConversationUtils**: Work with conversation history
- **ChatResponseBuilder**: Fluent API for building responses
- **ValidationUtils**: Validate request/response structures

## Type Safety

All interfaces are fully typed with TypeScript, including:

- Discriminated unions for content types
- Type guards for runtime checking
- Utility types for extracting specific content

## Visualizer Types

The system supports these artifact visualizers:

- `chart`: Interactive charts (Highcharts, etc.)
- `grid`: Editable and readonly grids
- `code`: Syntax-highlighted code blocks
- `canvas`: Interactive drawings or diagrams
- `table_schema`: Database schema definitions

Each visualizer expects its content in a specific format, allowing UIs to render them appropriately.
