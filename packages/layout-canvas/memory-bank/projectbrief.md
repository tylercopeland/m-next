# Project Brief: Layout Canvas - Focused Scope (2025-08-27)

## Project Overview
The Layout Canvas is a React-based drag-and-drop layout system built on react-grid-layout (RGL). It provides core layout functionality with @m-one component integration, focusing on three specific deliverables after scope reduction.

**Current Status**: RGL integration foundation COMPLETE - Basic drag-drop and component rendering working
**Revised Scope**: Focus on 3 core areas only - Figma styles, responsive system, and component registry improvements

## Core Purpose (Revised Scope)
Deliver a working responsive layout canvas that:
- Renders @m-one components properly in a drag-drop grid system
- Uses proper design system styling from Figma
- Supports responsive breakpoint behaviors  
- Provides extensible component registry architecture

## Remaining Work - 3 Core Areas

### 1. **Figma Design System Integration** 🎨
**Goal**: Replace placeholder SelectionIndicator styling with proper Figma design system
**Requirements**:
- Extract design tokens from Figma (colors, borders, shadows, spacing)
- Apply proper selection border styling to match design system
- Implement hover and focus states per Figma specifications
- Ensure consistent visual design across all selection indicators

### 2. **Responsive System Implementation** 📱  
**Goal**: Implement core responsive breakpoint behaviors for layout adaptation
**Requirements**:
- Components wrap at specific media breakpoints (1200px, 768px, 375px)
- Component compression logic between breakpoints for space optimization
- Responsive override system allowing per-breakpoint component positioning
- Multi-screen design management supporting different device layouts

### 3. **Component Registry Architecture** 🔧
**Goal**: Create extensible component system for external team integration
**Requirements**:
- Export component registry types for external consumption
- Accept registry definition with component wrappers as props to ReactGridLayoutWrapper
- Remove hardcoded component rendering logic and imports
- Enable external teams to provide their own component implementations
- Support for missing components (AddressLookup, Tag, HtmlEditor, Signature, Calendar, Map, Gallery, DateTimePicker)

## Technical Foundation (Already Complete) ✅

### ✅ **RGL Integration Infrastructure**
- Complete react-grid-layout integration with drag-drop functionality
- Real @m-one component rendering (Button, Input, TextArea, Checkbox, Toggle, Text)
- Bidirectional state adapters between ResponsiveComponent and RGL formats
- Component positioning and selection system working
- 93/96 tests passing with comprehensive test coverage

### ✅ **Core Architecture**  
- TypeScript throughout with proper type safety
- Emotion-based styling system
- Hook-based architecture for drag/drop and selection logic
- Event management and cleanup systems
- Parent component integration via callbacks

## Success Criteria (Revised)
1. **Design Integration**: SelectionIndicator uses proper Figma design tokens and styling
2. **Responsive Behavior**: Components wrap and compress correctly at defined breakpoints  
3. **Extensible Registry**: External teams can provide component implementations via props
4. **Maintained Functionality**: All existing drag-drop and component rendering continues working
5. **Test Coverage**: All tests continue passing with new features covered

## Constraints
- Must maintain existing RGL integration foundation
- Canvas width fixed at 900px for consistent layouts
- Grid system limited to 12 columns for RGL compatibility
- Must preserve all working drag-drop functionality
- Component rendering must remain performant

## Deferred Scope (Not Implementing)
❌ **Container system and child rendering** - Deferred due to complexity
❌ **Enhanced visual feedback** - Beyond SelectionIndicator styling  
❌ **Component palette enhancements** - Using existing palette
❌ **Accessibility features** - Beyond basic functionality
❌ **Advanced collision detection** - Using RGL's built-in collision handling
❌ **Dynamic reflow algorithms** - Not implementing custom reflow
❌ **Performance optimization phases** - Current performance adequate

## Timeline Focus
**Immediate Priority Order**:
1. Get Figma design data and implement SelectionIndicator styling
2. Implement responsive breakpoint behaviors in RGL wrapper
3. Refactor component registry to be prop-based and extensible

**Target**: Complete focused scope rather than attempting broader feature set
