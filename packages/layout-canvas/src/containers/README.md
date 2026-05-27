# Layout Container System

This directory contains the new container system for the layout canvas, replacing the previous `WIDGETS.SECTION` approach with a dedicated `WIDGETS.LAYOUT_CONTAINER` widget.

## Architecture

### Components

- **`LayoutContainer.tsx`** - Main container component with state management
- **`LayoutContainer.styles.ts`** - Emotion styled components for container appearance
- **`ContainerRenderer.tsx`** - Visual rendering logic for containers
- **`ContainerManager.ts`** - Utility class for container operations and validations
- **`ContainerTypes.ts`** - TypeScript interfaces and types

### Key Features

1. **Semantic Clarity**: `LAYOUT_CONTAINER` clearly indicates layout purpose vs content sections
2. **Flexible Styling**: Multiple container styles (default, card, panel, group, minimal)
3. **Collapsible**: Containers can be collapsed/expanded
4. **Drag & Drop**: Full support for dropping components into containers
5. **Child Management**: Automatic child component positioning and management
6. **Visual Feedback**: Hover states, selection indicators, drop zones

## Usage

### Basic Container

```typescript
import { LayoutContainer } from '@m-next/layout-canvas/containers';

const container = {
  id: 'container-1',
  type: WIDGETS.LAYOUT_CONTAINER,
  x: 0,
  y: 0,
  width: 6,
  height: 4,
  content: 'My Container',
  container: {
    direction: 'column',
    children: [],
    wrap: true,
    gap: 4
  }
};

<LayoutContainer
  container={container}
  childComponents={[]}
  selectedComponentId={selectedId}
  onContainerClick={handleContainerClick}
  onChildClick={handleChildClick}
  containerStyle="card"
  collapsible={true}
  title="My Container"
/>
```

### Container Manager

```typescript
import { ContainerManager } from '@m-next/layout-canvas/containers';

// Check if component is a container
const isContainer = ContainerManager.isContainer(component);

// Validate drop operation
const validation = ContainerManager.validateContainerDrop(
  container, 
  componentType, 
  allComponents
);

// Detect drop target
const dropTarget = ContainerManager.detectDropTarget(
  dropX, 
  dropY, 
  componentType, 
  components, 
  colWidth, 
  rowHeight
);
```

## Migration from SECTION

The new system is designed to work alongside the existing `WIDGETS.SECTION` for backward compatibility:

1. **Phase 1**: Both `SECTION` and `LAYOUT_CONTAINER` are supported
2. **Phase 2**: New containers use `LAYOUT_CONTAINER`
3. **Phase 3**: Existing `SECTION` containers can be migrated
4. **Phase 4**: `SECTION` can be deprecated for container use

## Container Styles

- **`default`**: Standard container with border
- **`card`**: Elevated container with shadow
- **`panel`**: Subtle background container
- **`group`**: Grouped appearance with green accent
- **`minimal`**: Transparent container with minimal styling

## Configuration

Containers support extensive configuration through the `ContainerConfig` interface:

```typescript
interface ContainerConfig {
  direction: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  children: string[];
  wrap?: boolean;
  gap?: number;
  alignItems?: 'start' | 'center' | 'end' | 'stretch';
  justifyContent?: 'start' | 'center' | 'end' | 'space-between' | 'space-around' | 'space-evenly';
  maxChildren?: number;
}
```

## Integration with LayoutCanvas

The new container system integrates seamlessly with the existing LayoutCanvas:

- Container detection and validation
- Drag and drop operations
- Child component management
- Visual feedback and selection
- Collision protection during drag operations
