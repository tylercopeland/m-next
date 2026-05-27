# Project Brief: M-One App Builder

## Project Overview
The M-One App Builder is a React-based WYSIWYG editor for creating and managing screen layouts within the Method CRM platform. It enables users to visually design application interfaces using drag-and-drop functionality with @m-one components.

## Core Requirements

### Primary Goals
- **Visual Layout Designer**: Provide intuitive drag-and-drop interface for screen creation
- **Component Integration**: Support full catalog of @m-one components (buttons, inputs, charts, grids, etc.)
- **Legacy Support**: Maintain compatibility with existing screens while transitioning to new architecture
- **Real-time Editing**: Live preview and editing capabilities with immediate feedback
- **State Persistence**: Save and restore screen layouts with backend integration

### Target Users
- **Business Users**: Create application screens without coding knowledge  
- **Power Users**: Configure advanced component properties and actions
- **Developers**: Extend and maintain the editor functionality

## Technical Constraints

### Architecture Requirements
- **React 17.0.2** with functional components and hooks
- **Redux Toolkit** for state management
- **@m-one component library** integration
- **React Grid Layout** foundation for drag-and-drop
- **TypeScript** support for type safety
- **Responsive design** support (desktop, tablet, mobile)

### Performance Requirements
- Support layouts with 50+ components
- Sub-500ms interaction response times
- Efficient state updates without full re-renders
- Lazy loading for complex components

### Integration Requirements
- **Backend API** integration for save/restore operations
- **Method CRM** platform integration
- **IIS deployment** support
- **Datadog RUM** analytics integration

## Success Criteria

### Functional Success
- Users can create complete screen layouts visually
- All @m-one components render and function correctly
- Layouts save and restore reliably
- Component properties are fully configurable
- Actions and events work as expected

### Technical Success  
- 95%+ uptime in production
- <2 second initial load time
- Clean TypeScript implementation without type casting
- Comprehensive test coverage (>85%)
- Zero critical accessibility violations

### Business Success
- Reduction in development time for new screens
- Increased adoption by business users
- Positive user feedback and engagement metrics
- Successful migration from legacy editor

## Current Status
**Phase**: Active Development and Modernization

The project is transitioning from a legacy layout system to the new @m-next/layout-canvas architecture. Core functionality exists but is being enhanced with modern patterns and improved user experience.

## Key Dependencies
- **@m-next/layout-canvas**: New drag-and-drop foundation (ready for adoption)
- **@m-one component packages**: 30+ UI components for layouts
- **React Grid Layout**: Grid system foundation  
- **Redux Toolkit**: State management
- **Method CRM APIs**: Backend integration for data and persistence

## Deployment Requirements
- **IIS Virtual Directory**: app-builder pointing to dist folder
- **Node.js Build Process**: Webpack-based build pipeline
- **Environment Configuration**: Development, staging, production configs
- **CDN Integration**: Static asset delivery optimization
