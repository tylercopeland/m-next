// Mock for @m-next/api-interface package

// Message Role enum
export const MessageRole = {
  HUMAN: 'human',
  ASSISTANT: 'assistant',
};

// Artifact Visualizer enum
export const ArtifactVisualizerType = {
  CHART: 'chart',
  GRID: 'grid',
  CODE: 'code',
  CANVAS: 'canvas',
  TABLE_SCHEMA: 'table_schema',
};

// Also export as ArtifactVisualizer for compatibility
export const ArtifactVisualizer = ArtifactVisualizerType;

// Utility functions
export const createTextContent = (text) => ({
  type: 'text',
  content: text,
});

export const createArtifactContent = (artifact, description, timing) => ({
  type: 'artifact',
  content: artifact,
  description,
  timing,
});

// Generate unique IDs for messages
let messageIdCounter = 1;
const generateMessageId = () => `test-message-${messageIdCounter++}`;

export const createHumanMessage = (content) => ({
  id: generateMessageId(),
  role: MessageRole.HUMAN,
  content,
  timestamp: new Date().toISOString(),
});

export const createAssistantMessage = (content, metadata) => ({
  id: generateMessageId(),
  role: MessageRole.ASSISTANT,
  content,
  timestamp: new Date().toISOString(),
  metadata,
});

// Utility functions
export const getMessageText = (message) => {
  return message.content
    .filter((c) => c.type === 'text')
    .map((c) => c.content)
    .join(' ');
};

export const getMessageArtifacts = (message) => {
  return message.content.filter((c) => c.type === 'artifact').map((c) => c.content);
};

export const hasArtifacts = (message) => {
  return message.content.some((c) => c.type === 'artifact');
};

// Type guards
export const isHumanMessage = (message) => message.role === MessageRole.HUMAN;
export const isAssistantMessage = (message) => message.role === MessageRole.ASSISTANT;

// Artifact utilities
let artifactIdCounter = 1;
const generateArtifactId = () => `test-artifact-${artifactIdCounter++}`;

export const generateVersionId = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const createArtifact = (title, visualizer, content, language) => ({
  id: generateArtifactId(),
  versionId: generateVersionId(),
  versionNumber: 1,
  title,
  visualizer,
  content,
  language,
  metadata: {
    createdAt: new Date().toISOString(),
    lastModified: new Date().toISOString(),
  },
});

// Type guards for artifacts
export const isChartArtifact = (artifact) => artifact.visualizer === ArtifactVisualizerType.CHART;
export const isGridArtifact = (artifact) => artifact.visualizer === ArtifactVisualizerType.GRID;
export const isCodeArtifact = (artifact) => artifact.visualizer === ArtifactVisualizerType.CODE;
export const isCanvasArtifact = (artifact) => artifact.visualizer === ArtifactVisualizerType.CANVAS;
export const isTableSchemaArtifact = (artifact) => artifact.visualizer === ArtifactVisualizerType.TABLE_SCHEMA;
