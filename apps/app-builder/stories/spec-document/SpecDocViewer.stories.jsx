import React from 'react';
import SpecDocViewer from '../../src/views/management/spec-document/SpecDocViewer';
import {
  mockSpecDocumentFull,
  mockSpecDocumentMinimal,
  mockSpecDocumentEmpty,
  mockSpecDocumentPartial,
} from '../../src/views/management/spec-document/mockSpecDocument';

export default {
  component: SpecDocViewer,
  title: 'App Builder/Spec Document/SpecDocViewer',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Main spec document viewer with tabbed interface for Snapshot, Overview, and Details views.',
      },
    },
  },
  argTypes: {
    specDocument: {
      description: 'The spec document object to display',
      control: 'object',
    },
    isLoading: {
      description: 'Loading state for the viewer',
      control: 'boolean',
    },
  },
};

// Full CRM spec document
export const FullSpecDocument = {
  args: {
    specDocument: mockSpecDocumentFull,
    isLoading: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Comprehensive CRM spec document with all sections populated including roles, workflows, entities, rules, and screens.',
      },
    },
  },
};

// Minimal spec document
export const MinimalSpecDocument = {
  args: {
    specDocument: mockSpecDocumentMinimal,
    isLoading: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Simple task manager spec with minimal data - shows how the viewer handles smaller specs.',
      },
    },
  },
};

// Minimal spec document
export const PartialSpecDocument = {
  args: {
    specDocument: mockSpecDocumentPartial,
    isLoading: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Simple task manager spec with partial data - shows how the viewer handles smaller specs.',
      },
    },
  },
};
// Empty spec document
export const EmptySpecDocument = {
  args: {
    specDocument: mockSpecDocumentEmpty,
    isLoading: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Empty spec document showing how the viewer handles missing or empty data.',
      },
    },
  },
};

// Loading state
export const Loading = {
  args: {
    specDocument: null,
    isLoading: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Loading state with skeleton loaders displayed in the Snapshot tab.',
      },
    },
  },
};

// No document provided
export const NoDocument = {
  args: {
    specDocument: null,
    isLoading: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'No document provided - shows empty state.',
      },
    },
  },
};

// Interactive story
export const Interactive = {
  args: {
    specDocument: mockSpecDocumentFull,
    isLoading: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive version - click between tabs to see different views of the spec document.',
      },
    },
  },
};
