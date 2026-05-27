# Technical Context: Layout Canvas - Focused Implementation (2025-08-27)

## Technology Stack

### Core Technologies
- **React 18+**: Modern React with hooks and concurrent features
- **TypeScript 5+**: Full type safety throughout
- **Emotion**: CSS-in-JS styling for @m-one design system integration
- **React-Grid-Layout (RGL)**: Production-proven grid layout system
- **Jest**: Testing framework with React Testing Library

### Component Ecosystem
- **@m-next/styles**: Design system tokens for Figma integration
- **@m-next/runtime-interface**: Component type definitions (WIDGETS)
- **@m-next/svg-icon**: Icon system for UI elements
- **@m-next/button, @m-next/input, etc.**: Actual component implementations

## Current Architecture (Working Foundation)

### Core Component Structure
```typescript
// Existing working interfaces
interface ResponsiveComponent extends GridComponent {
  id: string;
  type: string;
  x: number; y: number; w: number; h: number;
  content?: string;
  hidden?: boolean;
  responsive?: {
    [breakpoint: string]: Partial<GridComponent>;
  };
}

interface BreakpointConfig {
  mobile: number;    // 375px
  tablet: number;    // 768px  
  desktop: number;   // 1200px
}
```

### RGL Integration (Complete ✅)
- **ReactGridLayoutWrapper**: Main RGL integration component
- **State Adapters**: Bidirectional conversion between ResponsiveComponent and RGL formats
- **Event Handling**: Drag, drop, resize events properly managed
- **Component Rendering**: 6 @m-one components working (Button, Input, TextArea, Checkbox, Toggle, Text)

## Key Technical Features

### Coordinate System
```typescript
// Grid system configuration
const GRID_COLUMNS = 12;
const CANVAS_WIDTH = 900;
const ROW_HEIGHT = 32;

// Conversion utilities
const gridToPixels = (gridUnits: number, isWidth: boolean = true): number => {
  if (isWidth) {
    return Math.floor((gridUnits * CANVAS_WIDTH) / GRID_COLUMNS);
  } else {
    return gridUnits * ROW_HEIGHT;
  }
};
```

### Collision Detection
- **AABB Algorithm**: Axis-Aligned Bounding Box for overlap detection
- **Efficient O(n)**: Single pass through components for collision checking
- **Real-time Updates**: Collision detection during drag operations
- **Compaction Support**: Same algorithm used for upward movement

### Animation Implementation
```typescript
// Bounce animation for component compaction
const bounceUp = keyframes`
  0% { transform: translateY(0); }
  40% { transform: translateY(-20px); }
  60% { transform: translateY(-10px); }
  80% { transform: translateY(-15px); }
  100% { transform: translateY(0); }
`;
```

## Custom Hooks Architecture

### useComponentCompaction
**Purpose**: Handle automatic upward movement of components
```typescript
interface UseComponentCompactionReturn {
  compactUpwards: () => void;
  isCompacting: string[];
}
```

**Key Features**:
- **Collision Detection**: Prevents component overlap during movement
- **Optimal Positioning**: Calculates best upward positions
- **Animation Coordination**: Triggers bounce animations for moved components
- **State Management**: Updates component positions immutably

**Algorithm**:
1. Identify components that can move upward
2. Calculate target positions using collision detection
3. Update component state with new positions
4. Trigger animations for visual feedback

### useComponentSelection
**Purpose**: Manage component selection state
- Multi-select support with Ctrl/Cmd keys
- Visual selection indicators
- Deselection on canvas click

### useCanvasDragDrop
**Purpose**: Handle drag from palette to canvas
- Drag state management
- Drop positioning with grid snapping
- Component creation on drop

### useComponentDragMove
**Purpose**: Manage dragging existing components
- Real-time position updates
- Collision detection during drag
- Boundary constraints

## Performance Optimizations

### Rendering Optimizations
- **Memoization**: useCallback and useMemo for expensive calculations
- **Conditional Rendering**: Components only render when visible
- **Key Stability**: Stable React keys prevent unnecessary re-renders

### Animation Performance
- **CSS Transitions**: Hardware-accelerated animations
- **Staggered Rendering**: Components animate in sequence
- **State Batching**: Animation state updates batched together

### Event Handling
- **Event Delegation**: Single event listener at canvas level
- **Throttling**: Mouse move events throttled during drag
- **Cleanup**: Event listeners properly removed on unmount

## Integration Patterns

### @m-one Component Integration
```typescript
// Component rendering pattern
const renderComponent = (component: GridComponent) => {
  const componentText = component.content || `Sample ${component.type}`;
  
  switch (component.type) {
    case WIDGETS.BUTTON:
      return <Button value={componentText} isV4Design />;
    case WIDGETS.TEXTBOX:
      return <Input value={componentText} isV4Design />;
    // ... other component types
  }
};
```

### AppBuilder Integration
```typescript
// AppBuilder-compatible props interface
interface LayoutCanvasProps {
  // Core AppBuilder integration
  layout: LayoutV4;                    // Redux state with layout data
  resolution: 'desktop' | 'tablet' | 'mobile';  // From DeviceViewSelector
  onControlClick: (controlId: string, property?: string) => void; // Control selection
  
  // Canvas configuration  
  containerHeight: number;             // Available canvas height
  appRibbonType: number;              // Layout mode (affects canvas behavior)
  
  // State management
  selectedControlId?: string;          // Currently selected control
  isLoading?: boolean;                // Loading state
  error?: any;                        // Error state
  
  // Canvas-specific props
  onLayoutChange?: (layouts: RGLLayouts) => void;  // For API persistence
}

// Layout data conversion utilities
const convertLayoutV4ToComponents = (layout: LayoutV4): ResponsiveComponent[] => {
  return layout.entries.map(entry => ({
    id: entry.controlId,
    type: entry.type,
    x: 0, y: 0, // Calculate from entry.size
    w: entry.size, h: 1,
    content: entry.controlId
  }));
};

// Canvas dimensions matching ResponsiveCanvas
const getCanvasWidth = (resolution: string) => {
  switch (resolution) {
    case 'mobile': return 400;   // Matches AppBuilder ResponsiveCanvas
    case 'tablet': return 900;   // Matches AppBuilder ResponsiveCanvas  
    case 'desktop': return '100%'; // Matches AppBuilder ResponsiveCanvas
    default: return 900;
  }
};
```

### Styling Integration
- **Emotion Styled Components**: Consistent with @m-one design system
- **Design Tokens**: Colors, spacing, typography from @m-next/styles
- **Responsive Design**: Grid system adapts to different canvas sizes
- **AppBuilder Theme Integration**: Consistent with existing AppBuilder styling patterns

## Testing Strategy

### Unit Testing
- **Hook Testing**: Individual hook functionality with Jest
- **Component Testing**: React Testing Library for component behavior
- **Type Testing**: TypeScript compilation for type safety

### Integration Testing
- **Drag/Drop Testing**: Simulated drag operations
- **Selection Testing**: Multi-select and deselection flows
- **Compaction Testing**: Component movement and animation verification

### Visual Testing
- **Storybook Stories**: Interactive examples for all component states
- **Canvas States**: Empty, with components, with hidden components
- **Animation States**: Compaction animations and transitions

## Browser Compatibility
- **Modern Browsers**: Chrome, Firefox, Safari, Edge (latest versions)
- **React 18+**: Concurrent features and Suspense support
- **TypeScript 5+**: Latest language features and type checking

## Container Drop Zone Architecture
**Added**: 2025-08-20

### Enhanced Drop Detection System
**Architecture**: Container-aware drop detection with boundary calculations
```typescript
// Container drop target detection
interface DropTarget {
  type: 'container' | 'canvas';
  container?: ResponsiveComponent;
  relativePosition?: { x: number; y: number };
}

const detectDropTarget = (dropX: number, dropY: number, components: ResponsiveComponent[]): DropTarget => {
  const targetContainer = components.find(comp => 
    comp.container && 
    dropX >= comp.x * colWidth && 
    dropX <= (comp.x + comp.width) * colWidth &&
    dropY >= comp.y * (rowHeight + 4) &&
    dropY <= (comp.y + comp.height) * (rowHeight + 4)
  );
  
  return {
    type: targetContainer ? 'container' : 'canvas',
    container: targetContainer,
    relativePosition: targetContainer ? calculateRelativePosition(dropX, dropY, targetContainer) : null
  };
};
```

### Container-Child Relationship Management
**Parent-Child Positioning**: Child components positioned relative to container coordinate system
```typescript
// Child positioning within containers
interface ContainerChild {
  containerId: string;
  relativeX: number;  // Position relative to container bounds
  relativeY: number;
}

// Position calculation for container children
const calculateChildPosition = (container: ResponsiveComponent, relativePos: {x: number, y: number}) => {
  return {
    x: container.x + relativePos.x,
    y: container.y + relativePos.y,
    containerId: container.id
  };
};
```

### Collision Rule Customization
**Container Protection**: Custom collision rules prevent containers from being pushed
```typescript
// Enhanced collision detection for containers
interface ContainerCollisionRules {
  protectContainers: boolean;           // Containers immune to collision pushing
  allowSingleLevelNesting: boolean;     // Validate nesting depth
  maintainChildRelationships: boolean;  // Children move with parents
}

const customCollisionDetection = (item: ResponsiveComponent, layout: ResponsiveComponent[], rules: ContainerCollisionRules) => {
  // Container-specific collision logic
  if (rules.protectContainers && item.container) {
    return { canPush: false, reason: 'Container protection enabled' };
  }
  
  // Validate nesting depth
  if (rules.allowSingleLevelNesting && item.containerId && hasNestedContainer(item, layout)) {
    return { canPush: false, reason: 'Single nesting level limit' };
  }
  
  return standardCollisionDetection(item, layout);
};
```

### Implementation Timeline
**Phase 1**: Enhanced drop detection and container identification (Days 1-2)
**Phase 2**: Container-specific drop logic with relative positioning (Days 3-4)  
**Phase 3**: Collision rule customization and validation (Days 5-6)
**Phase 4**: Testing and integration with existing RGL system (Days 7-8)

## Development Environment
- **Node.js 18+**: Modern JavaScript runtime
- **Webpack 5**: Module bundling and development server
- **ESLint**: Code quality and style consistency
- **Prettier**: Code formatting and consistency
