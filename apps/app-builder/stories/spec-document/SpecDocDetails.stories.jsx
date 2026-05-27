import React from 'react';
import SpecDocDetails from '../../src/views/management/spec-document/SpecDocDetails';
import SpecDocDetailsSkeleton from '../../src/views/management/spec-document/SpecDocDetailsSkeleton';
import {
  mockSpecDocumentFull,
  mockSpecDocumentMinimal,
  mockSpecDocumentEmpty,
} from '../../src/views/management/spec-document/mockSpecDocument';

export default {
  component: SpecDocDetails,
  title: 'App Builder/Spec Document/SpecDocDetails',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Detailed technical view with progressive loading skeleton and tabbed sections for User Roles, Features, Data Entities, Business Rules, and Screens.',
      },
    },
  },
  argTypes: {
    specDocument: {
      description: 'The spec document object to display',
      control: 'object',
    },
    isLoading: {
      description: 'Loading state showing skeleton with progressive loading support',
      control: 'boolean',
    },
    onDownloadPdf: {
      description: 'Callback when Download PDF button is clicked',
      action: 'downloadPdf',
    },
    onAskMia: {
      description: 'Callback when Ask Mia button is clicked',
      action: 'askMia',
    },
  },
};

// Full spec document with User Roles section
export const UserRolesSection = {
  args: {
    specDocument: mockSpecDocumentFull,
    isLoading: false,
    onDownloadPdf: () => console.log('Download PDF clicked'),
    onAskMia: (section) => console.log('Ask Mia clicked for:', section),
  },
  parameters: {
    docs: {
      description: {
        story: 'Full CRM spec document showing User Roles section with role cards, permissions, and descriptions.',
      },
    },
  },
};

// Minimal spec document with fewer roles
export const MinimalRoles = {
  args: {
    specDocument: mockSpecDocumentMinimal,
    isLoading: false,
    onDownloadPdf: () => console.log('Download PDF clicked'),
    onAskMia: (section) => console.log('Ask Mia clicked for:', section),
  },
  parameters: {
    docs: {
      description: {
        story: 'Minimal task manager spec with single user role - demonstrates layout with fewer cards.',
      },
    },
  },
};

// Empty spec document
export const EmptyDocument = {
  args: {
    specDocument: mockSpecDocumentEmpty,
    isLoading: false,
    onDownloadPdf: () => console.log('Download PDF clicked'),
    onAskMia: (section) => console.log('Ask Mia clicked for:', section),
  },
  parameters: {
    docs: {
      description: {
        story: 'Empty spec document with no roles defined - shows empty state.',
      },
    },
  },
};

// Loading skeleton with progressive loading
export const LoadingSkeleton = {
  args: {
    specDocument: null,
    isLoading: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Loading skeleton with progressive loading support. Header, tabs, and content cards show animated placeholders.',
      },
    },
  },
};

// Skeleton component standalone
export const SkeletonOnly = {
  render: () => <SpecDocDetailsSkeleton />,
  parameters: {
    docs: {
      description: {
        story: 'Standalone skeleton component showing the progressive loading UI structure.',
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
        story: 'No document provided - shows skeleton as fallback.',
      },
    },
  },
};

// Interactive story
export const Interactive = {
  args: {
    specDocument: mockSpecDocumentFull,
    isLoading: false,
    onDownloadPdf: () => console.log('Download PDF clicked'),
    onAskMia: (section) => console.log('Ask Mia clicked for:', section),
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive version - click tabs to switch between sections, Download PDF button, and Ask Mia button.',
      },
    },
  },
};
