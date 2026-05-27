# M-One Project Structure Index

## Overview
M-One is a component library and application monorepo using Lerna + NX for workspace management.

## Applications (`apps/`)
- **action-editor** - Legacy AngularJS action editor with React wrapper
- **action-editor-copilot** - AI copilot for action editor (TypeScript)
- **app-builder** - Core application builder (React)
- **email-public-pages** - Email-related public pages

## UI Component Packages (`packages/`)

### Core UI Components
- **button** - Primary button component
- **button-group** - Button grouping component
- **input** - Text input controls
- **input-area** - Textarea controls
- **dropdown** - Dropdown/select components
- **checkbox** - Checkbox controls
- **radio-button** - Radio button controls
- **toggle** - Toggle/switch controls
- **select** - Enhanced select components
- **multi-select** - Multi-selection components

### Layout & Navigation
- **container** - Layout containers
- **card** - Card layouts
- **tabs** - Tab navigation
- **bread-crumbs** - Breadcrumb navigation
- **menu** - Menu components
- **banner** - Banner/alert components
- **stepper** - Step-by-step navigation

### Data Display
- **grid** - Data grid components
- **chart** - Charting components
- **chart-drilldown** - Interactive chart drilling
- **gallery** - Image/media gallery
- **image** - Image display components
- **caption** - Caption/label components
- **typeography** - Text styling components

### Interactive Components
- **dialog** - Modal dialogs
- **popover** - Popover/tooltip components
- **validation** - Form validation
- **criteria-builder** - Query builder
- **expression** - Expression builder
- **search-input** - Search functionality
- **chips-filter** - Filter chips
- **color-picker** - Color selection

### Specialized Components
- **map** - Mapping components
- **datepicker** - Date selection
- **phone-input** - Phone number input
- **address** - Address input forms
- **attachments** - File attachment handling
- **tag-widget** - Tagging interface
- **field-block** - Field grouping
- **pill** - Pill/badge components
- **loading-skeleton** - Loading states

### Canvas & Layout
- **canvas-craft** - Canvas crafting tools
- **canvas-grid** - Canvas grid system
- **canvas-rgl-drill** - Canvas drill-down interactions

### Utility Packages
- **styles** - Shared styling system (Emotion CSS-in-JS)
- **utilities** - Common utility functions
- **types** - TypeScript type definitions
- **svg-icon** - SVG icon system
- **runtime-interface** - Runtime interface definitions
- **runtime-renderer** - Runtime rendering system

## Key Technologies
- **React 17** - UI framework
- **Emotion CSS-in-JS** - Styling system
- **TypeScript** - Type safety (select packages)
- **Jest** - Testing framework
- **Storybook** - Component documentation
- **NX** - Build system and task runner
- **Lerna** - Package management
- **Webpack** - Module bundling

## Development Patterns
- All packages follow `@m-next/[component-name]` scoping
- Consistent peer dependencies across packages
- Shared theming through `@m-next/styles`
- Comprehensive test coverage (80% branches, 100% functions/lines/statements)
- Storybook documentation for all components

## File Structure Pattern
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

## Quick Navigation
- Core styles: `packages/styles/`
- Common utilities: `packages/utilities/`
- Type definitions: `packages/types/`
- Icon system: `packages/svg-icon/`
- Main application: `apps/app-builder/`
- Legacy editor: `apps/action-editor/`