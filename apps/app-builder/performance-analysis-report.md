# Layout Designer Performance Analysis Report

## 🔍 Performance Issues Identified

### 1. **DesignerComponentWrapper - Excessive Re-renders**
**Problem**: Each component wrapper subscribes to multiple Redux selectors that trigger re-renders frequently:
- `selectControls(state)[id]` - Re-renders when ANY control changes, not just this component's control
- `selectedControlId`, `selectedControlProperty`, `hoveredControlId` - Global state changes affect ALL wrappers
- Complex `useMemo` calculations for width/height run on every render
- Mouse hover events dispatch Redux actions causing cascading re-renders

**Code Location**: `src/views/layout-designer/component-wrappers/designerComponentWrapper.jsx`

**Current Problematic Pattern**:
```jsx
const control = useSelector((state) => selectControls(state)[id]); // Re-renders for ANY control change
const selectedControlId = useSelector(selectSelectedControlId);
const hoveredControlId = useSelector(selectHoveredControlId);
// ... 7+ more selectors that cause re-renders
```

### 2. **Redux State Structure Issues**
**Problem**: The Redux state updates are not optimized for frequent position changes:
- `controlUpdated` action updates entire control objects, triggering wide re-renders
- `changes` object structure causes shallow comparison failures
- Position updates (x, y, width, height) are treated the same as content changes

**Code Location**: `src/common/services/screenLayoutSlice.jsx`

**Current Issue**:
```jsx
controlUpdated(state, action) {
  // Updates entire control object, causing all subscribers to re-render
  state.controls[action.payload.id] = action.payload;
  state.changes[state.versionId][action.payload.id] = action.payload;
}
```

### 3. **LayoutCanvasWrapper - Complex Dependency Arrays**
**Problem**: Multiple hooks with extensive dependency arrays cause unnecessary recalculations:
- `handleComponentsChange` callback has 15+ dependencies
- Component mapping logic runs on every controls/layout change
- Synchronous control creation causes multiple Redux dispatches per drag operation

**Code Location**: `src/views/layout-designer/LayoutCanvasWrapper.tsx`

**Problematic Dependencies**:
```jsx
const handleComponentsChange = useCallback((newComponents) => {
  // Complex logic with multiple Redux dispatches
}, [
  canvasComponents, controls, WIDGET_TO_CONTROL_TYPE_MAP,
  getControlTypeCode, getControlClass, getControlName,
  getDefaultCaption, dispatch, onControlClick, isInitialLoad,
  onLayoutV4Change, layoutV4, versionId, onComponentsChange
]); // 13+ dependencies causing frequent recreations
```

### 4. **LayoutDesigner - Over-subscribed Component**
**Problem**: The main component subscribes to too much Redux state:
- 20+ `useSelector` calls that re-render the entire component tree
- Complex `useEffect` chains with interdependent state
- Large object processing in effects that block the main thread

**Code Location**: `src/views/layout-designer/layoutDesigner.jsx`

**Current Pattern**:
```jsx
// 20+ selectors causing frequent re-renders of entire component tree
const status = useSelector(selectStatus);
const controls = useSelector(selectControls);
const selectedControlId = useSelector(selectSelectedControlId);
// ... 17+ more selectors
```

## 🚀 Optimization Recommendations

### 1. **Implement React.memo and Selective Re-renders**
**Solution**: Memoize DesignerComponentWrapper to prevent unnecessary re-renders
- Use individual control selectors instead of `selectControls(state)[id]`
- Implement custom comparison functions
- Use `shallowEqual` for object comparisons

### 2. **Optimize Redux Selectors with Memoization**
**Solution**: Create memoized selectors using `createSelector`
- Separate position data from content data
- Use reselect library for complex selector logic
- Implement per-control selectors

### 3. **Separate Position Updates from Content Updates**
**Solution**: Create dedicated Redux actions for position-only updates
- `controlPositionUpdated` for drag operations
- `controlContentUpdated` for property changes
- Batch position updates during drag operations

### 4. **Implement Debounced Updates for Drag Operations**
**Solution**: Reduce Redux update frequency during active dragging
- Debounce position updates to ~60fps (16ms)
- Use local state for immediate visual feedback
- Batch final position updates

### 5. **Virtualization for Large Canvas**
**Solution**: Only render visible components
- Implement viewport-based component filtering
- Use intersection observer for visibility detection
- Virtual scrolling for large canvases

### 6. **Batch Redux Updates**
**Solution**: Use Redux Toolkit's batch updates
- Group multiple simultaneous changes
- Reduce render cycles during bulk operations

## 📊 Expected Performance Improvements

1. **Reduce re-renders by 60-80%** during drag operations
2. **Eliminate cascading re-renders** from global state changes
3. **Improve drag responsiveness** with debounced updates
4. **Reduce memory usage** with selective component rendering
5. **Maintain 60fps** during complex drag operations

## 🔧 Implementation Priority

### High Priority (Immediate Impact)
1. Memoize DesignerComponentWrapper with individual control selectors
2. Implement position-only Redux actions
3. Optimize Redux selectors with memoization

### Medium Priority (Significant Improvement)
1. Debounced position updates during drag
2. Batch Redux updates for bulk operations
3. Reduce LayoutDesigner selector count

### Low Priority (Large Scale Optimization)
1. Virtualization for 100+ component canvases
2. Web Workers for complex calculations
3. Canvas-based rendering for simple components

## 🎯 Recommended First Steps

1. **Start with DesignerComponentWrapper optimization** - highest impact for effort
2. **Add position-only Redux actions** - reduces unnecessary data flow
3. **Implement selector memoization** - prevents duplicate calculations
4. **Add debounced updates** - improves drag performance

This analysis shows that the primary issue is excessive re-rendering caused by over-subscription to Redux state and lack of granular update mechanisms for position changes during drag operations.
