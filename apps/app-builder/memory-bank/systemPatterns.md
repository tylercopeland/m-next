# System Patterns: M-One App Builder

## Architecture Overview

### Hybrid Canvas System
The App Builder uses a dual-canvas approach to support both legacy screens and new responsive layouts:

```typescript
// Legacy Canvas (canvas.jsx) - V3 screens
{!isV4Screen && (
  <Canvas
    layout={layout}
    selectedControlId={selectedControlId}
    onControlClick={handleControlClick}
  />
)}

// Responsive Canvas (ResponsiveCanvas.jsx) - V4 screens  
{isV4Screen && (
  <ResponsiveCanvas
    layout={layoutV4}
    resolution={resolution}
    containerHeight={containerHeight - 48}
  />
)}
```

**Design Decision**: Maintain backward compatibility while enabling migration to new @m-next/layout-canvas system.

### Component Registry Pattern

Components are registered through configuration objects that define rendering and behavior:

```typescript
interface ControlConfiguration {
  component: React.ComponentType<any>;
  label: string;
  defaultProps: Record<string, any>;
  minWidth: number;
  maxWidth: number;
  resizable: { width: boolean; height: boolean };
}

// Registry maps widget types to configurations
const componentRegistry: Partial<Record<WidgetType, ControlConfiguration>> = {
  'button': {
    component: ButtonWrapper,
    label: 'Button',
    defaultProps: { text: 'Click me' },
    minWidth: 2,
    maxWidth: 6,
    resizable: { width: true, height: false }
  }
};
```

**Design Decision**: Centralized registry enables easy component addition and type safety.

## State Management Patterns

### Redux Toolkit Slice Pattern
Each domain has its own slice with actions, reducers, and selectors:

```typescript
// screenLayoutSlice.jsx
export const screenLayoutSlice = createSlice({
  name: 'screenLayout',
  initialState,
  reducers: {
    screenLoaded: (state, action) => { /* ... */ },
    controlSelected: (state, action) => { /* ... */ },
    controlUpdated: (state, action) => { /* ... */ }
  }
});

// Export actions and selectors
export const { screenLoaded, controlSelected, controlUpdated } = screenLayoutSlice.actions;
export const selectControls = (state) => state.screenLayout.controls;
export const selectSelectedControlId = (state) => state.screenLayout.selectedControlId;
```

**Design Decision**: Domain-driven slices provide clear boundaries and prevent state coupling.

### RTK Query Integration Pattern
API endpoints are defined with RTK Query for automatic caching and state management:

```typescript
export const screenLayoutApi = createApi({
  reducerPath: 'screenLayoutApi',
  baseQuery: axiosBaseQuery,
  tagTypes: ['ScreenLayout'],
  endpoints: (builder) => ({
    getScreenLayout: builder.query({
      query: ({ appId, screenId, versionId }) => ({
        url: `/api/screens/${screenId}/versions/${versionId}`,
        method: 'GET'
      }),
      providesTags: ['ScreenLayout']
    }),
    updateScreenLayout: builder.mutation({
      query: ({ appId, screenId, versionId, body }) => ({
        url: `/api/screens/${screenId}/versions/${versionId}`,
        method: 'PUT',
        data: body
      }),
      invalidatesTags: ['ScreenLayout']
    })
  })
});
```

**Design Decision**: RTK Query eliminates boilerplate and provides automatic caching/invalidation.

## Component Patterns

### Wrapper Component Pattern
Each @m-one component has a wrapper that handles App Builder specific concerns:

```typescript
// component-wrappers/ButtonWrapper.jsx
function ButtonWrapper({ control, isSelected, onControlClick, ...props }) {
  const handleClick = useCallback((event) => {
    // App Builder selection logic
    onControlClick(control.id);
    
    // Component-specific click handling
    if (control.onClick) {
      executeAction(control.onClick);
    }
  }, [control, onControlClick]);

  return (
    <div className={isSelected ? 'selected' : ''}>
      <Button
        {...control.properties}
        onClick={handleClick}
        {...props}
      />
    </div>
  );
}
```

**Design Decision**: Wrapper pattern separates design-time concerns from runtime component behavior.

### Lazy Loading Pattern
Large components are lazy loaded to improve initial bundle size:

```typescript
// Lazy loaded components with Suspense boundaries
const Canvas = React.lazy(() => import('./canvas'));
const RightPanel = React.lazy(() => import('./right-panel/rightPanel'));
const ResponsiveCanvas = React.lazy(() => import('./ResponsiveCanvas'));

// Usage with fallback
<Suspense fallback={<LoadingSkeleton count={1} width='100%' height='100%' />}>
  <Canvas {...canvasProps} />
</Suspense>
```

**Design Decision**: Lazy loading reduces initial bundle size while providing smooth loading experience.

## Event System Patterns

### Action Management Pattern
Components can have multiple event handlers that trigger action sets:

```typescript
// Action handling in layoutDesigner.jsx
const handleAddAction = (control, eventName) => {
  if (!control[eventName]) {
    // Create new action set for event
    const actionSetId = Guid.create();
    const updatedControl = { ...control, [eventName]: actionSetId };
    
    const emptyActionSet = {
      ActionSetId: actionSetId,
      Actions: []
    };
    
    // Update control with new action set reference
    dispatch(controlUpdated(updatedControl));
    
    // Create empty action set for action editor
    dispatch(actionUpdated({
      id: actionSetId,
      actionSet: emptyActionSet,
      controlId: updatedControl.id
    }));
  }
};
```

**Design Decision**: Action sets provide reusable, configurable behavior system.

### Event Delegation Pattern
Canvas uses event delegation for efficient event handling:

```typescript
// Canvas click handling
const handleCanvasClick = useCallback((event) => {
  // Find the clicked control through event bubbling
  const controlElement = event.target.closest('[data-control-id]');
  
  if (controlElement) {
    const controlId = controlElement.dataset.controlId;
    onControlClick(controlId);
  } else {
    // Click on empty canvas - deselect all
    onControlClick(null);
  }
}, [onControlClick]);

return (
  <div className="canvas" onClick={handleCanvasClick}>
    {/* Rendered components */}
  </div>
);
```

**Design Decision**: Event delegation reduces memory usage and improves performance with many components.

## Data Flow Patterns

### Unidirectional Data Flow
Data flows down through props, events bubble up through callbacks:

```typescript
// LayoutDesigner -> Canvas -> Component flow
<Canvas
  controls={controls}
  selectedControlId={selectedControlId}
  onControlClick={handleControlClick}
  onControlChange={handleControlChange}
/>

// Canvas renders components and passes callbacks
{Object.values(controls).map(control => (
  <ComponentWrapper
    key={control.id}
    control={control}
    isSelected={selectedControlId === control.id}
    onControlClick={onControlClick}
    onChange={(newControl) => onControlChange(newControl)}
  />
))}
```

**Design Decision**: Unidirectional flow makes state changes predictable and debuggable.

### Optimistic Updates Pattern
UI updates immediately, with rollback on API failure:

```typescript
const handleControlChange = useCallback((control) => {
  // Immediate UI update
  dispatch(controlUpdated(control));
  
  // Mark changes for saving
  dispatch(markUnsavedChanges());
}, [dispatch]);

// Batch save on user action
const handleSave = async () => {
  try {
    const body = {
      controls: { ...changes },
      actionUpserts: { ...actionUpserts },
      // ... other changes
    };
    
    await updateScreen({ appId, screenId, versionId, body }).unwrap();
    dispatch(screenSaved());
  } catch (error) {
    // Could implement rollback here if needed
    toast.error(`Error saving screen - ${error.data?.message}`);
  }
};
```

**Design Decision**: Optimistic updates provide responsive UI while maintaining data integrity.

## Performance Patterns

### Memoization Strategy
Expensive computations and component renders are memoized:

```typescript
// useMemo for expensive computations
const lookUpControl = useMemo(() => {
  if (selectedControlId === 'tab-panel') {
    return { id: 'tab-panel', type: widgets.APPRIBBON };
  }
  if (!controls) return null;
  return selectedControlId ? controls[selectedControlId] : null;
}, [controls, selectedControlId]);

// useCallback for event handlers passed to children
const handleControlClick = useCallback((controlId, property) => {
  dispatch(controlSelected({ controlId, property }));
}, [dispatch]);

// React.memo for pure components
const ButtonWrapper = React.memo(({ control, isSelected, onControlClick }) => {
  // Component implementation
});
```

**Design Decision**: Strategic memoization prevents unnecessary re-renders in complex component trees.

### Batch Update Pattern
Multiple state updates are batched to prevent excessive re-renders:

```typescript
// Multiple updates in single dispatch
const handleRibbonChange = (action) => {
  dispatch(ribbonUpdated(action));
  
  if (action.create) {
    // Batch UI updates
    const updated = [...tabList];
    updated.push(action);
    setTabList(updated);
    setNewRibbon(true);
  }
};
```

**Design Decision**: Batching reduces render cycles and improves performance.

## Error Handling Patterns

### Error Boundaries Pattern
Components are wrapped with error boundaries for graceful degradation:

```typescript
// Suspense provides loading fallbacks
<Suspense fallback={<LoadingSkeleton />}>
  <Canvas {...props} />
</Suspense>

// Error states in components
if (error) {
  return <ErrorMessage>Failed to load screen layout</ErrorMessage>;
}

if (isFetching) {
  return <LoadingSkeleton count={3} />;
}
```

**Design Decision**: Error boundaries prevent entire app crashes and provide better user experience.

### Toast Notification Pattern
User-facing errors are shown through toast notifications:

```typescript
// Error handling with user feedback
try {
  await updateScreen({ appId, screenId, versionId, body }).unwrap();
  // Success is implicit - no toast needed
} catch (ex) {
  toast.error(`Error saving screen - ${ex.data?.message}`);
} finally {
  dispatch(screenSaved());
}
```

**Design Decision**: Toast notifications provide non-intrusive error feedback.

## Migration Patterns

### Feature Flag Pattern
New features are gated behind feature flags for gradual rollout:

```typescript
// Feature flag usage
const featureFlags = useSelector(selectFeatureFlags);

// Conditional rendering based on flags
{featureFlags.newLayoutEngine && (
  <ResponsiveCanvas {...props} />
)}

{!featureFlags.newLayoutEngine && (
  <LegacyCanvas {...props} />
)}
```

**Design Decision**: Feature flags enable safe, gradual migration to new systems.

### Version-based Routing Pattern
Different screen versions use different rendering approaches:

```typescript
// Version detection and routing
const isV4Screen = useSelector(selectIsV4Screen);
const layoutV4 = useSelector(selectLayoutV4);
const layout = useSelector(selectLayout);

// Render appropriate canvas based on screen version
{!isV4Screen && <Canvas layout={layout} />}
{isV4Screen && <ResponsiveCanvas layout={layoutV4} />}
```

**Design Decision**: Version-based rendering supports gradual migration while maintaining compatibility.

## Extensibility Patterns

### Plugin Architecture Pattern
New components can be added without modifying core code:

```typescript
// Component registration system
export const registerComponent = (
  widgetType: WidgetType, 
  config: ControlConfiguration
) => {
  componentRegistry[widgetType] = config;
};

// Usage
registerComponent('custom-widget', {
  component: CustomWidgetWrapper,
  label: 'Custom Widget',
  defaultProps: { /* defaults */ },
  // ... configuration
});
```

**Design Decision**: Plugin architecture enables extension without core modifications.

### Hook-based Extension Pattern
Custom hooks provide reusable logic across components:

```typescript
// Custom hooks for common patterns
export const useControlSelection = () => {
  const dispatch = useDispatch();
  const selectedControlId = useSelector(selectSelectedControlId);
  
  const selectControl = useCallback((controlId, property) => {
    dispatch(controlSelected({ controlId, property }));
  }, [dispatch]);
  
  return { selectedControlId, selectControl };
};

// Usage in components
const { selectedControlId, selectControl } = useControlSelection();
```

**Design Decision**: Custom hooks encapsulate common patterns and promote code reuse.
