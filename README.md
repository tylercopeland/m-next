# M-One Component Library & Application Monorepo

A modern React component library and application ecosystem built with Lerna + NX workspace management. M-One provides a comprehensive set of reusable UI components and complete applications for the Method platform.

## 🏗️ Architecture Overview

### Repository Structure

```
m-one/
├── apps/                     # Complete applications
│   ├── action-editor/        # Legacy AngularJS + React migration
│   ├── app-builder/          # Core application builder
│   ├── email-public-pages/   # Email-related public pages  
│   └── action-editor-copilot/ # AI copilot for action editor
├── packages/                 # Reusable UI components
│   ├── button/              # @m-next/button
│   ├── input/               # @m-next/input
│   ├── dropdown/            # @m-next/dropdown
│   ├── grid/                # @m-next/grid
│   ├── chart/               # @m-next/chart
│   ├── dialog/              # @m-next/dialog
│   ├── styles/              # @m-next/styles (theming system)
│   ├── utilities/           # @m-next/utilities
│   ├── types/               # @m-next/types
│   └── svg-icon/            # @m-next/svg-icon
├── .storybook/              # Storybook configuration
├── .githooks/               # Git hooks
└── tools/                   # Build tools and configuration
```

### Technology Stack

- **Frontend Framework**: React 17
- **Styling**: Emotion CSS-in-JS
- **Build System**: NX + Lerna + Webpack
- **Testing**: Jest with jsdom
- **Documentation**: Storybook
- **Languages**: JavaScript, TypeScript
- **Legacy Support**: AngularJS (being migrated)

### Component System

All packages follow the `@m-next/[component-name]` scoped naming convention and share:

- **Consistent Peer Dependencies**: React 17, Emotion, PropTypes
- **Shared Theming**: Through `@m-next/styles` package
- **Standardized Structure**: Common file organization patterns
- **Comprehensive Testing**: 80% branch coverage requirement

## 🚀 Quick Start

### Prerequisites

- Node.js (version specified in `.nvmrc`)
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd m-one

# Install dependencies and set up git hooks
npm install
```

### Development

```bash
# Start Storybook for component development
npm run storybook

# Build all packages/apps in parallel
npm run build

# Run all tests
npm run test

# Lint and format code
npm run lint
npm run prettify
```

## 📦 Package Development

### Standard Package Structure

```
packages/[component-name]/
├── src/
│   ├── index.js              # Main export
│   ├── [Component].jsx       # Main component
│   ├── [Component].styles.jsx # Emotion styles
│   ├── [Component].test.jsx   # Jest tests
│   └── __snapshots__/         # Jest snapshots
├── stories/
│   └── [Component].stories.jsx # Storybook documentation
├── package.json
├── webpack.config.js
├── babel.config.js
└── jest.config.js
```

### Creating a New Component

1. **Generate Package Structure**:
```bash
mkdir packages/my-component
cd packages/my-component
```

2. **Required Dependencies**:
```json
{
  "peerDependencies": {
    "@emotion/react": "^11.0.0",
    "@emotion/styled": "^11.0.0", 
    "react": "^17.0.0",
    "react-dom": "^17.0.0",
    "prop-types": "^15.0.0"
  },
  "dependencies": {
    "@m-next/styles": "*",
    "@m-next/utilities": "*"
  }
}
```

3. **Component Template**:
```jsx
// src/MyComponent.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { StyledComponent } from './MyComponent.styles';

const MyComponent = ({ children, variant, ...props }) => {
  return (
    <StyledComponent variant={variant} {...props}>
      {children}
    </StyledComponent>
  );
};

MyComponent.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.oneOf(['primary', 'secondary'])
};

MyComponent.defaultProps = {
  variant: 'primary'
};

export default MyComponent;
```

### Individual Package Commands

```bash
# Navigate to specific package
cd packages/[component-name]

# Development build with watch
npm run dev

# Production build  
npm run prod

# Run tests
npm test

# Update snapshots
npm run test-snapshot-update
```

## 🏃‍♂️ Application Development

### Available Applications

- **action-editor**: Legacy AngularJS application with React migration
- **app-builder**: Core application builder interface
- **email-public-pages**: Public-facing email pages
- **action-editor-copilot**: AI-powered development assistant

### Application Commands

```bash
# Navigate to specific app
cd apps/[app-name]

# Start development server
npm start

# Build for production
npm run prod

# Run tests
npm test
```

## 🧪 Testing Guidelines

### Coverage Requirements
- **Branches**: 80% minimum
- **Functions**: 100% required
- **Lines**: 100% required  
- **Statements**: 100% required

### Testing Stack
- **Framework**: Jest with jsdom environment
- **Snapshot Testing**: Extensive Jest snapshots for component rendering
- **Storybook Testing**: JSON output generation for integration
- **Console Monitoring**: Tests fail on console errors/warnings

### Running Tests

```bash
# All tests across monorepo
npm run test

# Specific package test
npx nx test [package-name]

# Update snapshots
npm run test-snapshot-update

# Test with coverage
npm run test -- --coverage
```

## 🎨 Styling System

### Emotion CSS-in-JS

All components use Emotion for styling:

```jsx
// Component.styles.jsx
import styled from '@emotion/styled';
import { css } from '@emotion/react';

export const StyledComponent = styled.div`
  ${({ theme, variant }) => css`
    color: ${theme.colors.primary};
    padding: ${theme.spacing.md};
    
    ${variant === 'large' && css`
      font-size: ${theme.typography.sizes.lg};
    `}
  `}
`;
```

### Theming

Centralized theming through `@m-next/styles`:

```jsx
import { useTheme } from '@emotion/react';

const MyComponent = () => {
  const theme = useTheme();
  // Access theme.colors, theme.spacing, theme.typography, etc.
};
```

## 📚 Documentation

### Storybook

Component documentation and development environment:

```bash
# Start Storybook
npm run storybook

# Build Storybook for deployment
npm run build-storybook

# Run visual regression tests
npm run chromatic
```

### Story Template

```jsx
// stories/Component.stories.jsx
export default {
  title: 'Components/MyComponent',
  component: MyComponent,
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary']
    }
  }
};

export const Default = {
  args: {
    children: 'Default component'
  }
};

export const Secondary = {
  args: {
    variant: 'secondary',
    children: 'Secondary variant'
  }
};
```

## 🔧 Build System

### NX Workspace

Task running and caching with parallel execution:

```bash
# Run specific NX command
npx nx [command] [project]

# Build dependency graph  
npx nx dep-graph

# Affected projects only
npx nx affected:build
```

### Lerna

Package management and versioning:

```bash
# Bootstrap packages
npx lerna bootstrap

# Version and publish
npx lerna version
npx lerna publish
```

## 🔄 Legacy Migration

The `action-editor` app contains ongoing AngularJS to React migration:

- **Legacy Code**: `apps/action-editor/src/angular/`
- **React Components**: `apps/action-editor/src/react/`
- **Integration**: `react2angular` for incremental migration
- **Build Targets**: Both legacy and modern versions

## 🌐 Browser Support

Targets modern browsers via Browserslist:
```
> 0.5%, not ie 11, iOS >= 12
```

## 🤖 AI Assistant Guidelines

When working with this codebase:

1. **Prefer Editing**: Always edit existing files rather than creating new ones
2. **Follow Patterns**: Use established component structure and naming conventions  
3. **Maintain Dependencies**: Keep peer dependencies consistent across packages
4. **Test Coverage**: Ensure all new code meets coverage requirements
5. **Style Consistency**: Use Emotion CSS-in-JS for all styling
6. **Documentation**: Update Storybook stories for component changes

### Common Tasks

- **Adding Components**: Follow package structure template
- **Updating Styles**: Modify `.styles.jsx` files using Emotion
- **Writing Tests**: Use Jest snapshots for component rendering
- **Documentation**: Create/update Storybook stories

## 📋 Git Workflow

- **Main Branch**: `master`
- **Git Hooks**: Pre-commit hooks in `.githooks/`
- **Commit Format**: Conventional commit messages
- **Current Development**: `gallery` branch

## 🚨 Common Issues

### Build Failures
- Check peer dependency versions match across packages
- Ensure all tests pass before building
- Verify no console errors in test output

### Component Issues  
- PropTypes are required for all component props
- Use `@m-next/styles` for consistent theming
- Follow naming conventions: `kebab-case` directories, `PascalCase` components

### Testing Issues
- Update snapshots when component output changes
- Ensure 80% branch coverage minimum
- No console errors/warnings allowed in tests

## 🤝 Contributing

1. Create feature branch from `master`
2. Follow established patterns and conventions
3. Add comprehensive tests with required coverage
4. Update Storybook documentation
5. Run `npm run lint` and `npm run prettify`
6. Submit pull request

---

**For additional help**: Refer to individual package READMEs or check Storybook documentation at `npm run storybook`