# System Patterns: Responsive Layout Canvas

## Architecture Overview

### Enhanced Component Hierarchy
```
ResponsiveLayoutCanvas (Main Orchestrator)
├── CanvasHeader (Controls & Breakpoint Selector)
├── ComponentPalette (Components + Containers)
│   ├── ComponentSection (Standard @m-one components)
│   └── ContainerSection (Layout containers)
└── CanvasArea (Responsive Canvas)
    ├── BreakpointIndicator (Current viewport info)
    ├── ResponsiveGridOverlay (Adaptive grid)
    ├── EmptyState (No Components State)
    ├── PreviewOverlay (Drag preview system)
    └── ComponentRenderer (Individual Components)
        ├── ComponentSelector (Selection & Interaction)
        └── ContainerRenderer (Container components)
```

### Enhanced State Management Pattern
- **Centralized State**: ResponsiveLayoutCanvas maintains component and breakpoint state
- **Immutable Updates**: State changes through immutable patterns with responsive data
- **Callback Propagation**: Parent notification with breakpoint-aware changes
- **Responsive State**: Component state includes breakpoint overrides
- **Container State**: Nested component relationships and directional layouts

### Custom Hook Architecture
Seven specialized hooks handle responsive functionality:

#### useResponsiveLayout
- **Purpose**: Manages responsive behavior and breakpoint handling
- **Responsibilities**: Viewport detection, component wrapping/compression, breakpoint overrides
- **Pattern**: Responsive state + media query management + override handling

#### useIntelligentReflow  
- **Purpose**: Handles automatic gap-filling and component pushing
- **Responsibilities**: Real-time gap detection, immediate reflow, collision avoidance
- **Pattern**: Layout analysis + reflow algorithms + animation coordination

#### useContainerSystem
- **Purpose**: Manages directional containers and nested layouts
- **Responsibilities**: Container creation, child management, directional layout logic
- **Pattern**: Container state + nesting algorithms + directional flow management

#### useComponentSelection (Enhanced)
- **Purpose**: Manages component selection with container awareness
- **Responsibilities**: Multi-select, container selection, nested component handling
- **Pattern**: State + event handlers + container hierarchy management

#### useCanvasDragDrop (Enhanced)
- **Purpose**: Handles drag from palette with intelligent collision handling  
- **Responsibilities**: Smart drop positioning, component pushing, container detection
- **Pattern**: Drag state + collision algorithms + reflow triggers

#### useComponentDragMove (Enhanced)
- **Purpose**: Manages dragging with real-time reflow and preview
- **Responsibilities**: Drag tracking, live collision handling, preview generation
- **Pattern**: Drag state + live reflow + preview system

#### useVisualFeedback
- **Purpose**: Manages preview overlays and visual indicators
- **Responsibilities**: Drop previews, snap guides, collision warnings
- **Pattern**: Visual state + overlay management + feedback coordination

## Key Design Patterns

### Coordinate System Pattern
**Dual Coordinate Systems**: Grid units vs. Pixel coordinates
```typescript
// Grid to Pixels (for rendering)
const gridToPixels = (gridUnits: number, isWidth: boolean = true): number => {
  if (isWidth) {
    return Math.floor((gridUnits * canvasWidth) / gridColumns);
  } else {
    return gridUnits * rowHeight;
  }
};

// Pixels to Grid (for positioning)
const pixelsToGrid = (pixels: number, isWidth: boolean = true): number => {
  if (isWidth) {
    return Math.round((pixels * gridColumns) / canvasWidth);
  } else {
    return Math.round(pixels / rowHeight);
  }
};
```

### Collision Detection Pattern
**AABB (Axis-Aligned Bounding Box) Algorithm**:
- Components represented as rectangles
- Overlap detection prevents component collision
- Efficient O(n) collision checking during drag operations
- **Compaction Collision**: Same algorithm used for upward movement calculations

### Event Delegation Pattern
- **Canvas-Level Events**: Mouse events handled at canvas level
- **Component Events**: Bubbled up through component hierarchy
- **Ref-Based Targeting**: Direct DOM access for precise positioning

## Component Rendering Pattern - REAL COMPONENTS WORKING ✅

### Real Component Rendering Strategy
```typescript
const renderComponent = (component: ResponsiveComponent): React.ReactNode => {
  const componentProps = {
    value: component.content || `Sample ${component.type}`,
    isV4Design: true
  };
  
  switch (component.type) {
    case WIDGETS.BUTTON:
      return <Button {...componentProps} />;
    case WIDGETS.TEXTBOX:
      return <Input {...componentProps} />;
    case WIDGETS.TEXTAREA:
      return <InputArea {...componentProps} />;
    case WIDGETS.CHECKBOX:
      return <Checkbox {...componentProps} />;
    case WIDGETS.TOGGLE:
      return <Toggle {...componentProps} />;
    case WIDGETS.LABEL:
      return <Text {...componentProps} />;
    default:
      return <EnhancedPlaceholder component={component} />;
  }
};
```

### Enhanced Placeholder Strategy
- **Complex Components**: Beautiful gradient placeholders for components requiring configuration
- **Configuration Required**: Dropdown, RadioButton, AddressLookup, Signature, HTMLEditor, TagList
- **Data Components**: DataTable, Calendar, Map, Chart, Gallery
- **Layout Components**: Section containers with visual indicators

### Animation Pattern
**CSS Keyframe Animations**:
- **Bounce Animation**: Used for component compaction movements
- **Staggered Timing**: Animations triggered with delays for visual appeal
- **State-Driven**: Animation state controlled via isCompacting prop

## Critical Implementation Paths

### Component Addition Flow
1. **Drag Initiation**: User drags from palette
2. **Drag Tracking**: useCanvasDragDrop tracks mouse position
3. **Grid Calculation**: Mouse position converted to grid coordinates
4. **Collision Check**: Verify no overlap with existing components
5. **Component Creation**: New GridComponent instance created
6. **State Update**: Component added to components array
7. **Re-render**: Canvas updates with new component

### Component Movement Flow
1. **Selection**: Component selected via click
2. **Drag Start**: Mouse down on selected component
3. **Drag Tracking**: useComponentDragMove tracks movement
4. **Real-time Updates**: Component position updated during drag
5. **Collision Prevention**: Movement blocked if collision detected
6. **Boundary Constraints**: Movement limited to canvas bounds
7. **Drop Completion**: Final position committed to state

### Component Compaction Flow
1. **Trigger Event**: User clicks "Compact" button or deletes components
2. **Calculation**: useComponentCompaction calculates optimal positions
3. **Collision Detection**: AABB algorithm prevents overlaps during movement
4. **Animation Trigger**: isCompacting prop set for affected components
5. **State Update**: New positions committed to component state
6. **Visual Feedback**: Bounce animation plays during movement
7. **Completion**: Animation ends, components in new positions

### Selection Management Flow
1. **Click Detection**: Mouse events captured at canvas level
2. **Target Identification**: Determine clicked component or canvas
3. **Multi-Select Logic**: Ctrl/Cmd key handling for multiple selection
4. **State Updates**: Selection state updated in useComponentSelection
5. **Visual Updates**: Selected components show blue borders and handles

## Component Relationships

### LayoutCanvas ↔ Custom Hooks
- **Bidirectional Communication**: Hooks receive props, return handlers
- **State Synchronization**: Hooks update parent state via callbacks
- **Event Coordination**: LayoutCanvas coordinates between multiple hooks

### ComponentSelector ↔ GridComponent
- **Wrapper Pattern**: ComponentSelector wraps rendered components
- **Interaction Layer**: Provides selection, drag handles, resize points
- **State Reflection**: Visual state reflects component properties

### Palette ↔ Canvas
- **Drag Initiation**: Palette starts drag operations
- **Type Communication**: Component type passed from palette to canvas
- **State Independence**: Palette and canvas maintain separate concerns

## Performance Patterns

### Memoization Strategy
- **useCallback**: Event handlers memoized to prevent re-renders
- **useMemo**: Expensive calculations cached (canvas height, filtered components)
- **React.memo**: Component-level memoization for stable props

### Event Optimization
- **Event Delegation**: Single event listener at canvas level
- **Throttling**: Mouse move events throttled during drag operations
- **Cleanup**: Event listeners properly removed on unmount

### Animation Optimization
- **CSS Transitions**: Hardware-accelerated animations
- **Staggered Rendering**: Components animate in sequence
- **State Batching**: Animation state updates batched together

### Render Optimization
- **Conditional Rendering**: Components only render when visible
- **Key Stability**: Stable keys prevent unnecessary re-renders
- **State Batching**: Multiple state updates batched together

## Error Handling Patterns

### Boundary Constraints
- **Grid Bounds**: Components cannot be placed outside grid boundaries
- **Collision Prevention**: Overlap detection prevents invalid positions
- **Size Validation**: Component dimensions validated against grid limits
- **Compaction Bounds**: Movement constrained to prevent invalid positions

### State Consistency
- **Immutable Updates**: State changes maintain referential integrity
- **Validation**: Component properties validated before state updates
- **Rollback Capability**: Drag operations can be cancelled/reverted
- **Animation State**: Compaction animations can be interrupted

### Accessibility Patterns
- **ARIA Labels**: Comprehensive labeling for screen readers
- **Keyboard Navigation**: Full keyboard support for all interactions
- **Focus Management**: Proper focus handling during drag operations
- **Semantic HTML**: Meaningful HTML structure for assistive technologies

## Container Drop Zone Patterns
**Added**: 2025-08-20
**Phase 1 COMPLETE**: 2025-08-25

### ✅ Phase 1 Implementation Complete: Container Component Foundation

**ContainerWrapper Component**: Successfully implemented professional container component
- **File**: `src/component-wrappers/ContainerWrapper.tsx` - Complete implementation 
- **Visual Design**: Dashed border empty boxes with direction indicators and empty state
- **Selection Integration**: Containers work with existing selection system (blue border, click handling)
- **Direction Indicators**: Top-left corner shows COLUMN/ROW/ROW-REVERSE/COLUMN-REVERSE with arrows
- **Empty State Display**: "📦 Container - Drop components here" messaging
- **TypeScript Integration**: Full type safety with proper interfaces and Emotion JSX pragma
- **Component Registry Integration**: Seamless integration replacing WIDGETS.SECTION placeholder

**Integration Points Complete**:
- ✅ Component Registry: Updated `src/component-registry/index.ts` to use ContainerWrapper for WIDGETS.SECTION
- ✅ ReactGridLayoutWrapper: Existing integration automatically renders containers via component registry
- ✅ Emotion Styling: Professional styling with hover states, selection indicators, direction labels
- ✅ Type Safety: Full TypeScript support with ResponsiveComponent and ContainerConfig interfaces

**What Users Can Do Now (Phase 1)**:
- ✅ Drag "Container" from component palette to canvas
- ✅ See containers as visually distinct empty boxes with dashed borders
- ✅ Select containers and see blue selection border with proper interaction
- ✅ Move containers around canvas like regular components  
- ✅ View direction indicators showing container layout direction (COLUMN by default)
- ✅ Visual feedback shows empty state message "Drop components here"
- ✅ Distinguish containers from regular components by professional appearance

### Container-Aware Drop Detection Pattern
**Enhanced Drop Target Identification**: Distinguish between canvas and container drop zones
```typescript
// Container drop detection pattern
interface DropTarget {
  type: 'container' | 'canvas';
  containerId?: string;
  relativePosition?: { x: number; y: number };
  validDrop: boolean;
}

const useContainerDropDetection = () => {
  const detectDropTarget = useCallback((dropX: number, dropY: number, components: ResponsiveComponent[]) => {
    // Find container at drop position
    const targetContainer = components.find(comp => 
      comp.container && isPointInContainer(dropX, dropY, comp)
    );
    
    if (targetContainer) {
      return {
        type: 'container',
        containerId: targetContainer.id,
        relativePosition: calculateRelativePosition(dropX, dropY, targetContainer),
        validDrop: validateContainerDrop(targetContainer, draggedComponentType)
      };
    }
    
    return {
      type: 'canvas',
      validDrop: true
    };
  }, []);
  
  return { detectDropTarget };
};
```

### Container Protection Collision Pattern
**Container Immobility**: Containers resist collision-based movement
```typescript
// Enhanced collision rules for container protection
interface CollisionRules {
  protectContainers: boolean;
  allowSingleNesting: boolean;
  maintainChildRelationships: boolean;
}

const useContainerCollisionRules = (rules: CollisionRules) => {
  const checkCollision = useCallback((item: ResponsiveComponent, layout: ResponsiveComponent[]) => {
    // Container protection: containers don't move from collisions
    if (rules.protectContainers && item.container) {
      return { canPush: false, reason: 'Container protection enabled' };
    }
    
    // Child relationship protection: children move with parents
    if (rules.maintainChildRelationships && item.containerId) {
      const parent = layout.find(comp => comp.id === item.containerId);
      if (parent) {
        return { canPush: false, reason: 'Child component bound to container' };
      }
    }
    
    return { canPush: true };
  }, [rules]);
  
  return { checkCollision };
};
```

### Container-Child Relationship Pattern
**Hierarchical Component Management**: Parent-child relationships with relative positioning
```typescript
// Container-child relationship management
interface ContainerChild {
  componentId: string;
  containerId: string;
  relativeX: number;  // Position relative to container
  relativeY: number;
}

const useContainerChildRelationships = () => {
  const addChildToContainer = useCallback((childId: string, containerId: string, relativePos: {x: number, y: number}) => {
    return {
      type: 'ADD_CHILD_TO_CONTAINER',
      payload: {
        childId,
        containerId,
        relativePosition: relativePos
      }
    };
  }, []);
  
  const moveContainerWithChildren = useCallback((containerId: string, newPosition: {x: number, y: number}) => {
    // When container moves, all children move with it
    return {
      type: 'MOVE_CONTAINER_WITH_CHILDREN',
      payload: {
        containerId,
        newPosition,
        updateChildPositions: true
      }
    };
  }, []);
  
  const validateNestingDepth = useCallback((targetContainerId: string, layout: ResponsiveComponent[]) => {
    // Ensure single-level nesting only
    const targetContainer = layout.find(comp => comp.id === targetContainerId);
    return !targetContainer?.containerId; // Container can't be inside another container
  }, []);
  
  return { addChildToContainer, moveContainerWithChildren, validateNestingDepth };
};
```

### Container Drop Zone Visual Feedback Pattern
**Enhanced Visual Indicators**: Container-specific drop feedback
```typescript
// Container drop zone visual feedback
interface ContainerDropFeedback {
  showContainerHighlight: boolean;
  showDropPreview: boolean;
  containerBorderColor: string;
  dropPreviewPosition: { x: number; y: number };
}

const useContainerDropFeedback = () => {
  const [dropFeedback, setDropFeedback] = useState<ContainerDropFeedback>({
    showContainerHighlight: false,
    showDropPreview: false,
    containerBorderColor: '#007bff',
    dropPreviewPosition: { x: 0, y: 0 }
  });
  
  const showContainerDropZone = useCallback((containerId: string, previewPosition: {x: number, y: number}) => {
    setDropFeedback(prev => ({
      ...prev,
      showContainerHighlight: true,
      showDropPreview: true,
      dropPreviewPosition: previewPosition
    }));
  }, []);
  
  const hideContainerDropZone = useCallback(() => {
    setDropFeedback(prev => ({
      ...prev,
      showContainerHighlight: false,
      showDropPreview: false
    }));
  }, []);
  
  return { dropFeedback, showContainerDropZone, hideContainerDropZone };
};
```

### Container State Management Pattern
**Extended Component State**: Container metadata and child tracking
```typescript
// Enhanced ResponsiveComponent with container support
interface ResponsiveComponent extends GridComponent {
  // Existing properties...
  
  // Container-specific properties
  isContainer?: boolean;
  containerConfig?: {
    direction: 'row' | 'column' | 'row-reverse' | 'column-reverse';
    allowsChildren: boolean;
    maxChildren?: number;
  };
  
  // Child relationship properties
  containerId?: string;        // Parent container ID (if this is a child)
  relativePosition?: {         // Position relative to container
    x: number;
    y: number;
  };
  
  // Container children tracking
  childrenIds?: string[];      // IDs of child components (if this is a container)
}
```
