# Technical Context: M-One App Builder

## Technology Stack

### Frontend Framework
- **React 17.0.2**: Functional components with hooks pattern
- **TypeScript**: Type safety and enhanced developer experience
- **@emotion/react & @emotion/styled**: CSS-in-JS styling solution
- **React Router DOM v6.21.1**: Client-side routing and navigation

### State Management
- **Redux Toolkit (@reduxjs/toolkit v2.0.1)**: Modern Redux with RTK Query
- **React Redux**: React bindings for Redux state management
- **RTK Query**: Data fetching and caching built on Redux Toolkit

### Build System
- **Webpack**: Module bundling and development server
- **Babel**: JavaScript transpilation with babel.config.cjs
- **TypeScript Compiler**: Type checking and transpilation

### UI Component System
- **@m-one Component Library**: 30+ purpose-built CRM components
  - Form controls: Input, Checkbox, Toggle, Dropdown, RadioButton
  - Layout: Container, Card, Tabs, Stepper, Banner
  - Data: Grid, Chart, Gallery, Map
  - Actions: Button, ButtonGroup, Menu
  - Advanced: HtmlEditor, AddressLookup, CriteriaBuilder, Expression

### Drag & Drop System
- **@m-next/layout-canvas**: New grid-based layout system (ready for adoption)
- **React Grid Layout (RGL)**: Foundation for drag-and-drop functionality
- **React Beautiful DnD v13.1.1**: Enhanced drag-and-drop interactions

### Development Tools
- **Jest**: Unit testing framework with @testing-library integration
- **Storybook**: Component development and documentation
- **ESLint 9.26.0**: Code linting with TypeScript support
- **Prettier 3.5.3**: Code formatting
- **ls-lint**: File/directory naming conventions

### Third-Party Integrations
- **@datadog/browser-rum & @datadog/browser-logs**: User monitoring and analytics
- **React Modal**: Modal dialog system
- **React Toastify**: Notification system
- **React Tooltip**: Interactive tooltips
- **Simplebar React**: Custom scrollbars

## Architecture Patterns

### Component Architecture
```
App Builder/
├── Canvas Layer (Rendering)
│   ├── Legacy Canvas (canvas.jsx)
│   └── Responsive Canvas (ResponsiveCanvas.jsx)
├── Layout Engine (@m-next/layout-canvas)
├── State Layer (Redux Toolkit)
├── API Layer (RTK Query)
└── Component Registry (@m-one components)
```

### State Management Pattern
- **Screen Layout Slice**: Canvas state, controls, selections
- **App Slice**: Application and screen metadata
- **Session Slice**: User authentication and preferences
- **Data Slice**: Runtime data for screen rendering

### Component Integration Pattern
```typescript
// Component registry maps widget types to configurations
const componentRegistry: Partial<Record<WidgetType, ControlConfiguration>> = {
  'button': {
    component: ButtonWrapper,
    label: 'Button',
    defaultProps: { text: 'Click me' },
    minWidth: 2,
    maxWidth: 6
  }
};
```

## Development Environment

### Local Development Setup
1. **Prerequisites**: Node.js 16+, npm 7+
2. **Installation**: `npm install` in app-builder directory
3. **Development**: `npm run serve` starts webpack dev server
4. **Testing**: `npm run test-watch` for continuous testing

### Build Commands
```bash
npm run dev          # Development build
npm run watch        # Development build with file watching
npm run serve        # Development server with hot reload
npm run build        # Full production build with linting/testing
npm run prod         # Production build only
```

### Code Quality Pipeline
```bash
npm run prettify     # Format all JS/JSX files
npm run lint         # ESLint + ls-lint checking
npm run lint-fix     # Auto-fix linting issues
npm run test         # Run Jest test suite
npm run check-types  # TypeScript type checking
```

## Deployment Architecture

### IIS Integration
- **Virtual Directory**: `/app-builder` points to dist folder
- **Static Assets**: Webpack builds to dist/ directory
- **Index Template**: public/index.html with app bootstrap

### Build Pipeline
1. **Code Quality**: Prettier, ESLint, TypeScript checking
2. **Testing**: Jest unit tests with coverage reports
3. **Webpack Build**: Production optimization and bundling
4. **Asset Generation**: Static files ready for IIS deployment

### Environment Configuration
- **Development**: webpack-dev-server with hot module replacement
- **Production**: Optimized bundles with code splitting
- **Environment Variables**: Injected via webpack configuration

## Performance Considerations

### Bundle Optimization
- **Code Splitting**: Lazy loading for Canvas and RightPanel components
- **Tree Shaking**: Eliminates unused @m-one component imports
- **Asset Optimization**: Webpack production optimizations

### Runtime Performance
- **React.memo**: Prevents unnecessary re-renders
- **useCallback/useMemo**: Optimizes expensive computations
- **Suspense Boundaries**: Graceful loading states with LoadingSkeleton

### State Management Efficiency
- **RTK Query Caching**: Prevents redundant API calls
- **Selective Redux Subscriptions**: Components only listen to needed state
- **Normalized State Shape**: Efficient updates and lookups

## Testing Strategy

### Unit Testing (Jest)
- **Component Testing**: @testing-library/react for user interactions
- **Redux Testing**: Mock store for state management testing
- **Utility Testing**: Pure function testing with edge cases

### Integration Testing
- **User Workflow Testing**: End-to-end component interactions
- **API Integration**: Mock API responses for data flow testing
- **State Integration**: Redux action/reducer integration testing

### Visual Testing (Storybook)
- **Component Stories**: Isolated component development
- **Visual Regression**: Chromatic integration for visual testing
- **Documentation**: Living component documentation

## Data Flow Architecture

### API Integration
```typescript
// RTK Query API definitions
export const screenLayoutApi = createApi({
  reducerPath: 'screenLayoutApi',
  baseQuery: axiosBaseQuery,
  endpoints: (builder) => ({
    getScreenLayout: builder.query<ScreenLayout, {appId, screenId, versionId}>(),
    updateScreenLayout: builder.mutation<void, UpdateScreenLayoutRequest>()
  })
});
```

### State Shape
```typescript
interface RootState {
  screenLayout: ScreenLayoutState;  // Canvas state, controls, selections
  app: AppState;                   // App metadata, screen info
  session: SessionState;           // User session, feature flags
  data: DataState;                 // Runtime data for rendering
}
```

## TypeScript Configuration

### Strict Type Checking
- **noImplicitAny**: All variables must have explicit or inferred types
- **strictNullChecks**: Null/undefined must be handled explicitly
- **noImplicitReturns**: All code paths must return values

### Module Resolution
- **Path Mapping**: Absolute imports for src/ directory
- **Declaration Files**: Type definitions for @m-one modules
- **Import/Export**: ES6 module syntax throughout codebase

## Debugging and Monitoring

### Development Debugging
- **React DevTools**: Component hierarchy and prop inspection
- **Redux DevTools**: Time-travel debugging and state inspection
- **Browser DevTools**: Network, performance, and console debugging

### Production Monitoring
- **Datadog RUM**: Real user monitoring and performance metrics
- **Error Tracking**: Browser error logging to Datadog
- **Analytics**: User interaction tracking for product insights

## Security Considerations

### Client-Side Security
- **Input Sanitization**: All user inputs validated and sanitized
- **XSS Prevention**: React's built-in XSS protection
- **CSRF Protection**: API calls include CSRF tokens
- **Content Security Policy**: Restricts resource loading

### Authentication Integration
- **Session Management**: Integration with Method CRM authentication
- **Permission Checking**: Component visibility based on user roles
- **API Authorization**: Bearer tokens for backend communication

## Legacy System Integration

### Backward Compatibility
- **Legacy Canvas**: Maintains existing screen rendering (canvas.jsx)
- **V4 Screen Support**: New responsive system (ResponsiveCanvas.jsx)
- **Migration Strategy**: Gradual transition from legacy to new architecture

### Component Migration
- **Wrapper Pattern**: Legacy components wrapped for new architecture
- **Configuration Migration**: Existing screen configs map to new system
- **Feature Flags**: Controlled rollout of new features

## Extensibility Patterns

### Component Registry
- **Plugin Architecture**: New components register via configuration
- **Type Safety**: TypeScript ensures proper component contracts
- **Hot-Pluggable**: Components can be added without core changes

### Event System
- **Action Framework**: Configurable component behaviors
- **Event Handlers**: onClick, onChange, onLoad event management  
- **Workflow Integration**: Components trigger CRM workflows

### Customization Points
- **Theme Integration**: @m-next/styles design system compliance
- **Configuration API**: Component properties expose all customization
- **Extension Hooks**: Custom component development patterns
