# Editor Components AI Knowledge File

## Overview

The `apps/app-builder/src/views/layout-designer/editors` directory contains a comprehensive collection of React component editors for M-One's application builder. These editors allow users to configure various UI controls and components within the layout designer interface. Each editor follows consistent patterns and architectural principles.

## Architecture Patterns

### Common Structure
All editor components follow these architectural patterns:

1. **Component Pattern**: Each editor directory contains:
   - Main editor component (e.g., `ButtonEditor.jsx`, `GridBlockEditor.jsx`)
   - Optional sub-components and sections
   - Styles file using Emotion CSS-in-JS (`*.styles.jsx`)
   - Test files (`*.test.jsx`)
   - Type definitions for complex editors (`*.ts`, `*.d.ts`)
   - Index file for clean exports

2. **Props Pattern**: Standard props across editors:
   - `rawControl`: The control object being edited
   - `onChange`: Callback for control property changes
   - `onAddAction`: Callback for adding actions/events
   - `onSendAnalytics`: Analytics tracking callback
   - `onSelect`: Selection state callback
   - `controlProperty`: Selection/navigation state

3. **State Management**: Uses Redux with selectors:
   - `selectAccountName`, `selectDisplayPreferences`, `selectFeatureFlags`
   - `selectControls`, `selectScreenProperties`, `selectBaseModel`
   - RTK Query for API data (`useGetTablesQuery`, `useGetFieldsForTableQuery`)

## Common Components (`/common/components/`)

### Shared UI Components
- **`SettingsHeader`**: Standardized header with breadcrumbs, actions menu, and delete functionality
- **`ActionListSection`**: Manages event/action lists with add/edit capabilities
- **`EditorInput`**: Standardized input component with validation and max length
- **`CaptionInput`**: Specialized input for control captions with name generation
- **`DefaultStateSelector`**: Visibility/enabled state selector
- **`ValidationRulesList`**: Manages validation rules for form controls
- **`TableDropdown`**: Database table selection dropdown
- **`MappedFieldSelector`**: Field mapping interface

### Common Utilities
- **`BlockEditor.styles.tsx`**: Shared styled components for consistent layout
- **`filterFieldList.jsx`**: Field filtering utilities

## Editor Categories

### Form Controls
1. **`button-editor`**: Button configuration (style, variant, icon, events)
2. **`button-menu-editor`**: Button dropdown menus with quick edit
3. **`input-editor`**: Text input fields with validation
4. **`dropdown-block-editor`**: Dropdown/select controls with data sources
5. **`checkbox-block-editor`**: Checkbox controls with custom headers
6. **`toggle-block-editor`**: Toggle switch controls
7. **`radio-group-editor`**: Radio button group controls
8. **`date-time-picker-editor`**: Date/time input controls

### Data Display
1. **`grid-block-editor`**: Complex data grid with columns, views, and interactions
   - `GridSettings`: Main grid configuration
   - `ViewSettings`: Grid view management
   - `ColumnSettings`: Individual column configuration
   - Supports multi-tab editing (grid → view → column)

2. **`chart-block-editor`**: Data visualization charts
   - `DataTab`: Chart data configuration
   - `DisplayTab`: Visual styling and formatting
   - `InteractionsTab`: Chart interaction events
   - `SeriesEditor`: Chart series configuration

3. **`calendar-editor`**: Calendar view with event configuration
4. **`gallery-block-editor`**: Image gallery with sorting and view settings

### Data Input
1. **`field-block-editor`**: Generic field blocks
2. **`address-lookup-block-editor`**: Address autocomplete
3. **`signature-block-editor`**: Digital signature capture
4. **`attachments-widget-editor`**: File attachment handling
5. **`image-block-editor`**: Image display and upload

### Advanced Controls
1. **`data-model-editor`**: Data projection and field mapping
2. **`expression-editor`**: Complex expression builder with drag-drop
3. **`related-records-editor`**: Related data relationship configuration
4. **`measurement-block-editor`**: Measurement input controls
5. **`recurrence-editor`**: Recurring event patterns

### Layout & Text
1. **`screen-editor`**: Overall screen properties and configuration
2. **`text-panel-editor`**: Rich text and HTML editing
3. **`html-editor`**: Raw HTML editing
4. **`legacy-section-editor`**: Legacy layout sections

### Specialized
1. **`tag-widget-editor`**: Tag management interface
2. **`map-block-editor`**: Geographic mapping controls

## Key Dependencies

### M-One Component Library
- `@m-next/button`, `@m-next/input`, `@m-next/dropdown` - Core UI components
- `@m-next/grid` - Advanced data grid
- `@m-next/tabs`, `@m-next/accordion` - Layout components
- `@m-next/dialog`, `@m-next/container` - Modal and container components
- `@m-next/typeography` - Text components (`Text`, `TextLine`)
- `@m-next/styles` - Design system colors and theming
- `@m-next/svg-icon` - Icon system
- `@m-next/utilities` - Common utilities (`Guid`, `toCamelCase`, `formatter`)

### External Libraries
- `react`, `react-redux` - Core React and state management
- `@emotion/react`, `@emotion/styled` - CSS-in-JS styling
- `prop-types` - Runtime type checking
- `react-beautiful-dnd` - Drag and drop functionality
- `react-tooltip` - Tooltip system
- `@datadog/browser-rum` - Analytics and monitoring

### Internal Systems
- `@m-next/action-editor` - Action/event editing system
- `@m-next/criteria-builder` - Query criteria building
- `@m-next/expression` - Expression parsing and building
- `@m-next/runtime-interface` - Control interfaces and types
- RUM (Real User Monitoring) context providers

## Data Flow Patterns

### Control Lifecycle
1. **Raw Control Input**: Each editor receives `rawControl` with current state
2. **Migration/Normalization**: Controls are migrated and normalized using control classes
3. **Property Changes**: `onChange` callback updates control properties
4. **Action Management**: `onAddAction` creates new action events
5. **Validation**: Real-time validation with error feedback

### API Integration
- **Tables/Fields**: Dynamic loading of database schema
- **Apps/Screens**: Cross-screen navigation and linking
- **Actions**: Action definition loading and editing

### Event System
- **Standard Events**: Click, Focus, Blur, Change
- **Specialized Events**: Row clicks, selection changes, data changes
- **Action Chaining**: Actions can trigger other actions

## Testing Patterns

### Test Structure
- Jest with React Testing Library
- Comprehensive snapshot testing
- Component integration tests
- Mock API responses and Redux state

### Coverage Requirements
- 80% branches, 100% functions/lines/statements
- Console error monitoring (tests fail on console output)
- Accessibility testing included

## Development Guidelines

### Code Style
- TypeScript/JavaScript mixed (migrating to TypeScript)
- Emotion CSS-in-JS for all styling
- PropTypes for runtime type checking
- ESLint + Prettier enforced formatting

### Performance Considerations
- Memoization with `useMemo` and `useCallback`
- Lazy loading for complex components (`Suspense`)
- Debounced inputs for real-time updates
- RTK Query for efficient API caching

### Accessibility
- ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility
- Focus management

## File Naming Conventions
- **Components**: PascalCase (e.g., `ButtonEditor.jsx`)
- **Directories**: kebab-case (e.g., `button-editor`)
- **Styles**: `*.styles.jsx` with Emotion
- **Types**: `*.ts` or `*.d.ts` for TypeScript definitions
- **Tests**: `*.test.jsx` with Jest/RTL

## Migration Status
- Legacy AngularJS editors being migrated to React
- Mixed TypeScript/JavaScript (ongoing TypeScript migration)
- Control class system for backward compatibility
- Progressive feature flag adoption

## Integration Points

### Action Editor Integration
- `@m-next/action-editor` for complex action configuration
- `openActionEditor()` function for modal editing
- Action validation and type checking

### Layout Designer Integration
- Parent-child control relationships
- Selection state management
- Property panel coordination
- Drag-drop integration for reordering

### Runtime System Integration
- Control definition validation
- Screen compilation and preview
- Data binding verification
- Expression evaluation

This knowledge file provides a comprehensive understanding of the editor components architecture, enabling effective maintenance, enhancement, and development of new editor types within the M-One application builder system.